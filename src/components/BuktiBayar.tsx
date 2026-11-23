import { useEffect, useState } from "react";
import { supabase, rp, tglIndo, type Pesanan, type Pembayaran } from "@/lib/supabase";

const inp = "w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2.5 text-foreground outline-none focus:border-primary";

/** Unggah foto/PDF bukti transfer ke bucket privat; mengembalikan path-nya. */
export async function unggahBukti(pesananId: string, file: File) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `bukti-bayar/${pesananId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("dokumen").upload(path, file, { contentType: file.type || undefined });
  if (error) throw error;
  return path;
}

/** Pembayaran yang wajib punya bukti: semua kecuali penyesuaian data lama. */
export const perluBukti = (b: Pembayaran) => !b.bukti && b.metode !== "tidak tercatat";

export default function BuktiBayar({ pesanan, onTutup, onUbah }: { pesanan: Pesanan; onTutup: () => void; onUbah: () => void }) {
  const [daftar, setDaftar] = useState<Pembayaran[]>([]);
  const [galat, setGalat] = useState("");
  const [sibuk, setSibuk] = useState("");
  const [f, setF] = useState({ jumlah: "", tanggal: new Date().toISOString().slice(0, 10), metode: "transfer", file: null as File | null });

  const muat = async () => {
    const { data, error } = await supabase.from("pembayaran").select("*").eq("pesanan_id", pesanan.id).order("tanggal");
    if (error) return setGalat(error.message);
    setDaftar((data as Pembayaran[]) || []);
  };
  useEffect(() => { muat(); }, [pesanan.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const dibayar = daftar.reduce((s, b) => s + b.jumlah, 0);
  const sisa = Math.max(0, pesanan.total - dibayar);

  const lihat = async (b: Pembayaran) => {
    const { data, error } = await supabase.storage.from("dokumen").createSignedUrl(b.bukti!, 600);
    if (error) return setGalat(error.message);
    window.open(data.signedUrl, "_blank");
  };

  const pasang = async (b: Pembayaran, file?: File) => {
    if (!file) return;
    setSibuk(b.id); setGalat("");
    try {
      const path = await unggahBukti(pesanan.id, file);
      const { error } = await supabase.from("pembayaran").update({ bukti: path }).eq("id", b.id);
      if (error) throw error;
      await muat(); onUbah();
    } catch (e) { setGalat((e as Error).message); }
    setSibuk("");
  };

  const tambah = async () => {
    const jumlah = Number(f.jumlah.replace(/\D/g, ""));
    if (!jumlah) return setGalat("Isi jumlah pembayaran.");
    if (!f.file && !confirm("Belum ada foto bukti. Tetap simpan tanpa bukti?")) return;
    setSibuk("baru"); setGalat("");
    try {
      const bukti = f.file ? await unggahBukti(pesanan.id, f.file) : null;
      const { error } = await supabase.from("pembayaran").insert({ pesanan_id: pesanan.id, jumlah, tanggal: f.tanggal, metode: f.metode, bukti });
      if (error) throw error;
      setF({ jumlah: "", tanggal: new Date().toISOString().slice(0, 10), metode: "transfer", file: null });
      await muat(); onUbah();
    } catch (e) { setGalat((e as Error).message); }
    setSibuk("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onTutup}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border px-5 py-4">
          <p className="font-semibold text-slate-900">Pembayaran · {pesanan.pelanggan?.nama}</p>
          <p className="text-xs text-muted-foreground">{pesanan.unit_id} · {tglIndo(pesanan.mulai)} · total {rp(pesanan.total)} · sisa <b className={sisa ? "text-rose-600" : "text-emerald-600"}>{rp(sisa)}</b></p>
        </div>
        <div className="space-y-3 px-5 py-4">
          {galat && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{galat}</p>}
          {daftar.length === 0 && <p className="text-sm text-muted-foreground">Belum ada pembayaran tercatat.</p>}
          <ul className="space-y-2">
            {daftar.map((b) => (
              <li key={b.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{rp(b.jumlah)}</p>
                    <p className="text-[11px] text-muted-foreground">{tglIndo(b.tanggal)} · {b.metode || "-"}{b.catatan ? ` · ${b.catatan}` : ""}</p>
                  </div>
                  {b.bukti ? (
                    <button onClick={() => lihat(b)} className="shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">Lihat bukti</button>
                  ) : b.metode === "tidak tercatat" ? (
                    <span className="shrink-0 text-[11px] text-muted-foreground">data lama</span>
                  ) : (
                    <span className="shrink-0 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">Belum ada bukti</span>
                  )}
                </div>
                <label className="mt-2 block cursor-pointer text-xs font-semibold text-primary">
                  {sibuk === b.id ? "Mengunggah…" : b.bukti ? "Ganti bukti" : "+ Unggah bukti"}
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => pasang(b, e.target.files?.[0])} />
                </label>
              </li>
            ))}
          </ul>

          <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
            <p className="text-xs font-semibold text-muted-foreground">Catat pembayaran baru</p>
            <div className="grid grid-cols-2 gap-2">
              <input className={inp} inputMode="numeric" placeholder={sisa ? `Sisa ${rp(sisa)}` : "Jumlah"} value={f.jumlah} onChange={(e) => setF({ ...f, jumlah: e.target.value })} />
              <input type="date" className={inp} value={f.tanggal} onChange={(e) => setF({ ...f, tanggal: e.target.value })} />
              <select className={inp} value={f.metode} onChange={(e) => setF({ ...f, metode: e.target.value })}>
                <option value="transfer">Transfer</option><option value="qris">QRIS</option><option value="tunai">Tunai</option>
              </select>
              <label className={inp + " cursor-pointer truncate text-sm text-slate-600"}>
                {f.file ? f.file.name : "📎 Foto bukti"}
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setF({ ...f, file: e.target.files?.[0] || null })} />
              </label>
            </div>
            <button onClick={tambah} disabled={!!sibuk} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {sibuk === "baru" ? "Menyimpan…" : "Simpan pembayaran"}
            </button>
          </div>
        </div>
        <div className="border-t border-border px-5 py-3 text-right">
          <button onClick={onTutup} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-slate-700">Tutup</button>
        </div>
      </div>
    </div>
  );
}
