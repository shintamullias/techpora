import { useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line,
} from "recharts";
import {
  rp, tglIndo, kelompokkanBayar, sudahDibayar, sisaTagihan, bulanDari, namaBulan,
  type Pesanan, type Pembayaran, type Pengeluaran, type Unit, type Pelanggan,
} from "@/lib/supabase";

const LAPORAN = [
  { key: "pendapatan", label: "Laporan Pendapatan", warna: "bg-emerald-50 text-emerald-600" },
  { key: "laba", label: "Laba & Pengeluaran", warna: "bg-primary/10 text-primary" },
  { key: "utilisasi", label: "Utilisasi Inventaris", warna: "bg-sky-50 text-sky-600" },
  { key: "performa", label: "Performa per Unit", warna: "bg-indigo-50 text-indigo-600" },
  { key: "konversi", label: "Konversi & Pembatalan", warna: "bg-amber-50 text-amber-600" },
  { key: "terlambat", label: "Sewa Terlambat", warna: "bg-rose-50 text-rose-600" },
  { key: "pelanggan", label: "Aktivitas Pelanggan", warna: "bg-violet-50 text-violet-600" },
] as const;
type Kunci = (typeof LAPORAN)[number]["key"];

const STATUS: Record<string, string> = { dipesan: "Dipesan", berjalan: "Aktif", selesai: "Selesai", batal: "Dibatalkan" };
const WARNA_STATUS: Record<string, string> = {
  dipesan: "bg-indigo-50 text-indigo-700", berjalan: "bg-sky-50 text-sky-700",
  selesai: "bg-emerald-50 text-emerald-700", batal: "bg-rose-50 text-rose-700",
};
const ringkas = (n: number) =>
  n >= 1_000_000 ? `Rp${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`
    : n >= 1000 ? `Rp${Math.round(n / 1000)}rb` : rp(n);

function unduhCSV(nama: string, baris: (string | number)[][]) {
  const csv = baris.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url; a.download = nama; a.click();
  URL.revokeObjectURL(url);
}

function Kartu({ judul, ket, children }: { judul: string; ket?: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{judul}</h3>
        {ket && <p className="mt-0.5 text-xs text-muted-foreground">{ket}</p>}
      </div>
      {children}
    </section>
  );
}

function Angka({ label, nilai, warna = "text-slate-900" }: { label: string; nilai: string; warna?: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={"mt-1 text-2xl font-semibold " + warna}>{nilai}</p>
    </div>
  );
}

const th = "px-5 py-3 font-medium";
const td = "px-5 py-3";

export default function TabLaporan({
  pesanan, pembayaran, biaya, unit, pelanggan,
}: {
  pesanan: Pesanan[]; pembayaran: Pembayaran[]; biaya: Pengeluaran[]; unit: Unit[]; pelanggan: Pelanggan[];
}) {
  const [aktif, setAktif] = useState<Kunci>("pendapatan");
  const bayar = useMemo(() => kelompokkanBayar(pembayaran), [pembayaran]);
  const hariIni = new Date().toISOString().slice(0, 10);

  const pendapatan = useMemo(() => pesanan
    .filter((p) => p.status !== "batal")
    .map((p) => ({ p, dibayar: sudahDibayar(p, bayar) }))
    .sort((a, b) => (b.p.mulai || "").localeCompare(a.p.mulai || "")), [pesanan, bayar]);

  const laba = useMemo(() => {
    const masuk = pendapatan.reduce((s, x) => s + x.dibayar, 0);
    const keluar = biaya.reduce((s, b) => s + (b.jumlah || 0), 0);
    return { masuk, keluar, laba: masuk - keluar, margin: masuk > 0 ? Math.round(((masuk - keluar) / masuk) * 100) : 0 };
  }, [pendapatan, biaya]);

  const tren = useMemo(() => {
    const bulan: string[] = [];
    const d = new Date();
    for (let i = 5; i >= 0; i--) {
      const x = new Date(d.getFullYear(), d.getMonth() - i, 1);
      bulan.push(`${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`);
    }
    return bulan.map((ym) => {
      const masuk = pendapatan.filter((x) => bulanDari(x.p.mulai) === ym).reduce((s, x) => s + x.dibayar, 0);
      const keluar = biaya.filter((b) => bulanDari(b.tanggal) === ym).reduce((s, b) => s + (b.jumlah || 0), 0);
      return { bulan: namaBulan(ym).split(" ")[0].slice(0, 3), laba: masuk - keluar, masuk, keluar };
    });
  }, [pendapatan, biaya]);

  const utilisasi = useMemo(() => unit.map((u) => {
    const milik = pesanan.filter((p) => p.unit_id === u.id && p.status !== "batal");
    const hari = milik.reduce((s, p) => s + (p.total_hari || 0), 0);
    const uang = milik.reduce((s, p) => s + sudahDibayar(p, bayar), 0);
    return { nama: u.nama, hari, uang, aktif: u.aktif, keluar: milik.some((p) => p.status === "berjalan") };
  }).sort((a, b) => b.hari - a.hari), [unit, pesanan, bayar]);

  const konversi = useMemo(() => {
    const total = pesanan.length;
    const selesai = pesanan.filter((p) => p.status === "selesai").length;
    const batal = pesanan.filter((p) => p.status === "batal").length;
    const jalan = pesanan.filter((p) => p.status === "dipesan" || p.status === "berjalan").length;
    return {
      total, selesai, batal, jalan,
      konv: total ? Math.round((selesai / total) * 100) : 0,
      bat: total ? Math.round((batal / total) * 100) : 0,
    };
  }, [pesanan]);

  const terlambat = useMemo(() => pesanan
    .filter((p) => p.status === "berjalan" && p.selesai < hariIni)
    .map((p) => ({
      p,
      hari: Math.round((new Date(hariIni).getTime() - new Date(p.selesai).getTime()) / 864e5),
      sisa: sisaTagihan(p, bayar),
    }))
    .sort((a, b) => b.hari - a.hari), [pesanan, bayar, hariIni]);

  const aktivitas = useMemo(() => pelanggan.map((c) => {
    const milik = pesanan.filter((p) => p.pelanggan_id === c.id && p.status !== "batal");
    return {
      nama: c.nama, sewa: milik.length,
      dibayar: milik.reduce((s, p) => s + sudahDibayar(p, bayar), 0),
      piutang: milik.reduce((s, p) => s + sisaTagihan(p, bayar), 0),
    };
  }).filter((r) => r.sewa > 0).sort((a, b) => b.dibayar - a.dibayar), [pelanggan, pesanan, bayar]);

  const ekspor = () => {
    if (aktif === "pendapatan") unduhCSV("laporan-pendapatan.csv", [["Pelanggan", "Unit", "Mulai", "Total", "Dibayar", "Status"], ...pendapatan.map(({ p, dibayar }) => [p.pelanggan?.nama || "-", p.unit?.nama || p.unit_id, p.mulai, p.total, dibayar, STATUS[p.status]])]);
    else if (aktif === "laba") unduhCSV("laba-pengeluaran.csv", [["Bulan", "Pemasukan", "Pengeluaran", "Laba"], ...tren.map((t) => [t.bulan, t.masuk, t.keluar, t.laba])]);
    else if (aktif === "utilisasi" || aktif === "performa") unduhCSV("utilisasi-unit.csv", [["Unit", "Hari Disewa", "Pendapatan"], ...utilisasi.map((r) => [r.nama, r.hari, r.uang])]);
    else if (aktif === "konversi") unduhCSV("konversi.csv", [["Total", "Selesai", "Batal", "Berjalan"], [konversi.total, konversi.selesai, konversi.batal, konversi.jalan]]);
    else if (aktif === "terlambat") unduhCSV("sewa-terlambat.csv", [["Pelanggan", "Unit", "Jatuh Tempo", "Hari Terlambat", "Sisa Tagihan"], ...terlambat.map(({ p, hari, sisa }) => [p.pelanggan?.nama || "-", p.unit?.nama || p.unit_id, p.selesai, hari, sisa])]);
    else unduhCSV("aktivitas-pelanggan.csv", [["Nama", "Jumlah Sewa", "Total Dibayar", "Piutang"], ...aktivitas.map((r) => [r.nama, r.sewa, r.dibayar, r.piutang])]);
  };

  const gridSumbu = { fontSize: 11, fill: "#64748b" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Laporan operasional & ekspor data</p>
        <button onClick={ekspor} className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
          ⬇ Ekspor CSV
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-7">
        {LAPORAN.map((l) => (
          <button key={l.key} onClick={() => setAktif(l.key)}
            className={"rounded-xl border p-3 text-left transition-colors " + (aktif === l.key ? "border-primary bg-primary/5" : "border-border bg-white hover:bg-slate-50")}>
            <span className={"mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold " + l.warna}>{l.label.slice(0, 1)}</span>
            <p className="text-xs font-medium leading-tight text-slate-800">{l.label}</p>
          </button>
        ))}
      </div>

      {aktif === "pendapatan" && (
        <Kartu judul="Laporan Pendapatan" ket={`${pendapatan.length} pesanan · total diterima ${rp(laba.masuk)}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className={th}>Pelanggan</th><th className={th}>Unit</th><th className={th}>Mulai</th><th className={th}>Total</th><th className={th}>Dibayar</th><th className={th}>Status</th>
              </tr></thead>
              <tbody>
                {pendapatan.slice(0, 200).map(({ p, dibayar }) => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0">
                    <td className={td + " font-medium"}>{p.pelanggan?.nama || "-"}</td>
                    <td className={td + " text-muted-foreground"}>{p.unit?.nama || p.unit_id}</td>
                    <td className={td + " text-muted-foreground"}>{tglIndo(p.mulai)}</td>
                    <td className={td + " font-medium"}>{rp(p.total)}</td>
                    <td className={td + " text-emerald-600"}>{rp(dibayar)}</td>
                    <td className={td}><span className={"rounded-full px-2.5 py-0.5 text-xs font-medium " + WARNA_STATUS[p.status]}>{STATUS[p.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Kartu>
      )}

      {aktif === "laba" && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Angka label="Pemasukan" nilai={rp(laba.masuk)} warna="text-emerald-600" />
            <Angka label="Pengeluaran" nilai={rp(laba.keluar)} warna="text-rose-600" />
            <Angka label={`Laba bersih (margin ${laba.margin}%)`} nilai={rp(laba.laba)} />
          </div>
          <Kartu judul="Tren laba 6 bulan" ket="Pemasukan dari pesanan dikurangi pengeluaran tercatat, per bulan mulai sewa">
            <div className="p-4">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={tren}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="bulan" tick={gridSumbu} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={ringkas} tick={gridSumbu} axisLine={false} tickLine={false} width={64} />
                  <Tooltip formatter={(v: number) => rp(v)} />
                  <Line type="monotone" dataKey="laba" name="Laba" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Kartu>
        </>
      )}

      {aktif === "utilisasi" && (
        <Kartu judul="Utilisasi Inventaris" ket="Total hari disewa per unit">
          <div className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilisasi}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="nama" tick={{ ...gridSumbu, fontSize: 10 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={70} interval={0} />
                <YAxis tickFormatter={(v) => `${v}h`} tick={gridSumbu} axisLine={false} tickLine={false} width={40} />
                <Tooltip formatter={(v: number) => `${v} hari`} />
                <Bar dataKey="hari" name="Hari disewa" fill="#11a9c4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto border-t border-border">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className={th}>Unit</th><th className={th}>Hari disewa</th><th className={th}>Pendapatan</th><th className={th}>Status</th>
              </tr></thead>
              <tbody>
                {utilisasi.map((r) => (
                  <tr key={r.nama} className="border-b border-border/60 last:border-0">
                    <td className={td + " font-medium"}>{r.nama}</td>
                    <td className={td + " text-muted-foreground"}>{r.hari} hari</td>
                    <td className={td + " font-medium"}>{rp(r.uang)}</td>
                    <td className={td}>
                      <span className={"rounded-full px-2.5 py-0.5 text-xs font-medium " + (!r.aktif ? "bg-slate-100 text-slate-500" : r.keluar ? "bg-sky-50 text-sky-700" : "bg-emerald-50 text-emerald-700")}>
                        {!r.aktif ? "Nonaktif" : r.keluar ? "Disewa" : "Tersedia"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Kartu>
      )}

      {aktif === "performa" && (
        <Kartu judul="Performa per Unit" ket="Pendapatan & rata-rata per hari sewa">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className={th}>Unit</th><th className={th}>Hari disewa</th><th className={th}>Pendapatan</th><th className={th}>Rata-rata/hari</th>
              </tr></thead>
              <tbody>
                {utilisasi.map((r) => (
                  <tr key={r.nama} className="border-b border-border/60 last:border-0">
                    <td className={td + " font-medium"}>{r.nama}</td>
                    <td className={td + " text-muted-foreground"}>{r.hari}</td>
                    <td className={td + " font-medium"}>{rp(r.uang)}</td>
                    <td className={td + " text-muted-foreground"}>{rp(r.hari > 0 ? Math.round(r.uang / r.hari) : 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Kartu>
      )}

      {aktif === "konversi" && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Angka label="Total pemesanan" nilai={String(konversi.total)} />
            <Angka label="Selesai" nilai={String(konversi.selesai)} warna="text-emerald-600" />
            <Angka label="Tingkat konversi" nilai={`${konversi.konv}%`} warna="text-primary" />
            <Angka label="Tingkat pembatalan" nilai={`${konversi.bat}%`} warna="text-rose-600" />
          </div>
          <Kartu judul="Distribusi status pemesanan">
            <div className="p-4">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={[{ n: "Akan datang / aktif", v: konversi.jalan }, { n: "Selesai", v: konversi.selesai }, { n: "Dibatalkan", v: konversi.batal }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="n" tick={gridSumbu} axisLine={false} tickLine={false} />
                  <YAxis tick={gridSumbu} axisLine={false} tickLine={false} width={30} />
                  <Tooltip />
                  <Bar dataKey="v" name="Jumlah" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Kartu>
        </>
      )}

      {aktif === "terlambat" && (
        <Kartu judul="Sewa Terlambat" ket={`${terlambat.length} sewa lewat tanggal kembali`}>
          {terlambat.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">Tidak ada sewa terlambat.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className={th}>Pelanggan</th><th className={th}>Unit</th><th className={th}>Jatuh tempo</th><th className={th}>Terlambat</th><th className={th}>Sisa tagihan</th>
                </tr></thead>
                <tbody>
                  {terlambat.map(({ p, hari, sisa }) => (
                    <tr key={p.id} className="border-b border-border/60 last:border-0">
                      <td className={td + " font-medium"}>{p.pelanggan?.nama || "-"}</td>
                      <td className={td + " text-muted-foreground"}>{p.unit?.nama || p.unit_id}</td>
                      <td className={td + " text-rose-600"}>{tglIndo(p.selesai)}</td>
                      <td className={td + " font-medium text-rose-600"}>{hari} hari</td>
                      <td className={td + " font-medium"}>{rp(sisa)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Kartu>
      )}

      {aktif === "pelanggan" && (
        <Kartu judul="Aktivitas Pelanggan" ket="Peringkat berdasarkan total dibayar">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className={th}>Pelanggan</th><th className={th}>Jumlah sewa</th><th className={th}>Total dibayar</th><th className={th}>Piutang</th>
              </tr></thead>
              <tbody>
                {aktivitas.map((r, i) => (
                  <tr key={r.nama + i} className="border-b border-border/60 last:border-0">
                    <td className={td + " font-medium"}>{r.nama}</td>
                    <td className={td + " text-muted-foreground"}>{r.sewa}</td>
                    <td className={td + " font-medium"}>{rp(r.dibayar)}</td>
                    <td className={td + " font-medium " + (r.piutang > 0 ? "text-rose-600" : "text-muted-foreground")}>{rp(r.piutang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Kartu>
      )}
    </div>
  );
}
