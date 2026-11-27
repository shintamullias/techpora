import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { tugasTelat } from "./TabTugas";
import { supabase, rp, tglIndo, waktuPesanan, kelompokkanBayar, sisaTagihan, sudahJatuhTempo, bulanDari, namaBulan,
  type Pesanan, type Pembayaran, type Unit, type Tugas, type Pengeluaran } from "@/lib/supabase";

type Log = { id: number; waktu: string; tabel: string; aksi: string; oleh_email: string | null; lama: Record<string, unknown> | null; baru: Record<string, unknown> | null };

const sekarangWIB = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
const ringkas = (n: number) => (Math.abs(n) >= 1e6 ? `${(n / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt` : Math.abs(n) >= 1e3 ? `${Math.round(n / 1e3)}rb` : String(n));
const tambahHari = (t: string, n: number) => { const d = new Date(t + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const NAMA_TABEL: Record<string, string> = { pesanan: "Pesanan", pembayaran: "Pembayaran", pelanggan: "Pelanggan", unit: "Unit", voucher: "Voucher", pengeluaran: "Pengeluaran" };

function Angka({ label, nilai, sub, nada = "text-slate-900", onClick }: { label: string; nilai: string | number; sub?: string; nada?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} disabled={!onClick}
      className="min-w-0 rounded-xl border border-border bg-white px-3.5 py-3 text-left shadow-sm transition enabled:hover:border-primary/40">
      <p className="truncate text-[11px] text-muted-foreground">{label}</p>
      <p className={"mt-0.5 truncate text-lg font-bold tabular-nums " + nada}>{nilai}</p>
      {sub && <p className="truncate text-[11px] text-muted-foreground">{sub}</p>}
    </button>
  );
}

function Kotak({ judul, aksi, children }: { judul: string; aksi?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">{judul}</h3>{aksi}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export default function Overview({ pesanan, pembayaran, unit, tugas, biaya, keTab, bookingBaru, tugasBaru }: {
  pesanan: Pesanan[]; pembayaran: Pembayaran[]; unit: Unit[]; tugas: Tugas[]; biaya: Pengeluaran[];
  keTab: (t: any) => void; bookingBaru: () => void; tugasBaru: () => void;
}) {
  const kini = sekarangWIB();
  const hariIni = kini.slice(0, 10);
  const bulanIni = hariIni.slice(0, 7);
  const [log, setLog] = useState<Log[]>([]);
  useEffect(() => {
    supabase.from("audit_log").select("id,waktu,tabel,aksi,oleh_email,lama,baru").order("waktu", { ascending: false }).limit(12)
      .then(({ data }) => setLog((data as Log[]) || []));
  }, [pesanan.length, pembayaran.length]);

  const d = useMemo(() => {
    const bayar = kelompokkanBayar(pembayaran);
    const hidup = pesanan.filter((p) => p.status !== "batal");
    const pakai = (p: Pesanan) => { const w = waktuPesanan(p); return w.dari <= kini && kini < w.sampai; };

    // status unit
    const disewa = new Set(hidup.filter((p) => p.status === "berjalan" || (p.status === "dipesan" && pakai(p))).map((p) => p.unit_id));
    const akan = new Set(hidup.filter((p) => (p.status === "dipesan" || p.status === "menunggu") && waktuPesanan(p).dari > kini).map((p) => p.unit_id));
    const aktif = unit.filter((u) => u.aktif);
    const maint = aktif.filter((u) => u.kondisi === "maintenance");
    const rusak = aktif.filter((u) => u.kondisi === "rusak");
    const tersedia = aktif.filter((u) => (u.kondisi || "baik") === "baik" && !disewa.has(u.id));

    // uang
    const sah = pembayaran.filter((b) => pesanan.some((p) => p.id === b.pesanan_id));
    const net = (b: Pembayaran) => (b.jenis === "refund" ? -1 : 1) * b.jumlah;
    const masukBln = sah.filter((b) => b.tanggal.startsWith(bulanIni)).reduce((s, b) => s + net(b), 0);
    const keluarBln = biaya.filter((b) => b.tanggal.startsWith(bulanIni)).reduce((s, b) => s + b.jumlah, 0);
    const utang = hidup.filter((p) => sudahJatuhTempo(p) && sisaTagihan(p, bayar) > 0);
    const outstanding = utang.reduce((s, p) => s + sisaTagihan(p, bayar), 0);

    // jadwal
    const sampai7 = tambahHari(hariIni, 7);
    const pickup = hidup.filter((p) => (p.status === "dipesan" || p.status === "menunggu") && p.mulai >= hariIni && p.mulai <= sampai7)
      .sort((a, b) => waktuPesanan(a).dari.localeCompare(waktuPesanan(b).dari));
    const kembali = hidup.filter((p) => p.status === "berjalan" && p.selesai >= hariIni && p.selesai <= sampai7)
      .sort((a, b) => waktuPesanan(a).sampai.localeCompare(waktuPesanan(b).sampai));
    const telat = hidup.filter((p) => p.status === "berjalan" && waktuPesanan(p).sampai < kini);

    // utilisasi bulan ini: hari-unit tersewa / (unit aktif × hari berjalan)
    const hariBln = Number(hariIni.slice(8, 10));
    const awal = `${bulanIni}-01`;
    const hariSewa = (p: Pesanan, dari: string, ke: string) => {
      const m = p.mulai > dari ? p.mulai : dari, s = p.selesai < ke ? p.selesai : ke;
      return Math.max(0, (Date.parse(s) - Date.parse(m)) / 864e5);
    };
    const tersewaBln = hidup.filter((p) => p.status !== "menunggu").reduce((s, p) => s + hariSewa(p, awal, tambahHari(hariIni, 1)), 0);
    const utilisasi = aktif.length ? Math.round((tersewaBln / (aktif.length * hariBln)) * 100) : 0;

    // 6 bulan terakhir: pemasukan & okupansi
    const bulan: string[] = [];
    for (let i = 5; i >= 0; i--) { const t = new Date(Date.UTC(+bulanIni.slice(0, 4), +bulanIni.slice(5, 7) - 1 - i, 1)); bulan.push(t.toISOString().slice(0, 7)); }
    const grafik = bulan.map((b) => {
      const dari = `${b}-01`;
      const [y, m] = b.split("-").map(Number);
      const ke = new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10);
      const jumlahHari = (Date.parse(ke) - Date.parse(dari)) / 864e5;
      const sewa = hidup.filter((p) => p.status !== "menunggu").reduce((s, p) => s + hariSewa(p, dari, ke), 0);
      return {
        bulan: namaBulan(b).slice(0, 3),
        Pemasukan: sah.filter((x) => bulanDari(x.tanggal) === b).reduce((s, x) => s + net(x), 0),
        Pengeluaran: biaya.filter((x) => bulanDari(x.tanggal) === b).reduce((s, x) => s + x.jumlah, 0),
        Okupansi: aktif.length ? Math.round((sewa / (aktif.length * jumlahHari)) * 100) : 0,
      };
    });

    // pendapatan per kategori (uang diterima bulan ini)
    const kat: Record<string, number> = {};
    sah.filter((b) => b.tanggal.startsWith(bulanIni)).forEach((b) => {
      const p = pesanan.find((x) => x.id === b.pesanan_id);
      const k = unit.find((u) => u.id === p?.unit_id)?.kategori || "lainnya";
      kat[k] = (kat[k] || 0) + net(b);
    });

    return {
      total: aktif.length, tersedia: tersedia.length, disewa: disewa.size, akan: akan.size, maint, rusak,
      bookingHari: pesanan.filter((p) => (p.dibuat_pada || "").slice(0, 10) === hariIni || p.mulai === hariIni).filter((p) => p.status !== "batal").length,
      bookingBln: hidup.filter((p) => p.mulai.startsWith(bulanIni)).length,
      masukBln, keluarBln, outstanding, utang, pickup, kembali, telat, utilisasi, grafik,
      kategori: Object.entries(kat).sort((a, b) => b[1] - a[1]),
      tugasHari: tugas.filter((t) => t.jatuh_tempo === hariIni && t.status !== "selesai" && t.status !== "batal").length,
    };
  }, [pesanan, pembayaran, unit, tugas, biaya, kini, hariIni, bulanIni]);

  const net = d.masukBln - d.keluarBln;
  const baris = (p: Pesanan, saat: string, nada = "") => (
    <li key={p.id} className="flex items-center justify-between gap-2 py-2 text-sm">
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{p.pelanggan?.nama || "-"}</p>
        <p className="truncate text-xs text-muted-foreground">{p.unit_id} · {p.unit?.nama}</p>
      </div>
      <span className={"shrink-0 text-right text-xs font-semibold " + (nada || "text-slate-600")}>{tglIndo(saat.slice(0, 10))}<br />{saat.slice(11)}</span>
    </li>
  );

  return (
    <div className="space-y-4">
      {/* Aksi cepat + notifikasi telat */}
      <div className="flex flex-wrap gap-2">
        <button onClick={bookingBaru} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm">+ Booking baru</button>
        <button onClick={tugasBaru} className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm">+ Tambah tugas</button>
        {d.tugasHari > 0 && <button onClick={() => keTab("tugas")} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-800">{d.tugasHari} tugas hari ini</button>}
        {tugas.filter(tugasTelat).length > 0 && <button onClick={() => keTab("tugas")} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-800">⚠ {tugas.filter(tugasTelat).length} tugas telat</button>}
      </div>

      {d.telat.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5">
          <p className="text-sm font-semibold text-rose-800">⚠ {d.telat.length} unit terlambat dikembalikan</p>
          <ul className="mt-1.5 space-y-0.5 text-xs text-rose-700">
            {d.telat.map((p) => <li key={p.id}>{p.unit_id} · {p.pelanggan?.nama} — harusnya kembali {tglIndo(p.selesai)} {waktuPesanan(p).sampai.slice(11)}</li>)}
          </ul>
        </div>
      )}

      {/* Unit */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        <Angka label="Total unit" nilai={d.total} onClick={() => keTab("unit")} />
        <Angka label="Tersedia" nilai={d.tersedia} nada="text-emerald-600" onClick={() => keTab("kalender")} />
        <Angka label="Sedang disewa" nilai={d.disewa} nada="text-sky-600" onClick={() => keTab("kalender")} />
        <Angka label="Akan disewa" nilai={d.akan} nada="text-indigo-600" onClick={() => keTab("kalender")} />
        <Angka label="Maintenance" nilai={d.maint.length} nada="text-amber-600" sub={d.maint.map((u) => u.id).join(", ") || undefined} onClick={() => keTab("unit")} />
        <Angka label="Rusak" nilai={d.rusak.length} nada="text-rose-600" sub={d.rusak.map((u) => u.id).join(", ") || undefined} onClick={() => keTab("unit")} />
      </div>

      {/* Booking & uang */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Angka label="Booking hari ini" nilai={d.bookingHari} onClick={() => keTab("pesanan")} />
        <Angka label="Booking bulan ini" nilai={d.bookingBln} onClick={() => keTab("pesanan")} />
        <Angka label="Utilisasi bulan ini" nilai={`${d.utilisasi}%`} nada={d.utilisasi >= 60 ? "text-emerald-600" : "text-amber-600"} />
        <Angka label="Belum dibayar" nilai={`${d.utang.length} transaksi`} nada="text-rose-600" onClick={() => keTab("piutang")} />
        <Angka label="Pemasukan aktual (bln ini)" nilai={rp(d.masukBln)} nada="text-emerald-700" onClick={() => keTab("keuangan")} />
        <Angka label="Pengeluaran (bln ini)" nilai={rp(d.keluarBln)} nada="text-rose-700" onClick={() => keTab("keuangan")} />
        <Angka label="Net profit (bln ini)" nilai={rp(net)} nada={net >= 0 ? "text-emerald-700" : "text-rose-700"} onClick={() => keTab("keuangan")} />
        <Angka label="Outstanding payment" nilai={rp(d.outstanding)} nada="text-rose-600" onClick={() => keTab("piutang")} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Kotak judul="Pemasukan & pengeluaran bulanan">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.grafik}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={ringkas} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={42} />
                <Tooltip formatter={(v: number) => rp(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Pemasukan" fill="#0891b2" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Kotak>
        <Kotak judul="Okupansi unit (%)">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.grafik}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Line type="monotone" dataKey="Okupansi" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Kotak>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Kotak judul={`Ambil unit · 7 hari (${d.pickup.length})`}>
          {d.pickup.length ? <ul className="divide-y divide-border/60">{d.pickup.slice(0, 8).map((p) => baris(p, waktuPesanan(p).dari, p.status === "menunggu" ? "text-slate-400" : "text-indigo-600"))}</ul>
            : <p className="text-sm text-muted-foreground">Tidak ada jadwal ambil.</p>}
        </Kotak>
        <Kotak judul={`Pengembalian · 7 hari (${d.kembali.length})`}>
          {d.kembali.length ? <ul className="divide-y divide-border/60">{d.kembali.slice(0, 8).map((p) => baris(p, waktuPesanan(p).sampai, "text-sky-600"))}</ul>
            : <p className="text-sm text-muted-foreground">Tidak ada jadwal kembali.</p>}
        </Kotak>
        <Kotak judul="Pendapatan per kategori (bln ini)">
          {d.kategori.length ? (
            <ul className="space-y-2.5">
              {d.kategori.map(([k, v]) => {
                const maks = d.kategori[0][1] || 1;
                return (
                  <li key={k}>
                    <div className="flex justify-between text-sm"><span className="capitalize text-slate-700">{k}</span><b className="tabular-nums">{rp(v)}</b></div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(4, (v / maks) * 100)}%` }} /></div>
                  </li>
                );
              })}
            </ul>
          ) : <p className="text-sm text-muted-foreground">Belum ada uang masuk bulan ini.</p>}
        </Kotak>
      </div>

      <Kotak judul="Aktivitas terbaru" aksi={<button onClick={() => keTab("pengaturan")} className="text-xs font-semibold text-primary">Lihat semua</button>}>
        {log.length ? (
          <ul className="divide-y divide-border/60">
            {log.map((l) => {
              const r = l.baru || l.lama || {};
              const apa = String(r.nama ?? r.kode ?? (r.jumlah != null ? rp(Number(r.jumlah)) : "") ?? "");
              const ubahStatus = l.aksi === "UPDATE" && l.lama?.status !== l.baru?.status ? ` → ${l.baru?.status}` : "";
              return (
                <li key={l.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                  <span className="min-w-0 truncate text-slate-700">
                    <b className="font-semibold">{l.aksi === "INSERT" ? "Tambah" : l.aksi === "DELETE" ? "Hapus" : "Ubah"}</b> {NAMA_TABEL[l.tabel] || l.tabel}{apa ? ` · ${apa}` : ""}{ubahStatus}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{new Date(l.waktu).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </li>
              );
            })}
          </ul>
        ) : <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>}
      </Kotak>
    </div>
  );
}
