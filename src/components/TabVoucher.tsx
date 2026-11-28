import { useMemo, useState } from "react";
import { supabase, rp, tglIndo, kelompokkanBayar, type Voucher, type Pesanan, type Pelanggan, type Pembayaran } from "@/lib/supabase";

const inp = "w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2.5 text-foreground outline-none focus:border-primary";
function Kol({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="min-w-0"><label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</label>{children}</div>;
}
const SEGMEN: Record<string, string> = { semua: "Semua pelanggan", baru: "Pelanggan baru (first-time)", loyal: "Pelanggan loyal (≥2× sewa)", reseller: "Reseller", referral: "Referral (pelanggan baru yang direferensikan)" };

export default function TabVoucher({ voucher, pesanan, pelanggan, pembayaran, muat, setGalat }: {
  voucher: Voucher[]; pesanan: Pesanan[]; pelanggan: Pelanggan[]; pembayaran: Pembayaran[]; muat: () => void; setGalat: (s: string) => void;
}) {
  const kosong = { id: "", kode: "", nama: "", tipe: "persen", nilai: "", periode: "semua", kategori: "semua", segmen: "semua", pelanggan_id: "",
    mulai: "", selesai: "", maks_pakai: "", maks_per_pelanggan: "", min_transaksi: "", maks_diskon: "", bisa_digabung: true };
  const [f, setF] = useState<typeof kosong | null>(null);
  const s = (k: string, v: string | boolean) => setF((p) => (p ? { ...p, [k]: v } : p));
  const angka = (x: string) => Number(String(x).replace(/\D/g, "")) || 0;

  const simpan = async () => {
    if (!f) return;
    if (!f.kode.trim() || !f.nilai) return setGalat("Kode dan nilai voucher wajib diisi.");
    const isi = {
      kode: f.kode.trim().toUpperCase(), nama: f.nama.trim() || f.kode.trim(), tipe: f.tipe, nilai: angka(f.nilai), periode: f.periode,
      kategori: f.kategori, segmen: f.segmen, pelanggan_id: f.pelanggan_id || null, mulai: f.mulai || null, selesai: f.selesai || null,
      maks_pakai: angka(f.maks_pakai), maks_per_pelanggan: angka(f.maks_per_pelanggan), min_transaksi: angka(f.min_transaksi),
      maks_diskon: angka(f.maks_diskon), bisa_digabung: f.bisa_digabung,
    };
    const { error } = f.id ? await supabase.from("voucher").update(isi).eq("id", f.id) : await supabase.from("voucher").insert({ ...isi, aktif: true });
    if (error) return setGalat(error.message);
    setF(null); muat();
  };
  const ubah = (v: Voucher) => setF({
    id: v.id, kode: v.kode, nama: v.nama, tipe: v.tipe, nilai: String(v.nilai), periode: v.periode, kategori: v.kategori || "semua", segmen: v.segmen || "semua",
    pelanggan_id: v.pelanggan_id || "", mulai: v.mulai || "", selesai: v.selesai || "", maks_pakai: v.maks_pakai ? String(v.maks_pakai) : "",
    maks_per_pelanggan: v.maks_per_pelanggan ? String(v.maks_per_pelanggan) : "", min_transaksi: v.min_transaksi ? String(v.min_transaksi) : "",
    maks_diskon: v.maks_diskon ? String(v.maks_diskon) : "", bisa_digabung: v.bisa_digabung !== false,
  });
  const toggle = async (v: Voucher) => { const { error } = await supabase.from("voucher").update({ aktif: !v.aktif }).eq("id", v.id); if (error) setGalat(error.message); else muat(); };

  // performa promo: pemakaian, total diskon, pendapatan dari booking ber-voucher, pelanggan baru yang didapat
  const bayar = useMemo(() => kelompokkanBayar(pembayaran), [pembayaran]);
  const performa = useMemo(() => Object.fromEntries(voucher.map((v) => {
    const pakai = pesanan.filter((p) => p.voucher_id === v.id && p.status !== "batal");
    const baru = pakai.filter((p) => !pesanan.some((q) => q.pelanggan_id === p.pelanggan_id && q.status !== "batal" && q.mulai < p.mulai)).length;
    return [v.id, { n: pakai.length, diskon: pakai.reduce((a, p) => a + (p.diskon || 0), 0), omzet: pakai.reduce((a, p) => a + Math.min(p.total, bayar[p.id] || 0), 0), baru }];
  })), [voucher, pesanan, bayar]);
  const totalDiskon = Object.values(performa).reduce((a, x) => a + x.diskon, 0);
  const totalOmzet = Object.values(performa).reduce((a, x) => a + x.omzet, 0);

  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Voucher & promo</h2>
        <button onClick={() => setF(f ? null : kosong)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white">{f ? "Tutup" : "+ Voucher"}</button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 px-3 py-2"><p className="text-[11px] text-muted-foreground">Total diskon diberikan</p><p className="font-bold">{rp(totalDiskon)}</p></div>
        <div className="rounded-lg bg-slate-50 px-3 py-2"><p className="text-[11px] text-muted-foreground">Uang masuk dari booking ber-voucher</p><p className="font-bold">{rp(totalOmzet)}</p></div>
        <div className="rounded-lg bg-slate-50 px-3 py-2"><p className="text-[11px] text-muted-foreground">Rasio diskon : uang masuk</p><p className="font-bold">{totalOmzet ? `${Math.round((totalDiskon / totalOmzet) * 100)}%` : "—"}</p></div>
      </div>

      {f && (
        <div className="mb-4 space-y-3 rounded-lg border border-border bg-slate-50 p-3">
          <div className="grid grid-cols-2 gap-3">
            <Kol label="Kode"><input className={inp} value={f.kode} onChange={(e) => s("kode", e.target.value)} placeholder="DISC25" /></Kol>
            <Kol label="Nama"><input className={inp} value={f.nama} onChange={(e) => s("nama", e.target.value)} placeholder="Promo mingguan" /></Kol>
            <Kol label="Tipe"><select className={inp} value={f.tipe} onChange={(e) => s("tipe", e.target.value)}><option value="persen">Persen</option><option value="nominal">Nominal</option></select></Kol>
            <Kol label={f.tipe === "persen" ? "Nilai (%)" : "Nilai (Rp)"}><input className={inp} inputMode="numeric" value={f.nilai} onChange={(e) => s("nilai", e.target.value)} /></Kol>
            <Kol label="Durasi sewa"><select className={inp} value={f.periode} onChange={(e) => s("periode", e.target.value)}><option value="semua">Semua</option><option value="harian">Harian</option><option value="mingguan">Mingguan</option><option value="bulanan">Bulanan</option></select></Kol>
            <Kol label="Kategori unit"><select className={inp} value={f.kategori} onChange={(e) => s("kategori", e.target.value)}><option value="semua">Semua</option><option value="laptop">Laptop</option><option value="sepatu">Sepatu</option></select></Kol>
            <Kol label="Untuk siapa"><select className={inp} value={f.segmen} onChange={(e) => s("segmen", e.target.value)}>{Object.entries(SEGMEN).map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select></Kol>
            <Kol label="Khusus pelanggan (opsional)"><select className={inp} value={f.pelanggan_id} onChange={(e) => s("pelanggan_id", e.target.value)}><option value="">— semua —</option>{[...pelanggan].sort((a, b) => a.nama.localeCompare(b.nama)).map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}</select></Kol>
            <Kol label="Minimal transaksi (Rp)"><input className={inp} inputMode="numeric" value={f.min_transaksi} onChange={(e) => s("min_transaksi", e.target.value)} placeholder="0" /></Kol>
            <Kol label="Maksimal diskon (Rp)"><input className={inp} inputMode="numeric" value={f.maks_diskon} onChange={(e) => s("maks_diskon", e.target.value)} placeholder="0 = tanpa batas" /></Kol>
            <Kol label="Kuota total"><input className={inp} inputMode="numeric" value={f.maks_pakai} onChange={(e) => s("maks_pakai", e.target.value)} placeholder="0 = tanpa batas" /></Kol>
            <Kol label="Maks per pelanggan"><input className={inp} inputMode="numeric" value={f.maks_per_pelanggan} onChange={(e) => s("maks_per_pelanggan", e.target.value)} placeholder="0 = tanpa batas" /></Kol>
            <Kol label="Mulai berlaku"><input type="date" className={inp} value={f.mulai} onChange={(e) => s("mulai", e.target.value)} /></Kol>
            <Kol label="Kedaluwarsa"><input type="date" className={inp} value={f.selesai} onChange={(e) => s("selesai", e.target.value)} /></Kol>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.bisa_digabung} onChange={(e) => s("bisa_digabung", e.target.checked)} /> Boleh digabung dengan diskon manual lain</label>
          <p className="text-[11px] text-muted-foreground">Satu booking hanya bisa memakai satu voucher. Potongan dihitung otomatis dari harga sewa.</p>
          <button onClick={simpan} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">{f.id ? "Simpan perubahan" : "Simpan voucher"}</button>
        </div>
      )}

      <ul className="space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
        {voucher.map((v) => {
          const pf = performa[v.id] || { n: 0, diskon: 0, omzet: 0, baru: 0 };
          const aturan = [
            v.periode !== "semua" && v.periode, v.kategori && v.kategori !== "semua" && v.kategori, v.segmen && v.segmen !== "semua" && SEGMEN[v.segmen],
            v.pelanggan_id && `khusus ${pelanggan.find((c) => c.id === v.pelanggan_id)?.nama || "pelanggan"}`,
            v.min_transaksi && `min ${rp(v.min_transaksi)}`, v.maks_diskon && `maks ${rp(v.maks_diskon)}`,
            v.maks_pakai && `kuota ${v.terpakai}/${v.maks_pakai}`, v.maks_per_pelanggan && `${v.maks_per_pelanggan}×/pelanggan`,
            v.selesai && `s/d ${tglIndo(v.selesai)}`, v.bisa_digabung === false && "tidak bisa digabung",
          ].filter(Boolean);
          return (
            <li key={v.id} className={"rounded-xl border border-border p-3 " + (v.aktif ? "" : "opacity-60")}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-bold text-slate-900">{v.kode} <span className="font-sans text-xs font-semibold text-primary">{v.tipe === "persen" ? `${v.nilai}%` : rp(v.nilai)}</span></p>
                  <p className="text-xs text-muted-foreground">{v.nama}</p>
                  {aturan.length > 0 && <p className="mt-1 text-[11px] text-slate-600">{aturan.join(" · ")}</p>}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button onClick={() => ubah(v)} className="rounded-lg border border-border px-2 py-1 text-xs font-semibold text-slate-600">Ubah</button>
                  <button onClick={() => toggle(v)} className="rounded-lg border border-border px-2 py-1 text-xs font-semibold text-slate-600">{v.aktif ? "Matikan" : "Aktifkan"}</button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1 text-center text-[11px]">
                <div className="rounded bg-slate-50 py-1"><b className="block text-sm">{pf.n}</b>dipakai</div>
                <div className="rounded bg-slate-50 py-1"><b className="block text-sm">{pf.baru}</b>pelanggan baru</div>
                <div className="rounded bg-slate-50 py-1"><b className="block truncate text-sm">{rp(pf.diskon)}</b>diskon</div>
                <div className="rounded bg-slate-50 py-1"><b className="block truncate text-sm">{rp(pf.omzet)}</b>uang masuk</div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
