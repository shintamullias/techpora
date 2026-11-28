import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { supabase, rp, tglIndo, waktuPesanan, kelompokkanBayar, type Pesanan, type Pembayaran, type Pengeluaran, type Unit, type Pelanggan } from "@/lib/supabase";
import { hitungPerUnitBulan, jumlahkan, netBayar, penyusutan, unduhTabel, cetakTabel } from "@/lib/keuangan";

/* Laporan lengkap. Setiap laporan disusun sebagai "lembar" (baris pertama = judul kolom),
   dipakai sekaligus untuk tampilan, Excel, CSV, dan PDF supaya angkanya selalu sama. */

type Lembar = { judul: string; baris: (string | number)[][]; catatan?: string };
const BLN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const pct = (a: number, b: number) => (b ? `${Math.round(((a - b) / Math.abs(b)) * 100)}%` : "—");
const ringkas = (n: number) => (Math.abs(n) >= 1e6 ? `${(n / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt` : `${Math.round(n / 1e3)}rb`);
const BIAYA_LANGSUNG = /maintenance|spare|servis|perbaikan|ongkir|kurir|bensin/i;

export default function LaporanKeuangan({ pesanan, pembayaran, biaya, unit, pelanggan }: {
  pesanan: Pesanan[]; pembayaran: Pembayaran[]; biaya: Pengeluaran[]; unit: Unit[]; pelanggan: Pelanggan[];
}) {
  const tahunAda = [...new Set([...pembayaran.map((b) => b.tanggal.slice(0, 4)), ...pesanan.map((p) => p.mulai.slice(0, 4)), String(new Date().getFullYear())])].sort().reverse();
  const [tahun, setTahun] = useState(tahunAda[0]);
  const [aktif, setAktif] = useState(0);
  const [owner, setOwner] = useState<{ bulan: string; jumlah: number; tanggal: string }[]>([]);
  useEffect(() => { supabase.from("bagi_hasil").select("bulan,jumlah,tanggal").then(({ data }) => setOwner(data || [])); }, []);

  const L = useMemo<Lembar[]>(() => {
    const pes = new Map(pesanan.map((p) => [p.id, p]));
    const uD = new Map(unit.map((u) => [u.id, u]));
    const bayar = kelompokkanBayar(pembayaran);
    const perUnit = hitungPerUnitBulan(pesanan, pembayaran, biaya, unit);
    const bulanTh = (th: string) => BLN.map((_, i) => `${th}-${String(i + 1).padStart(2, "0")}`);
    const kini = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 7);
    const bulan = bulanTh(tahun).filter((b) => b <= kini);
    const lalu = String(Number(tahun) - 1);
    const hidup = pesanan.filter((p) => p.status !== "batal");

    const angka = (b: string) => {
      const sewa = hidup.filter((p) => p.mulai.startsWith(b));
      const gross = sewa.reduce((a, p) => a + (p.harga_sewa || 0) + (p.harga_antar || 0) + Math.max(0, (p.item || []).reduce((s, i) => s + Math.max(0, i.jumlah), 0)), 0);
      const diskon = sewa.reduce((a, p) => a + (p.diskon || 0) + Math.abs((p.item || []).reduce((s, i) => s + Math.min(0, i.jumlah), 0)), 0);
      const masuk = pembayaran.filter((x) => x.tanggal.startsWith(b) && pes.has(x.pesanan_id)).reduce((a, x) => a + netBayar(x), 0);
      const bB = biaya.filter((x) => x.tanggal.startsWith(b));
      const langsung = bB.filter((x) => x.unit_id || BIAYA_LANGSUNG.test(x.kategori)).reduce((a, x) => a + x.jumlah, 0);
      const keluar = bB.reduce((a, x) => a + x.jumlah, 0);
      const ow = owner.filter((x) => x.tanggal.startsWith(b)).reduce((a, x) => a + x.jumlah, 0);
      return { sewa: sewa.length, gross, diskon, netRev: gross - diskon, masuk, langsung, keluar, grossProfit: masuk - langsung, netProfit: masuk - keluar, ow, kas: masuk - keluar - ow };
    };

    // 1. Laba rugi bulanan + perbandingan
    let saldo = 0;
    const lr = bulan.map((b) => ({ b, ...angka(b), ly: angka(lalu + b.slice(4)) }));
    const tot = lr.reduce((a, r) => ({ gross: a.gross + r.gross, diskon: a.diskon + r.diskon, netRev: a.netRev + r.netRev, masuk: a.masuk + r.masuk, langsung: a.langsung + r.langsung, keluar: a.keluar + r.keluar, grossProfit: a.grossProfit + r.grossProfit, netProfit: a.netProfit + r.netProfit, ow: a.ow + r.ow }), { gross: 0, diskon: 0, netRev: 0, masuk: 0, langsung: 0, keluar: 0, grossProfit: 0, netProfit: 0, ow: 0 });

    const kategoriBiaya: Record<string, number> = {};
    biaya.filter((x) => x.tanggal.startsWith(tahun)).forEach((x) => { kategoriBiaya[x.kategori || "Lainnya"] = (kategoriBiaya[x.kategori || "Lainnya"] || 0) + x.jumlah; });

    const unitTh = perUnit.filter((r) => r.bulan.startsWith(tahun));
    const unitSemua = (uid: string) => jumlahkan(perUnit.filter((r) => r.unit_id === uid));
    const hariTahun = Math.max(1, (Math.min(Date.now(), Date.parse(`${Number(tahun) + 1}-01-01`)) - Date.parse(`${tahun}-01-01`)) / 864e5);
    const hariSewa = (uid: string) => hidup.filter((p) => p.unit_id === uid && p.status !== "menunggu" && p.mulai.startsWith(tahun)).reduce((a, p) => a + (p.total_hari || 1), 0);

    const kat: Record<string, ReturnType<typeof jumlahkan> & { unit: number }> = {};
    for (const u of unit) {
      const k = u.kategori || "lainnya";
      const j = jumlahkan(unitTh.filter((r) => r.unit_id === u.id));
      const a = kat[k] || { ...jumlahkan([]), unit: 0 };
      kat[k] = { pendapatan: a.pendapatan + j.pendapatan, biayaLangsung: a.biayaLangsung + j.biayaLangsung, biayaBersama: a.biayaBersama + j.biayaBersama, laba: a.laba + j.laba, hakPemilik: a.hakPemilik + j.hakPemilik, hakPerusahaan: a.hakPerusahaan + j.hakPerusahaan, transaksi: a.transaksi + j.transaksi, unit: a.unit + 1 };
    }

    const thPes = pesanan.filter((p) => p.mulai.startsWith(tahun));
    const batal = thPes.filter((p) => p.status === "batal");
    const telat = hidup.filter((p) => p.mulai.startsWith(tahun) && p.kembali_pada && new Date(p.kembali_pada).getTime() > Date.parse(waktuPesanan(p).sampai + ":00+07:00") + 3600e3);
    const durasi: Record<string, number[]> = {};
    hidup.filter((p) => p.mulai.startsWith(tahun)).forEach((p) => { (durasi[p.durasi_tipe] ||= []).push(p.total_hari || 1); });
    const utang = hidup.map((p) => ({ p, sisa: Math.max(0, p.total - (bayar[p.id] || 0)) })).filter((x) => x.sisa > 0 && x.p.status !== "menunggu");
    const pertama = new Map<string, string>();
    [...hidup].sort((a, b) => a.mulai.localeCompare(b.mulai)).forEach((p) => { if (!pertama.has(p.pelanggan_id)) pertama.set(p.pelanggan_id, p.mulai.slice(0, 7)); });
    const mtBiaya = biaya.filter((x) => x.tanggal.startsWith(tahun) && /maintenance|spare|servis|perbaikan/i.test(x.kategori));

    return [
      { judul: "Laba rugi", catatan: "Pendapatan kotor = nilai sewa+ongkir+tambahan dari booking yang mulai di bulan itu. Pendapatan bersih = setelah diskon. Laba dihitung dari uang yang benar-benar masuk (kas).",
        baris: [["Bulan", "Booking", "Pendapatan kotor", "Diskon", "Pendapatan bersih", "Uang masuk", "Biaya langsung", "Laba kotor", "Total biaya", "Laba bersih", "vs bln lalu", "Tahun lalu", "vs tahun lalu"],
          ...lr.map((r, i) => [`${BLN[Number(r.b.slice(5)) - 1]} ${tahun}`, r.sewa, r.gross, r.diskon, r.netRev, r.masuk, r.langsung, r.grossProfit, r.keluar, r.netProfit, i ? pct(r.netProfit, lr[i - 1].netProfit) : "—", r.ly.netProfit, pct(r.netProfit, r.ly.netProfit)]),
          ["Total", lr.reduce((a, r) => a + r.sewa, 0), tot.gross, tot.diskon, tot.netRev, tot.masuk, tot.langsung, tot.grossProfit, tot.keluar, tot.netProfit, "", lr.reduce((a, r) => a + r.ly.netProfit, 0), pct(tot.netProfit, lr.reduce((a, r) => a + r.ly.netProfit, 0))]] },
      { judul: "Arus kas", catatan: "Kas keluar termasuk biaya operasional dan transfer bagi hasil ke pemilik.",
        baris: [["Bulan", "Kas masuk", "Biaya", "Transfer ke pemilik", "Arus kas bersih", "Saldo kumulatif"],
          ...lr.map((r) => { saldo += r.kas; return [`${BLN[Number(r.b.slice(5)) - 1]} ${tahun}`, r.masuk, r.keluar, r.ow, r.kas, saldo]; })] },
      { judul: "Biaya per kategori", baris: [["Kategori", "Jumlah", "% dari total"], ...Object.entries(kategoriBiaya).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v, `${Math.round((v / Math.max(1, tot.keluar)) * 100)}%`])] },
      { judul: "Profit per unit & ROI", catatan: "ROI = laba kumulatif sejak awal ÷ modal unit. Utilisasi = hari tersewa tahun ini ÷ hari berjalan.",
        baris: [["Unit", "Pendapatan " + tahun, "Biaya " + tahun, "Laba " + tahun, "Transaksi", "Laba/transaksi", "Utilisasi", "Laba kumulatif", "Modal", "ROI", "Nilai buku"],
          ...unit.map((u) => { const j = jumlahkan(unitTh.filter((r) => r.unit_id === u.id)); const s = unitSemua(u.id); const modal = u.harga_beli || u.modal || 0;
            return [`${u.id} ${u.nama}`, j.pendapatan, j.biayaLangsung + j.biayaBersama, j.laba, j.transaksi, j.transaksi ? Math.round(j.laba / j.transaksi) : 0, `${Math.round((hariSewa(u.id) / hariTahun) * 100)}%`, s.laba, modal, modal ? `${Math.round((s.laba / modal) * 100)}%` : "—", penyusutan(u).nilaiBuku]; })] },
      { judul: "Profit per kategori", baris: [["Kategori", "Unit", "Pendapatan", "Biaya", "Laba", "Hak pemilik", "Hak perusahaan", "Margin"],
          ...Object.entries(kat).map(([k, v]) => [k, v.unit, v.pendapatan, v.biayaLangsung + v.biayaBersama, v.laba, v.hakPemilik, v.hakPerusahaan, v.pendapatan ? `${Math.round((v.laba / v.pendapatan) * 100)}%` : "—"])] },
      { judul: "Booking & durasi", baris: [["Keterangan", "Nilai"], ["Total booking", thPes.length], ["Selesai", thPes.filter((p) => p.status === "selesai").length], ["Berjalan / dikonfirmasi", thPes.filter((p) => p.status === "berjalan" || p.status === "dipesan").length], ["Batal", batal.length],
          ...Object.entries(durasi).map(([k, v]) => [`Rata-rata hari (${k}, ${v.length} sewa)`, Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10])] },
      { judul: "Pembatalan", baris: [["Tanggal sewa", "Pelanggan", "Unit", "Nilai", "Alasan"], ...batal.map((p) => [tglIndo(p.mulai), p.pelanggan?.nama || "", p.unit_id, p.total, p.batal_alasan || "-"])] },
      { judul: "Telat kembali", baris: [["Pelanggan", "Unit", "Jadwal kembali", "Kembali aktual"], ...telat.map((p) => [p.pelanggan?.nama || "", p.unit_id, `${tglIndo(p.selesai)} ${waktuPesanan(p).sampai.slice(11)}`, new Date(p.kembali_pada!).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })])] },
      { judul: "Piutang", baris: [["Pelanggan", "Unit", "Mulai", "Jatuh tempo", "Tagihan", "Sisa"], ...utang.sort((a, b) => (a.p.jatuh_tempo_bayar || a.p.mulai).localeCompare(b.p.jatuh_tempo_bayar || b.p.mulai)).map((x) => [x.p.pelanggan?.nama || "", x.p.unit_id, tglIndo(x.p.mulai), tglIndo(x.p.jatuh_tempo_bayar || x.p.mulai), x.p.total, x.sisa])] },
      { judul: "Aktivitas pelanggan", baris: [["Bulan", "Pelanggan aktif", "Pelanggan baru", "Pelanggan kembali"], ...bulan.map((b) => { const ids = new Set(hidup.filter((p) => p.mulai.startsWith(b)).map((p) => p.pelanggan_id)); const baru = [...ids].filter((id) => pertama.get(id) === b).length; return [`${BLN[Number(b.slice(5)) - 1]} ${tahun}`, ids.size, baru, ids.size - baru]; })] },
      { judul: "Biaya maintenance", baris: [["Unit", "Jumlah catatan", "Total biaya"], ...Object.entries(mtBiaya.reduce<Record<string, number[]>>((a, x) => { (a[x.unit_id || "umum"] ||= []).push(x.jumlah); return a; }, {})).map(([k, v]) => [k, v.length, v.reduce((a, b) => a + b, 0)])] },
      { judul: "Bagi hasil pemilik", baris: [["Bulan", "Laba unit milik pemilik", "Hak pemilik", "Ditransfer"], ...bulan.map((b) => { const r = perUnit.filter((x) => x.bulan === b && x.pemilik_id); return [`${BLN[Number(b.slice(5)) - 1]} ${tahun}`, r.reduce((a, x) => a + x.laba, 0), r.reduce((a, x) => a + x.hakPemilik, 0), owner.filter((o) => o.bulan === b).reduce((a, o) => a + o.jumlah, 0)]; })] },
      { judul: "Rekonsiliasi pembayaran", catatan: "Cocokkan dengan mutasi rekening. Baris tanpa bukti perlu dicek.",
        baris: [["Tanggal", "Pelanggan", "Unit", "Metode", "Jenis", "Jumlah", "Bukti"], ...pembayaran.filter((b) => b.tanggal.startsWith(tahun) && b.metode !== "tidak tercatat").sort((a, b) => b.tanggal.localeCompare(a.tanggal)).map((b) => { const p = pes.get(b.pesanan_id); return [tglIndo(b.tanggal), p?.pelanggan?.nama || "", p?.unit_id || "", b.metode || "", b.jenis === "refund" ? "Refund" : "Bayar", netBayar(b), b.bukti ? "ada" : "BELUM"]; })] },
    ].map((l) => ({ ...l, baris: l.baris.length > 1 ? l.baris : [...l.baris, ["Tidak ada data", ...Array(Math.max(0, l.baris[0].length - 1)).fill("")]] }));
  }, [pesanan, pembayaran, biaya, unit, pelanggan, owner, tahun]); // eslint-disable-line react-hooks/exhaustive-deps

  const grafik = L[0].baris.slice(1, -1).map((r) => ({ b: String(r[0]).slice(0, 3), Masuk: r[5] as number, Biaya: r[8] as number, Laba: r[9] as number, "Laba thn lalu": r[11] as number }));
  const lb = L[aktif];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm">{tahunAda.map((t) => <option key={t}>{t}</option>)}</select>
        <span className="mr-auto text-sm text-muted-foreground">Laporan keuangan & operasional</span>
        <button onClick={() => unduhTabel(`laporan-techpora-${tahun}`, L, "xlsx")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">⬇ Excel (semua)</button>
        <button onClick={() => unduhTabel(`${lb.judul}-${tahun}`, [lb], "csv")} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold">CSV</button>
        <button onClick={() => cetakTabel(`Laporan ${tahun}`, "Semua laporan", L)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold">PDF</button>
      </div>

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={grafik}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="b" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={ringkas} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={44} />
              <Tooltip formatter={(v: number) => rp(v)} /><Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Masuk" fill="#0891b2" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Biaya" fill="#f43f5e" radius={[3, 3, 0, 0]} />
              <Line dataKey="Laba" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line dataKey="Laba thn lalu" stroke="#94a3b8" strokeDasharray="4 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {L.map((l, i) => <button key={l.judul} onClick={() => setAktif(i)} className={"shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold " + (aktif === i ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600")}>{l.judul}</button>)}
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">{lb.judul} · {tahun}</h3>
          <button onClick={() => cetakTabel(`${lb.judul} ${tahun}`, lb.catatan || "", [lb])} className="text-xs font-semibold text-primary">PDF</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-xs text-muted-foreground">{lb.baris[0].map((c, i) => <th key={i} className={"whitespace-nowrap px-3 py-2 font-medium " + (i ? "text-right" : "text-left")}>{c}</th>)}</tr></thead>
            <tbody>
              {lb.baris.slice(1).map((r, i) => (
                <tr key={i} className={"border-b border-border/60 " + (r[0] === "Total" ? "font-semibold" : "")}>
                  {r.map((c, j) => <td key={j} className={"whitespace-nowrap px-3 py-1.5 " + (j ? "text-right tabular-nums" : "") + (typeof c === "number" && c < 0 ? " text-rose-600" : "") + (c === "BELUM" ? " font-semibold text-amber-600" : "")}>{typeof c === "number" && (lb.baris[0][j] as string).match(/Booking|Transaksi|Unit$|Jumlah catatan|Pelanggan|^Nilai$|Total booking/) == null && Math.abs(c) >= 1000 ? rp(c) : c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lb.catatan && <p className="px-4 py-2 text-[11px] text-muted-foreground">{lb.catatan}</p>}
      </div>
    </section>
  );
}
