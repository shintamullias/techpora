import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  supabase, rp, hariDari, tambahHari, tglIndo, hitungOngkir, waLink, beririsan, JENIS_DOKUMEN, KATEGORI,
  type Pelanggan, type Unit, type Pesanan, type Pengaturan, type StatusPesanan, type Dokumen, type Pengeluaran,
  type Kategori, type Saring,
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
      supabase.from("pesanan").select("*, pelanggan(nama, wa), unit(nama, kategori)").order("mulai", { ascending: false }),
      supabase.from("pengaturan").select("ongkir_per_km, ongkir_minimum").maybeSingle(),
      supabase.from("pengeluaran").select("*").order("tanggal", { ascending: false }),
    ]);
    setBiaya((b.data as Pengeluaran[]) || []);
    setPelanggan((p.data as Pelanggan[]) || []);
    setUnit((u.data as Unit[]) || []);
    setPesanan((o.data as Pesanan[]) || []);
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
    <div className="min-h-screen bg-secondary/30 pb-10">
      <header className="bg-slate-900 px-4 py-4 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl leading-none">Techpora</h1>
              <p className="mt-1 text-xs tracking-widest text-white/50">DASHBOARD SEWA</p>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); nav({ to: "/masuk" }); }}
              className="text-xs text-white/70 underline underline-offset-4"
            >Keluar</button>
          </div>
          <div className="mt-3 flex gap-3 text-xs text-white/70">
            <span><b className="text-white">{aktif}</b> unit keluar</span>
            <span><b className="text-white">{akanDatang}</b> akan datang</span>
            <span><b className="text-white">{unitTampil.filter((u) => u.aktif).length}</b> unit aktif</span>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 backdrop-blur">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-1 py-2">
            {([["kalender","Kalender"],["pesanan","Pesanan"],["pelanggan","Pelanggan"],["unit","Unit"],["uang","Uang"]] as [Tab,string][]).map(([k,t]) => (
              <button key={k} onClick={() => setTab(k)}
                className={"flex-1 rounded-lg px-1.5 py-2 text-xs font-semibold transition sm:text-sm " + (tab===k?"bg-primary text-primary-foreground":"text-muted-foreground")}>{t}</button>
            ))}
          </div>
          <div className="flex gap-1.5 pb-2">
            {([["semua","Semua"], ...KATEGORI.map((k) => [k.key, k.label])] as [Saring,string][]).map(([k,t]) => {
              const n = k === "semua" ? unit.length : unit.filter((u) => (u.kategori || "laptop") === k).length;
              return (
                <button key={k} onClick={() => setKat(k)}
                  className={"flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition " +
                    (kat===k ? "border-slate-900 bg-slate-900 text-white" : "border-border bg-background text-muted-foreground")}>
                  {t}<span className={kat===k ? "text-white/55" : "text-muted-foreground/55"}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-4">
        {galat && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{galat}</p>}
        {tab === "kalender" && <TabKalender pesanan={pesananTampil} unit={unitTampil} />}
        {tab === "pesanan" && <TabPesanan pesanan={pesananTampil} pelanggan={pelanggan} unit={unitTampil} set={set} muat={muat} setGalat={setGalat} />}
        {tab === "pelanggan" && <TabPelanggan pelanggan={pelangganTampil} pesanan={pesananTampil} muat={muat} setGalat={setGalat} />}
        {tab === "unit" && <TabUnit unit={unitTampil} unitSemua={unit} kat={kat} set={set} muat={muat} setGalat={setGalat} />}
        {tab === "uang" && <TabKeuangan pesanan={pesananTampil} unit={unitTampil} biaya={biayaTampil} muat={muat} setGalat={setGalat} />}
      </main>
    </div>
  );
}

const Pusat = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center text-muted-foreground">{children}</div>
);

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
    <section className="rounded-2xl border border-border bg-background p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">{judul}</h2>
        {aksi}
      </div>
      {children}
    </section>
  );
}

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
                    <span className="font-mono">{p.unit_id}</span> · {tglIndo(p.mulai)} → {tglIndo(p.selesai)}
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
  const kosong = { pelanggan_id: "", unit_id: "", durasi_tipe: "harian" as const, durasi_jumlah: 1, mulai: "", jam: "08:00", antar: "tidak" as const, alamat: "", jarak: "", catatan: "" };
  const [f, setF] = useState<any>(kosong);
  const [sibuk, setSibuk] = useState(false);
  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const u = unit.find((x) => x.id === f.unit_id);
  const tipeAda = useMemo(() => (u ? (["harian","mingguan","bulanan"] as const).filter((t) => u[t] > 0) : (["harian"] as const)), [u]);
  useEffect(() => { if (u && !tipeAda.includes(f.durasi_tipe)) s("durasi_tipe", tipeAda[0]); }, [f.unit_id]);

  const n = Math.max(1, Number(f.durasi_jumlah) || 1);
  const totalHari = hariDari(f.durasi_tipe, n);
  const selesai = f.mulai ? tambahHari(f.mulai, totalHari) : "";
  const hargaSewa = u ? (u[f.durasi_tipe as "harian"] || 0) * n : 0;
  const km = Math.max(0, Number(f.jarak) || 0);
  const hargaAntar = hitungOngkir(km, f.antar, set);
  const total = hargaSewa + hargaAntar;

  const bentrok = useMemo(() => {
    if (!f.unit_id || !f.mulai) return null;
    return pesanan.find((p) => p.unit_id === f.unit_id && p.status !== "batal" && p.status !== "selesai" && beririsan(f.mulai, selesai, p.mulai, p.selesai));
  }, [f.unit_id, f.mulai, selesai, pesanan]);

  const simpan = async () => {
    if (!f.pelanggan_id || !f.unit_id || !f.mulai) return setGalat("Pelanggan, unit, dan tanggal mulai wajib diisi.");
    setSibuk(true); setGalat("");
    const { error } = await supabase.from("pesanan").insert({
      pelanggan_id: f.pelanggan_id, unit_id: f.unit_id, durasi_tipe: f.durasi_tipe, durasi_jumlah: n,
      mulai: f.mulai, jam: f.jam, selesai, total_hari: totalHari, antar: f.antar,
      alamat: f.alamat.trim(), jarak_km: km, harga_sewa: hargaSewa, harga_antar: hargaAntar, total, catatan: f.catatan.trim(),
    });
    setSibuk(false);
    if (error) return setGalat(error.message);
    setF(kosong); setBuka(false); muat();
  };

  const ubahStatus = async (id: string, status: StatusPesanan) => {
    const { error } = await supabase.from("pesanan").update({ status }).eq("id", id);
    if (error) setGalat(error.message); else muat();
  };

  return (
    <>
      <Kartu judul="Pesanan" aksi={
        <button onClick={() => setBuka(!buka)} className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
          {buka ? "Tutup" : "+ Tambah"}
        </button>}>
        {buka && (
          <div className="mb-4 space-y-3 rounded-xl border border-border bg-secondary/40 p-3">
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
                {unit.filter((x) => x.aktif).map((x) => <option key={x.id} value={x.id}>{x.id} · {x.nama} · {rp(x.harian)}/hari</option>)}
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
                <div className="rounded-xl border-2 border-dashed border-border p-3 text-sm">
                  <Baris k={`${u.nama} · ${n} ${f.durasi_tipe}`} v={hargaSewa} />
                  {f.antar !== "tidak" && <Baris k={`Antar${f.antar === "pp" ? " + jemput" : ""} ${km} km`} v={hargaAntar} />}
                  <div className="mt-2 flex items-baseline justify-between border-t border-border pt-2">
                    <span className="font-semibold text-muted-foreground">TOTAL</span>
                    <span className="font-serif text-2xl text-foreground">{rp(total)}</span>
                  </div>
                </div>
                <button onClick={simpan} disabled={sibuk} className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">
                  {sibuk ? "Menyimpan…" : "Simpan pesanan"}
                </button>
              </>
            )}
          </div>
        )}

        {pesanan.length === 0 ? <p className="text-sm text-muted-foreground">Belum ada pesanan.</p> : (
          <ul className="space-y-2">
            {pesanan.map((p) => (
              <li key={p.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{p.pelanggan?.nama}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      <span className="font-mono">{p.unit_id}</span> · {tglIndo(p.mulai)} → {tglIndo(p.selesai)} · {p.durasi_jumlah} {p.durasi_tipe}
                    </p>
                    {p.antar !== "tidak" && <p className="truncate text-xs text-muted-foreground">Antar {p.jarak_km} km · {rp(p.harga_antar)}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-foreground">{rp(p.total)}</p>
                    <span className={"rounded-full border px-2 py-0.5 text-xs font-semibold " + warnaStatus[p.status]}>{p.status}</span>
                  </div>
                </div>
                <p className="mt-1.5 text-xs">
                  {p.ttd_setuju
                    ? <span className="text-primary">Perjanjian ditandatangani {p.ttd_nama ? `oleh ${p.ttd_nama}` : ""}</span>
                    : <span className="text-amber-700">Perjanjian belum ditandatangani</span>}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {!p.ttd_setuju && p.pelanggan?.wa && (
                    <a href={waLink(p.pelanggan.wa, `Halo kak ${p.pelanggan.nama}, ini perjanjian sewa ${p.unit?.nama} untuk ${tglIndo(p.mulai)}. Mohon dibaca lalu tanda tangan langsung di halaman ini ya:\n\n${typeof window !== "undefined" ? window.location.origin : "https://techpora.id"}/ttd/${p.token}\n\nNanti saat serah terima tinggal cek unit, tidak perlu tanda tangan lagi 🙏`)}
                      target="_blank" rel="noreferrer"
                      className="rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">Kirim link TTD</a>
                  )}
                  <a href={`/ttd/${p.token}`} target="_blank" rel="noreferrer"
                    className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground">Lihat perjanjian</a>
                  {p.status === "dipesan" && <Aksi onClick={() => ubahStatus(p.id, "berjalan")}>Unit diantar</Aksi>}
                  {p.status === "berjalan" && <Aksi onClick={() => ubahStatus(p.id, "selesai")}>Unit kembali</Aksi>}
                  {p.status !== "batal" && p.status !== "selesai" && <Aksi onClick={() => ubahStatus(p.id, "batal")}>Batal</Aksi>}
                  {p.pelanggan?.wa && (
                    <a href={waLink(p.pelanggan.wa, `Halo kak ${p.pelanggan.nama}, konfirmasi sewa ${p.unit?.nama} ${tglIndo(p.mulai)} — ${tglIndo(p.selesai)} pukul ${p.jam}. Total ${rp(p.total)}. Terima kasih 🙏`)}
                      target="_blank" rel="noreferrer" className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground">WhatsApp</a>
                  )}
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
    <span className="text-foreground">{rp(v)}</span>
  </div>
);

/* ============ TAB 3: PELANGGAN ============ */
function TabPelanggan({ pelanggan, pesanan, muat, setGalat }: { pelanggan: Pelanggan[]; pesanan: Pesanan[]; muat: () => void; setGalat: (s: string) => void }) {
  const kosong = { nama: "", wa: "", instagram: "", alamat: "", no_darurat: "", catatan: "" };
  const [f, setF] = useState(kosong);
  const [buka, setBuka] = useState(false);
  const [sibuk, setSibuk] = useState(false);
  const [cari, setCari] = useState("");
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const simpan = async () => {
    if (!f.nama.trim() || !f.wa.trim()) return setGalat("Nama dan nomor WA wajib diisi.");
    setSibuk(true); setGalat("");
    const { error } = await supabase.from("pelanggan").insert({ ...f, nama: f.nama.trim(), wa: f.wa.trim() });
    setSibuk(false);
    if (error) return setGalat(error.message);
    setF(kosong); setBuka(false); muat();
  };

  const hapus = async (id: string) => {
    const { error } = await supabase.from("pelanggan").delete().eq("id", id);
    if (error) setGalat(error.message); else muat();
  };

  const daftar = pelanggan.filter((p) => (p.nama + p.wa + p.instagram).toLowerCase().includes(cari.toLowerCase()));

  return (
    <Kartu judul="Pelanggan" aksi={
      <button onClick={() => setBuka(!buka)} className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
        {buka ? "Tutup" : "+ Tambah"}
      </button>}>
      {buka && (
        <div className="mb-4 space-y-3 rounded-xl border border-border bg-secondary/40 p-3">
          <Kol label="Nama sesuai KTP"><input value={f.nama} onChange={(e) => s("nama", e.target.value)} className={inp} /></Kol>
          <div className="grid grid-cols-2 gap-3">
            <Kol label="Nomor WhatsApp"><input value={f.wa} onChange={(e) => s("wa", e.target.value)} placeholder="08…" className={inp} /></Kol>
            <Kol label="Instagram"><input value={f.instagram} onChange={(e) => s("instagram", e.target.value)} placeholder="@user" className={inp} /></Kol>
          </div>
          <Kol label="Alamat"><input value={f.alamat} onChange={(e) => s("alamat", e.target.value)} className={inp} /></Kol>
          <Kol label="Nomor darurat"><input value={f.no_darurat} onChange={(e) => s("no_darurat", e.target.value)} className={inp} /></Kol>
          <Kol label="Catatan verifikasi"><input value={f.catatan} onChange={(e) => s("catatan", e.target.value)} placeholder="mis. KTP + KTM ok, GetContact bersih" className={inp} /></Kol>
          <button onClick={simpan} disabled={sibuk} className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">
            {sibuk ? "Menyimpan…" : "Simpan pelanggan"}
          </button>
        </div>
      )}

      {pelanggan.length > 4 && <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama / WA…" className={inp + " mb-3"} />}

      {daftar.length === 0 ? <p className="text-sm text-muted-foreground">Belum ada pelanggan.</p> : (
        <ul className="space-y-2">
          {daftar.map((p) => (
            <KartuPelanggan key={p.id} p={p} jml={pesanan.filter((o) => o.pelanggan_id === p.id).length} hapus={hapus} setGalat={setGalat} />
          ))}
        </ul>
      )}
    </Kartu>
  );
}

function KartuPelanggan({ p, jml, hapus, setGalat }: { p: Pelanggan; jml: number; hapus: (id: string) => void; setGalat: (s: string) => void }) {
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
