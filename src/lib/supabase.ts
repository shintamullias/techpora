import { createClient } from "@supabase/supabase-js";

/**
 * Kunci publishable memang untuk dipakai di browser.
 * Keamanan dijaga Row Level Security di database: seluruh tabel
 * dashboard hanya bisa diakses akun yang ditandai admin.
 */
const URL = import.meta.env.VITE_SUPABASE_URL ?? "https://deegpogdpdhyzprjjksc.supabase.co";
const KEY = import.meta.env.VITE_SUPABASE_KEY ?? "sb_publishable_EwP5fCkLuAouNBVUfbI2WQ_oly8JGFs";

export const supabase = createClient(URL, KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export type Pelanggan = {
  id: string;
  nama: string;
  wa: string;
  instagram: string;
  alamat: string;
  no_darurat: string;
  catatan: string;
  dibuat_pada: string;
};

export type Unit = {
  id: string;
  nama: string;
  spek: string;
  harian: number;
  mingguan: number;
  bulanan: number;
  aktif: boolean;
  urutan: number;
};

export type StatusPesanan = "dipesan" | "berjalan" | "selesai" | "batal";

export type Pesanan = {
  id: string;
  pelanggan_id: string;
  unit_id: string;
  durasi_tipe: "harian" | "mingguan" | "bulanan";
  durasi_jumlah: number;
  mulai: string;
  jam: string;
  selesai: string;
  total_hari: number;
  antar: "tidak" | "antar" | "pp";
  alamat: string;
  jarak_km: number;
  harga_sewa: number;
  harga_antar: number;
  total: number;
  status: StatusPesanan;
  catatan: string;
  dibuat_pada: string;
  pelanggan?: { nama: string; wa: string } | null;
  unit?: { nama: string } | null;
};

export type Pengaturan = { ongkir_per_km: number; ongkir_minimum: number };

/* ---------- util ---------- */

export const rp = (n: number) => "Rp" + (Number(n) || 0).toLocaleString("id-ID");

export const hariDari = (tipe: string, jumlah: number) =>
  tipe === "harian" ? jumlah : tipe === "mingguan" ? jumlah * 7 : jumlah * 30;

/**
 * Menambah hari pada tanggal "YYYY-MM-DD".
 * Sengaja TIDAK memakai toISOString(): fungsi itu mengonversi ke UTC,
 * sehingga di zona WIB (UTC+7) penambahan harinya termakan balik dan
 * tanggal selesai jadi sama dengan tanggal mulai.
 */
export function tambahHari(tanggal: string, hari: number) {
  const [y, m, d] = tanggal.split("-").map(Number);
  const dt = new Date(y, m - 1, d + hari);
  return (
    dt.getFullYear() +
    "-" +
    String(dt.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(dt.getDate()).padStart(2, "0")
  );
}

export const tglIndo = (iso?: string | null) =>
  iso
    ? new Date(iso.slice(0, 10) + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

/** Ongkir antar-jemput: tarif per km, tapi tidak kurang dari minimum. */
export const hitungOngkir = (km: number, antar: string, p: Pengaturan) =>
  antar === "tidak" ? 0 : Math.max(p.ongkir_minimum, Math.round(km * p.ongkir_per_km));

export const waLink = (wa: string, teks = "") =>
  `https://wa.me/${(wa || "").replace(/[^0-9]/g, "").replace(/^0/, "62")}` +
  (teks ? `?text=${encodeURIComponent(teks)}` : "");

/** Dua rentang tanggal beririsan? (akhir bersifat eksklusif) */
export const beririsan = (a1: string, a2: string, b1: string, b2: string) => a1 < b2 && b1 < a2;

export type Dokumen = {
  id: string;
  pelanggan_id: string;
  jenis: string;
  path: string;
  nama_file: string;
  diunggah_pada: string;
};

export const JENIS_DOKUMEN = [
  { key: "ktp", label: "KTP", wajib: true },
  { key: "jaminan", label: "Jaminan ke-2", wajib: true },
  { key: "selfie", label: "Selfie + KTP", wajib: true },
  { key: "getcontact", label: "GetContact", wajib: false },
  { key: "lainnya", label: "Lainnya", wajib: false },
] as const;
