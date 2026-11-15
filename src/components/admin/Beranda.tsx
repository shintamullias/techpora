import { useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import {
  Wallet, TrendingDown, TrendingUp, Receipt, ArrowUpRight, PackageCheck, AlertTriangle, CalendarClock, Plus, CheckCircle2,
} from "lucide-react";
import {
  supabase, rp, hariIni, tambahHari, tglHariIndo, waLink, bulanDari, namaBulan,
  type Tugas, type Pesanan, type Pembayaran, type Pengeluaran, type Unit, type StatusTugas,
} from "@/lib/supabase";
import { hitungBayar } from "@/lib/admin-data";
import { Kartu, KartuAngka, Judul, Kosong, Lencana, Tombol, TautanTombol } from "./ui";
import type { Tab } from "./Shell";

const jamTampil = (j?: string | null, bawaan = "09:00") => (j || bawaan).slice(0, 5);

/** Angka ringkas untuk sumbu grafik: 1,2 jt / 350 rb. */
const ringkas = (n: number) => {
  const a = Math.abs(n);
  const s = a >= 1_000_000 ? (a / 1_000_000).toFixed(1).replace(".0", "") + " jt" : a >= 1_000 ? Math.round(a / 1_000) + " rb" : String(a);
  return (n < 0 ? "-" : "") + s;
};

function pesanPelanggan(t: Tugas, p?: Pesanan) {
  const nama = t.pelanggan?.nama || p?.pelanggan?.nama || "";
  const unit = p?.unit?.nama || t.unit_id || "unit";
  const jam = jamTampil(t.jam);
  if (t.jenis === "pengembalian")
    return `Halo kak ${nama}, mengingatkan ${unit} dijadwalkan kembali ${tglHariIndo(t.jatuh_tempo)} pukul ${jam}. Kalau mau perpanjang, kabari kami dulu ya. Terima kasih 🙏`;
  if (t.jenis === "pengingat_bayar")
    return `Halo kak ${nama}, mengingatkan sisa pembayaran sewa ${unit}. Terima kasih 🙏`;
  const lokasi = p && p.antar !== "tidak" ? `Kami antar ke ${p.alamat || "alamat yang disepakati"}.` : "Diambil di tempat kami.";
  return `Halo kak ${nama}, mengingatkan serah terima ${unit} ${tglHariIndo(t.jatuh_tempo)} pukul ${jam}. ${lokasi} Mohon siapkan KTP asli ya. Terima kasih 🙏`;
}

function pesanPic(t: Tugas, p?: Pesanan) {
  const nama = t.pelanggan?.nama || p?.pelanggan?.nama || "-";
  const wa = t.pelanggan?.wa || p?.pelanggan?.wa || "-";
  return `Pengingat tugas: ${t.judul}\n${tglHariIndo(t.jatuh_tempo)} pukul ${jamTampil(t.jam)}\nPelanggan: ${nama} (${wa})` +
    (p && p.antar !== "tidak" ? `\nAlamat: ${p.alamat || "-"}` : "") + (p?.catatan ? `\nCatatan: ${p.catatan}` : "");
}

export default function Beranda({ tugas, pesanan, pembayaran, biaya, unit, muat, galat, keTab }: {
  tugas: Tugas[]; pesanan: Pesanan[]; pembayaran: Pembayaran[]; biaya: Pengeluaran[]; unit: Unit[];
  muat: () => void; galat: (s: string) => void; keTab: (t: Tab) => void;
}) {
  const ini = hariIni();
  const besok = tambahHari(ini, 1);
  const bulan = ini.slice(0, 7);
  const pesananById = useMemo(() => Object.fromEntries(pesanan.map((p) => [p.id, p])), [pesanan]);
  const bayar = useMemo(() => hitungBayar(pesanan, pembayaran), [pesanan, pembayaran]);

  /* ---------- angka ---------- */
  const idPesanan = useMemo(() => new Set(pesanan.map((p) => p.id)), [pesanan]);
  const pembayaranTampil = useMemo(() => pembayaran.filter((b) => idPesanan.has(b.pesanan_id)), [pembayaran, idPesanan]);
  const kasMasuk = pembayaranTampil.filter((b) => bulanDari(b.tanggal) === bulan).reduce((s, b) => s + (b.jumlah || 0), 0);
  const kasKeluar = biaya.filter((b) => bulanDari(b.tanggal) === bulan).reduce((s, b) => s + (b.jumlah || 0), 0);
  const piutang = pesanan.reduce((s, p) => s + (bayar[p.id]?.status === "batal" ? 0 : bayar[p.id]?.sisa || 0), 0);
  const aktif = pesanan.filter((p) => p.status === "berjalan");
  const datang = pesanan.filter((p) => p.status === "dipesan").length;
  const unitAktif = unit.filter((u) => u.aktif);
  const unitTersedia = unitAktif.filter((u) => !aktif.some((p) => p.unit_id === u.id)).length;
  const telatKembali = aktif.filter((p) => p.selesai < ini);

  const tugasAktif = tugas.filter((t) => t.status === "menunggu" || t.status === "dikerjakan");
  const tugasIni = tugasAktif.filter((t) => t.jatuh_tempo <= ini);
  const tugasTelat = tugasAktif.filter((t) => t.jatuh_tempo < ini).length;
  const urut = (a: Tugas, b: Tugas) => (a.jatuh_tempo + (a.jam || "")).localeCompare(b.jatuh_tempo + (b.jam || ""));

  /* ---------- tren 6 bulan: kas masuk dari pembayaran, keluar dari pengeluaran ---------- */
  const tren = useMemo(() => {
    const [y, m] = bulan.split("-").map(Number);
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(y, m - 1 - (5 - i), 1);
      const kunci = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
      const masuk = pembayaranTampil.filter((b) => bulanDari(b.tanggal) === kunci).reduce((s, b) => s + (b.jumlah || 0), 0);
      const keluar = biaya.filter((b) => bulanDari(b.tanggal) === kunci).reduce((s, b) => s + (b.jumlah || 0), 0);
      return { bulan: namaBulan(kunci).split(" ")[0].slice(0, 3), masuk, laba: masuk - keluar };
    });
  }, [pembayaranTampil, biaya, bulan]);

  /* ---------- perlu perhatian ---------- */
  const perhatian = useMemo(() => {
    const l: { kunci: string; judul: string; ket: string; nada: "merah" | "kuning"; ke: Tab }[] = [];
    telatKembali.forEach((p) => l.push({ kunci: "k" + p.id, judul: "Sewa terlambat kembali", ket: `${p.unit?.nama || p.unit_id} — ${p.pelanggan?.nama}, seharusnya ${tglHariIndo(p.selesai)}`, nada: "merah", ke: "pesanan" }));
    pesanan.filter((p) => bayar[p.id] && ["sebagian", "belum"].includes(bayar[p.id].status) && p.status !== "dipesan")
      .sort((a, b) => bayar[b.id].sisa - bayar[a.id].sisa).slice(0, 4)
      .forEach((p) => l.push({ kunci: "b" + p.id, judul: "Pembayaran tertunda", ket: `${p.pelanggan?.nama} — sisa ${rp(bayar[p.id].sisa)}`, nada: "kuning", ke: "uang" }));
    return l.slice(0, 6);
  }, [telatKembali, pesanan, bayar]);

  const ubah = async (t: Tugas, status: StatusTugas) => {
    const { error } = await supabase.from("tugas").update({ status }).eq("id", t.id);
    if (error) return galat(error.message);
    muat();
  };
  const tandaiWa = async (t: Tugas, siapa: "pel" | "pic") => {
    const { error } = await supabase.from("tugas")
      .update(siapa === "pel" ? { wa_pelanggan_terkirim: true } : { wa_pic_terkirim: true }).eq("id", t.id);
    if (error) galat(error.message); else muat();
  };

  // Pesanan lama (sebelum otomasi) belum punya tugas: tetap muncul di agenda.
  const adaTugas = new Set(tugas.filter((t) => t.status !== "batal").map((t) => t.pesanan_id).filter(Boolean));
  const tanpaTugas = pesanan.filter((p) => p.status === "dipesan" && p.mulai === ini && !adaTugas.has(p.id));

  const Baris = ({ t }: { t: Tugas }) => {
    const p = t.pesanan_id ? pesananById[t.pesanan_id] : undefined;
    const lewat = t.jatuh_tempo < ini;
    const waPel = t.pelanggan?.wa || p?.pelanggan?.wa;
    const waPic = t.pic?.wa;
    return (
      <li className={"rounded-xl border p-3 " + (lewat ? "border-red-200 bg-red-50/50" : "border-border bg-card")}>
        <div className="flex items-start gap-3">
          <button
            onClick={() => ubah(t, "selesai")}
            aria-label={"Tandai selesai: " + t.judul}
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border text-transparent hover:border-primary hover:text-primary"
          ><CheckCircle2 className="h-4 w-4" /></button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-foreground">{t.judul}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <span className={lewat ? "font-semibold text-red-600" : ""}>{lewat ? "Telat · " : ""}{tglHariIndo(t.jatuh_tempo)}</span>
              {" · "}{jamTampil(t.jam)}
              {t.pic?.nama ? <> · PIC <b className="text-foreground">{t.pic.nama}</b></> : <> · <span className="text-amber-600">belum ada PIC</span></>}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {waPel && (
                <TautanTombol varian={t.wa_pelanggan_terkirim ? "hantu" : "lembut"} href={waLink(waPel, pesanPelanggan(t, p))} onClick={() => tandaiWa(t, "pel")}>
                  {t.wa_pelanggan_terkirim ? "✓ WA pelanggan terkirim" : "WA pelanggan"}
                </TautanTombol>
              )}
              {waPic && (
                <TautanTombol varian={t.wa_pic_terkirim ? "hantu" : "garis"} href={waLink(waPic, pesanPic(t, p))} onClick={() => tandaiWa(t, "pic")}>
                  {t.wa_pic_terkirim ? "✓ WA PIC terkirim" : "WA PIC"}
                </TautanTombol>
              )}
              {t.status === "menunggu" && <Tombol kecil varian="hantu" onClick={() => ubah(t, "dikerjakan")}>Mulai</Tombol>}
            </div>
          </div>
        </div>
      </li>
    );
  };

  const hariIniList = [...tugasIni].sort(urut);
  const besokList = tugasAktif.filter((t) => t.jatuh_tempo === besok).sort(urut);

  return (
    <>
      <Judul judul="Ringkasan Operasional" deskripsi="Kondisi bisnis hari ini, langsung dari data pesanan dan pembayaran"
        aksi={<Tombol varian="utama" onClick={() => keTab("pesanan")}><Plus className="h-4 w-4" /> Pesanan baru</Tombol>} />

      {/* Di HP hanya 4 kartu terpenting; sisanya muncul di layar lebih lebar. */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KartuAngka label="Kas masuk bulan ini" nilai={rp(kasMasuk)} ikon={Wallet} aksen="utama" sub="Dari pembayaran tercatat" onClick={() => keTab("uang")} />
        <KartuAngka label="Belum dibayar" nilai={rp(piutang)} ikon={Receipt} aksen="kuning" sub={telatKembali.length ? `${telatKembali.length} sewa terlambat` : undefined} onClick={() => keTab("uang")} />
        <KartuAngka label="Unit di luar" nilai={aktif.length} ikon={ArrowUpRight} aksen="biru" sub={`${unitTersedia} tersedia dari ${unitAktif.length}`} onClick={() => keTab("pesanan")} />
        <KartuAngka label="Tugas hari ini" nilai={tugasIni.length} ikon={AlertTriangle} aksen={tugasTelat ? "merah" : "ungu"} sub={tugasTelat ? `${tugasTelat} telat` : undefined} />
        <KartuAngka className="hidden sm:block" label="Pengeluaran bulan ini" nilai={rp(kasKeluar)} ikon={TrendingDown} aksen="merah" onClick={() => keTab("uang")} />
        <KartuAngka className="hidden sm:block" label="Selisih kas bulan ini" nilai={rp(kasMasuk - kasKeluar)} ikon={TrendingUp} aksen="hijau" />
        <KartuAngka className="hidden sm:block" label="Unit tersedia" nilai={unitTersedia} ikon={PackageCheck} aksen="hijau" sub={`${unitAktif.length} unit aktif`} />
        <KartuAngka className="hidden sm:block" label="Akan datang" nilai={datang} ikon={CalendarClock} aksen="ungu" onClick={() => keTab("kalender")} />
      </div>

      <Kartu judul="Tugas & pengingat" deskripsi="Dibuat otomatis dari pesanan. Ketuk lingkaran untuk menandai selesai"
        aksi={<Lencana nada={hariIniList.length ? "biru" : "hijau"}>{hariIniList.length} hari ini</Lencana>}>
        {hariIniList.length === 0 && tanpaTugas.length === 0 ? (
          <Kosong ikon={CheckCircle2}>Tidak ada jadwal hari ini. Santai dulu ✨</Kosong>
        ) : (
          <ul className="space-y-2.5">
            {hariIniList.map((t) => <Baris key={t.id} t={t} />)}
            {tanpaTugas.map((p) => (
              <li key={p.id} className="rounded-xl border border-border bg-card p-3 text-sm">
                <p className="font-semibold text-foreground">Antar {p.unit?.nama || p.unit_id} — {p.pelanggan?.nama}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{jamTampil(p.jam, "08:00")} · {p.antar === "tidak" ? "Diambil di tempat" : "Diantar"} · belum punya tugas</p>
              </li>
            ))}
          </ul>
        )}
        {besokList.length > 0 && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-2.5 text-sm font-semibold text-muted-foreground">Besok</p>
            <ul className="space-y-2.5">{besokList.slice(0, 4).map((t) => <Baris key={t.id} t={t} />)}</ul>
          </div>
        )}
      </Kartu>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <Kartu judul="Tren kas 6 bulan" deskripsi="Kas masuk dan selisih setelah pengeluaran" className="lg:col-span-2">
          <div className="h-[240px] sm:h-[280px]" role="img" aria-label="Grafik tren kas masuk dan selisih kas enam bulan terakhir">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tren} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(187 92% 43%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(187 92% 43%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gLaba" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152 62% 45%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(152 62% 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={ringkas} tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} width={52} />
                <Tooltip formatter={(v: number) => rp(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="masuk" name="Kas masuk" stroke="hsl(187 92% 43%)" strokeWidth={2} fill="url(#gMasuk)" />
                <Area type="monotone" dataKey="laba" name="Selisih" stroke="hsl(152 62% 45%)" strokeWidth={2} fill="url(#gLaba)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Kartu>

        <Kartu judul="Perlu perhatian" deskripsi={`${perhatian.length} hal operasional`} tanpaIsi>
          {perhatian.length === 0 ? <Kosong ikon={CheckCircle2}>Semuanya aman 🎉</Kosong> : (
            <ul className="divide-y divide-border/60">
              {perhatian.map((a) => (
                <li key={a.kunci}>
                  <button onClick={() => keTab(a.ke)} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/40 sm:px-5">
                    <span className={"mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg " + (a.nada === "merah" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600")}>
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">{a.judul}</span>
                      <span className="block truncate text-xs text-muted-foreground">{a.ket}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Kartu>
      </div>
    </>
  );
}
