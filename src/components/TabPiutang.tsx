import { useMemo, useState } from "react";
import BuktiBayar, { perluBukti } from "./BuktiBayar";
import { supabase, rp, tglIndo, waLink, kelompokkanBayar, sisaTagihan, sudahJatuhTempo, type Pesanan, type Pembayaran } from "@/lib/supabase";

const inp =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

/** Piutang = pesanan yang belum lunas, dikurangi pembayaran yang sudah dicatat. */
export default function TabPiutang({
  pesanan, pembayaran, muat, setGalat,
}: {
  pesanan: Pesanan[]; pembayaran: Pembayaran[]; muat: () => void; setGalat: (s: string) => void;
}) {
  const [bukaId, setBukaId] = useState("");
  const [modal, setModal] = useState<Pesanan | null>(null);
  const tanpaBukti = useMemo(() => {
    const ids = new Set(pembayaran.filter(perluBukti).map((b) => b.pesanan_id));
    return pesanan.filter((p) => ids.has(p.id) && p.status !== "batal");
  }, [pesanan, pembayaran]);
  const [f, setF] = useState({ jumlah: "", tanggal: new Date().toISOString().slice(0, 10), metode: "transfer" });

  const dibayar = useMemo(() => kelompokkanBayar(pembayaran), [pembayaran]);

  const daftar = useMemo(
    () => pesanan
      .map((p) => ({ p, bayar: dibayar[p.id] || 0, sisa: sisaTagihan(p, dibayar) }))
      .filter((x) => x.sisa > 0)
      .sort((a, b) => (b.p.mulai || "").localeCompare(a.p.mulai || "")),
    [pesanan, dibayar],
  );
  const jatuhTempo = daftar.filter((x) => sudahJatuhTempo(x.p));
  const mendatang = daftar.filter((x) => !sudahJatuhTempo(x.p)).sort((a, b) => a.p.mulai.localeCompare(b.p.mulai));
  const totalPiutang = jatuhTempo.reduce((s, x) => s + x.sisa, 0);
  const totalMendatang = mendatang.reduce((s, x) => s + x.sisa, 0);

  const catat = async (pesananId: string, sisa: number) => {
    const jumlah = Number(f.jumlah.replace(/\D/g, ""));
    if (!jumlah) return setGalat("Isi jumlah pembayaran.");
    if (jumlah > sisa && !confirm("Jumlah melebihi sisa tagihan. Tetap catat?")) return;
    setGalat("");
    const { error } = await supabase.from("pembayaran").insert({
      pesanan_id: pesananId, jumlah, tanggal: f.tanggal, metode: f.metode,
    });
    if (error) return setGalat(error.message);
    // Status bayar dihitung otomatis oleh database dari catatan pembayaran.
    setBukaId(""); setF({ jumlah: "", tanggal: new Date().toISOString().slice(0, 10), metode: "transfer" });
    muat();
  };

  const tandaiLunas = async (pesananId: string, sisa: number) => {
    if (!confirm(`Catat pelunasan ${rp(sisa)} hari ini?`)) return;
    const { error } = await supabase.from("pembayaran").insert({
      pesanan_id: pesananId, jumlah: sisa, tanggal: new Date().toISOString().slice(0, 10), metode: "transfer", catatan: "Pelunasan",
    });
    if (error) return setGalat(error.message);
    muat();
  };

  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Piutang</h2>
        <p className="text-sm font-bold text-red-600">{rp(totalPiutang)}</p>
      </div>
      {modal && <BuktiBayar pesanan={modal} onTutup={() => setModal(null)} onUbah={muat} />}
      {tanpaBukti.length > 0 && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-900">{tanpaBukti.length} pesanan punya pembayaran tanpa bukti</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tanpaBukti.slice(0, 20).map((p) => (
              <button key={p.id} onClick={() => setModal(p)} className="rounded-md border border-amber-300 bg-white px-2 py-1 text-[11px] text-amber-900">
                {p.pelanggan?.nama} · {p.unit_id}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="mb-3 text-xs text-muted-foreground">Sewa yang sudah dimulai tapi belum lunas, dikurangi pembayaran yang sudah dicatat.</p>

      {daftar.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Semua pesanan sudah lunas. 🎉</p>}

      {[{ judul: "", isi: jatuhTempo }, { judul: `Pesanan mendatang belum dibayar · ${rp(totalMendatang)}`, isi: mendatang }].map((grup) => grup.isi.length > 0 && (
      <div key={grup.judul} className={grup.judul ? "mt-5" : ""}>
      {grup.judul && <p className="mb-2 text-xs font-semibold text-muted-foreground">{grup.judul} <span className="font-normal">(belum dihitung piutang)</span></p>}
      <ul className="space-y-2.5">
        {grup.isi.map(({ p, bayar, sisa }) => (
          <li key={p.id} className="rounded-lg border border-border bg-white p-3">
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
              <button onClick={() => setModal(p)}
                className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-white">Catat bayar + bukti</button>
              {p.pelanggan?.wa && (
                <a href={waLink(p.pelanggan.wa, `Halo kak ${p.pelanggan?.nama || ""}, mengingatkan sisa pembayaran sewa ${p.unit?.nama || ""} sebesar ${rp(sisa)} ya. Terima kasih 🙏`)}
                  target="_blank" rel="noreferrer"
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-emerald-700">Ingatkan via WA</a>
              )}
              <button onClick={() => tandaiLunas(p.id, sisa)}
                className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate-600">Tandai lunas</button>
            </div>
            {bukaId === p.id && (
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-border bg-slate-50 p-3">
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
      </div>
      ))}
    </section>
  );
}
