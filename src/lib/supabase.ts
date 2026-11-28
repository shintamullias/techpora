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
  terverifikasi?: boolean;
  verifikasi_pada?: string | null;
  blacklist?: boolean;
  blacklist_alasan?: string | null;
  catatan_internal?: string | null;
  dihubungi_pada?: string | null;
};

/** Kategori aset sewa. Satu unit selalu milik tepat satu kategori. */
export type Kategori = "laptop" | "sepatu";

/** Pilihan saringan di dashboard: satu kategori, atau gabungan semuanya. */
export type Saring = "semua" | Kategori;

export const KATEGORI: { key: Kategori; label: string; prefiks: string }[] = [
  { key: "laptop", label: "Laptop", prefiks: "TP" },
  { key: "sepatu", label: "Sepatu", prefiks: "SS" },
];

export const labelKategori = (k?: string) =>
  KATEGORI.find((x) => x.key === k)?.label ?? "Laptop";

export type Unit = {
  id: string;
  nama: string;
  spek: string;
  harian: number;
  mingguan: number;
  bulanan: number;
  aktif: boolean;
  /** kondisi fisik unit */
  kondisi?: "baik" | "maintenance" | "rusak";
  kode_aset?: string | null; serial_number?: string | null; imei?: string | null;
  tgl_beli?: string | null; harga_beli?: number | null; lokasi?: string | null;
  status_kepemilikan?: string; status_aset?: "aktif" | "pensiun" | "dijual" | "hilang";
  pensiun_pada?: string | null; pensiun_alasan?: string | null;
  umur_ekonomis_bulan?: number; nilai_sisa?: number; interval_maintenance_hari?: number;
  pemilik_id?: string | null;
  urutan: number;
  modal: number;
  pemilik: string;
  porsi_pemilik: number;
  nilai_ganti: number;
  kategori: Kategori;
};

export type Pengeluaran = {
  id: string;
  tanggal: string;
  kategori: string;
  keterangan: string;
  jumlah: number;
  unit_id: string | null;
  kategori_bisnis?: "laptop" | "sepatu" | "umum";
};

export const KATEGORI_BIAYA = [
  { key: "unit", label: "Beli unit" },
  { key: "perawatan", label: "Perawatan" },
  { key: "transport", label: "Transport / bensin" },
  { key: "pemasaran", label: "Pemasaran" },
  { key: "operasional", label: "Operasional" },
  { key: "lainnya", label: "Lainnya" },
] as const;

/** Bulan "YYYY-MM" dari tanggal ISO */
export const bulanDari = (iso: string) => (iso || "").slice(0, 7);

export const namaBulan = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

/** menunggu = Pending, dipesan = Confirmed, berjalan = Active, selesai = Completed, batal = Cancelled */
export type StatusPesanan = "menunggu" | "dipesan" | "berjalan" | "selesai" | "batal";

/** Ubah pesan error database jadi kalimat yang jelas. */
export const pesanGalat = (m: string) =>
  /pesanan_tidak_bentrok/.test(m) ? "Unit sudah dipakai booking lain yang sudah dikonfirmasi di jam tersebut. Simpan sebagai Menunggu, ubah jam/tanggal, atau pilih unit lain."
  : /pesanan_total_cocok/.test(m) ? "Total tidak cocok dengan harga sewa − voucher + ongkir + tambahan."
  : /pesanan_durasi_cocok/.test(m) ? "Jumlah hari tidak cocok dengan tanggal mulai dan selesai."
  : m;

/** Baris tambahan pada sebuah pesanan.
 *  jumlah positif menambah tagihan, negatif berarti potongan/diskon. */
export type ItemPesanan = { nama: string; jumlah: number };

export const totalItem = (item?: ItemPesanan[] | null) =>
  (item || []).reduce((a, i) => a + (Number(i.jumlah) || 0), 0);

export type Pesanan = {
  id: string;
  pelanggan_id: string;
  unit_id: string;
  durasi_tipe: "harian" | "mingguan" | "bulanan";
  durasi_jumlah: number;
  mulai: string;
  jam: string;
  selesai: string;
  /** jam kembali; kosong = sama dengan jam ambil */
  jam_selesai?: string | null;
  voucher_id?: string | null;
  voucher_kode?: string | null;
  diskon?: number;
  total_hari: number;
  antar: "tidak" | "antar" | "pp";
  alamat: string;
  jarak_km: number;
  harga_sewa: number;
  harga_antar: number;
  item: ItemPesanan[];
  total: number;
  status: StatusPesanan;
  /** lunas / sebagian / belum — mengikuti status pembayaran di aplikasi operasional */
  status_bayar?: "lunas" | "sebagian" | "belum" | "refund";
  deposit?: number;
  deposit_status?: "tidak" | "belum" | "diterima" | "dikembalikan" | "dipotong";
  deposit_potong?: number;
  kembali_pada?: string | null;
  jatuh_tempo_bayar?: string | null;
  kembali_catatan?: string | null;
  batal_pada?: string | null;
  batal_alasan?: string | null;
  batal_oleh?: string | null;
  catatan: string;
  dibuat_pada: string;
  token: string;
  ttd_nama: string | null;
  ttd_pada: string | null;
  ttd_setuju: boolean;
  pelanggan?: { nama: string; wa: string } | null;
  unit?: { nama: string; kategori?: Kategori } | null;
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

/** Seperti tglIndo tapi menyertakan nama hari, mis. "Sen, 3 Agu 2026". */
export const tglHariIndo = (iso?: string | null) =>
  iso
    ? new Date(iso.slice(0, 10) + "T00:00:00").toLocaleDateString("id-ID", {
        weekday: "short",
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

/** Waktu ambil & kembali sebuah pesanan sebagai "YYYY-MM-DDTHH:MM" (bisa dibandingkan sebagai teks). */
export const waktuPesanan = (p: { mulai: string; selesai: string; jam?: string | null; jam_selesai?: string | null }) => {
  const j1 = (p.jam || "08:00").slice(0, 5);
  const j2 = (p.jam_selesai || p.jam || "08:00").slice(0, 5);
  return { dari: `${p.mulai}T${j1}`, sampai: `${p.selesai}T${j2}` };
};

/** Potongan voucher untuk harga sewa (tidak termasuk ongkir & tambahan). */
export const hitungDiskon = (v: { tipe: string; nilai: number; maks_diskon?: number } | null | undefined, hargaSewa: number) => {
  if (!v || hargaSewa <= 0) return 0;
  const d = v.tipe === "persen" ? Math.round((hargaSewa * Math.min(100, v.nilai)) / 100) : Math.min(v.nilai, hargaSewa);
  return v.maks_diskon ? Math.min(d, v.maks_diskon) : d;
};

/** Voucher yang boleh dipakai untuk pesanan dengan tipe durasi & tanggal mulai ini. */
/** Konteks pemakai untuk aturan voucher. */
export type KonteksVoucher = { kategori?: string; pelangganId?: string; jumlahSewa?: number; pakaiPelanggan?: number; hargaSewa?: number };

/** Alasan voucher tidak berlaku (kosong = berlaku). */
export const alasanVoucher = (v: Voucher, durasi: string, mulai: string, k: KonteksVoucher = {}): string => {
  if (!v.aktif) return "nonaktif";
  if (v.periode !== "semua" && v.periode !== durasi) return `khusus sewa ${v.periode}`;
  if (v.mulai && mulai && v.mulai > mulai) return `berlaku mulai ${v.mulai}`;
  if (v.selesai && mulai && v.selesai < mulai) return "kedaluwarsa";
  if (v.maks_pakai && v.terpakai >= v.maks_pakai) return "kuota habis";
  if (v.kategori && v.kategori !== "semua" && k.kategori && v.kategori !== k.kategori) return `khusus ${v.kategori}`;
  if (v.pelanggan_id && k.pelangganId && v.pelanggan_id !== k.pelangganId) return "khusus pelanggan tertentu";
  if ((v.segmen === "baru" || v.segmen === "referral") && (k.jumlahSewa || 0) > 0) return "khusus pelanggan baru";
  if (v.segmen === "loyal" && (k.jumlahSewa || 0) < 2) return "khusus pelanggan loyal (≥2× sewa)";
  if (v.maks_per_pelanggan && (k.pakaiPelanggan || 0) >= v.maks_per_pelanggan) return "batas pemakaian pelanggan tercapai";
  if (v.min_transaksi && (k.hargaSewa || 0) < v.min_transaksi) return `minimal transaksi Rp${v.min_transaksi.toLocaleString("id-ID")}`;
  return "";
};
export const voucherBerlaku = (v: Voucher, durasi: string, mulai: string, k: KonteksVoucher = {}) => !alasanVoucher(v, durasi, mulai, k);

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

/* ---------- operasional (tugas, PIC, voucher, pembayaran) ---------- */

export type Pic = {
  id: string;
  nama: string;
  email: string | null;
  wa: string | null;
  aktif: boolean;
  dibuat_pada?: string;
  /** laptop / sepatu / semua — penentu pembagian tugas otomatis */
  kategori?: string;
  ics_token?: string;
};

export type JenisTugas = "serah_terima" | "pengembalian" | "pengecekan" | "maintenance" | "penagihan" | "pengingat_bayar" | "lainnya";
/** menunggu = Pending, dikerjakan = In Progress, tertunda = Waiting, selesai = Completed */
export type StatusTugas = "menunggu" | "dikerjakan" | "tertunda" | "selesai" | "batal";

export const JENIS_TUGAS: { key: JenisTugas; label: string }[] = [
  { key: "serah_terima", label: "Serah terima" },
  { key: "pengembalian", label: "Pengembalian" },
  { key: "pengecekan", label: "Cek unit" },
  { key: "maintenance", label: "Maintenance" },
  { key: "penagihan", label: "Penagihan" },
  { key: "pengingat_bayar", label: "Pengingat bayar" },
  { key: "lainnya", label: "Lainnya" },
];

export type Tugas = {
  id: string;
  judul: string;
  deskripsi: string | null;
  jenis: JenisTugas;
  pic_id: string | null;
  pesanan_id: string | null;
  pelanggan_id: string | null;
  unit_id: string | null;
  jatuh_tempo: string;
  jam: string | null;
  status: StatusTugas;
  prioritas: "tinggi" | "normal" | "rendah";
  gcal_event_id: string | null;
  dibuat_pada?: string;
  mulai_pada?: string | null;
  selesai_pada?: string | null;
  bukti?: string[];
  pic?: { nama: string; email: string | null } | null;
  pelanggan?: { nama: string; wa: string } | null;
  unit?: { nama: string } | null;
};

export type Voucher = {
  id: string;
  kode: string;
  nama: string;
  tipe: "persen" | "nominal";
  nilai: number;
  periode: "semua" | "harian" | "mingguan" | "bulanan";
  mulai: string | null;
  selesai: string | null;
  maks_pakai: number;
  terpakai: number;
  aktif: boolean;
  dibuat_pada?: string;
  kategori?: string;
  segmen?: "semua" | "baru" | "loyal" | "reseller" | "referral";
  pelanggan_id?: string | null;
  min_transaksi?: number;
  maks_diskon?: number;
  maks_per_pelanggan?: number;
  bisa_digabung?: boolean;
};

export type Pembayaran = {
  id: string;
  pesanan_id: string;
  tanggal: string;
  jumlah: number;
  metode: string | null;
  catatan: string | null;
  /** path foto/PDF bukti transfer di bucket dokumen */
  bukti?: string | null;
  /** "bayar" atau "refund" (nominal selalu positif) */
  jenis?: "bayar" | "refund";
  dibuat_pada?: string;
};

/** Link "simpan ke Google Calendar" untuk satu tugas; email PIC ikut diundang. */
export const gcalLinkTugas = (t: Tugas) => {
  const tgl = (t.jatuh_tempo || "").replaceAll("-", "");
  const mulaiJam = (t.jam || "09:00:00").slice(0, 5).replace(":", "") + "00";
  const akhir = String(Number(mulaiJam.slice(0, 2)) + 1).padStart(2, "0") + mulaiJam.slice(2);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: t.judul,
    dates: `${tgl}T${mulaiJam}/${tgl}T${akhir}`,
    details: t.deskripsi || "",
    ctz: "Asia/Jakarta",
  });
  if (t.pic?.email) q.set("add", t.pic.email);
  return "https://calendar.google.com/calendar/render?" + q.toString();
};


/** Jumlah yang sudah dibayar untuk sebuah pesanan.
 *  Pesanan berstatus lunas dianggap terbayar penuh walau pembayarannya tidak dicatat satu per satu. */
export const sudahDibayar = (p: Pesanan, bayarPerPesanan: Record<string, number>) =>
  Math.min(p.total || 0, bayarPerPesanan[p.id] || 0);

export const sisaTagihan = (p: Pesanan, bayarPerPesanan: Record<string, number>) =>
  p.status === "batal" || p.status === "menunggu" ? 0 : Math.max(0, (p.total || 0) - sudahDibayar(p, bayarPerPesanan));

/** Tagihan dianggap piutang setelah sewa dimulai; pesanan mendatang yang belum dibayar dipisah. */
export const sudahJatuhTempo = (p: { mulai: string }) => {
  const d = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10); // tanggal WIB
  return p.mulai <= d;
};

export const kelompokkanBayar = (pembayaran: { pesanan_id: string; jumlah: number; jenis?: string }[]) => {
  const m: Record<string, number> = {};
  // uang bersih per pesanan: pembayaran dikurangi refund
  pembayaran.forEach((b) => { m[b.pesanan_id] = (m[b.pesanan_id] || 0) + (b.jenis === "refund" ? -1 : 1) * (b.jumlah || 0); });
  return m;
};
