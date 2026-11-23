import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  supabase, rp, hariDari, tambahHari, tglIndo, tglHariIndo, hitungOngkir, waLink, beririsan, waktuPesanan, hitungDiskon, voucherBerlaku, JENIS_DOKUMEN, KATEGORI, totalItem,
  kelompokkanBayar, sisaTagihan, sudahJatuhTempo,
  type Pelanggan, type Unit, type Pesanan, type Pengaturan, type StatusPesanan, type Dokumen, type Pengeluaran,
  type Kategori, type Saring, type ItemPesanan,
  type Pic, type Tugas, type Voucher, type Pembayaran,
} from "@/lib/supabase";
import TabKeuangan from "@/components/TabKeuangan";
import TabTugas from "@/components/TabTugas";
import TabPiutang from "@/components/TabPiutang";
import TabVoucher from "@/components/TabVoucher";
import BuktiBayar, { unggahBukti, perluBukti } from "@/components/BuktiBayar";
import TabLaporan from "@/components/TabLaporan";
import TabWhatsApp from "@/components/TabWhatsApp";
import TabAdmin from "@/components/TabAdmin";
import TabPengaturan from "@/components/TabPengaturan";
import TabKalender from "@/components/TabKalender";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Dashboard — Techpora" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: Dashboard,
});

type Tab = "beranda" | "kalender" | "pesanan" | "tugas" | "pelanggan" | "unit" | "keuangan" | "piutang" | "voucher" | "laporan" | "whatsapp" | "admin" | "pengaturan";

function Dashboard() {
  const nav = useNavigate();
  const [siap, setSiap] = useState(false);
  const [boleh, setBoleh] = useState(false);
  const [tab, setTab] = useState<Tab>("beranda");
  const [namaku, setNamaku] = useState("");
  const [menuBuka, setMenuBuka] = useState(false);
  // Isian awal formulir pesanan saat sel kalender diketuk.
  const [isiBaru, setIsiBaru] = useState<{ unit_id?: string; mulai?: string } | null>(null);
  const [kat, setKat] = useState<Saring>("semua");
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [set, setSet] = useState<Pengaturan>({ ongkir_per_km: 10000, ongkir_minimum: 50000 });
  const [biaya, setBiaya] = useState<Pengeluaran[]>([]);
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [pic, setPic] = useState<Pic[]>([]);
  const [voucher, setVoucher] = useState<Voucher[]>([]);
  const [pembayaran, setPembayaran] = useState<Pembayaran[]>([]);
  const [galat, setGalat] = useState("");

  const muat = async () => {
    const { data: sesi } = await supabase.auth.getSession();
    if (!sesi.session) return nav({ to: "/masuk" });
    const { data: me } = await supabase.from("profil").select("is_admin, nama").eq("id", sesi.session.user.id).maybeSingle();
    if (!me?.is_admin) { setBoleh(false); setSiap(true); return; }
    setNamaku((me.nama || "").split(" ")[0]);
    setBoleh(true);
    const [p, u, o, s, b, tg, pc, vc, by] = await Promise.all([
      supabase.from("pelanggan").select("*").order("dibuat_pada", { ascending: false }),
      supabase.from("unit").select("*").order("urutan"),
      supabase.from("pesanan").select("id, pelanggan_id, unit_id, durasi_tipe, durasi_jumlah, mulai, jam, jam_selesai, voucher_id, voucher_kode, diskon, selesai, total_hari, antar, alamat, jarak_km, harga_sewa, harga_antar, item, total, status, status_bayar, catatan, dibuat_pada, token, ttd_nama, ttd_pada, ttd_setuju, pelanggan(nama, wa), unit(nama, kategori)").order("mulai", { ascending: false }),
      supabase.from("pengaturan").select("ongkir_per_km, ongkir_minimum").maybeSingle(),
      supabase.from("pengeluaran").select("*").order("tanggal", { ascending: false }),
      supabase.from("tugas").select("*, pic(nama, email), pelanggan(nama, wa)").order("jatuh_tempo", { ascending: false }),
      supabase.from("pic").select("*").order("nama"),
      supabase.from("voucher").select("*").order("dibuat_pada", { ascending: false }),
      supabase.from("pembayaran").select("*").order("tanggal", { ascending: false }),
    ]);
    setTugas((tg.data as unknown as Tugas[]) || []);
    setPic((pc.data as Pic[]) || []);
    setVoucher((vc.data as Voucher[]) || []);
    setPembayaran((by.data as Pembayaran[]) || []);
    setBiaya((b.data as Pengeluaran[]) || []);
    setPelanggan((p.data as Pelanggan[]) || []);
    // Urut per kategori (laptop dulu, sepatu terakhir), lalu kode unit — dipakai di semua tampilan.
    const bobot = (k?: string) => (k === "laptop" ? 0 : k === "sepatu" ? 2 : 1);
    setUnit(((u.data as Unit[]) || []).sort((a, b) => bobot(a.kategori) - bobot(b.kategori) || a.id.localeCompare(b.id, "id", { numeric: true })));
    // Kolom dipilih eksplisit, jadi bentuk relasi harus dilepas dulu ke unknown.
    setPesanan((o.data as unknown as Pesanan[]) || []);
    if (s.data) setSet(s.data as Pengaturan);
    setSiap(true);
  };

  useEffect(() => { muat(); }, []);

  // Auto-refresh saat kembali ke halaman (mis. habis input dari perangkat lain)
  // supaya data keuangan & pesanan selalu sinkron tanpa reload manual.
  useEffect(() => {
    const segarkan = () => { if (document.visibilityState === "visible") muat(); };
    window.addEventListener("focus", segarkan);
    document.addEventListener("visibilitychange", segarkan);
    return () => {
      window.removeEventListener("focus", segarkan);
      document.removeEventListener("visibilitychange", segarkan);
    };
  }, []);

  /* ---------- saringan kategori ----------
     Satu unit selalu milik tepat satu kategori, jadi seluruh tab cukup
     disaring lewat unit_id-nya. Pelanggan ikut tersaring dari pesanan. */
  const katUnit = useMemo(() => {
    const m: Record<string, string> = {};
    unit.forEach((u) => { m[u.id] = u.kategori || "laptop"; });
    return m;
  }, [unit]);

  const cocok = (unitId?: string | null) =>
    kat === "semua" || (!!unitId && katUnit[unitId] === kat);

  const unitTampil = useMemo(
    () => (kat === "semua" ? unit : unit.filter((u) => (u.kategori || "laptop") === kat)),
    [unit, kat],
  );
  const pesananTampil = useMemo(
    () => (kat === "semua" ? pesanan : pesanan.filter((p) => cocok(p.unit_id))),
    [pesanan, kat, katUnit],
  );
  const pelangganTampil = useMemo(() => {
    if (kat === "semua") return pelanggan;
    const ada = new Set(pesananTampil.map((p) => p.pelanggan_id));
    return pelanggan.filter((p) => ada.has(p.id));
  }, [pelanggan, pesananTampil, kat]);
  const biayaTampil = useMemo(() => {
    if (kat === "semua") return biaya;
    // Biaya kategori terpilih tampil penuh; biaya "umum" dibagi 50:50
    // (separuh dibebankan ke tiap kategori) supaya total tetap terbaca utuh.
    return biaya
      .filter((b) => {
        const kb = b.kategori_bisnis || "umum";
        return kb === kat || kb === "umum";
      })
      .map((b) => {
        const kb = b.kategori_bisnis || "umum";
        return kb === "umum"
          ? { ...b, jumlah: Math.round(b.jumlah / 2), keterangan: (b.keterangan ? b.keterangan + " " : "") + "(½ biaya umum)" }
          : b;
      });
  }, [biaya, kat]);

  if (!siap) return <Pusat>Memuat…</Pusat>;
  if (!boleh)
    return (
      <Pusat>
        <p className="mb-2 font-serif text-xl">Khusus admin</p>
        <Link to="/masuk" className="text-primary underline underline-offset-4">Masuk dengan akun admin</Link>
      </Pusat>
    );

  const aktif = pesananTampil.filter((p) => p.status === "berjalan").length;
  const akanDatang = pesananTampil.filter((p) => p.status === "dipesan").length;
  const hariIniIso = new Date().toISOString().slice(0, 10);
  const tugasHariIni = tugas.filter((t) =>
    (t.status === "menunggu" || t.status === "dikerjakan") && t.jatuh_tempo <= hariIniIso).length;
  const salam = (() => {
    const j = new Date().getHours();
    return j < 11 ? "Selamat pagi" : j < 15 ? "Selamat siang" : j < 19 ? "Selamat sore" : "Selamat malam";
  })();

  // Menu mengikuti susunan aplikasi operasional: dikelompokkan Harian / Data / Uang.
  const IKON: Record<string, string> = {
    beranda: "M3 9.5 10 3l7 6.5M5 8.5V17h10V8.5",
    kalender: "M3 4h14v13H3V4Zm0 4h14M7 2v4m6-4v4",
    pesanan: "M4 4h10l1 3v9H4V4Zm0 4h11M7 12h5",
    tugas: "M3 3h14v14H3V3Zm3.5 7 2.5 2.5L14 7.5",
    pelanggan: "M7 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 8a5 5 0 0 1 10 0M13 4a3 3 0 0 1 0 6m5 7a5 5 0 0 0-4-4.9",
    unit: "M3 5h14v8H3V5Zm-1 11h16M8 16v1.5m4-1.5v1.5",
    keuangan: "M10 2v16M6 5h6a2 2 0 0 1 0 4H8a2 2 0 0 0 0 4h6",
    piutang: "M5 2h10v16l-2.5-1.5L10 18l-2.5-1.5L5 18V2Zm3 5h4m-4 4h4",
    voucher: "M2 7a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a2 2 0 0 0 0 2v2a2 2 0 0 0-2 2H4a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-2V7Zm10-2v10",
    laporan: "M3 17h14M5 14V9m4 5V5m4 9v-6m4 6V3",
    whatsapp: "M3 17l1.2-3.6A7 7 0 1 1 7 16.6L3 17Z",
    admin: "M10 2l6 2.5v5c0 4-2.7 7-6 8.5-3.3-1.5-6-4.5-6-8.5v-5L10 2Zm-2.5 8 2 2 3.5-3.5",
    pengaturan: "M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6.5-3a6.5 6.5 0 0 0-.1-1.2l1.6-1.3-1.5-2.6-2 .7a6.5 6.5 0 0 0-2-1.2L12 2H8l-.5 2.1a6.5 6.5 0 0 0-2 1.2l-2-.7L2 7.2l1.6 1.3a6.5 6.5 0 0 0 0 2.4L2 12.2l1.5 2.6 2-.7a6.5 6.5 0 0 0 2 1.2L8 17.4h4l.5-2.1a6.5 6.5 0 0 0 2-1.2l2 .7 1.5-2.6-1.6-1.3c.1-.4.1-.8.1-1.2Z",
  };
  const NAV_GRUP: [string, [Tab, string][]][] = [
    ["Harian", [["beranda", "Ringkasan"], ["kalender", "Kalender Sewa"], ["pesanan", "Pemesanan"], ["tugas", "Tugas & PIC"]]],
    ["Data", [["pelanggan", "Pelanggan"], ["unit", "Inventaris"]]],
    ["Uang", [["keuangan", "Keuangan"], ["piutang", "Piutang"], ["voucher", "Voucher"], ["laporan", "Laporan"]]],
    ["Lainnya", [["whatsapp", "Pusat WhatsApp"], ["admin", "Manajemen Admin"], ["pengaturan", "Pengaturan"]]],
  ];
  const JUDUL_TAB: Record<Tab, string> = {
    beranda: "Ringkasan", kalender: "Kalender Sewa", pesanan: "Pemesanan", tugas: "Tugas & PIC",
    pelanggan: "Pelanggan", unit: "Inventaris", keuangan: "Keuangan", piutang: "Piutang", voucher: "Voucher",
    laporan: "Laporan & Analitik", whatsapp: "Pusat WhatsApp", admin: "Manajemen Admin", pengaturan: "Pengaturan",
  };
  const grupUang = tab === "keuangan" || tab === "piutang" || tab === "voucher" || tab === "laporan";
  const grupData = tab === "pelanggan" || tab === "unit";
  const NAV_HP: [Tab, string, string][] = [
    ["beranda", "Beranda", IKON.beranda],
    ["kalender", "Kalender", IKON.kalender],
    ["pesanan", "Pesanan", IKON.pesanan],
    ["tugas", "Tugas", IKON.tugas],
    ["keuangan", "Uang", IKON.keuangan],
    ["pelanggan", "Data", IKON.pelanggan],
  ];
  const navAktif = (k: Tab) => tab === k || (k === "pelanggan" && grupData) || (k === "keuangan" && grupUang);
  const keluar = async () => { await supabase.auth.signOut(); nav({ to: "/masuk" }); };

  return (
    <div className="adm flex min-h-screen bg-[#F6F8FA] pb-24 text-slate-900 lg:pb-0">

      {/* Sidebar — gaya aplikasi operasional, hanya layar lebar */}
      {menuBuka && <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setMenuBuka(false)} />}
      <aside className={"fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-white transition-transform lg:sticky lg:top-0 lg:w-60 lg:translate-x-0 " +
        (menuBuka ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-white">T</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Techpora</p>
            <p className="truncate text-[11px] text-muted-foreground">Operations Dashboard</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GRUP.map(([grup, items]) => (
            <div key={grup} className="mb-4">
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{grup}</p>
              <div className="space-y-0.5">
                {items.map(([k, label]) => {
                  const on = tab === k;
                  return (
                    <button key={k} onClick={() => { setTab(k); setMenuBuka(false); }}
                      className={"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                        (on ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100")}>
                      <svg viewBox="0 0 20 20" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={IKON[k]} /></svg>
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button onClick={keluar} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50">Keluar</button>
        </div>
      </aside>

      {/* Kolom konten */}
      <div className="min-w-0 flex-1">
        {/* Bilah atas */}
        <header className="sticky top-0 z-20 border-b border-border bg-white/85 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-4 lg:h-16 lg:px-6">
            <button onClick={() => setMenuBuka(true)} aria-label="Buka menu"
              className="-ml-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M3 5h14M3 10h14M3 15h14" /></svg>
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold sm:text-base">{JUDUL_TAB[tab]}</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">{tglHariIndo(hariIniIso)}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {(namaku || "A").slice(0, 1).toUpperCase()}
                </div>
                <p className="text-sm font-medium">{namaku || "Admin"}</p>
              </div>
              <button onClick={keluar}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >Keluar</button>
            </div>
          </div>
        </header>

        <div className="px-4 pt-4 lg:px-6">
          <p className="text-sm text-slate-600">
            {salam}{namaku ? `, ${namaku}` : ""} 👋 — <b className="text-primary">{aktif}</b> unit di luar · <b className="text-amber-600">{akanDatang}</b> akan datang ·{" "}
            <button onClick={() => setTab("tugas")} className="underline-offset-4 hover:underline">
              <b className={tugasHariIni > 0 ? "text-rose-600" : "text-emerald-600"}>{tugasHariIni}</b> tugas hari ini
            </button>
          </p>

          {/* Saringan kategori (Semua / Laptop / Sepatu) */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
            {([["semua","Semua"], ...KATEGORI.map((k) => [k.key, k.label])] as [Saring,string][]).map(([k,t]) => {
              const n = k === "semua" ? unit.length : unit.filter((u) => (u.kategori || "laptop") === k).length;
              return (
                <button key={k} onClick={() => setKat(k)}
                  className={"flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition " +
                    (kat===k ? "bg-primary text-white" : "border border-border bg-white text-slate-600 hover:bg-slate-50")}>
                  {t}<span className={kat===k ? "text-white/70" : "text-slate-400"}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        <main className="space-y-4 px-4 py-4 lg:px-6">
        {galat && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{galat}</p>}
        {tab === "beranda" && (
          <TabBeranda tugas={tugas} pesanan={pesananTampil} pembayaran={pembayaran} unit={unitTampil} voucher={voucher} keTab={setTab} />
        )}
        {grupData && (
          <div className="flex rounded-full border border-border bg-white p-1 shadow-sm lg:hidden">
            {([["pelanggan", "Pelanggan"], ["unit", "Inventaris"]] as [Tab, string][]).map(([k, t]) => (
              <button key={k} onClick={() => setTab(k)}
                className={"flex-1 rounded-full py-2 text-sm font-semibold transition " +
                  (tab === k ? "bg-primary text-white" : "text-slate-500")}>
                {t}
              </button>
            ))}
          </div>
        )}
        {grupUang && (
          <div className="flex rounded-full border border-border bg-white p-1 shadow-sm lg:hidden">
            {([["keuangan", "Keuangan"], ["piutang", "Piutang"], ["voucher", "Voucher"], ["laporan", "Laporan"]] as [Tab, string][]).map(([k, t]) => (
              <button key={k} onClick={() => setTab(k)}
                className={"flex-1 rounded-full py-2 text-sm font-semibold transition " +
                  (tab === k ? "bg-primary text-white" : "text-slate-500")}>
                {t}
              </button>
            ))}
          </div>
        )}
        {tab === "kalender" && <TabKalender pesanan={pesananTampil} unit={unitTampil} tugas={tugas} pic={pic} onBaru={(isi) => { setIsiBaru(isi || {}); setTab("pesanan"); }} />}
        {tab === "pesanan" && <TabPesanan pesanan={pesananTampil} pembayaran={pembayaran} pelanggan={pelanggan} unit={unitTampil} voucher={voucher} set={set} muat={muat} setGalat={setGalat} isiBaru={isiBaru} habisPakai={() => setIsiBaru(null)} />}
        {tab === "pelanggan" && <TabPelanggan pelanggan={pelangganTampil} pesanan={pesananTampil} muat={muat} setGalat={setGalat} />}
        {tab === "unit" && <TabUnit unit={unitTampil} unitSemua={unit} kat={kat} set={set} muat={muat} setGalat={setGalat} />}
        {tab === "tugas" && <TabTugas tugas={tugas} pic={pic} pesanan={pesanan} muat={muat} setGalat={setGalat} />}
        {tab === "keuangan" && <TabKeuangan pesanan={pesananTampil} pembayaran={pembayaran} unit={unitTampil} biaya={biayaTampil} muat={muat} setGalat={setGalat} />}
        {tab === "piutang" && <TabPiutang pesanan={pesananTampil} pembayaran={pembayaran} muat={muat} setGalat={setGalat} />}
        {tab === "voucher" && <TabVoucher voucher={voucher} muat={muat} setGalat={setGalat} />}
        {tab === "laporan" && <TabLaporan pesanan={pesananTampil} pembayaran={pembayaran} biaya={biayaTampil} unit={unitTampil} pelanggan={pelanggan} />}
        {tab === "whatsapp" && <TabWhatsApp pesanan={pesananTampil} pembayaran={pembayaran} tugas={tugas} pic={pic} muat={muat} />}
        {tab === "admin" && <TabAdmin setGalat={setGalat} />}
        {tab === "pengaturan" && <TabPengaturan set={set} muat={muat} setGalat={setGalat} />}
        </main>
      </div>

      {/* Navigasi bawah — hanya HP, mudah dijangkau jempol */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl">
          {NAV_HP.map(([k, label, d]) => {
            const on = navAktif(k);
            return (
              <button key={k} onClick={() => setTab(k)}
                className={"flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition " + (on ? "text-primary" : "text-slate-400")}>
                <span className={"flex h-7 w-11 items-center justify-center rounded-full transition " + (on ? "bg-primary/10" : "")}>
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={on ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

const Pusat = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center text-muted-foreground">{children}</div>
);

/* ============ TAB 0: BERANDA (hari ini) ============ */
function TabBeranda({ tugas, pesanan, pembayaran, unit, voucher, keTab }: {
  tugas: Tugas[]; pesanan: Pesanan[]; pembayaran: Pembayaran[]; unit: Unit[]; voucher: Voucher[]; keTab: (t: Tab) => void;
}) {
  const hariIni = new Date().toISOString().slice(0, 10);
  const besok = tambahHari(hariIni, 1);

  type Acara = { kunci: string; jam: string; judul: string; ket: string; warna: string; telat?: boolean };
  const buatAgenda = (tgl: string): Acara[] => {
    const a: Acara[] = [];
    const tugasAktif = tugas.filter((t) => t.status === "menunggu" || t.status === "dikerjakan");
    tugasAktif
      .filter((t) => (tgl === hariIni ? t.jatuh_tempo <= tgl : t.jatuh_tempo === tgl))
      .forEach((t) => a.push({
        kunci: "t" + t.id,
        jam: (t.jam || "09:00").slice(0, 5),
        judul: t.judul,
        ket: t.pic?.nama ? "PIC " + t.pic.nama : "Tugas",
        warna: "#1e6feb",
        telat: t.jatuh_tempo < hariIni,
      }));
    const adaTugas = new Set(tugasAktif.map((t) => t.pesanan_id).filter(Boolean));
    pesanan
      .filter((p) => p.status === "dipesan" && p.mulai === tgl && !adaTugas.has(p.id))
      .forEach((p) => a.push({
        kunci: "m" + p.id,
        jam: (p.jam || "08:00").slice(0, 5),
        judul: `Antar ${p.unit?.nama || p.unit_id} — ${p.pelanggan?.nama || "pelanggan"}`,
        ket: p.antar === "tidak" ? "Diambil di tempat" : "Diantar",
        warna: "#F59E0B",
      }));
    pesanan
      .filter((p) => p.status === "berjalan" && p.selesai === tgl)
      .forEach((p) => a.push({
        kunci: "k" + p.id,
        jam: "17:00",
        judul: `Kembali ${p.unit?.nama || p.unit_id} — ${p.pelanggan?.nama || "pelanggan"}`,
        ket: "Unit harus balik",
        warna: "#10B981",
      }));
    return a.sort((x, y) => (Number(x.telat ? 0 : 1) - Number(y.telat ? 0 : 1)) || x.jam.localeCompare(y.jam));
  };

  const agendaIni = buatAgenda(hariIni);
  const agendaBesok = buatAgenda(besok);

  const dibayar = kelompokkanBayar(pembayaran);
  const piutang = pesanan.filter((p) => sudahJatuhTempo(p)).reduce((s, p) => s + sisaTagihan(p, dibayar), 0);

  const Baris = ({ a }: { a: Acara }) => (
    <li className="flex gap-3">
      <div className="w-12 shrink-0 pt-0.5 text-right">
        <p className={"text-sm font-bold tabular-nums " + (a.telat ? "text-red-600" : "text-slate-900")}>{a.jam}</p>
        {a.telat && <p className="text-[10px] font-bold text-red-600">TELAT</p>}
      </div>
      <div className="relative flex flex-col items-center">
        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: a.telat ? "#DC2626" : a.warna }} />
        <span className="w-px flex-1 bg-slate-200" />
      </div>
      <div className="min-w-0 pb-4">
        <p className="text-[15px] font-semibold leading-snug text-slate-900">{a.judul}</p>
        <p className="mt-0.5 text-xs text-slate-500">{a.ket}</p>
      </div>
    </li>
  );

  return (
    <div className="grid gap-4 md:grid-cols-[1.55fr_1fr] md:items-start">
      <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Hari ini</h2>
          <button onClick={() => keTab("tugas")} className="text-xs font-bold text-primary underline-offset-4 hover:underline">Semua tugas →</button>
        </div>
        {agendaIni.length === 0 ? (
          <p className="rounded-xl bg-emerald-50 px-4 py-6 text-center text-sm text-emerald-800">
            Tidak ada jadwal hari ini. Santai dulu ✨
          </p>
        ) : (
          <ul>{agendaIni.map((a) => <Baris key={a.kunci} a={a} />)}</ul>
        )}

        {agendaBesok.length > 0 && (
          <div className="mt-2 border-t border-slate-100 pt-4">
            <p className="mb-3 text-sm font-semibold text-slate-400">Besok</p>
            <ul className="opacity-70">{agendaBesok.slice(0, 4).map((a) => <Baris key={a.kunci} a={a} />)}</ul>
          </div>
        )}
      </section>

      <div className="grid gap-4">
      {piutang > 0 && (
        <button onClick={() => keTab("piutang")}
          className="flex w-full items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-left transition hover:bg-rose-100/70">
          <div>
            <p className="text-sm font-semibold text-rose-800">Belum dibayar {rp(piutang)}</p>
            <p className="mt-0.5 text-xs text-rose-600/80">Ketuk untuk lihat siapa saja dan kirim pengingat</p>
          </div>
          <span className="text-rose-400">→</span>
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => keTab("pesanan")}
          className="rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white transition hover:opacity-90">+ Pesanan baru</button>
        <button onClick={() => keTab("tugas")}
          className="rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">+ Tugas baru</button>
      </div>

      {/* Angka ringkas — mengisi kolom kanan di layar lebar */}
      <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-slate-900">Sekilas</h2>
        <div className="grid grid-cols-2 gap-2.5 text-center">
          {([
            [pesanan.filter((p) => p.status === "berjalan").length, "unit di luar", "#E8F3FB"],
            [pesanan.filter((p) => p.status === "dipesan").length, "akan datang", "#FEF6E0"],
            [unit.filter((u) => u.aktif).length, "unit siap sewa", "#E8F9F0"],
            [voucher.filter((v) => v.aktif).length, "voucher aktif", "#FCEEF5"],
          ] as [number, string, string][]).map(([n, label, warna]) => (
            <div key={label} className="rounded-lg border border-border p-3" style={{ background: warna }}>
              <p className="text-2xl font-bold tabular-nums">{n}</p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}

const inp = "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function Kol({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Kartu({ children, judul, aksi }: { children: React.ReactNode; judul: string; aksi?: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">{judul}</h2>
        {aksi}
      </div>
      {children}
    </section>
  );
}

const warnaBar: Record<StatusPesanan, string> = {
  dipesan: "#F59E0B",
  berjalan: "#3B82F6",
  selesai: "#10B981",
  batal: "#CBD5E1",
};

const warnaStatus: Record<StatusPesanan, string> = {
  dipesan: "bg-amber-50 text-amber-800 border-amber-200",
  berjalan: "bg-blue-50 text-blue-800 border-blue-200",
  selesai: "bg-emerald-50 text-emerald-800 border-emerald-200",
  batal: "bg-slate-100 text-slate-600 border-slate-200",
};

const labelStatus: Record<StatusPesanan, string> = {
  dipesan: "Dipesan", berjalan: "Keluar", selesai: "Selesai", batal: "Batal",
};

/* ============ TAB 1: KALENDER ============ */
/* ============ TAB 2: PESANAN ============ */
function TabPesanan({ pesanan, pembayaran, pelanggan, unit, voucher, set, muat, setGalat, isiBaru, habisPakai }: {
  pesanan: Pesanan[]; pembayaran: Pembayaran[]; pelanggan: Pelanggan[]; unit: Unit[]; voucher: Voucher[]; set: Pengaturan; muat: () => void; setGalat: (s: string) => void;
  isiBaru?: { unit_id?: string; mulai?: string } | null; habisPakai?: () => void;
}) {
  const [buka, setBuka] = useState(false);
  const [edit, setEdit] = useState<string | null>(null);
  const kosong = { pelanggan_id: "", unit_id: "", durasi_tipe: "harian" as const, durasi_jumlah: 1, mulai: "", jam: "08:00", jam_selesai: "", voucher_id: "", antar: "tidak" as const, alamat: "", jarak: "", catatan: "", item: [] as ItemPesanan[], status_bayar: "belum" as "belum" | "sebagian" | "lunas", dp: "" };
  const [f, setF] = useState<any>(kosong);
  const [sibuk, setSibuk] = useState(false);
  const [bayarUntuk, setBayarUntuk] = useState<Pesanan | null>(null);
  const [fileBukti, setFileBukti] = useState<File | null>(null);
  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const tutup = () => { setBuka(false); setEdit(null); setF(kosong); };

  // Dibuka dari kalender: langsung tampilkan formulir dengan unit & tanggal terisi.
  useEffect(() => {
    if (!isiBaru) return;
    setEdit(null);
    setF({ ...kosong, unit_id: isiBaru.unit_id || "", mulai: isiBaru.mulai || "" });
    setBuka(true);
    habisPakai?.();
  }, [isiBaru]); // eslint-disable-line react-hooks/exhaustive-deps

  const bukaTambah = () => {
    if (buka && !edit) return tutup();
    setEdit(null); setF(kosong); setBuka(true);
  };

  /* Mengisi ulang formulir dari pesanan yang dipilih. Status tidak ikut
     diubah di sini — status tetap lewat tombol alur (diantar/kembali/batal). */
  const bukaEdit = (o: Pesanan) => {
    if (edit === o.id) return tutup();
    setEdit(o.id);
    setF({
      pelanggan_id: o.pelanggan_id, unit_id: o.unit_id,
      durasi_tipe: o.durasi_tipe, durasi_jumlah: o.durasi_jumlah || 1,
      mulai: o.mulai, jam: (o.jam || "08:00").slice(0, 5), jam_selesai: (o.jam_selesai || "").slice(0, 5), voucher_id: o.voucher_id || "",
      antar: o.antar || "tidak",
      alamat: o.alamat || "", jarak: String(o.jarak_km || ""), catatan: o.catatan || "",
      item: Array.isArray(o.item) ? o.item.map((i) => ({ ...i })) : [],
      status_bayar: o.status_bayar || "belum", dp: "",
    });
    setBuka(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const u = unit.find((x) => x.id === f.unit_id);
  const tipeAda = useMemo(() => (u ? (["harian","mingguan","bulanan"] as const).filter((t) => u[t] > 0) : (["harian"] as const)), [u]);
  useEffect(() => { if (u && !tipeAda.includes(f.durasi_tipe)) s("durasi_tipe", tipeAda[0]); }, [f.unit_id]);

  const n = Math.max(1, Number(f.durasi_jumlah) || 1);
  const totalHari = hariDari(f.durasi_tipe, n);
  const selesai = f.mulai ? tambahHari(f.mulai, totalHari) : "";
  const hargaSewa = u ? (u[f.durasi_tipe as "harian"] || 0) * n : 0;
  const km = Math.max(0, Number(f.jarak) || 0);
  const hargaAntar = hitungOngkir(km, f.antar, set);
  const itemBersih: ItemPesanan[] = (f.item || [])
    .filter((i: ItemPesanan) => i.nama.trim() !== "" || Number(i.jumlah))
    .map((i: ItemPesanan) => ({ nama: i.nama.trim(), jumlah: Number(i.jumlah) || 0 }));
  const jumlahItem = totalItem(f.item);
  const jamKembali = f.jam_selesai || f.jam;
  const pilihanVoucher = voucher.filter((v) => v.id === f.voucher_id || voucherBerlaku(v, f.durasi_tipe, f.mulai));
  const vDipilih = voucher.find((v) => v.id === f.voucher_id) || null;
  const diskon = hitungDiskon(vDipilih, hargaSewa);
  const total = hargaSewa - diskon + hargaAntar + jumlahItem;

  const setItem = (idx: number, patch: Partial<ItemPesanan>) =>
    setF((p: any) => ({ ...p, item: p.item.map((it: ItemPesanan, i: number) => (i === idx ? { ...it, ...patch } : it)) }));
  const tambahItem = () => setF((p: any) => ({ ...p, item: [...(p.item || []), { nama: "", jumlah: 0 }] }));
  const hapusItem = (idx: number) => setF((p: any) => ({ ...p, item: p.item.filter((_: ItemPesanan, i: number) => i !== idx) }));

  // Bentrok dihitung sampai jam: kembali 10.00 lalu disewa lagi 13.00 di hari yang sama tidak dianggap bentrok.
  const bentrok = useMemo(() => {
    if (!f.unit_id || !f.mulai) return null;
    const ini = waktuPesanan({ mulai: f.mulai, selesai, jam: f.jam, jam_selesai: jamKembali });
    return pesanan.find((p) => {
      if (p.id === edit || p.unit_id !== f.unit_id || p.status === "batal" || p.status === "selesai") return false;
      const w = waktuPesanan(p);
      return beririsan(ini.dari, ini.sampai, w.dari, w.sampai);
    });
  }, [f.unit_id, f.mulai, f.jam, jamKembali, selesai, pesanan, edit]);

  const simpan = async () => {
    if (!f.pelanggan_id || !f.unit_id || !f.mulai) return setGalat("Pelanggan, unit, dan tanggal mulai wajib diisi.");
    if (bentrok) {
      const w = waktuPesanan(bentrok);
      if (!confirm(`Bentrok dengan ${bentrok.pelanggan?.nama || "pesanan lain"} (${tglIndo(bentrok.mulai)} ${w.dari.slice(11)} – ${tglIndo(bentrok.selesai)} ${w.sampai.slice(11)}).\n\nTetap simpan?`)) return;
    }
    setSibuk(true); setGalat("");
    const isi = {
      pelanggan_id: f.pelanggan_id, unit_id: f.unit_id, durasi_tipe: f.durasi_tipe, durasi_jumlah: n,
      mulai: f.mulai, jam: f.jam, jam_selesai: f.jam_selesai || null, selesai, total_hari: totalHari,
      voucher_id: vDipilih?.id || null, voucher_kode: vDipilih?.kode || null, diskon, antar: f.antar,
      alamat: f.alamat.trim(), jarak_km: km, harga_sewa: hargaSewa, harga_antar: hargaAntar,
      item: itemBersih, total, catatan: f.catatan.trim(),
    };
    const dp = Number(String(f.dp || "").replace(/\D/g, ""));
    if (!edit && f.status_bayar === "sebagian" && !dp) { setSibuk(false); return setGalat("Isi jumlah DP yang sudah dibayar."); }
    const { data: hasil, error } = edit
      ? await supabase.from("pesanan").update(isi).eq("id", edit).select("id").single()
      : await supabase.from("pesanan").insert(isi).select("id").single();
    // Pembayaran selalu dicatat di tabel pembayaran; status bayar dihitung otomatis dari situ.
    const awal = f.status_bayar === "lunas" ? total : f.status_bayar === "sebagian" ? dp : 0;
    if (!error && !edit && awal > 0 && hasil?.id) {
      let bukti: string | null = null;
      try { if (fileBukti) bukti = await unggahBukti(hasil.id, fileBukti); } catch (e) { setGalat("Pesanan tersimpan, tapi bukti gagal diunggah: " + (e as Error).message); }
      setFileBukti(null);
      const { error: e2 } = await supabase.from("pembayaran").insert({ pesanan_id: hasil.id, jumlah: awal, bukti, tanggal: new Date().toISOString().slice(0, 10), metode: "transfer", catatan: f.status_bayar === "lunas" ? "Lunas saat pemesanan" : "DP saat pemesanan" });
      if (e2) { setSibuk(false); return setGalat(e2.message); }
    }
    setSibuk(false);
    if (error) return setGalat(error.message);
    tutup(); muat();
  };

  const hapusPesanan = async (o: Pesanan) => {
    const nama = o.pelanggan?.nama || "pelanggan ini";
    if (!confirm(`Hapus permanen pesanan ${nama} · ${o.unit_id} (${tglIndo(o.mulai)})?\n\nData ini tidak bisa dikembalikan. Kalau sewanya cuma batal, pakai tombol Batal saja supaya riwayatnya tetap tersimpan.`)) return;
    const { error } = await supabase.from("pesanan").delete().eq("id", o.id);
    if (error) return setGalat(error.message);
    if (edit === o.id) tutup();
    muat();
  };

  const ubahStatus = async (id: string, status: StatusPesanan) => {
    const { error } = await supabase.from("pesanan").update({ status }).eq("id", id);
    if (error) setGalat(error.message); else muat();
  };

  return (
    <>
      {bayarUntuk && <BuktiBayar pesanan={bayarUntuk} onTutup={() => setBayarUntuk(null)} onUbah={muat} />}
      <Kartu judul="Pesanan" aksi={
        <button onClick={bukaTambah} className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
          {buka && !edit ? "Tutup" : "+ Tambah"}
        </button>}>
        {buka && (
          <div className="mb-4 space-y-3 rounded-xl border border-border bg-secondary/40 p-3">
            {edit && <p className="text-sm font-semibold text-foreground">Edit pesanan</p>}
            {pelanggan.length === 0 && <p className="text-sm text-destructive">Tambahkan pelanggan dulu di tab Pelanggan.</p>}
            <Kol label="Pelanggan">
              <select value={f.pelanggan_id} onChange={(e) => s("pelanggan_id", e.target.value)} className={inp}>
                <option value="">— pilih —</option>
                {pelanggan.map((p) => <option key={p.id} value={p.id}>{p.nama} · {p.wa}</option>)}
              </select>
            </Kol>
            <Kol label="Unit">
              <select value={f.unit_id} onChange={(e) => s("unit_id", e.target.value)} className={inp}>
                <option value="">— pilih —</option>
                {unit.filter((x) => x.aktif || x.id === f.unit_id).map((x) => <option key={x.id} value={x.id}>{x.id} · {x.nama} · {rp(x.harian)}/hari</option>)}
              </select>
            </Kol>
            {u && (
              <>
                <div className="flex gap-2">
                  {tipeAda.map((t) => (
                    <button key={t} onClick={() => s("durasi_tipe", t)}
                      className={"flex-1 rounded-lg border px-2 py-2 text-sm font-semibold capitalize " + (f.durasi_tipe===t?"border-primary bg-primary/5 text-primary":"border-border text-muted-foreground")}>{t}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Kol label={`Jumlah ${f.durasi_tipe === "harian" ? "hari" : f.durasi_tipe === "mingguan" ? "minggu" : "bulan"}`}>
                    <input type="number" min={1} value={f.durasi_jumlah} onChange={(e) => s("durasi_jumlah", e.target.value)} className={inp} />
                  </Kol>
                  <Kol label="Tanggal mulai"><input type="date" value={f.mulai} onChange={(e) => s("mulai", e.target.value)} className={inp} /></Kol>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Kol label="Jam ambil"><input type="time" value={f.jam} onChange={(e) => s("jam", e.target.value)} className={inp} /></Kol>
                  <Kol label="Jam kembali"><input type="time" value={jamKembali} onChange={(e) => s("jam_selesai", e.target.value === f.jam ? "" : e.target.value)} className={inp} /></Kol>
                </div>
                {f.mulai && <p className="text-xs text-muted-foreground">Ambil <b className="text-foreground">{tglIndo(f.mulai)} {f.jam}</b> · kembali <b className="text-foreground">{tglIndo(selesai)} {jamKembali}</b></p>}
                {bentrok && (() => { const w = waktuPesanan(bentrok); return (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                    Bentrok: {bentrok.unit_id} dipakai {bentrok.pelanggan?.nama} {tglIndo(bentrok.mulai)} {w.dari.slice(11)} – {tglIndo(bentrok.selesai)} {w.sampai.slice(11)}. Geser jam atau tanggal, atau pilih unit lain.
                  </p>); })()}
                <div className="flex gap-2">
                  {([["tidak","Ambil sendiri"],["antar","Antar saja"],["pp","Antar + jemput"]] as const).map(([k,t]) => (
                    <button key={k} onClick={() => s("antar", k)}
                      className={"flex-1 rounded-lg border px-2 py-2 text-xs font-semibold " + (f.antar===k?"border-primary bg-primary/5 text-primary":"border-border text-muted-foreground")}>{t}</button>
                  ))}
                </div>
                {f.antar !== "tidak" && (
                  <>
                    <Kol label="Alamat"><input value={f.alamat} onChange={(e) => s("alamat", e.target.value)} placeholder="Jalan, patokan" className={inp} /></Kol>
                    <Kol label="Jarak (km)"><input type="number" min={0} value={f.jarak} onChange={(e) => s("jarak", e.target.value)} className={inp} /></Kol>
                    <p className="text-xs text-muted-foreground">{rp(set.ongkir_per_km)}/km, minimum {rp(set.ongkir_minimum)}.</p>
                  </>
                )}
                <Kol label="Catatan"><input value={f.catatan} onChange={(e) => s("catatan", e.target.value)} className={inp} /></Kol>

                <Kol label="Voucher">
                  <select value={f.voucher_id} onChange={(e) => s("voucher_id", e.target.value)} className={inp}>
                    <option value="">Tanpa voucher</option>
                    {pilihanVoucher.map((v) => (
                      <option key={v.id} value={v.id}>{v.kode} · {v.tipe === "persen" ? `${v.nilai}%` : rp(v.nilai)}{v.periode !== "semua" ? ` · ${v.periode}` : ""}</option>
                    ))}
                  </select>
                </Kol>
                {voucher.some((v) => v.aktif) && pilihanVoucher.length === 0 && (
                  <p className="-mt-1 text-xs text-muted-foreground">Tidak ada voucher yang berlaku untuk sewa {f.durasi_tipe}{f.mulai ? ` mulai ${tglIndo(f.mulai)}` : ""}.</p>
                )}

                {edit ? (
                  <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                    Status bayar: <b className="text-foreground">{f.status_bayar === "lunas" ? "Lunas" : f.status_bayar === "sebagian" ? "DP / sebagian" : "Belum bayar"}</b> — dihitung otomatis dari catatan pembayaran. Tambah pembayaran lewat menu Piutang.
                  </p>
                ) : (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Pembayaran</p>
                  <div className="flex gap-2">
                    {([["belum","Belum bayar"],["sebagian","DP / sebagian"],["lunas","Lunas"]] as const).map(([k,t]) => (
                      <button key={k} type="button" onClick={() => s("status_bayar", k)}
                        className={"flex-1 rounded-lg border px-2 py-2 text-xs font-semibold " + (f.status_bayar===k?"border-primary bg-primary/5 text-primary":"border-border text-muted-foreground")}>{t}</button>
                    ))}
                  </div>
                  {f.status_bayar !== "belum" && (
                    <label className={inp + " block cursor-pointer truncate text-sm text-slate-600"}>
                      {fileBukti ? `📎 ${fileBukti.name}` : "📎 Foto bukti transfer (disarankan)"}
                      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFileBukti(e.target.files?.[0] || null)} />
                    </label>
                  )}
                  {f.status_bayar === "sebagian" && !edit && (
                    <Kol label="Jumlah DP yang sudah masuk (Rp)"><input inputMode="numeric" value={f.dp} onChange={(e) => s("dp", e.target.value)} placeholder="mis. 100000" className={inp} /></Kol>
                  )}
                </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">Tambahan &amp; diskon</p>
                    <button onClick={tambahItem} className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground">+ Baris</button>
                  </div>
                  {(f.item || []).length === 0 && (
                    <p className="text-xs text-muted-foreground">Belum ada. Pakai ini untuk sewa mouse, tas, denda telat, atau potongan harga.</p>
                  )}
                  {(f.item || []).map((it: ItemPesanan, i: number) => {
                    const potongan = Number(it.jumlah) < 0;
                    return (
                      <div key={i} className="space-y-2 rounded-lg border border-border bg-white p-2">
                        <div className="flex min-w-0 gap-2">
                          <input value={it.nama} onChange={(e) => setItem(i, { nama: e.target.value })}
                            placeholder={potongan ? "Diskon langganan" : "Sewa mouse"} className={inp + " min-w-0 flex-1"} />
                          <button onClick={() => hapusItem(i)} aria-label="Hapus baris"
                            className="shrink-0 rounded-lg border border-border px-3 text-sm font-semibold text-muted-foreground">×</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select value={potongan ? "kurang" : "tambah"}
                            onChange={(e) => setItem(i, { jumlah: Math.abs(Number(it.jumlah) || 0) * (e.target.value === "kurang" ? -1 : 1) })}
                            className={inp + " min-w-0"}>
                            <option value="tambah">Tambah</option>
                            <option value="kurang">Diskon</option>
                          </select>
                          <input type="number" inputMode="numeric" min={0} value={Math.abs(Number(it.jumlah) || 0) || ""}
                            onChange={(e) => setItem(i, { jumlah: (Number(e.target.value) || 0) * (potongan ? -1 : 1) })}
                            placeholder="Rp" className={inp + " min-w-0"} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl border-2 border-dashed border-border p-3 text-sm">
                  <Baris k={`${u.nama} · ${n} ${f.durasi_tipe}`} v={hargaSewa} />
                  {diskon > 0 && <Baris k={`Voucher ${vDipilih?.kode}`} v={-diskon} />}
                  {f.antar !== "tidak" && <Baris k={`Antar${f.antar === "pp" ? " + jemput" : ""} ${km} km`} v={hargaAntar} />}
                  {itemBersih.map((it, i) => <Baris key={i} k={it.nama || (it.jumlah < 0 ? "Diskon" : "Tambahan")} v={it.jumlah} />)}
                  <div className="mt-2 flex items-baseline justify-between border-t border-border pt-2">
                    <span className="font-semibold text-muted-foreground">TOTAL</span>
                    <span className="font-serif text-2xl text-foreground">{rp(total)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={simpan} disabled={sibuk} className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">
                    {sibuk ? "Menyimpan…" : edit ? "Simpan perubahan" : "Simpan pesanan"}
                  </button>
                  <button onClick={tutup} className="rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground">Batal</button>
                </div>
              </>
            )}
          </div>
        )}

        {pesanan.length === 0 ? <p className="py-6 text-center text-sm text-slate-400">Belum ada pesanan.</p> : (
          <ul className="space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
            {pesanan.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                <div className="h-1" style={{ background: warnaBar[p.status] }} />
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">{p.pelanggan?.nama}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        <span className="font-mono font-semibold text-slate-600">{p.unit_id}</span> · {tglHariIndo(p.mulai)} {waktuPesanan(p).dari.slice(11)} → {tglHariIndo(p.selesai)} {waktuPesanan(p).sampai.slice(11)}
                      </p>
                      <p className="text-xs text-slate-400">{p.durasi_jumlah} {p.durasi_tipe}{p.antar !== "tidak" ? ` · antar ${p.jarak_km} km` : ""}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-bold text-slate-900">{rp(p.total)}</p>
                      {!!p.diskon && <p className="text-[11px] text-emerald-700">Voucher {p.voucher_kode} −{rp(p.diskon)}</p>}
                      {(p.item || []).length > 0 && (
                        <p className="text-[11px] text-slate-400">
                          {(p.item || []).map((it) => `${it.nama || (it.jumlah < 0 ? "Diskon" : "Tambahan")} ${it.jumlah < 0 ? "−" : "+"}${rp(Math.abs(it.jumlah))}`).join(" · ")}
                        </p>
                      )}
                      <span className={"mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold " + warnaStatus[p.status]}>{labelStatus[p.status]}</span>
                      {p.status !== "batal" && (
                        <span className={"ml-1 mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold " + (p.status_bayar === "lunas" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : p.status_bayar === "sebagian" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-rose-200 bg-rose-50 text-rose-700")}>
                          {p.status_bayar === "lunas" ? "Lunas" : p.status_bayar === "sebagian" ? "DP" : "Belum bayar"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={"mt-2.5 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium " + (p.ttd_setuju ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                    <span className={"h-1.5 w-1.5 shrink-0 rounded-full " + (p.ttd_setuju ? "bg-emerald-500" : "bg-amber-500")} />
                    <span className="truncate">
                      {p.ttd_setuju
                        ? `Ditandatangani${p.ttd_nama ? ` · ${p.ttd_nama}` : ""}${p.ttd_pada ? ` · ${new Date(p.ttd_pada).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}` : ""}`
                        : "Perjanjian belum ditandatangani"}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {!p.ttd_setuju && p.pelanggan?.wa && (
                      <a href={waLink(p.pelanggan.wa, `Halo kak ${p.pelanggan.nama}, ini perjanjian sewa ${p.unit?.nama} untuk ${tglIndo(p.mulai)}. Mohon dibaca lalu tanda tangan langsung di halaman ini ya:\n\n${typeof window !== "undefined" ? window.location.origin : "https://techpora.id"}/ttd/${p.token}\n\nNanti saat serah terima tinggal cek unit, tidak perlu tanda tangan lagi 🙏`)}
                        target="_blank" rel="noreferrer"
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90">Kirim link TTD</a>
                    )}
                    {p.status === "dipesan" && <Aksi onClick={() => ubahStatus(p.id, "berjalan")}>Unit diantar</Aksi>}
                    {p.status === "berjalan" && <Aksi onClick={() => ubahStatus(p.id, "selesai")}>Unit kembali</Aksi>}
                    {p.status !== "batal" && p.status !== "selesai" && <Aksi onClick={() => ubahStatus(p.id, "batal")}>Batal</Aksi>}
                    <Aksi onClick={() => bukaEdit(p)}>{edit === p.id ? "Tutup edit" : "Edit"}</Aksi>
                    {p.pelanggan?.wa && (
                      <a href={waLink(p.pelanggan.wa, `Halo kak ${p.pelanggan.nama}, konfirmasi sewa ${p.unit?.nama} ${tglIndo(p.mulai)} — ${tglIndo(p.selesai)} pukul ${p.jam}. Total ${rp(p.total)}. Terima kasih 🙏`)}
                        target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">WhatsApp</a>
                    )}
                    <a href={`/ttd/${p.token}`} target="_blank" rel="noreferrer"
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">Perjanjian</a>
                    {(() => {
                      const milik = pembayaran.filter((b) => b.pesanan_id === p.id);
                      const kurang = milik.filter(perluBukti).length;
                      return (
                        <button onClick={() => setBayarUntuk(p)}
                          className={"rounded-lg border px-3 py-1.5 text-xs font-semibold " + (kurang ? "border-amber-300 bg-amber-50 text-amber-800" : "border-slate-200 text-slate-600")}>
                          Pembayaran{milik.length ? ` (${milik.length})` : ""}{kurang ? ` · ${kurang} tanpa bukti` : ""}
                        </button>
                      );
                    })()}
                    <button onClick={() => hapusPesanan(p)}
                      className="ml-auto rounded-lg px-2 py-1.5 text-xs font-semibold text-red-400 hover:text-red-600">Hapus</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Kartu>
    </>
  );
}

const Aksi = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-secondary">{children}</button>
);

const Baris = ({ k, v }: { k: string; v: number }) => (
  <div className="flex items-baseline justify-between gap-2 py-0.5">
    <span className="text-muted-foreground">{k}</span>
    <span className="flex-1 border-b border-dotted border-border" />
    {/* Potongan ditulis dengan tanda minus di depan, bukan "Rp-20.000". */}
    <span className={v < 0 ? "text-emerald-700" : "text-foreground"}>
      {v < 0 ? `− ${rp(Math.abs(v))}` : rp(v)}
    </span>
  </div>
);

/* ============ TAB 3: PELANGGAN ============ */
function TabPelanggan({ pelanggan, pesanan, muat, setGalat }: { pelanggan: Pelanggan[]; pesanan: Pesanan[]; muat: () => void; setGalat: (s: string) => void }) {
  const kosong = { nama: "", wa: "", instagram: "", alamat: "", no_darurat: "", catatan: "" };
  const [f, setF] = useState(kosong);
  const [buka, setBuka] = useState(false);
  const [edit, setEdit] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const [cari, setCari] = useState("");
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const tutup = () => { setBuka(false); setEdit(null); setF(kosong); };

  const bukaTambah = () => {
    if (buka && !edit) return tutup();
    setEdit(null); setF(kosong); setBuka(true);
  };

  const bukaEdit = (o: Pelanggan) => {
    if (edit === o.id) return tutup();
    setEdit(o.id);
    setF({
      nama: o.nama || "", wa: o.wa || "", instagram: o.instagram || "",
      alamat: o.alamat || "", no_darurat: o.no_darurat || "", catatan: o.catatan || "",
    });
    setBuka(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const simpan = async () => {
    if (!f.nama.trim() || !f.wa.trim()) return setGalat("Nama dan nomor WA wajib diisi.");
    setSibuk(true); setGalat("");
    const isi = { ...f, nama: f.nama.trim(), wa: f.wa.trim() };
    const { error } = edit
      ? await supabase.from("pelanggan").update(isi).eq("id", edit)
      : await supabase.from("pelanggan").insert(isi);
    setSibuk(false);
    if (error) return setGalat(error.message);
    tutup(); muat();
  };

  const hapus = async (id: string) => {
    const { error } = await supabase.from("pelanggan").delete().eq("id", id);
    if (error) return setGalat("Tidak bisa dihapus, kemungkinan masih terpakai di pesanan.");
    if (edit === id) tutup();
    muat();
  };

  const daftar = pelanggan.filter((p) => (p.nama + p.wa + p.instagram).toLowerCase().includes(cari.toLowerCase()));

  return (
    <Kartu judul="Pelanggan" aksi={
      <button onClick={bukaTambah} className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
        {buka && !edit ? "Tutup" : "+ Tambah"}
      </button>}>
      {buka && (
        <div className="mb-4 space-y-3 rounded-xl border border-border bg-secondary/40 p-3">
          {edit && <p className="text-sm font-semibold text-foreground">Edit pelanggan</p>}
          <Kol label="Nama sesuai KTP"><input value={f.nama} onChange={(e) => s("nama", e.target.value)} className={inp} /></Kol>
          <div className="grid grid-cols-2 gap-3">
            <Kol label="Nomor WhatsApp"><input value={f.wa} onChange={(e) => s("wa", e.target.value)} placeholder="08…" className={inp} /></Kol>
            <Kol label="Instagram"><input value={f.instagram} onChange={(e) => s("instagram", e.target.value)} placeholder="@user" className={inp} /></Kol>
          </div>
          <Kol label="Alamat"><input value={f.alamat} onChange={(e) => s("alamat", e.target.value)} className={inp} /></Kol>
          <Kol label="Nomor darurat"><input value={f.no_darurat} onChange={(e) => s("no_darurat", e.target.value)} className={inp} /></Kol>
          <Kol label="Catatan verifikasi"><input value={f.catatan} onChange={(e) => s("catatan", e.target.value)} placeholder="mis. KTP + KTM ok, GetContact bersih" className={inp} /></Kol>
          <div className="flex gap-2">
            <button onClick={simpan} disabled={sibuk} className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">
              {sibuk ? "Menyimpan…" : edit ? "Simpan perubahan" : "Simpan pelanggan"}
            </button>
            <button onClick={tutup} className="rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground">Batal</button>
          </div>
        </div>
      )}

      {pelanggan.length > 4 && <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama / WA…" className={inp + " mb-3"} />}

      {daftar.length === 0 ? <p className="text-sm text-muted-foreground">Belum ada pelanggan.</p> : (
        <ul className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
          {daftar.map((p) => (
            <KartuPelanggan key={p.id} p={p} jml={pesanan.filter((o) => o.pelanggan_id === p.id).length}
              hapus={hapus} setGalat={setGalat} bukaEdit={bukaEdit} sedangEdit={edit === p.id} />
          ))}
        </ul>
      )}
    </Kartu>
  );
}

function KartuPelanggan({ p, jml, hapus, setGalat, bukaEdit, sedangEdit }: {
  p: Pelanggan; jml: number; hapus: (id: string) => void; setGalat: (s: string) => void;
  bukaEdit: (p: Pelanggan) => void; sedangEdit: boolean;
}) {
  const [buka, setBuka] = useState(false);
  const [dok, setDok] = useState<Dokumen[]>([]);
  const [sibuk, setSibuk] = useState("");

  const muatDok = async () => {
    const { data } = await supabase.from("dokumen").select("*").eq("pelanggan_id", p.id);
    setDok((data as Dokumen[]) || []);
  };

  const unggah = async (jenis: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) return setGalat("Ukuran file maksimal 10 MB.");
    setSibuk(jenis); setGalat("");
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${p.id}/${jenis}-${Date.now()}.${ext}`;
      const { error: e1 } = await supabase.storage.from("dokumen").upload(path, file);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("dokumen").insert({ pelanggan_id: p.id, jenis, path, nama_file: file.name });
      if (e2) throw e2;
      await muatDok();
    } catch (e: any) {
      setGalat("Gagal mengunggah: " + String(e?.message || e));
    } finally { setSibuk(""); }
  };

  const lihat = async (d: Dokumen) => {
    const { data, error } = await supabase.storage.from("dokumen").createSignedUrl(d.path, 600);
    if (error) return setGalat(error.message);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const hapusDok = async (d: Dokumen) => {
    await supabase.storage.from("dokumen").remove([d.path]);
    await supabase.from("dokumen").delete().eq("id", d.id);
    muatDok();
  };

  const lengkap = JENIS_DOKUMEN.filter((j) => j.wajib).every((j) => dok.some((d) => d.jenis === j.key));

  return (
    <li className="rounded-xl border border-border">
      <button onClick={() => { setBuka(!buka); if (!buka && !dok.length) muatDok(); }} className="flex w-full items-start justify-between gap-3 p-3 text-left">
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{p.nama}</p>
          <p className="truncate text-xs text-muted-foreground">{p.wa}{p.instagram && ` · ${p.instagram}`}</p>
          {p.catatan && <p className="mt-1 text-xs text-muted-foreground">{p.catatan}</p>}
        </div>
        <div className="shrink-0 text-right">
          <span className="block text-xs text-muted-foreground">{jml}× sewa</span>
          <span className="text-xs text-muted-foreground">{buka ? "tutup" : "berkas"}</span>
        </div>
      </button>

      {buka && (
        <div className="space-y-3 border-t border-border p-3">
          {p.alamat && <p className="text-xs text-muted-foreground"><b className="text-foreground">Alamat:</b> {p.alamat}</p>}
          {p.no_darurat && <p className="text-xs text-muted-foreground"><b className="text-foreground">Darurat:</b> {p.no_darurat}</p>}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Berkas persyaratan {dok.length > 0 && (lengkap ? <span className="text-primary">· wajib lengkap</span> : <span className="text-amber-700">· belum lengkap</span>)}
            </p>
            <div className="space-y-2">
              {JENIS_DOKUMEN.map((j) => {
                const ada = dok.filter((d) => d.jenis === j.key);
                return (
                  <div key={j.key} className="rounded-lg border border-border p-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-foreground">
                        {j.label} {j.wajib && <span className="text-destructive">*</span>}
                      </span>
                      <label className="shrink-0 cursor-pointer rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-secondary">
                        {sibuk === j.key ? "Mengunggah…" : ada.length ? "+ Tambah" : "Unggah"}
                        <input type="file" accept="image/*,application/pdf" className="hidden" disabled={sibuk === j.key}
                          onChange={(e) => { const file = e.target.files?.[0]; if (file) unggah(j.key, file); e.target.value = ""; }} />
                      </label>
                    </div>
                    {ada.map((d) => (
                      <div key={d.id} className="mt-1.5 flex items-center gap-2 rounded bg-secondary/60 px-2 py-1.5">
                        <button onClick={() => lihat(d)} className="min-w-0 flex-1 truncate text-left text-xs text-primary underline underline-offset-2">
                          {d.nama_file || "lihat berkas"}
                        </button>
                        <button onClick={() => hapusDok(d)} className="shrink-0 text-xs text-muted-foreground">hapus</button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Berkas tersimpan privat. Tautan yang dibuka hanya berlaku 10 menit.</p>
          </div>

          <div className="flex gap-1.5 border-t border-border pt-3">
            <a href={waLink(p.wa)} target="_blank" rel="noreferrer" className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground">WhatsApp</a>
            <button onClick={() => bukaEdit(p)} className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground">
              {sedangEdit ? "Tutup edit" : "Edit"}
            </button>
            {jml === 0 && <button onClick={() => hapus(p.id)} className="ml-auto text-xs text-muted-foreground underline underline-offset-2">Hapus pelanggan</button>}
          </div>
        </div>
      )}
    </li>
  );
}

/* ============ TAB 4: UNIT ============ */
function TabUnit({ unit, unitSemua, kat, set, muat, setGalat }: {
  unit: Unit[]; unitSemua: Unit[]; kat: Saring; set: Pengaturan; muat: () => void; setGalat: (s: string) => void;
}) {
  /* Nilai awal ikut kategori yang sedang dipilih: sepatu memakai bagi hasil
     investor 40%, laptop memakai porsi Techpora 70%. */
  const bawaan = (k: Saring) => {
    const kategori: Kategori = k === "sepatu" ? "sepatu" : "laptop";
    return {
      id: "", nama: "", spek: "", harian: "", mingguan: "", bulanan: "",
      modal: "", nilai_ganti: "", kategori,
      pemilik: kategori === "sepatu" ? "" : "Techpora",
      porsi: kategori === "sepatu" ? "40" : "70",
    };
  };
  const [f, setF] = useState(() => bawaan(kat));
  const [buka, setBuka] = useState(false);
  const [edit, setEdit] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const [ongkir, setOngkir] = useState(set);
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const tutup = () => { setBuka(false); setEdit(null); setF(bawaan(kat)); };

  const bukaTambah = () => {
    if (buka && !edit) return tutup();
    setEdit(null); setF(bawaan(kat)); setBuka(true);
  };

  const bukaEdit = (u: Unit) => {
    if (edit === u.id) return tutup();
    setEdit(u.id);
    setF({
      id: u.id, nama: u.nama || "", spek: u.spek || "",
      harian: String(u.harian || ""), mingguan: String(u.mingguan || ""), bulanan: String(u.bulanan || ""),
      modal: String(u.modal || ""), nilai_ganti: String(u.nilai_ganti || ""),
      pemilik: u.pemilik || "", porsi: String(u.porsi_pemilik ?? ""),
      kategori: (u.kategori || "laptop") as Kategori,
    });
    setBuka(true);
  };

  const simpan = async () => {
    if (!f.id.trim() || !f.nama.trim()) return setGalat("Kode unit dan nama wajib diisi.");
    setSibuk(true); setGalat("");
    const isi = {
      nama: f.nama.trim(), spek: f.spek.trim(), kategori: f.kategori,
      harian: Number(f.harian) || 0, mingguan: Number(f.mingguan) || 0, bulanan: Number(f.bulanan) || 0,
      modal: Number(f.modal) || 0, nilai_ganti: Number(f.nilai_ganti) || 0,
      pemilik: f.pemilik.trim() || "Techpora", porsi_pemilik: Number(f.porsi) || 0,
    };
    const { error } = edit
      ? await supabase.from("unit").update(isi).eq("id", edit)
      : await supabase.from("unit").insert({
          id: f.id.trim().toUpperCase(),
          urutan: Math.max(0, ...unitSemua.map((u) => u.urutan || 0)) + 1,
          ...isi,
        });
    setSibuk(false);
    if (error) return setGalat(error.code === "23505" ? "Kode unit itu sudah dipakai." : error.message);
    tutup(); muat();
  };

  const ubah = async (id: string, patch: Partial<Unit>) => {
    const { error } = await supabase.from("unit").update(patch).eq("id", id);
    if (error) setGalat(error.message); else muat();
  };

  return (
    <>
      <Kartu judul="Unit" aksi={
        <button onClick={bukaTambah} className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
          {buka && !edit ? "Tutup" : "+ Tambah"}
        </button>}>
        {buka && (
          <div className="mb-4 space-y-3 rounded-xl border border-border bg-secondary/40 p-3">
            <p className="text-sm font-semibold text-foreground">
              {edit ? `Edit unit ${edit}` : "Unit baru"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Kol label="Kode unit">
                <input value={f.id} onChange={(e) => s("id", e.target.value)} disabled={!!edit}
                  placeholder={f.kategori === "sepatu" ? "SS-008" : "TP-07"}
                  className={inp + (edit ? " opacity-60" : "")} />
              </Kol>
              <Kol label="Kategori">
                <select value={f.kategori} onChange={(e) => s("kategori", e.target.value)} className={inp}>
                  {KATEGORI.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
                </select>
              </Kol>
            </div>
            <Kol label="Nama"><input value={f.nama} onChange={(e) => s("nama", e.target.value)} placeholder={f.kategori === "sepatu" ? "ZENITH FG WhiteGold" : "Lenovo ThinkPad"} className={inp} /></Kol>
            <Kol label={f.kategori === "sepatu" ? "Jenis & ukuran" : "Spesifikasi"}>
              <input value={f.spek} onChange={(e) => s("spek", e.target.value)} placeholder={f.kategori === "sepatu" ? "Bola · uk 43" : "i3 · 8GB · SSD 256GB"} className={inp} />
            </Kol>
            <div className="grid grid-cols-3 gap-2">
              <Kol label="Harian"><input type="number" value={f.harian} onChange={(e) => s("harian", e.target.value)} className={inp} /></Kol>
              <Kol label="Mingguan"><input type="number" value={f.mingguan} onChange={(e) => s("mingguan", e.target.value)} className={inp} /></Kol>
              <Kol label="Bulanan"><input type="number" value={f.bulanan} onChange={(e) => s("bulanan", e.target.value)} className={inp} /></Kol>
            </div>
            <p className="text-xs text-muted-foreground">Isi 0 kalau durasi itu tidak ditawarkan.</p>
            <div className="grid grid-cols-2 gap-3">
              <Kol label="Modal / harga beli"><input type="number" value={f.modal} onChange={(e) => s("modal", e.target.value)} placeholder="3000000" className={inp} /></Kol>
              <Kol label="Nilai ganti bila hilang"><input type="number" value={f.nilai_ganti} onChange={(e) => s("nilai_ganti", e.target.value)} placeholder="3500000" className={inp} /></Kol>
            </div>
            <p className="text-xs text-muted-foreground">Modal dipakai menghitung balik modal. Nilai ganti muncul di perjanjian sewa.</p>
            <div className="grid grid-cols-2 gap-3">
              <Kol label="Pemilik unit"><input value={f.pemilik} onChange={(e) => s("pemilik", e.target.value)} placeholder="Techpora / nama investor" className={inp} /></Kol>
              <Kol label="Porsi pemilik (%)"><input type="number" value={f.porsi} onChange={(e) => s("porsi", e.target.value)} className={inp} /></Kol>
            </div>
            <div className="flex gap-2">
              <button onClick={simpan} disabled={sibuk} className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">
                {sibuk ? "Menyimpan…" : edit ? "Simpan perubahan" : "Simpan unit"}
              </button>
              <button onClick={tutup} className="rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground">Batal</button>
            </div>
          </div>
        )}

        {unit.length === 0 && (
          <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground">
            Belum ada unit di kategori ini.
          </p>
        )}

        <ul className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
          {unit.map((u) => (
            <li key={u.id} className={"rounded-xl border p-3 " + (u.aktif ? "border-border" : "border-dashed border-border opacity-60")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    <span className="font-mono text-xs text-muted-foreground">{u.id}</span> · {u.nama}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{u.spek}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {rp(u.harian)}/hari{u.mingguan ? ` · ${rp(u.mingguan)}/mgg` : ""}{u.bulanan ? ` · ${rp(u.bulanan)}/bln` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">Modal {rp(u.modal)} · {u.pemilik} ({u.porsi_pemilik}%)</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  <button onClick={() => bukaEdit(u)}
                    className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                    {edit === u.id ? "Tutup" : "Edit"}
                  </button>
                  <button onClick={() => ubah(u.id, { aktif: !u.aktif })}
                    className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground">
                    {u.aktif ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Kartu>

      <Kartu judul="Ongkir">
        <div className="grid grid-cols-2 gap-3">
          <Kol label="Per km"><input type="number" value={ongkir.ongkir_per_km} onChange={(e) => setOngkir({ ...ongkir, ongkir_per_km: Number(e.target.value) || 0 })} className={inp} /></Kol>
          <Kol label="Minimum"><input type="number" value={ongkir.ongkir_minimum} onChange={(e) => setOngkir({ ...ongkir, ongkir_minimum: Number(e.target.value) || 0 })} className={inp} /></Kol>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Contoh: 3 km → {rp(Math.max(ongkir.ongkir_minimum, 3 * ongkir.ongkir_per_km))} · 8 km → {rp(Math.max(ongkir.ongkir_minimum, 8 * ongkir.ongkir_per_km))}
        </p>
        <button
          onClick={async () => {
            const { error } = await supabase.from("pengaturan").update(ongkir).eq("id", true);
            if (error) setGalat(error.message); else muat();
          }}
          className="mt-3 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground">Simpan ongkir</button>
      </Kartu>
    </>
  );
}
