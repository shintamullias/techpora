import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import {
  rp, kelompokkanBayar, bulanDari, namaBulan, sudahJatuhTempo,
  type Pesanan, type Pembayaran, type Unit, type Pelanggan,
} from "@/lib/supabase";

/** Analisis bebas: kelompokkan transaksi per unit, pelanggan, bulan, kategori, atau tipe durasi,
 *  lalu saring per unit / pelanggan / periode. Pesanan batal tidak dihitung. */
const DIMENSI = {
  unit: "Unit", pelanggan: "Pelanggan", bulan: "Bulan", kategori: "Kategori", durasi: "Tipe sewa",
} as const;
type Dim = keyof typeof DIMENSI;
type Kol = "sewa" | "hari" | "tagihan" | "dibayar" | "piutang" | "diskon" | "rata";

const ringkas = (n: number) =>
  Math.abs(n) >= 1_000_000 ? `${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`
    : Math.abs(n) >= 1000 ? `${Math.round(n / 1000)}rb` : String(n);

const unduhCSV = (nama: string, baris: (string | number)[][]) => {
  const isi = baris.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + isi], { type: "text/csv;charset=utf-8" }));
  a.download = nama; a.click();
};

const sel = "rounded-lg border border-border bg-white px-2.5 py-2 text-sm min-w-0";

export default function LaporanAnalisis({ pesanan, pembayaran, unit, pelanggan }: {
  pesanan: Pesanan[]; pembayaran: Pembayaran[]; unit: Unit[]; pelanggan: Pelanggan[];
}) {
  const [dim, setDim] = useState<Dim>("unit");
  const [fUnit, setFUnit] = useState("");
  const [fPel, setFPel] = useState("");
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");
  const [urut, setUrut] = useState<Kol>("dibayar");

  const bayar = useMemo(() => kelompokkanBayar(pembayaran), [pembayaran]);
  const bulanAda = useMemo(() => [...new Set(pesanan.map((p) => bulanDari(p.mulai)))].sort(), [pesanan]);

  const terpilih = useMemo(() => pesanan.filter((p) =>
    p.status !== "batal" &&
    (!fUnit || p.unit_id === fUnit) && (!fPel || p.pelanggan_id === fPel) &&
    (!dari || bulanDari(p.mulai) >= dari) && (!sampai || bulanDari(p.mulai) <= sampai)), [pesanan, fUnit, fPel, dari, sampai]);

  const baris = useMemo(() => {
    const m = new Map<string, { nama: string; sewa: number; hari: number; tagihan: number; dibayar: number; piutang: number; diskon: number }>();
    for (const p of terpilih) {
      const u = unit.find((x) => x.id === p.unit_id);
      const [k, nama] =
        dim === "unit" ? [p.unit_id, `${p.unit_id} · ${u?.nama || p.unit?.nama || ""}`]
        : dim === "pelanggan" ? [p.pelanggan_id, p.pelanggan?.nama || "-"]
        : dim === "bulan" ? [bulanDari(p.mulai), namaBulan(bulanDari(p.mulai))]
        : dim === "kategori" ? [u?.kategori || "lainnya", u?.kategori || "Lainnya"]
        : [p.durasi_tipe, p.durasi_tipe];
      const r = m.get(k) || { nama, sewa: 0, hari: 0, tagihan: 0, dibayar: 0, piutang: 0, diskon: 0 };
      const masuk = Math.min(bayar[p.id] || 0, p.total || 0);
      r.sewa += 1; r.hari += p.total_hari || 0; r.tagihan += p.total || 0; r.dibayar += masuk;
      r.piutang += sudahJatuhTempo(p) ? Math.max(0, (p.total || 0) - masuk) : 0;
      r.diskon += (p.diskon || 0) + Math.abs((p.item || []).filter((i) => i.jumlah < 0).reduce((s, i) => s + i.jumlah, 0));
      m.set(k, r);
    }
    const out = [...m.entries()].map(([k, r]) => ({ k, ...r, rata: r.hari ? Math.round(r.dibayar / r.hari) : 0 }));
    return dim === "bulan" ? out.sort((a, b) => a.k.localeCompare(b.k)) : out.sort((a, b) => b[urut] - a[urut]);
  }, [terpilih, dim, unit, bayar, urut]);

  const jumlah = baris.reduce((s, r) => ({
    sewa: s.sewa + r.sewa, hari: s.hari + r.hari, tagihan: s.tagihan + r.tagihan,
    dibayar: s.dibayar + r.dibayar, piutang: s.piutang + r.piutang, diskon: s.diskon + r.diskon,
  }), { sewa: 0, hari: 0, tagihan: 0, dibayar: 0, piutang: 0, diskon: 0 });

  const grafik = (dim === "bulan" ? baris : baris.slice(0, 12)).map((r) => ({
    n: r.nama.length > 18 ? r.nama.slice(0, 17) + "…" : r.nama, Dibayar: r.dibayar, Piutang: r.piutang,
  }));

  const KOLOM: [Kol, string][] = [["sewa", "Sewa"], ["hari", "Hari"], ["tagihan", "Tagihan"], ["dibayar", "Dibayar"], ["piutang", "Piutang"], ["diskon", "Diskon"], ["rata", "Rata/hari"]];
  const uang = (k: Kol) => k !== "sewa" && k !== "hari";

  const ekspor = () => unduhCSV(`analisis-per-${dim}.csv`, [
    [DIMENSI[dim], ...KOLOM.map(([, t]) => t)],
    ...baris.map((r) => [r.nama, ...KOLOM.map(([k]) => r[k])]),
  ]);

  return (
    <section className="space-y-3 rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(DIMENSI) as Dim[]).map((d) => (
          <button key={d} onClick={() => setDim(d)}
            className={"rounded-full border px-3 py-1.5 text-xs font-semibold " + (dim === d ? "border-primary bg-primary text-white" : "border-border text-slate-600")}>
            Per {DIMENSI[d].toLowerCase()}
          </button>
        ))}
        <button onClick={ekspor} className="ml-auto rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-700">⬇ CSV</button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <select className={sel} value={fUnit} onChange={(e) => setFUnit(e.target.value)}>
          <option value="">Semua unit</option>
          {unit.map((u) => <option key={u.id} value={u.id}>{u.id} · {u.nama}</option>)}
        </select>
        <select className={sel} value={fPel} onChange={(e) => setFPel(e.target.value)}>
          <option value="">Semua pelanggan</option>
          {[...pelanggan].sort((a, b) => a.nama.localeCompare(b.nama)).map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
        </select>
        <select className={sel} value={dari} onChange={(e) => setDari(e.target.value)}>
          <option value="">Dari awal</option>
          {bulanAda.map((b) => <option key={b} value={b}>Dari {namaBulan(b)}</option>)}
        </select>
        <select className={sel} value={sampai} onChange={(e) => setSampai(e.target.value)}>
          <option value="">Sampai sekarang</option>
          {bulanAda.map((b) => <option key={b} value={b}>Sampai {namaBulan(b)}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {([["Transaksi", String(jumlah.sewa)], ["Uang diterima", rp(jumlah.dibayar)], ["Piutang", rp(jumlah.piutang)], ["Diskon diberikan", rp(jumlah.diskon)]] as const).map(([l, v]) => (
          <div key={l} className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-[11px] text-muted-foreground">{l}</p>
            <p className="text-sm font-bold text-slate-900">{v}</p>
          </div>
        ))}
      </div>

      {grafik.length > 0 && (
        <div style={{ height: dim === "bulan" ? 240 : Math.max(180, grafik.length * 34) }}>
          <ResponsiveContainer width="100%" height="100%">
            {dim === "bulan" ? (
              <BarChart data={grafik}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="n" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={ringkas} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={44} />
                <Tooltip formatter={(v: number) => rp(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Dibayar" stackId="a" fill="#0891b2" />
                <Bar dataKey="Piutang" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={grafik} layout="vertical" margin={{ left: 0, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" tickFormatter={ringkas} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="n" width={120} tick={{ fontSize: 11, fill: "#334155" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => rp(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Dibayar" stackId="a" fill="#0891b2" />
                <Bar dataKey="Piutang" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      <div className="-mx-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">{DIMENSI[dim]}</th>
              {KOLOM.map(([k, t]) => (
                <th key={k} className="px-3 py-2 text-right font-medium">
                  <button onClick={() => setUrut(k)} className={urut === k && dim !== "bulan" ? "text-primary" : ""}>{t}{urut === k && dim !== "bulan" ? " ↓" : ""}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {baris.map((r) => (
              <tr key={r.k} className="border-b border-border/60">
                <td className="px-4 py-2 font-medium text-slate-900">{r.nama}</td>
                {KOLOM.map(([k]) => (
                  <td key={k} className={"px-3 py-2 text-right tabular-nums " + (k === "piutang" && r.piutang > 0 ? "text-rose-600" : "text-slate-700")}>
                    {uang(k) ? rp(r[k]) : r[k]}
                  </td>
                ))}
              </tr>
            ))}
            {baris.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">Tidak ada transaksi untuk saringan ini.</td></tr>}
          </tbody>
          {baris.length > 1 && (
            <tfoot>
              <tr className="font-semibold text-slate-900">
                <td className="px-4 py-2">Total</td>
                {KOLOM.map(([k]) => (
                  <td key={k} className="px-3 py-2 text-right tabular-nums">
                    {k === "rata" ? rp(jumlah.hari ? Math.round(jumlah.dibayar / jumlah.hari) : 0) : uang(k) ? rp(jumlah[k as Exclude<Kol, "rata">]) : jumlah[k as "sewa" | "hari"]}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground">Pesanan batal tidak dihitung. Uang diterima = pembayaran yang tercatat. Piutang hanya sewa yang sudah dimulai.</p>
    </section>
  );
}
