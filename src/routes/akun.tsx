import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  supabase,
  JENIS_DOKUMEN,
  rp,
  hariDari,
  tambahHari,
  tglIndo,
  type Profil,
  type Unit,
  type Dokumen,
  type Pesanan,
} from "@/lib/supabase";

const SITE_URL = "https://techpora.id";

export const Route = createFileRoute("/akun")({
  head: () => ({
    meta: [
      { title: "Akun Saya — Techpora" },
      { name: "description", content: "Kelola verifikasi dan pesanan sewa laptop Techpora." },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/akun` }],
  }),
  component: Akun,
});

function Akun() {
  const nav = useNavigate();
  const [siap, setSiap] = useState(false);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [dokumen, setDokumen] = useState<Dokumen[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [ongkirKm, setOngkirKm] = useState(10000);
  const [galat, setGalat] = useState("");

  const muat = async () => {
    const { data: sesi } = await supabase.auth.getSession();
    if (!sesi.session) {
      nav({ to: "/masuk" });
      return;
    }
    const uid = sesi.session.user.id;
    const [p, d, u, o, s] = await Promise.all([
      supabase.from("profil").select("*").eq("id", uid).maybeSingle(),
      supabase.from("dokumen").select("*").eq("user_id", uid).order("diunggah_pada", { ascending: false }),
      supabase.from("unit").select("*").eq("aktif", true).order("urutan"),
      supabase.from("pesanan").select("*, unit(nama)").eq("user_id", uid).order("dibuat_pada", { ascending: false }),
      supabase.from("pengaturan").select("ongkir_per_km").maybeSingle(),
    ]);
    setProfil(p.data as Profil);
    setDokumen((d.data as Dokumen[]) || []);
    setUnit((u.data as Unit[]) || []);
    setPesanan((o.data as Pesanan[]) || []);
    if (s.data?.ongkir_per_km) setOngkirKm(s.data.ongkir_per_km);
    setSiap(true);
  };

  useEffect(() => {
    muat();
  }, []);

  if (!siap) return <Memuat />;

  const disetujui = profil?.status_verifikasi === "disetujui";

  return (
    <div className="min-h-screen bg-secondary/30 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← techpora.id
          </Link>
          <div className="flex items-center gap-3">
            {profil?.is_admin && (
              <Link to="/admin" className="text-sm font-semibold text-primary underline underline-offset-4">
                Dashboard admin
              </Link>
            )}
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                nav({ to: "/masuk" });
              }}
              className="text-sm text-muted-foreground underline underline-offset-4"
            >
              Keluar
            </button>
          </div>
        </div>

        <StatusKartu profil={profil} />

        {galat && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{galat}</p>}

        {!disetujui && (
          <UnggahDokumen
            dokumen={dokumen}
            userId={profil!.id}
            onSelesai={muat}
            setGalat={setGalat}
            ditolak={profil?.status_verifikasi === "ditolak"}
          />
        )}

        {disetujui && (
          <FormPesan unit={unit} ongkirKm={ongkirKm} userId={profil!.id} pesanan={pesanan} onSelesai={muat} setGalat={setGalat} />
        )}

        <DaftarPesanan pesanan={pesanan} />
      </div>
    </div>
  );
}

function Memuat() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30">
      <p className="text-sm text-muted-foreground">Memuat…</p>
    </div>
  );
}

/* ---------------- Status verifikasi ---------------- */

function StatusKartu({ profil }: { profil: Profil | null }) {
  if (!profil) return null;
  const s = profil.status_verifikasi;
  const gaya =
    s === "disetujui"
      ? "border-primary/30 bg-primary/5"
      : s === "ditolak"
      ? "border-destructive/30 bg-destructive/5"
      : "border-border bg-background";

  return (
    <div className={`rounded-2xl border p-5 ${gaya}`}>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Halo, {profil.nama || "penyewa"}</p>
      <h1 className="mt-1 font-serif text-2xl text-foreground">
        {s === "disetujui" ? "Akun terverifikasi" : s === "ditolak" ? "Verifikasi belum lolos" : "Menunggu verifikasi"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {s === "disetujui"
          ? "Kamu sudah bisa memesan unit. Pilih unit dan durasinya di bawah."
          : s === "ditolak"
          ? "Silakan perbaiki dokumen lalu unggah ulang. Kami akan meninjau kembali."
          : "Unggah dokumen syarat di bawah. Admin memeriksa pada jam kerja dan mengabari lewat WhatsApp."}
      </p>
      {profil.catatan_review && (
        <p className="mt-3 rounded-lg bg-background/80 px-3 py-2 text-sm text-foreground">
          <span className="font-semibold">Catatan admin: </span>
          {profil.catatan_review}
        </p>
      )}
    </div>
  );
}

/* ---------------- Unggah dokumen ---------------- */

function UnggahDokumen({
  dokumen,
  userId,
  onSelesai,
  setGalat,
  ditolak,
}: {
  dokumen: Dokumen[];
  userId: string;
  onSelesai: () => void;
  setGalat: (s: string) => void;
  ditolak: boolean;
}) {
  const [sibuk, setSibuk] = useState("");

  const unggah = async (jenis: string, file: File) => {
    setGalat("");
    if (file.size > 10 * 1024 * 1024) {
      setGalat("Ukuran file maksimal 10 MB. Coba kompres dulu.");
      return;
    }
    setSibuk(jenis);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${jenis}-${Date.now()}.${ext}`;
      const { error: e1 } = await supabase.storage.from("dokumen").upload(path, file, { upsert: false });
      if (e1) throw e1;
      const { error: e2 } = await supabase
        .from("dokumen")
        .insert({ user_id: userId, jenis, path, nama_file: file.name });
      if (e2) throw e2;
      onSelesai();
    } catch (e: any) {
      setGalat("Gagal mengunggah: " + String(e?.message || e));
    } finally {
      setSibuk("");
    }
  };

  const hapus = async (d: Dokumen) => {
    setSibuk(d.jenis);
    try {
      await supabase.storage.from("dokumen").remove([d.path]);
      await supabase.from("dokumen").delete().eq("id", d.id);
      onSelesai();
    } finally {
      setSibuk("");
    }
  };

  const wajibLengkap = JENIS_DOKUMEN.filter((j) => j.wajib).every((j) => dokumen.some((d) => d.jenis === j.key));

  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <h2 className="font-serif text-xl text-foreground">Dokumen syarat</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Sewa di Techpora <span className="font-semibold text-foreground">tanpa deposit uang</span> — dokumen ini yang menjadi
        jaminannya. Pastikan foto terbaca jelas dan nama pada semua dokumen sama.
      </p>

      <div className="mt-4 space-y-3">
        {JENIS_DOKUMEN.map((j) => {
          const ada = dokumen.filter((d) => d.jenis === j.key);
          return (
            <div key={j.key} className="rounded-xl border border-border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {j.label} {j.wajib && <span className="text-destructive">*</span>}
                  </p>
                  {ada.length === 0 && <p className="text-xs text-muted-foreground">Belum diunggah</p>}
                </div>
                <label className="shrink-0 cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary">
                  {sibuk === j.key ? "Mengunggah…" : ada.length ? "Ganti" : "Pilih file"}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    disabled={sibuk === j.key}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) unggah(j.key, f);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              {ada.map((d) => (
                <div key={d.id} className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2">
                  <span className="truncate text-xs text-foreground">{d.nama_file || d.path.split("/").pop()}</span>
                  <button onClick={() => hapus(d)} className="shrink-0 text-xs text-destructive underline underline-offset-2">
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <p className={`mt-4 rounded-lg px-3 py-2.5 text-sm ${wajibLengkap ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
        {wajibLengkap
          ? ditolak
            ? "Dokumen sudah diperbarui. Hubungi admin lewat WhatsApp agar segera ditinjau ulang."
            : "Dokumen wajib lengkap. Admin akan memeriksa dan mengabarimu lewat WhatsApp."
          : "Lengkapi dokumen bertanda * agar verifikasi bisa diproses."}
      </p>

      <a
        href="https://wa.me/6282177984041?text=Halo%20Techpora%2C%20saya%20sudah%20mengunggah%20dokumen%20di%20techpora.id%2Fakun.%20Mohon%20dibantu%20verifikasinya%20ya."
        target="_blank"
        rel="noreferrer"
        className="mt-3 block rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground hover:bg-secondary"
      >
        Kabari admin lewat WhatsApp
      </a>
    </div>
  );
}

/* ---------------- Form pesan (khusus yang sudah disetujui) ---------------- */

function FormPesan({
  unit,
  ongkirKm,
  userId,
  pesanan,
  onSelesai,
  setGalat,
}: {
  unit: Unit[];
  ongkirKm: number;
  userId: string;
  pesanan: Pesanan[];
  onSelesai: () => void;
  setGalat: (s: string) => void;
}) {
  const [unitId, setUnitId] = useState("");
  const [tipe, setTipe] = useState<"harian" | "mingguan" | "bulanan">("harian");
  const [jumlah, setJumlah] = useState(1);
  const [mulai, setMulai] = useState("");
  const [jam, setJam] = useState("08:00");
  const [antar, setAntar] = useState<"tidak" | "antar" | "pp">("tidak");
  const [alamat, setAlamat] = useState("");
  const [jarak, setJarak] = useState("");
  const [catatan, setCatatan] = useState("");
  const [sibuk, setSibuk] = useState(false);

  const u = unit.find((x) => x.id === unitId);
  const tipeAda = useMemo(
    () => (u ? (["harian", "mingguan", "bulanan"] as const).filter((t) => u[t] > 0) : (["harian"] as const)),
    [u]
  );
  useEffect(() => {
    if (u && !tipeAda.includes(tipe)) setTipe(tipeAda[0]);
  }, [unitId]);

  const n = Math.max(1, Number(jumlah) || 1);
  const totalHari = hariDari(tipe, n);
  const selesai = mulai ? tambahHari(mulai, totalHari) : "";
  const hargaSewa = u ? (u[tipe] || 0) * n : 0;
  const km = Math.max(0, Number(jarak) || 0);
  const kali = antar === "pp" ? 2 : antar === "antar" ? 1 : 0;
  const hargaAntar = km * ongkirKm * kali;
  const total = hargaSewa + hargaAntar;

  const kirim = async () => {
    setGalat("");
    if (!unitId || !mulai) {
      setGalat("Pilih unit dan tanggal mulai dulu.");
      return;
    }
    if (antar !== "tidak" && !alamat.trim()) {
      setGalat("Isi alamat pengantaran.");
      return;
    }
    setSibuk(true);
    try {
      const { error } = await supabase.from("pesanan").insert({
        user_id: userId,
        unit_id: unitId,
        durasi_tipe: tipe,
        durasi_jumlah: n,
        mulai,
        jam,
        selesai,
        total_hari: totalHari,
        antar,
        alamat: alamat.trim(),
        jarak_km: km,
        harga_sewa: hargaSewa,
        harga_antar: hargaAntar,
        total,
        catatan: catatan.trim(),
      });
      if (error) throw error;
      setUnitId("");
      setMulai("");
      setAlamat("");
      setJarak("");
      setCatatan("");
      onSelesai();
    } catch (e: any) {
      setGalat("Gagal membuat pesanan: " + String(e?.message || e));
    } finally {
      setSibuk(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <h2 className="font-serif text-xl text-foreground">Pesan unit</h2>

      <div className="mt-4 space-y-2">
        {unit.map((x) => (
          <button
            key={x.id}
            onClick={() => setUnitId(x.id)}
            className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
              unitId === x.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <span>
              <span className="block font-semibold text-foreground">{x.nama}</span>
              <span className="block text-xs text-muted-foreground">{x.spek}</span>
            </span>
            <span className="text-right">
              <span className="block font-semibold text-foreground">{rp(x.harian)}</span>
              <span className="text-xs text-muted-foreground">/hari</span>
            </span>
          </button>
        ))}
      </div>

      {u && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            {tipeAda.map((t) => (
              <button
                key={t}
                onClick={() => setTipe(t)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold capitalize ${
                  tipe === t ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Kolom label={`Jumlah ${tipe === "harian" ? "hari" : tipe === "mingguan" ? "minggu" : "bulan"}`}>
              <input type="number" min={1} value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))} className={inputCls} />
            </Kolom>
            <Kolom label="Jam ambil">
              <input type="time" value={jam} onChange={(e) => setJam(e.target.value)} className={inputCls} />
            </Kolom>
          </div>

          <Kolom label="Tanggal mulai">
            <input type="date" value={mulai} onChange={(e) => setMulai(e.target.value)} className={inputCls} />
          </Kolom>
          {mulai && (
            <p className="text-xs text-muted-foreground">
              Dikembalikan <b className="text-foreground">{tglIndo(selesai)}</b> pukul {jam} — hitungan {totalHari} × 24 jam.
            </p>
          )}

          <div className="flex gap-2">
            {(
              [
                ["tidak", "Ambil sendiri"],
                ["antar", "Antar saja"],
                ["pp", "Antar + jemput"],
              ] as const
            ).map(([k, t]) => (
              <button
                key={k}
                onClick={() => setAntar(k)}
                className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold ${
                  antar === k ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {antar !== "tidak" && (
            <>
              <Kolom label="Alamat pengantaran">
                <input value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Jalan, patokan terdekat" className={inputCls} />
              </Kolom>
              <Kolom label="Jarak dari Rawamangun (km)">
                <input type="number" min={0} value={jarak} onChange={(e) => setJarak(e.target.value)} placeholder="mis. 7" className={inputCls} />
              </Kolom>
              <p className="text-xs text-muted-foreground">
                {rp(ongkirKm)}/km{antar === "pp" ? " × 2 (pergi–pulang)" : ""}. Admin mengecek ulang jaraknya.
              </p>
            </>
          )}

          <Kolom label="Catatan (opsional)">
            <input
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="mis. butuh dipasangkan aplikasi ujian"
              className={inputCls}
            />
          </Kolom>

          <div className="rounded-xl border-2 border-dashed border-border p-4">
            <Baris label={`${u.nama} · ${n} ${tipe}`} nilai={hargaSewa} />
            {antar !== "tidak" && <Baris label={`Antar${antar === "pp" ? " + jemput" : ""} ${km} km`} nilai={hargaAntar} />}
            <div className="mt-2 flex items-baseline justify-between border-t border-border pt-2">
              <span className="text-sm font-semibold text-muted-foreground">TOTAL</span>
              <span className="font-serif text-2xl text-foreground">{rp(total)}</span>
            </div>
          </div>

          <button
            onClick={kirim}
            disabled={sibuk}
            className="w-full rounded-xl bg-primary px-4 py-3.5 font-semibold text-primary-foreground disabled:opacity-60"
          >
            {sibuk ? "Mengirim…" : "Ajukan pesanan"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Pesanan dikonfirmasi admin dulu. Pelunasan sebelum unit diserahkan.
          </p>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function Kolom({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Baris({ label, nilai }: { label: string; nilai: number }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex-1 border-b border-dotted border-border" />
      <span className="text-foreground">{rp(nilai)}</span>
    </div>
  );
}

/* ---------------- Riwayat pesanan ---------------- */

function DaftarPesanan({ pesanan }: { pesanan: Pesanan[] }) {
  if (!pesanan.length) return null;
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <h2 className="font-serif text-xl text-foreground">Pesananmu</h2>
      <ul className="mt-3 space-y-2">
        {pesanan.map((p) => (
          <li key={p.id} className="rounded-xl border border-border p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{p.unit?.nama || p.unit_id}</p>
                <p className="text-xs text-muted-foreground">
                  {tglIndo(p.mulai)} → {tglIndo(p.selesai)} · pukul {p.jam}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{rp(p.total)}</p>
                <span className="text-xs capitalize text-muted-foreground">{p.status}</span>
              </div>
            </div>
            {p.catatan_admin && (
              <p className="mt-2 rounded-lg bg-secondary px-3 py-2 text-xs text-foreground">
                <span className="font-semibold">Admin: </span>
                {p.catatan_admin}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
