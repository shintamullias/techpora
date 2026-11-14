import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  supabase,
  type Pelanggan, type Unit, type Pesanan, type Pengaturan, type Pengeluaran,
  type Tugas, type Pic, type Voucher, type Pembayaran,
} from "@/lib/supabase";

/**
 * Satu-satunya pintu data dashboard.
 * Semua tab membaca dari satu cache ("admin"), jadi pesanan baru, pembayaran,
 * dan tugas otomatis muncul di kalender, piutang, keuangan, dan ROI sekaligus.
 */
export type AdminData = {
  nama: string;
  pelanggan: Pelanggan[];
  unit: Unit[];
  pesanan: Pesanan[];
  pengaturan: Pengaturan;
  biaya: Pengeluaran[];
  tugas: Tugas[];
  pic: Pic[];
  voucher: Voucher[];
  pembayaran: Pembayaran[];
};

export const KUNCI_ADMIN = ["admin"] as const;

const KOLOM_PESANAN =
  "id, pelanggan_id, unit_id, durasi_tipe, durasi_jumlah, mulai, jam, selesai, total_hari, antar, alamat, jarak_km, harga_sewa, harga_antar, item, total, status, catatan, dibuat_pada, token, ttd_nama, ttd_pada, ttd_setuju, pic_id, pelanggan(nama, wa), unit(nama, kategori)";

async function ambil(): Promise<AdminData> {
  const { data: sesi } = await supabase.auth.getSession();
  if (!sesi.session) throw new Error("BELUM_MASUK");

  const { data: me, error: eMe } = await supabase
    .from("profil").select("is_admin, nama").eq("id", sesi.session.user.id).maybeSingle();
  if (eMe) throw eMe;
  if (!me?.is_admin) throw new Error("BUKAN_ADMIN");

  const [p, u, o, s, b, tg, pc, vc, by] = await Promise.all([
    supabase.from("pelanggan").select("*").order("dibuat_pada", { ascending: false }),
    supabase.from("unit").select("*").order("urutan"),
    supabase.from("pesanan").select(KOLOM_PESANAN).order("mulai", { ascending: false }),
    supabase.from("pengaturan").select("ongkir_per_km, ongkir_minimum").maybeSingle(),
    supabase.from("pengeluaran").select("*").order("tanggal", { ascending: false }),
    supabase.from("tugas").select("*, pic(nama, email, wa), pelanggan(nama, wa)").order("jatuh_tempo", { ascending: false }),
    supabase.from("pic").select("*").order("nama"),
    supabase.from("voucher").select("*").order("dibuat_pada", { ascending: false }),
    supabase.from("pembayaran").select("*").order("tanggal", { ascending: false }),
  ]);

  // Jangan diam-diam menampilkan data kosong kalau salah satu query gagal.
  const gagal = [p, u, o, s, b, tg, pc, vc, by].find((r) => r.error);
  if (gagal?.error) throw gagal.error;

  return {
    nama: (me.nama || "").split(" ")[0],
    pelanggan: (p.data as Pelanggan[]) || [],
    unit: (u.data as Unit[]) || [],
    pesanan: (o.data as unknown as Pesanan[]) || [],
    pengaturan: (s.data as Pengaturan) || { ongkir_per_km: 10000, ongkir_minimum: 50000 },
    biaya: (b.data as Pengeluaran[]) || [],
    tugas: (tg.data as unknown as Tugas[]) || [],
    pic: (pc.data as Pic[]) || [],
    voucher: (vc.data as Voucher[]) || [],
    pembayaran: (by.data as Pembayaran[]) || [],
  };
}

const TABEL = ["pesanan", "pembayaran", "tugas", "pelanggan", "unit", "pengeluaran", "pic", "voucher", "pengaturan"];

export function useAdminData() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: KUNCI_ADMIN,
    queryFn: ambil,
    staleTime: 20_000,
    refetchOnWindowFocus: true, // menggantikan listener focus + visibilitychange buatan sendiri
    retry: false,
  });

  // Perubahan dari perangkat lain / dari trigger database langsung masuk.
  // Kalau Realtime belum aktif untuk tabel tertentu, refetch saat fokus tetap jalan.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const segarkan = () => {
      clearTimeout(timer);
      timer = setTimeout(() => qc.invalidateQueries({ queryKey: KUNCI_ADMIN }), 400);
    };
    const kanal = supabase.channel("admin-sinkron");
    TABEL.forEach((tabel) => kanal.on("postgres_changes", { event: "*", schema: "public", table: tabel }, segarkan));
    kanal.subscribe();
    return () => { clearTimeout(timer); supabase.removeChannel(kanal); };
  }, [qc]);

  return q;
}

/** Pengganti props `muat` + `setGalat` yang lama: segarkan data & tampilkan pesan. */
export function useAksi() {
  const qc = useQueryClient();
  return {
    muat: () => qc.invalidateQueries({ queryKey: KUNCI_ADMIN }),
    galat: (pesan: string) => { if (pesan) toast.error(pesan); },
    sukses: (pesan: string) => toast.success(pesan),
  };
}

/* ---------- turunan yang dipakai banyak tab ---------- */

export type StatusBayar = "lunas" | "sebagian" | "belum" | "batal";

/** Status bayar satu pesanan, dihitung dari pembayaran (satu sumber kebenaran). */
export function hitungBayar(pesanan: Pesanan[], pembayaran: Pembayaran[]) {
  const dibayar: Record<string, number> = {};
  pembayaran.forEach((b) => { dibayar[b.pesanan_id] = (dibayar[b.pesanan_id] || 0) + (b.jumlah || 0); });
  const peta: Record<string, { dibayar: number; sisa: number; status: StatusBayar }> = {};
  pesanan.forEach((p) => {
    const d = dibayar[p.id] || 0;
    const sisa = Math.max(0, (p.total || 0) - d);
    peta[p.id] = {
      dibayar: d,
      sisa,
      status: p.status === "batal" ? "batal" : sisa === 0 && p.total > 0 ? "lunas" : d > 0 ? "sebagian" : "belum",
    };
  });
  return peta;
}
