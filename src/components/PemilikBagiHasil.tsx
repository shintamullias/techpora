import { useEffect, useMemo, useState } from "react";
import { supabase, rp, tglIndo, waLink, namaBulan, type Pesanan, type Pembayaran, type Pengeluaran, type Unit } from "@/lib/supabase";
import { hitungPerUnitBulan, jumlahkan, cetakTabel, unduhTabel } from "@/lib/keuangan";

type Pemilik = { id: string; nama: string; wa: string | null; bank: string | null; catatan: string | null };
type Bagi = { id: string; pemilik_id: string; bulan: string; jumlah: number; tanggal: string; metode: string | null; catatan: string | null };
type Tutup = { bulan: string; ringkasan: Record<string, number>; ditutup_pada: string; oleh: string | null };

const inp = "w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary";
const bulanKini = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 7);

/** Pemilik unit, bagi hasil otomatis, pembayaran ke pemilik, owner statement, dan tutup buku bulanan. */
export default function PemilikBagiHasil({ pesanan, pembayaran, biaya, unit, muatInduk, setGalat }: {
  pesanan: Pesanan[]; pembayaran: Pembayaran[]; biaya: Pengeluaran[]; unit: Unit[]; muatInduk: () => void; setGalat: (s: string) => void;
}) {
  const [pemilik, setPemilik] = useState<Pemilik[]>([]);
  const [bagi, setBagi] = useState<Bagi[]>([]);
  const [tutup, setTutup] = useState<Tutup[]>([]);
  const [bulan, setBulan] = useState(bulanKini());
  const [formP, setFormP] = useState<Partial<Pemilik> | null>(null);
  const [rinci, setRinci] = useState("");

  const muat = async () => {
    const [a, b, c] = await Promise.all([
      supabase.from("pemilik").select("*").order("nama"),
      supabase.from("bagi_hasil").select("*").order("tanggal", { ascending: false }),
      supabase.from("tutup_buku").select("*").order("bulan", { ascending: false }),
    ]);
    setPemilik((a.data as Pemilik[]) || []); setBagi((b.data as Bagi[]) || []); setTutup((c.data as Tutup[]) || []);
  };
  useEffect(() => { muat(); }, []);

  const semua = useMemo(() => hitungPerUnitBulan(pesanan, pembayaran, biaya, unit), [pesanan, pembayaran, biaya, unit]);
  const bulanAda = [...new Set([...semua.map((r) => r.bulan), bulanKini()])].sort().reverse();
  const ini = semua.filter((r) => r.bulan === bulan);
  const tot = jumlahkan(ini);
  const ditutup = tutup.find((t) => t.bulan === bulan);

  const perPemilik = pemilik.map((p) => {
    const unitP = unit.filter((u) => u.pemilik_id === p.id);
    const baris = ini.filter((r) => r.pemilik_id === p.id);
    const hak = baris.reduce((a, r) => a + r.hakPemilik, 0);
    const dibayar = bagi.filter((b) => b.pemilik_id === p.id && b.bulan === bulan).reduce((a, b) => a + b.jumlah, 0);
    const hakSemua = semua.filter((r) => r.pemilik_id === p.id).reduce((a, r) => a + r.hakPemilik, 0);
    const dibayarSemua = bagi.filter((b) => b.pemilik_id === p.id).reduce((a, b) => a + b.jumlah, 0);
    return { p, unitP, baris, hak, dibayar, sisa: hak - dibayar, saldo: hakSemua - dibayarSemua };
  });

  const simpanPemilik = async () => {
    if (!formP?.nama?.trim()) return setGalat("Nama pemilik wajib diisi.");
    const isi = { nama: formP.nama.trim(), wa: formP.wa || null, bank: formP.bank || null, catatan: formP.catatan || null };
    const { error } = formP.id ? await supabase.from("pemilik").update(isi).eq("id", formP.id) : await supabase.from("pemilik").insert(isi);
    if (error) return setGalat(error.message);
    setFormP(null); muat();
  };
  const aturUnit = async (u: Unit, pemilik_id: string, porsi?: number) => {
    const isi: Record<string, unknown> = { pemilik_id: pemilik_id || null, pemilik: pemilik.find((p) => p.id === pemilik_id)?.nama || "" };
    if (porsi != null) isi.porsi_pemilik = porsi;
    const { error } = await supabase.from("unit").update(isi).eq("id", u.id);
    if (error) setGalat(error.message); else muatInduk();
  };
  const bayarPemilik = async (x: (typeof perPemilik)[number]) => {
    const n = Number(String(prompt(`Transfer bagi hasil ${namaBulan(bulan)} ke ${x.p.nama} (Rp):`, String(Math.max(0, x.sisa))) || "").replace(/\D/g, ""));
    if (!n) return;
    const { error } = await supabase.from("bagi_hasil").insert({ pemilik_id: x.p.id, bulan, jumlah: n });
    if (error) return setGalat(error.message);
    muat();
  };

  const statement = (x: (typeof perPemilik)[number]) => cetakTabel(`Owner statement · ${x.p.nama}`, namaBulan(bulan), [
    { judul: "Rincian per unit", baris: [["Unit", "Pendapatan", "Biaya langsung", "Biaya bersama", "Laba", "Porsi %", "Hak pemilik"],
      ...x.baris.map((r) => [r.unit_id, r.pendapatan, r.biayaLangsung, r.biayaBersama, r.laba, unit.find((u) => u.id === r.unit_id)?.porsi_pemilik ?? 0, r.hakPemilik])] },
    { judul: "Ringkasan", baris: [["Keterangan", "Jumlah"], ["Total hak pemilik", x.hak], ["Sudah ditransfer", x.dibayar], ["Sisa bulan ini", x.sisa], ["Saldo kumulatif belum dibayar", x.saldo]] },
    { judul: "Riwayat transfer", baris: [["Tanggal", "Bulan", "Jumlah"], ...bagi.filter((b) => b.pemilik_id === x.p.id).map((b) => [tglIndo(b.tanggal), namaBulan(b.bulan), b.jumlah])] },
  ]);

  const tutupBuku = async () => {
    if (!confirm(`Tutup buku ${namaBulan(bulan)}? Angka bulan ini disimpan sebagai arsip resmi.`)) return;
    const ringkasan = { ...tot, pengeluaran: tot.biayaLangsung + tot.biayaBersama, kas_masuk: tot.pendapatan, owner_dibayar: perPemilik.reduce((a, x) => a + x.dibayar, 0) };
    const { error } = await supabase.from("tutup_buku").upsert({ bulan, ringkasan });
    if (error) return setGalat(error.message);
    muat();
  };

  const rekap = () => unduhTabel(`bagi-hasil-${bulan}`, [
    { judul: "Per pemilik", baris: [["Pemilik", "Unit", "Hak", "Ditransfer", "Sisa"], ...perPemilik.map((x) => [x.p.nama, x.unitP.map((u) => u.id).join(" "), x.hak, x.dibayar, x.sisa]), ["Perusahaan", "", tot.hakPerusahaan, "", ""]] },
    { judul: "Per unit", baris: [["Unit", "Pemilik", "Pendapatan", "Biaya langsung", "Biaya bersama", "Laba", "Hak pemilik", "Hak perusahaan"],
      ...ini.map((r) => [r.unit_id, pemilik.find((p) => p.id === r.pemilik_id)?.nama || "Perusahaan", r.pendapatan, r.biayaLangsung, r.biayaBersama, r.laba, r.hakPemilik, r.hakPerusahaan])] },
  ], "xlsx");

  return (
    <section className="mt-4 space-y-4">
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="mr-auto text-base font-semibold text-slate-900">Bagi hasil pemilik</h2>
          <select className={inp + " w-auto"} value={bulan} onChange={(e) => setBulan(e.target.value)}>{bulanAda.map((b) => <option key={b} value={b}>{namaBulan(b)}</option>)}</select>
          <button onClick={rekap} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold">⬇ Excel</button>
          <button onClick={tutupBuku} className={"rounded-lg px-3 py-2 text-xs font-semibold " + (ditutup ? "border border-emerald-300 text-emerald-700" : "bg-slate-900 text-white")}>{ditutup ? "✓ Sudah tutup buku" : "Tutup buku"}</button>
        </div>
        {ditutup && <p className="mb-2 text-[11px] text-emerald-700">Ditutup {new Date(ditutup.ditutup_pada).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}{ditutup.oleh ? ` oleh ${ditutup.oleh}` : ""} · arsip: pendapatan {rp(ditutup.ringkasan.pendapatan || 0)}, laba {rp(ditutup.ringkasan.laba || 0)}. Tekan lagi untuk memperbarui arsip.</p>}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {([["Pendapatan diterima", tot.pendapatan], ["Biaya (langsung + bersama)", tot.biayaLangsung + tot.biayaBersama], ["Total hak pemilik", tot.hakPemilik], ["Total hak perusahaan", tot.hakPerusahaan]] as const).map(([l, v]) => (
            <div key={l} className="rounded-lg bg-slate-50 px-3 py-2"><p className="text-[11px] text-muted-foreground">{l}</p><p className="font-bold tabular-nums">{rp(v)}</p></div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Rumus: laba unit = uang diterima − biaya unit itu − bagian biaya bersama (dibagi sesuai porsi pendapatan). Hak pemilik = laba × persentase bagi hasil. Unit tanpa pemilik = 100% perusahaan.</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Pemilik unit</h3>
          <button onClick={() => setFormP(formP ? null : {})} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white">{formP ? "Tutup" : "+ Pemilik"}</button>
        </div>
        {formP && (
          <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3">
            <input className={inp} placeholder="Nama" value={formP.nama || ""} onChange={(e) => setFormP({ ...formP, nama: e.target.value })} />
            <input className={inp} placeholder="No. WA" value={formP.wa || ""} onChange={(e) => setFormP({ ...formP, wa: e.target.value })} />
            <input className={inp + " col-span-2"} placeholder="Rekening (bank · no · a.n.)" value={formP.bank || ""} onChange={(e) => setFormP({ ...formP, bank: e.target.value })} />
            <button onClick={simpanPemilik} className="col-span-2 rounded-lg bg-primary py-2 text-sm font-semibold text-white">Simpan</button>
          </div>
        )}
        <ul className="space-y-2.5">
          {perPemilik.map((x) => (
            <li key={x.p.id} className="rounded-xl border border-border p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{x.p.nama} <button onClick={() => setFormP(x.p)} className="text-xs font-normal text-primary">ubah</button></p>
                  <p className="text-xs text-muted-foreground">{x.p.bank || "rekening belum diisi"} · {x.unitP.length} unit</p>
                </div>
                <div className="text-right text-xs">
                  <p>Hak {namaBulan(bulan)}: <b>{rp(x.hak)}</b></p>
                  <p>Ditransfer: {rp(x.dibayar)} · <b className={x.sisa > 0 ? "text-rose-600" : "text-emerald-600"}>sisa {rp(x.sisa)}</b></p>
                  <p className="text-muted-foreground">Saldo kumulatif: {rp(x.saldo)}</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button onClick={() => bayarPemilik(x)} className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-white">Catat transfer</button>
                <button onClick={() => statement(x)} className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold">Owner statement (PDF)</button>
                {x.p.wa && <a href={waLink(x.p.wa, `Halo ${x.p.nama}, laporan bagi hasil Techpora ${namaBulan(bulan)}:\nHak: ${rp(x.hak)}\nSudah ditransfer: ${rp(x.dibayar)}\nSisa: ${rp(x.sisa)}\n\nRincian per unit:\n${x.baris.map((r) => `• ${r.unit_id}: pendapatan ${rp(r.pendapatan)}, laba ${rp(r.laba)}, hak ${rp(r.hakPemilik)}`).join("\n")}`)} target="_blank" rel="noreferrer" className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white">Kirim WA</a>}
                <button onClick={() => setRinci(rinci === x.p.id ? "" : x.p.id)} className="rounded-lg border border-border px-2.5 py-1.5 text-xs">{rinci === x.p.id ? "Tutup" : "Unit & riwayat"}</button>
              </div>
              {rinci === x.p.id && (
                <div className="mt-2 space-y-2 rounded-lg bg-slate-50 p-2 text-xs">
                  {x.baris.map((r) => <p key={r.unit_id}>{r.unit_id}: pendapatan {rp(r.pendapatan)} − biaya {rp(r.biayaLangsung + r.biayaBersama)} = laba {rp(r.laba)} → hak <b>{rp(r.hakPemilik)}</b></p>)}
                  <p className="pt-1 font-semibold">Riwayat transfer</p>
                  {bagi.filter((b) => b.pemilik_id === x.p.id).slice(0, 12).map((b) => <p key={b.id}>{tglIndo(b.tanggal)} · {namaBulan(b.bulan)} · {rp(b.jumlah)}</p>)}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Kepemilikan & persentase bagi hasil per unit</h3>
        <div className="-mx-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead><tr className="border-b border-border text-left text-xs text-muted-foreground"><th className="px-4 py-2 font-medium">Unit</th><th className="px-2 py-2 font-medium">Pemilik</th><th className="px-4 py-2 text-right font-medium">Bagi hasil pemilik %</th></tr></thead>
            <tbody>
              {unit.map((u) => (
                <tr key={u.id} className="border-b border-border/60">
                  <td className="px-4 py-1.5">{u.id} · {u.nama}</td>
                  <td className="px-2 py-1.5"><select className={inp + " py-1"} value={u.pemilik_id || ""} onChange={(e) => aturUnit(u, e.target.value)}><option value="">Perusahaan</option>{pemilik.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}</select></td>
                  <td className="px-4 py-1.5 text-right">
                    <input type="number" min={0} max={100} disabled={!u.pemilik_id} defaultValue={u.porsi_pemilik} key={u.id + u.porsi_pemilik}
                      onBlur={(e) => { const v = Number(e.target.value); if (v !== u.porsi_pemilik && confirm(`Ubah bagi hasil ${u.id} dari ${u.porsi_pemilik}% ke ${v}%? Perubahan tercatat di riwayat.`)) aturUnit(u, u.pemilik_id || "", v); }}
                      className="w-20 rounded-lg border border-border px-2 py-1 text-right text-sm disabled:opacity-40" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Setiap perubahan pemilik/persentase tercatat di Pengaturan → Riwayat & cadangan.</p>
      </div>
    </section>
  );
}
