import { useMemo, useState } from "react";
import { supabase, rp, tglIndo, waLink, type Pesanan, type Pembayaran } from "@/lib/supabase";

const inp =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

/** Piutang dihitung dari pesanan aktif/selesai dikurangi pembayaran tercatat. */
export default function TabPiutang({
  pesanan, pembayaran, muat, setGalat,
}: {
  pesanan: Pesanan[]; pembayaran: Pembayaran[]; muat: () => void; setGalat: (s: string) => void;
}) {
  const [bukaId, setBukaId] = useState("");
  const [f, setF] = useState({ jumlah: "", tanggal: new Date().toISOString().slice(0, 10), metode: "transfer" });

  const dibayar = useMemo(() => {
    const m: Record<string, number> = {};
    pembayaran.forEach((b) => { m[b.pesanan_id] = (m[b.pesanan_id] || 0) + (b.jumlah || 0); });
    return m;
  }, [pembayaran]);

  const daftar = useMemo(
    () => pesanan
      .filter((p) => p.status !== "batal")
      .map((p) => ({ p, bayar: dibayar[p.id] || 0, sisa: (p.total || 0) - (dibayar[p.id] || 0) }))
      .filter((x) => x.sisa > 0)
      .sort((a, b) => (b.p.mulai || "").localeCompare(a.p.mulai || "")),
    [pesanan, dibayar],
  );
  const totalPiutang = daftar.reduce((s, x) => s + x.sisa, 0);

  const catat = async (pesananId: string, sisa: number) => {
    const jumlah = Number(f.jumlah.replace(/\D/g, ""));
    if (!jumlah) return setGalat("Isi jumlah pembayaran.");
    if (jumlah > sisa && !confirm("Jumlah melebihi sisa tagihan. Tetap catat?")) return;
    setGalat("");
    const { error } = await supabase.from("pembayaran").insert({
      pesanan_id: pesananId, jumlah, tanggal: f.tanggal, metode: f.metode,
    });
    if (error) return setGalat(error.message);
    setBukaId(""); setF({ jumlah: "", tanggal: new Date().toISOString().slice(0, 10), metode: "transfer" });
    muat();
  };

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Piutang</h2>
        <p className="text-sm font-bold text-red-600">{rp(totalPiutang)}</p>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">Tagihan yang belum lunas, dihitung dari total pesanan dikurangi pembayaran tercatat.</p>

      {daftar.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Semua pesanan sudah lunas. 🎉</p>}

      <ul className="space-y-2.5">
        {daftar.map(({ p, bayar, sisa }) => (
          <li key={p.id} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{p.pelanggan?.nama || "Pelanggan"}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {p.unit?.nama || p.unit_id} · mulai {tglIndo(p.mulai)} · total {rp(p.total)}{bayar > 0 ? ` · dibayar ${rp(bayar)}` : ""}
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold text-red-600">{rp(sisa)}</p>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <button onClick={() => setBukaId(bukaId === p.id ? "" : p.id)}
                className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-white">Catat bayar</button>
              {p.pelanggan?.wa && (
                <a href={waLink(p.pelanggan.wa, `Halo kak ${p.pelanggan?.nama || ""}, mengingatkan sisa pembayaran sewa ${p.unit?.nama || ""} sebesar ${rp(sisa)} ya. Terima kasih 🙏`)}
                  target="_blank" rel="noreferrer"
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-emerald-700">Ingatkan via WA</a>
              )}
            </div>
            {bukaId === p.id && (
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-border bg-[#F8FAFC] p-3">
                <input className={inp} inputMode="numeric" placeholder={"Jumlah (sisa " + rp(sisa) + ")"}
                  value={f.jumlah} onChange={(e) => setF((v) => ({ ...v, jumlah: e.target.value }))} />
                <input type="date" className={inp} value={f.tanggal} onChange={(e) => setF((v) => ({ ...v, tanggal: e.target.value }))} />
                <select className={inp} value={f.metode} onChange={(e) => setF((v) => ({ ...v, metode: e.target.value }))}>
                  <option value="transfer">Transfer</option><option value="tunai">Tunai</option><option value="qris">QRIS</option>
                </select>
                <button onClick={() => catat(p.id, sisa)} className="rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">Simpan</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
