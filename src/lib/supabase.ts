import { createClient } from "@supabase/supabase-js";

/**
 * Kunci publishable memang dirancang untuk dipakai di sisi browser.
 * Keamanan data dijaga oleh Row Level Security di database, bukan
 * dengan menyembunyikan kunci ini.
 */
const URL = import.meta.env.VITE_SUPABASE_URL ?? "https://deegpogdpdhyzprjjksc.supabase.co";
const KEY = import.meta.env.VITE_SUPABASE_KEY ?? "sb_publishable_EwP5fCkLuAouNBVUfbI2WQ_oly8JGFs";

export const supabase = createClient(URL, KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export type StatusVerifikasi = "menunggu" | "disetujui" | "ditolak";

export type Profil = {
  id: string;
  nama: string;
  wa: string;
  instagram: string;
  alamat: string;
  status_verifikasi: StatusVerifikasi;
  catatan_review: string;
  is_admin: boolean;
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

export type Dokumen = {
  id: string;
  user_id: string;
  jenis: string;
  path: string;
  nama_file: string;
  diunggah_pada: string;
};

export type Pesanan = {
  id: string;
  user_id: string;
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
  status: "menunggu" | "disetujui" | "ditolak" | "berjalan" | "selesai";
  catatan: string;
  catatan_admin: string;
  dibuat_pada: string;
  profil?: { nama: string; wa: string } | null;
  unit?: { nama: string } | null;
};

export const JENIS_DOKUMEN = [
  { key: "ktp", label: "KTP", wajib: true },
  { key: "jaminan", label: "Jaminan ke-2 (KK / SIM / Paspor / NPWP / KTM)", wajib: true },
  { key: "selfie", label: "Selfie memegang KTP", wajib: true },
  { key: "getcontact", label: "Tangkapan layar GetContact", wajib: false },
  { key: "pendukung", label: "Dokumen pendukung lain", wajib: false },
] as const;

export const rp = (n: number) => "Rp" + (Number(n) || 0).toLocaleString("id-ID");

export const hariDari = (tipe: string, jumlah: number) =>
  tipe === "harian" ? jumlah : tipe === "mingguan" ? jumlah * 7 : jumlah * 30;

export function tambahHari(tanggal: string, hari: number) {
  const d = new Date(tanggal + "T00:00:00");
  d.setDate(d.getDate() + hari);
  return d.toISOString().slice(0, 10);
}

export const tglIndo = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
