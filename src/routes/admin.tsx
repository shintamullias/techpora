import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  supabase, rp, hariDari, tambahHari, tglIndo, tglHariIndo, hitungOngkir, waLink, beririsan, JENIS_DOKUMEN, KATEGORI, totalItem,
  type Pelanggan, type Unit, type Pesanan, type Pengaturan, type StatusPesanan, type Dokumen, type Pengeluaran,
  type Kategori, type Saring, type ItemPesanan,
} from "@/lib/supabase";
import TabKeuangan from "@/components/TabKeuangan";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Dashboard — Techpora" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: Dashboard,
});

type Tab = "kalender" | "pesanan" | "pelanggan" | "unit" | "uang";

function Dashboard() {
  const nav = useNavigate();
  const [siap, setSiap] = useState(false);
  const [boleh, setBoleh] = useState(false);
  const [tab, setTab] = useState<Tab>("kalender");
  const [kat, setKat] = useState<Saring>("semua");
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [set, setSet] = useState<Pengaturan>({ ongkir_per_km: 10000, ongkir_minimum: 50000 });
  const [biaya, setBiaya] = useState<Pengeluaran[]>([]);
  const [galat, setGalat] = useState("");

  const muat = async () => {
    const { data: sesi } = await supabase.auth.getSession();
    if (!sesi.session) return nav({ to: "/masuk" });
    const { data: me } = await supabase.from("profil").select("is_admin").eq("id", sesi.session.user.id).maybeSingle();
    if (!me?.is_admin) { setBoleh(false); setSiap(true); return; }
    setBoleh(true);
    const [p, u, o, s, b] = await Promise.all([
      supabase.from("pelanggan").select("*").order("dibuat_pada", { ascending: false }),
      supabase.from("unit").select("*").order("urutan"),
      supabase.from("pesanan").select("id, pelanggan_id, unit_id, durasi_tipe, durasi_jumlah, mulai, jam, selesai, total_hari, antar, alamat, jarak_km, harga_sewa, harga_antar, item, total, status, catatan, dibuat_pada, token, ttd_nama, ttd_pada, ttd_setuju, pelanggan(nama, wa), unit(nama, kategori)").order("mulai", { ascending: false }),
      supabase.from("pengaturan").select("ongkir_per_km, ongkir_minimum").maybeSingle(),
      supabase.from("pengeluaran").select("*").order("tanggal", { ascending: false }),
    ]);
    setBiaya((b.data as Pengeluaran[]) || []);
    setPelanggan((p.data as Pelanggan[]) || []);
    setUnit((u.data as Unit[]) || []);
    // Kolom dipilih eksplisit, jadi bentuk relasi harus dilepas dulu ke unknown.
    setPesanan((o.data as unknown as Pesanan[]) || []);
    if (s.data) setSet(s.data as Pengaturan);
    setSiap(true);
  };

  useEffect(() => { muat(); }, []);

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
  const biayaTampil = useMemo(
    () => (kat === "semua" ? biaya : biaya.filter((b) => cocok(b.unit_id))),
    [biaya, kat, katUnit],
  );

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

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-24">
      <header className="bg-slate-900">
        <div className="mx-auto max-w-3xl px-4 pb-5 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-serif text-lg font-bold text-white">T</div>
              <div>
                <p className="text-base font-bold leading-none text-white">TECHPORA</p>
                <p className="mt-1 text-[11px] tracking-widest text-slate-400">DASHBOARD SEWA</p>
              </div>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); nav({ to: "/masuk" }); }}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
            >Keluar</button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <StatKartu warna="#3B82F6" nilai={aktif} label="Unit keluar" />
            <StatKartu warna="#F59E0B" nilai={akanDatang} label="Akan datang" />
            <StatKartu warna="#10B981" nilai={unitTampil.filter((u) => u.aktif).length} label="Unit aktif" />
          </div>

          {/* Saringan kategori (Semua / Laptop / Sepatu) */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
            {([["semua","Semua"], ...KATEGORI.map((k) => [k.key, k.label])] as [Saring,string][]).map(([k,t]) => {
              const n = k === "semua" ? unit.length : unit.filter((u) => (u.kategori || "laptop") === k).length;
              return (
                <button key={k} onClick={() => setKat(k)}
                  className={"flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition " +
                    (kat===k ? "bg-white text-slate-900" : "bg-white/10 text-slate-300")}>
                  {t}<span className={kat===k ? "text-slate-400" : "text-slate-500"}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-4">
        {galat && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{galat}</p>}
        {tab === "kalender" && <TabKalender pesanan={pesananTampil} unit={unitTampil} />}
        {tab === "pesanan" && <TabPesanan pesanan={pesananTampil} pelanggan={pelanggan} unit={unitTampil} set={set} muat={muat} setGalat={setGalat} />}
        {tab === "pelanggan" && <TabPelanggan pelanggan={pelangganTampil} pesanan={pesananTampil} muat={muat} setGalat={setGalat} />}
        {tab === "unit" && <TabUnit unit={unitTampil} unitSemua={unit} kat={kat} set={set} muat={muat} setGalat={setGalat} />}
        {tab === "uang" && <TabKeuangan pesanan={pesananTampil} unit={unitTampil} biaya={biayaTampil} muat={muat} setGalat={setGalat} />}
      </main>

      {/* Navigasi bawah — mudah dijangkau jempol di HP */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl">
          {([
            ["pesanan", "Pesanan", "M4 4h10l1 3v9H4V4Zm0 4h11M7 12h5"],
            ["kalender", "Kalender", "M3 4h14v13H3V4Zm0 4h14M7 2v4m6-4v4"],
            ["pelanggan", "Pelanggan", "M7 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 8a5 5 0 0 1 10 0M13 4a3 3 0 0 1 0 6m5 7a5 5 0 0 0-4-4.9"],
            ["unit", "Unit", "M3 5h14v8H3V5Zm-1 11h16M8 16v1.5m4-1.5v1.5"],
            ["uang", "Uang", "M10 2v16M6 5h6a2 2 0 0 1 0 4H8a2 2 0 0 0 0 4h6"],
          ] as [Tab,string,string][]).map(([k, label, d]) => {
            const on = tab === k;
            return (
              <button key={k} onClick={() => setTab(k)}
                className={"flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition " + (on ? "text-primary" : "text-slate-400")}>
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={on ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
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

function StatKartu({ warna, nilai, label }: { warna: string; nilai: number; label: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
      <span className="mb-1.5 block h-2 w-2 rounded-full" style={{ background: warna, boxShadow: `0 0 10px ${warna}` }} />
      <p className="text-2xl font-bold leading-none tracking-tight text-white">{nilai}</p>
      <p className="mt-1 text-[11px] text-slate-400">{label}</p>
    </div>
  );
}

const inp = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

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
    <section className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">{judul}</h2>
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

/* ============ TAB 1: KALENDER ============ */
function TabKalender({ pesanan, unit }: { pesanan: Pesanan[]; unit: Unit[] }) {
  const [bln, setBln] = useState(() => { const d = new Date(); return { th: d.getFullYear(), bl: d.getMonth() }; });
  const aktif = pesanan.filter((p) => p.status === "dipesan" || p.status === "berjalan");
  /* Bilah kalender menampilkan seluruh sewa kecuali yang dibatalkan, supaya
     riwayat "selesai" tetap kelihatan. Tanggal selesai bersifat eksklusif;
     kalau ada data lama yang selesai == mulai, dianggap sewa 1 hari. */
  const terpakai = pesanan.filter((p) => p.status !== "batal");
  const habis = (p: Pesanan) => (p.selesai > p.mulai ? p.selesai : tambahHari(p.mulai, 1));
  const warnaBilah: Record<string, string> = {
    berjalan: "bg-blue-500",
    dipesan: "bg-amber-400",
    selesai: "bg-emerald-300",
  };
  const awal = new Date(bln.th, bln.bl, 1);
  const jml = new Date(bln.th, bln.bl + 1, 0).getDate();
  const iso = (d: number) => `${bln.th}-${String(bln.bl + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const geser = (a: number) => setBln(({ th, bl }) => { const d = new Date(th, bl + a, 1); return { th: d.getFullYear(), bl: d.getMonth() }; });

  return (
    <Kartu judul={awal.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
      aksi={<div className="flex gap-1">
        <button onClick={() => geser(-1)} className="rounded-lg border border-border px-3 py-1 text-sm">‹</button>
        <button onClick={() => geser(1)} className="rounded-lg border border-border px-3 py-1 text-sm">›</button>
      </div>}>
      {unit.filter((u) => u.aktif).length === 0 && (
        <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground">Belum ada unit aktif. Tambahkan unit dulu di tab Unit.</p>
      )}
      <div className="space-y-3">
        {unit.filter((u) => u.aktif).map((u) => (
          <div key={u.id}>
            <p className="mb-1 text-sm font-semibold text-foreground">
              <span className="font-mono text-xs text-muted-foreground">{u.id}</span> · {u.nama}
            </p>
            <div className="flex gap-[2px] overflow-hidden rounded-md">
              {Array.from({ length: jml }).map((_, i) => {
                const t = iso(i + 1);
                const isi = terpakai.find((p) => p.unit_id === u.id && t >= p.mulai && t < habis(p));
                return (
                  <div key={i} title={isi ? `${isi.pelanggan?.nama} · ${isi.status} · ${tglIndo(isi.mulai)}–${tglIndo(isi.selesai)}` : t}
                    className={"h-8 flex-1 " + (isi ? warnaBilah[isi.status] || "bg-slate-300" : "bg-secondary")} />
                );
              })}
            </div>
            {/* Penanda tanggal supaya jelas kotak warna itu tanggal berapa */}
            <div className="mt-0.5 flex gap-[2px]">
              {Array.from({ length: jml }).map((_, i) => {
                const d = i + 1;
                const tampil = d === 1 || d % 5 === 0 || d === jml;
                return (
                  <div key={i} className="flex-1 text-center text-[9px] leading-none text-muted-foreground">
                    {tampil ? d : ""}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-amber-400" /> Dipesan</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-blue-500" /> Sedang keluar</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-emerald-300" /> Selesai</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-secondary" /> Kosong</span>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <p className="mb-2 text-sm font-semibold text-foreground">Jadwal terdekat</p>
        {aktif.length === 0 ? <p className="text-sm text-muted-foreground">Belum ada sewa terjadwal.</p> : (
          <ul className="space-y-2">
            {[...aktif].sort((a, b) => (a.mulai < b.mulai ? -1 : 1)).slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{p.pelanggan?.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono">{p.unit_id}</span> · {tglHariIndo(p.mulai)}{p.jam ? ` ${p.jam}` : ""} → {tglHariIndo(p.selesai)}
                  </p>
                </div>
                <span className={"shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold " + warnaStatus[p.status]}>{p.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Kartu>
  );
}

/* ============ TAB 2: PESANAN ============ */
function TabPesanan({ pesanan, pelanggan, unit, set, muat, setGalat }: {
  pesanan: Pesanan[]; pelanggan: Pelanggan[]; unit: Unit[]; set: Pengaturan; muat: () => void; setGalat: (s: string) => void;
}) {
  const [buka, setBuka] = useState(false);
  const [edit, setEdit] = useState<string | null>(null);
  const kosong = { pelanggan_id: "", unit_id: "", durasi_tipe: "harian" as const, durasi_jumlah: 1, mulai: "", jam: "08:00", antar: "tidak" as const, alamat: "", jarak: "", catatan: "", item: [] as ItemPesanan[] };
  const [f, setF] = useState<any>(kosong);
  const [sibuk, setSibuk] = useState(false);
  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const tutup = () => { setBuka(false); setEdit(null); setF(kosong); };

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
      mulai: o.mulai, jam: (o.jam || "08:00").slice(0, 5), antar: o.antar || "tidak",
      alamat: o.alamat || "", jarak: String(o.jarak_km || ""), catatan: o.catatan || "",
      item: Array.isArray(o.item) ? o.item.map((i) => ({ ...i })) : [],
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
  const total = hargaSewa + hargaAntar + jumlahItem;

  const setItem = (idx: number, patch: Partial<ItemPesanan>) =>
    setF((p: any) => ({ ...p, item: p.item.map((it: ItemPesanan, i: number) => (i === idx ? { ...it, ...patch } : it)) }));
  const tambahItem = () => setF((p: any) => ({ ...p, item: [...(p.item || []), { nama: "", jumlah: 0 }] }));
  const hapusItem = (idx: number) => setF((p: any) => ({ ...p, item: p.item.filter((_: ItemPesanan, i: number) => i !== idx) }));

  const bentrok = useMemo(() => {
    if (!f.unit_id || !f.mulai) return null;
    return pesanan.find((p) => p.id !== edit && p.unit_id === f.unit_id && p.status !== "batal" && p.status !== "selesai" && beririsan(f.mulai, selesai, p.mulai, p.selesai));
  }, [f.unit_id, f.mulai, selesai, pesanan, edit]);

  const simpan = async () => {
    if (!f.pelanggan_id || !f.unit_id || !f.mulai) return setGalat("Pelanggan, unit, dan tanggal mulai wajib diisi.");
    setSibuk(true); setGalat("");
    const isi = {
      pelanggan_id: f.pelanggan_id, unit_id: f.unit_id, durasi_tipe: f.durasi_tipe, durasi_jumlah: n,
      mulai: f.mulai, jam: f.jam, selesai, total_hari: totalHari, antar: f.antar,
      alamat: f.alamat.trim(), jarak_km: km, harga_sewa: hargaSewa, harga_antar: hargaAntar,
      item: itemBersih, total, catatan: f.catatan.trim(),
    };
    const { error } = edit
      ? await supabase.from("pesanan").update(isi).eq("id", edit)
      : await supabase.from("pesanan").insert(isi);
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
                  <Kol label="Jam ambil"><input type="time" value={f.jam} onChange={(e) => s("jam", e.target.value)} className={inp} /></Kol>
                </div>
                <Kol label="Tanggal mulai"><input type="date" value={f.mulai} onChange={(e) => s("mulai", e.target.value)} className={inp} /></Kol>
                {f.mulai && <p className="text-xs text-muted-foreground">Kembali <b className="text-foreground">{tglIndo(selesai)}</b> pukul {f.jam} · {totalHari} × 24 jam</p>}
                {bentrok && <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  Bentrok: {bentrok.unit_id} sudah dipakai {bentrok.pelanggan?.nama} ({tglIndo(bentrok.mulai)}–{tglIndo(bentrok.selesai)}).
                </p>}
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
                      <div key={i} className="flex items-center gap-2">
                        <input value={it.nama} onChange={(e) => setItem(i, { nama: e.target.value })}
                          placeholder={potongan ? "Diskon langganan" : "Sewa mouse"} className={inp + " flex-1"} />
                        <select value={potongan ? "kurang" : "tambah"}
                          onChange={(e) => setItem(i, { jumlah: Math.abs(Number(it.jumlah) || 0) * (e.target.value === "kurang" ? -1 : 1) })}
                          className={inp + " w-24 shrink-0"}>
                          <option value="tambah">Tambah</option>
                          <option value="kurang">Diskon</option>
                        </select>
                        <input type="number" min={0} value={Math.abs(Number(it.jumlah) || 0) || ""}
                          onChange={(e) => setItem(i, { jumlah: (Number(e.target.value) || 0) * (potongan ? -1 : 1) })}
                          placeholder="0" className={inp + " w-28 shrink-0"} />
                        <button onClick={() => hapusItem(i)} aria-label="Hapus baris"
                          className="shrink-0 rounded-lg border border-border px-2.5 py-2 text-xs font-semibold text-muted-foreground">×</button>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl border-2 border-dashed border-border p-3 text-sm">
                  <Baris k={`${u.nama} · ${n} ${f.durasi_tipe}`} v={hargaSewa} />
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
          <ul className="space-y-2.5">
            {pesanan.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                <div className="h-1" style={{ background: warnaBar[p.status] }} />
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">{p.pelanggan?.nama}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        <span className="font-mono font-semibold text-slate-600">{p.unit_id}</span> · {tglHariIndo(p.mulai)} → {tglHariIndo(p.selesai)}
                      </p>
                      <p className="text-xs text-slate-400">{p.durasi_jumlah} {p.durasi_tipe}{p.antar !== "tidak" ? ` · antar ${p.jarak_km} km` : ""}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-bold text-slate-900">{rp(p.total)}</p>
                      {(p.item || []).length > 0 && (
                        <p className="text-[11px] text-slate-400">
                          {(p.item || []).map((it) => `${it.nama || (it.jumlah < 0 ? "Diskon" : "Tambahan")} ${it.jumlah < 0 ? "−" : "+"}${rp(Math.abs(it.jumlah))}`).join(" · ")}
                        </p>
                      )}
                      <span className={"mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize " + warnaStatus[p.status]}>{p.status}</span>
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
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white">Kirim link TTD</a>
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
        <ul className="space-y-2">
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

        <ul className="space-y-2">
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
