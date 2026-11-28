import type { Pesanan, Pembayaran, Pengeluaran, Unit } from "./supabase";

/** Satu sumber perhitungan keuangan (dipakai Keuangan, Pemilik, Laporan, Aset).
 *  - Pendapatan = uang benar-benar diterima (pembayaran − refund), menurut tanggal bayar.
 *  - Biaya langsung = pengeluaran yang punya unit_id.
 *  - Biaya bersama = pengeluaran tanpa unit → dialokasikan ke unit sesuai porsi pendapatan bulan itu.
 *  - Laba unit = pendapatan − biaya langsung − alokasi biaya bersama.
 *  - Hak pemilik = laba unit × porsi_pemilik% (unit tanpa pemilik = 100% perusahaan). */

export type BarisUnit = {
  unit_id: string; bulan: string; pendapatan: number; biayaLangsung: number; biayaBersama: number; laba: number;
  hakPemilik: number; hakPerusahaan: number; pemilik_id: string | null; transaksi: number;
};

export const bulanDari = (t: string) => t.slice(0, 7);
export const netBayar = (b: Pembayaran) => (b.jenis === "refund" ? -1 : 1) * b.jumlah;

export function hitungPerUnitBulan(pesanan: Pesanan[], pembayaran: Pembayaran[], biaya: Pengeluaran[], unit: Unit[]): BarisUnit[] {
  const pes = new Map(pesanan.map((p) => [p.id, p]));
  const uDari = new Map(unit.map((u) => [u.id, u]));
  const peta = new Map<string, BarisUnit>();
  const ambil = (uid: string, bln: string) => {
    const k = uid + "|" + bln;
    let r = peta.get(k);
    if (!r) {
      const u = uDari.get(uid);
      r = { unit_id: uid, bulan: bln, pendapatan: 0, biayaLangsung: 0, biayaBersama: 0, laba: 0, hakPemilik: 0, hakPerusahaan: 0, pemilik_id: u?.pemilik_id || null, transaksi: 0 };
      peta.set(k, r);
    }
    return r;
  };
  for (const b of pembayaran) {
    const p = pes.get(b.pesanan_id);
    if (!p) continue;
    const r = ambil(p.unit_id, bulanDari(b.tanggal));
    r.pendapatan += netBayar(b);
    if (b.jenis !== "refund") r.transaksi += 1;
  }
  const bersamaPerBulan: Record<string, number> = {};
  for (const x of biaya) {
    if (x.unit_id) ambil(x.unit_id, bulanDari(x.tanggal)).biayaLangsung += x.jumlah;
    else bersamaPerBulan[bulanDari(x.tanggal)] = (bersamaPerBulan[bulanDari(x.tanggal)] || 0) + x.jumlah;
  }
  const baris = [...peta.values()];
  for (const [bln, jumlah] of Object.entries(bersamaPerBulan)) {
    const ini = baris.filter((r) => r.bulan === bln && r.pendapatan > 0);
    const tot = ini.reduce((a, r) => a + r.pendapatan, 0);
    if (tot > 0) ini.forEach((r) => { r.biayaBersama += (r.pendapatan / tot) * jumlah; });
    else { const r = ambil("_umum", bln); r.biayaBersama += jumlah; if (!baris.includes(r)) baris.push(r); }
  }
  for (const r of baris) {
    r.biayaBersama = Math.round(r.biayaBersama);
    r.laba = r.pendapatan - r.biayaLangsung - r.biayaBersama;
    const u = uDari.get(r.unit_id);
    const porsi = r.pemilik_id ? (u?.porsi_pemilik ?? 0) : 0;
    r.hakPemilik = Math.round((r.laba * porsi) / 100);
    r.hakPerusahaan = r.laba - r.hakPemilik;
  }
  return baris;
}

export const jumlahkan = (rs: BarisUnit[]) => rs.reduce((a, r) => ({
  pendapatan: a.pendapatan + r.pendapatan, biayaLangsung: a.biayaLangsung + r.biayaLangsung, biayaBersama: a.biayaBersama + r.biayaBersama,
  laba: a.laba + r.laba, hakPemilik: a.hakPemilik + r.hakPemilik, hakPerusahaan: a.hakPerusahaan + r.hakPerusahaan, transaksi: a.transaksi + r.transaksi,
}), { pendapatan: 0, biayaLangsung: 0, biayaBersama: 0, laba: 0, hakPemilik: 0, hakPerusahaan: 0, transaksi: 0 });

/** Penyusutan garis lurus per bulan & nilai buku saat ini. */
export function penyusutan(u: Unit, kini = new Date()) {
  const harga = u.harga_beli || u.modal || 0;
  const umur = Math.max(1, u.umur_ekonomis_bulan || 36);
  const perBulan = Math.max(0, (harga - (u.nilai_sisa || 0)) / umur);
  const dari = u.tgl_beli ? new Date(u.tgl_beli) : null;
  const bulanJalan = dari ? Math.max(0, (kini.getFullYear() - dari.getFullYear()) * 12 + kini.getMonth() - dari.getMonth()) : 0;
  const akumulasi = Math.min(harga - (u.nilai_sisa || 0), perBulan * bulanJalan);
  return { harga, perBulan: Math.round(perBulan), bulanJalan, akumulasi: Math.round(akumulasi), nilaiBuku: Math.round(harga - akumulasi), sisaUmur: Math.max(0, umur - bulanJalan) };
}

/** Unduh tabel sebagai Excel (.xlsx) atau CSV. */
export async function unduhTabel(nama: string, lembar: { judul: string; baris: (string | number)[][] }[], format: "xlsx" | "csv") {
  if (format === "csv") {
    const isi = lembar.map((l) => [l.judul, ...l.baris.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n")).join("\n\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + isi], { type: "text/csv;charset=utf-8" }));
    a.download = nama + ".csv"; a.click(); return;
  }
  // Excel XML Spreadsheet (multi-sheet, dibuka langsung oleh Excel & Google Sheets) — tanpa pustaka tambahan
  const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
  const sel = (c: string | number) => typeof c === "number" ? `<Cell><Data ss:Type="Number">${c}</Data></Cell>` : `<Cell><Data ss:Type="String">${esc(c)}</Data></Cell>`;
  const xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">`
    + `<Styles><Style ss:ID="h"><Font ss:Bold="1"/></Style></Styles>`
    + lembar.map((l) => `<Worksheet ss:Name="${esc(l.judul.replace(/[\\/?*[\]:]/g, " ").slice(0, 31))}"><Table>`
      + l.baris.map((r, i) => `<Row${i === 0 ? ' ss:StyleID="h"' : ""}>${r.map(sel).join("")}</Row>`).join("") + `</Table></Worksheet>`).join("")
    + `</Workbook>`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([xml], { type: "application/vnd.ms-excel" }));
  a.download = nama + ".xls"; a.click();
}

/** Buka halaman cetak (simpan PDF) berisi beberapa tabel. */
export function cetakTabel(judul: string, sub: string, lembar: { judul: string; baris: (string | number)[][] }[]) {
  const esc = (s: unknown) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
  const fmt = (c: string | number) => (typeof c === "number" ? c.toLocaleString("id-ID") : esc(c));
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${esc(judul)}</title><style>
body{font-family:system-ui,sans-serif;color:#0f172a;margin:24px;font-size:12px}h1{font-size:18px;margin:0}h2{font-size:14px;margin:18px 0 6px}
table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #e2e8f0;padding:5px 6px;text-align:left}th{background:#f1f5f9}
td:not(:first-child),th:not(:first-child){text-align:right}.k{color:#64748b}@media print{button{display:none}}</style></head><body>
<h1>${esc(judul)}</h1><p class="k">Techpora · ${esc(sub)} · dicetak ${new Date().toLocaleString("id-ID")}</p>
${lembar.map((l) => `<h2>${esc(l.judul)}</h2><table><thead><tr>${l.baris[0].map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${l.baris.slice(1).map((r) => `<tr>${r.map((c) => `<td>${fmt(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`).join("")}
<button onclick="print()" style="margin-top:16px;padding:8px 14px;border:0;border-radius:6px;background:#0891b2;color:#fff">Cetak / simpan PDF</button></body></html>`;
  const w = window.open("", "_blank");
  if (!w) return alert("Izinkan pop-up untuk membuka laporan.");
  w.document.write(html); w.document.close();
}
