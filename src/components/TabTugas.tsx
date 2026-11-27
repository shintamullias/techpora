import { Fragment, useEffect, useMemo, useState } from "react";
import {
  supabase, tglHariIndo, waLink, gcalLinkTugas, JENIS_TUGAS,
  type Tugas, type Pic, type Pesanan, type StatusTugas, type JenisTugas,
} from "@/lib/supabase";

const inp =
  "w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const ICS = `${import.meta.env.VITE_SUPABASE_URL ?? "https://deegpogdpdhyzprjjksc.supabase.co"}/functions/v1/kalender-ics`;

function Kol({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

/* Pending → In Progress → (Waiting) → Completed */
const STATUS: { k: StatusTugas; t: string; w: string }[] = [
  { k: "menunggu", t: "Pending", w: "bg-amber-100 text-amber-800" },
  { k: "dikerjakan", t: "Dikerjakan", w: "bg-blue-100 text-blue-800" },
  { k: "tertunda", t: "Tertunda", w: "bg-violet-100 text-violet-800" },
  { k: "selesai", t: "Selesai", w: "bg-emerald-100 text-emerald-800" },
  { k: "batal", t: "Batal", w: "bg-slate-100 text-slate-500" },
];
const ST = Object.fromEntries(STATUS.map((s) => [s.k, s]));
const PRIORITAS: Record<string, [string, string]> = { tinggi: ["Tinggi", "text-rose-600"], normal: ["Normal", "text-slate-500"], rendah: ["Rendah", "text-slate-400"] };
const AKTIF = ["menunggu", "dikerjakan", "tertunda"];
const kiniWIB = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 16);
const tenggat = (t: Tugas) => `${t.jatuh_tempo}T${(t.jam || "23:59").slice(0, 5)}`;
export const tugasTelat = (t: Tugas) => AKTIF.includes(t.status) && tenggat(t) < kiniWIB();

export default function TabTugas({
  tugas, pic, pesanan, muat, setGalat, bukaAwal, habisBuka,
}: {
  tugas: Tugas[]; pic: Pic[]; pesanan: Pesanan[]; muat: () => void; setGalat: (s: string) => void;
  bukaAwal?: boolean; habisBuka?: () => void;
}) {
  const [saring, setSaring] = useState<"aktif" | "telat" | StatusTugas>("aktif");
  const [fPic, setFPic] = useState("");
  const [fJenis, setFJenis] = useState("");
  const [buka, setBuka] = useState(!!bukaAwal);
  useEffect(() => { if (bukaAwal) { setBuka(true); habisBuka?.(); } }, [bukaAwal]); // eslint-disable-line react-hooks/exhaustive-deps
  const kosong = {
    judul: "", jenis: "serah_terima" as JenisTugas, pic_id: "", pesanan_id: "", prioritas: "normal",
    jatuh_tempo: kiniWIB().slice(0, 10), jam: "09:00", deskripsi: "",
  };
  const [f, setF] = useState(kosong);
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const [buktiUrl, setBuktiUrl] = useState<Record<string, string>>({});
  const [sibuk, setSibuk] = useState("");

  const nTelat = tugas.filter(tugasTelat).length;
  const tampil = useMemo(() => {
    const urut = [...tugas].sort((a, b) => tenggat(a).localeCompare(tenggat(b)));
    return urut.filter((t) =>
      (saring === "aktif" ? AKTIF.includes(t.status) : saring === "telat" ? tugasTelat(t) : t.status === saring) &&
      (!fPic || (fPic === "-" ? !t.pic_id : t.pic_id === fPic)) && (!fJenis || t.jenis === fJenis));
  }, [tugas, saring, fPic, fJenis]);

  const simpan = async () => {
    if (!f.judul.trim()) return setGalat("Judul tugas wajib diisi.");
    setGalat("");
    const pes = pesanan.find((p) => p.id === f.pesanan_id);
    const { error } = await supabase.from("tugas").insert({
      judul: f.judul.trim(), jenis: f.jenis, pic_id: f.pic_id || null, pesanan_id: f.pesanan_id || null,
      pelanggan_id: pes?.pelanggan_id || null, unit_id: pes?.unit_id || null,
      jatuh_tempo: f.jatuh_tempo, jam: f.jam ? f.jam + ":00" : null, deskripsi: f.deskripsi.trim() || null,
      status: "menunggu", prioritas: f.prioritas,
    });
    if (error) return setGalat(error.message);
    setF(kosong); setBuka(false); muat();
  };

  const ubah = async (t: Tugas, isi: Partial<Tugas>) => {
    setGalat("");
    const { error } = await supabase.from("tugas").update(isi).eq("id", t.id);
    if (error) return setGalat(error.message);
    muat();
  };

  const hapus = async (t: Tugas) => {
    if (!confirm("Hapus tugas ini?")) return;
    const { error } = await supabase.from("tugas").delete().eq("id", t.id);
    if (error) return setGalat(error.message);
    muat();
  };

  const unggahBukti = async (t: Tugas, files: FileList | null) => {
    if (!files?.length) return;
    setSibuk(t.id);
    const baru: string[] = [];
    for (const file of Array.from(files)) {
      const path = `tugas/${t.id}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${(file.name.split(".").pop() || "jpg").toLowerCase()}`;
      const { error } = await supabase.storage.from("dokumen").upload(path, file, { contentType: file.type || undefined });
      if (error) { setGalat(error.message); break; }
      baru.push(path);
    }
    setSibuk("");
    if (baru.length) ubah(t, { bukti: [...(t.bukti || []), ...baru] });
  };
  const lihatBukti = async (path: string) => {
    if (buktiUrl[path]) return window.open(buktiUrl[path], "_blank");
    const { data, error } = await supabase.storage.from("dokumen").createSignedUrl(path, 600);
    if (error) return setGalat(error.message);
    setBuktiUrl((u) => ({ ...u, [path]: data.signedUrl }));
    window.open(data.signedUrl, "_blank");
  };

  return (
    <>
      {nTelat > 0 && (
        <button onClick={() => setSaring("telat")} className="mb-3 block w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm font-semibold text-rose-800">
          ⚠ {nTelat} tugas lewat tenggat — ketuk untuk lihat
        </button>
      )}

      <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Tugas <span className="text-sm font-normal text-muted-foreground">({tugas.filter((t) => AKTIF.includes(t.status)).length} aktif)</span></h2>
          <button onClick={() => setBuka((b) => !b)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">{buka ? "Tutup" : "+ Tugas"}</button>
        </div>

        {buka && (
          <div className="mb-4 space-y-3 rounded-lg border border-border bg-slate-50 p-3">
            <Kol label="Judul"><input className={inp} value={f.judul} onChange={(e) => s("judul", e.target.value)} placeholder="mis. Cek baterai TP-02" /></Kol>
            <div className="grid grid-cols-2 gap-3">
              <Kol label="Jenis">
                <select className={inp} value={f.jenis} onChange={(e) => s("jenis", e.target.value)}>
                  {JENIS_TUGAS.map((j) => <option key={j.key} value={j.key}>{j.label}</option>)}
                </select>
              </Kol>
              <Kol label="Prioritas">
                <select className={inp} value={f.prioritas} onChange={(e) => s("prioritas", e.target.value)}>
                  <option value="tinggi">Tinggi</option><option value="normal">Normal</option><option value="rendah">Rendah</option>
                </select>
              </Kol>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Kol label="PIC">
                <select className={inp} value={f.pic_id} onChange={(e) => s("pic_id", e.target.value)}>
                  <option value="">— pilih —</option>
                  {pic.filter((p) => p.aktif).map((p) => <option key={p.id} value={p.id}>{p.nama}{p.kategori && p.kategori !== "semua" ? ` (${p.kategori})` : ""}</option>)}
                </select>
              </Kol>
              <Kol label="Pesanan terkait">
                <select className={inp} value={f.pesanan_id} onChange={(e) => s("pesanan_id", e.target.value)}>
                  <option value="">— tanpa pesanan —</option>
                  {pesanan.slice(0, 60).map((p) => <option key={p.id} value={p.id}>{p.pelanggan?.nama || "?"} — {p.unit_id} ({tglHariIndo(p.mulai)})</option>)}
                </select>
              </Kol>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Kol label="Tenggat"><input type="date" className={inp} value={f.jatuh_tempo} onChange={(e) => s("jatuh_tempo", e.target.value)} /></Kol>
              <Kol label="Jam"><input type="time" className={inp} value={f.jam} onChange={(e) => s("jam", e.target.value)} /></Kol>
            </div>
            <Kol label="Catatan"><input className={inp} value={f.deskripsi} onChange={(e) => s("deskripsi", e.target.value)} /></Kol>
            <button onClick={simpan} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:opacity-90">Simpan tugas</button>
          </div>
        )}

        <div className="mb-2 flex gap-1.5 overflow-x-auto pb-0.5">
          {([["aktif", "Aktif"], ["telat", `Telat${nTelat ? ` (${nTelat})` : ""}`], ["menunggu", "Pending"], ["dikerjakan", "Dikerjakan"], ["tertunda", "Tertunda"], ["selesai", "Selesai"]] as const).map(([k, t]) => (
            <button key={k} onClick={() => setSaring(k as typeof saring)}
              className={"shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold " + (saring === k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600")}>{t}</button>
          ))}
        </div>
        <div className="mb-3 grid grid-cols-2 gap-2">
          <select className={inp + " py-2 text-sm"} value={fPic} onChange={(e) => setFPic(e.target.value)}>
            <option value="">Semua PIC</option><option value="-">Belum ada PIC</option>
            {pic.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
          </select>
          <select className={inp + " py-2 text-sm"} value={fJenis} onChange={(e) => setFJenis(e.target.value)}>
            <option value="">Semua jenis</option>
            {JENIS_TUGAS.map((j) => <option key={j.key} value={j.key}>{j.label}</option>)}
          </select>
        </div>

        {tampil.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Tidak ada tugas di saringan ini.</p>}

        <ul className="space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
          {tampil.map((t) => {
            const telat = tugasTelat(t);
            const [pt, pw] = PRIORITAS[t.prioritas] || PRIORITAS.normal;
            return (
              <li key={t.id} className={"rounded-xl border p-3 " + (telat ? "border-rose-200 bg-rose-50/60" : "border-slate-200 bg-white")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-muted-foreground">{JENIS_TUGAS.find((j) => j.key === t.jenis)?.label || t.jenis} · <span className={pw}>{pt}</span></p>
                    <p className="text-sm font-semibold leading-snug text-slate-900">{t.judul}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tglHariIndo(t.jatuh_tempo)}{t.jam ? " · " + t.jam.slice(0, 5) : ""}
                      {telat && <b className="text-rose-600"> · TELAT</b>}
                      {t.selesai_pada && <> · selesai {new Date(t.selesai_pada).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</>}
                    </p>
                    {t.deskripsi && <p className="mt-1 text-xs text-slate-600">{t.deskripsi}</p>}
                  </div>
                  <span className={"shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold " + (ST[t.status]?.w || "")}>{ST[t.status]?.t || t.status}</span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <select className={inp + " py-1.5 text-xs"} value={t.pic_id || ""} onChange={(e) => ubah(t, { pic_id: e.target.value || null })} aria-label="PIC">
                    <option value="">PIC: belum ada</option>
                    {pic.filter((p) => p.aktif || p.id === t.pic_id).map((p) => <option key={p.id} value={p.id}>PIC: {p.nama}</option>)}
                  </select>
                  <select className={inp + " py-1.5 text-xs"} value={t.prioritas} onChange={(e) => ubah(t, { prioritas: e.target.value as Tugas["prioritas"] })} aria-label="Prioritas">
                    <option value="tinggi">Prioritas tinggi</option><option value="normal">Prioritas normal</option><option value="rendah">Prioritas rendah</option>
                  </select>
                </div>

                {(t.bukti || []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(t.bukti || []).map((b, i) => <button key={b} onClick={() => lihatBukti(b)} className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">📎 Bukti {i + 1}</button>)}
                  </div>
                )}

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {t.status === "menunggu" && <button onClick={() => ubah(t, { status: "dikerjakan" })} className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white">Mulai</button>}
                  {(t.status === "menunggu" || t.status === "dikerjakan") && <button onClick={() => ubah(t, { status: "tertunda" })} className="rounded-lg border border-violet-200 px-2.5 py-1.5 text-xs font-semibold text-violet-700">Tunda</button>}
                  {t.status === "tertunda" && <button onClick={() => ubah(t, { status: "dikerjakan" })} className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white">Lanjutkan</button>}
                  {AKTIF.includes(t.status) && (
                    <button onClick={() => { if ((t.bukti || []).length || confirm("Belum ada bukti pekerjaan. Tetap tandai selesai?")) ubah(t, { status: "selesai" }); }}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white">✓ Selesai</button>
                  )}
                  {t.status === "selesai" && <button onClick={() => ubah(t, { status: "menunggu" })} className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate-600">Buka lagi</button>}
                  <label className="cursor-pointer rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                    {sibuk === t.id ? "Mengunggah…" : "📷 Bukti"}
                    <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => unggahBukti(t, e.target.files)} />
                  </label>
                  <a href={gcalLinkTugas(t)} target="_blank" rel="noreferrer" className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate-700">📅</a>
                  {t.pelanggan?.wa && <a href={waLink(t.pelanggan.wa)} target="_blank" rel="noreferrer" className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-emerald-700">WA</a>}
                  <button onClick={() => hapus(t)} className="ml-auto rounded-lg px-2 py-1.5 text-xs text-rose-500">Hapus</button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <KinerjaPic tugas={tugas} pic={pic} />
      <DaftarPic pic={pic} muat={muat} setGalat={setGalat} />
    </>
  );
}

/* ---------- kinerja & riwayat aktivitas PIC ---------- */
function KinerjaPic({ tugas, pic }: { tugas: Tugas[]; pic: Pic[] }) {
  const [buka, setBuka] = useState("");
  const dari = new Date(Date.now() - 30 * 864e5).toISOString();
  const baris = pic.map((p) => {
    const milik = tugas.filter((t) => t.pic_id === p.id);
    const selesai30 = milik.filter((t) => t.status === "selesai" && (t.selesai_pada || "") >= dari);
    const tepat = selesai30.filter((t) => t.selesai_pada && new Date(t.selesai_pada).getTime() <= Date.parse(`${tenggat(t)}:00+07:00`) + 60000);
    return {
      p, aktif: milik.filter((t) => AKTIF.includes(t.status)).length, telat: milik.filter(tugasTelat).length,
      selesai: selesai30.length, tepat: selesai30.length ? Math.round((tepat.length / selesai30.length) * 100) : null,
      riwayat: milik.filter((t) => t.selesai_pada).sort((a, b) => (b.selesai_pada || "").localeCompare(a.selesai_pada || "")).slice(0, 10),
    };
  });
  return (
    <section className="mt-4 rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-base font-semibold text-slate-900">Kinerja PIC <span className="text-xs font-normal text-muted-foreground">· 30 hari terakhir</span></h2>
      <div className="-mx-4 mt-2 overflow-x-auto sm:-mx-5">
        <table className="w-full min-w-[460px] text-sm">
          <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="px-4 py-2 font-medium sm:px-5">PIC</th><th className="px-2 py-2 text-right font-medium">Aktif</th>
            <th className="px-2 py-2 text-right font-medium">Telat</th><th className="px-2 py-2 text-right font-medium">Selesai</th>
            <th className="px-4 py-2 text-right font-medium sm:px-5">Tepat waktu</th>
          </tr></thead>
          <tbody>
            {baris.map((b) => (
              <Fragment key={b.p.id}>
                <tr key={b.p.id} onClick={() => setBuka(buka === b.p.id ? "" : b.p.id)} className="cursor-pointer border-b border-border/60 hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium sm:px-5">{b.p.nama}{!b.p.aktif && <span className="text-xs text-muted-foreground"> (nonaktif)</span>} <span className="text-xs text-muted-foreground">{buka === b.p.id ? "▴" : "▾"}</span></td>
                  <td className="px-2 py-2 text-right tabular-nums">{b.aktif}</td>
                  <td className={"px-2 py-2 text-right tabular-nums " + (b.telat ? "font-semibold text-rose-600" : "")}>{b.telat}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{b.selesai}</td>
                  <td className={"px-4 py-2 text-right tabular-nums sm:px-5 " + (b.tepat == null ? "text-muted-foreground" : b.tepat >= 80 ? "text-emerald-600" : "text-amber-600")}>{b.tepat == null ? "—" : `${b.tepat}%`}</td>
                </tr>
                {buka === b.p.id && (
                  <tr key={b.p.id + "-r"}><td colSpan={5} className="bg-slate-50 px-4 py-2 sm:px-5">
                    {b.riwayat.length ? (
                      <ul className="space-y-1 text-xs text-slate-600">
                        {b.riwayat.map((t) => <li key={t.id}>✓ {t.judul} · {new Date(t.selesai_pada!).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</li>)}
                      </ul>
                    ) : <p className="text-xs text-muted-foreground">Belum ada tugas selesai.</p>}
                  </td></tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- kelola PIC ---------- */
function DaftarPic({ pic, muat, setGalat }: { pic: Pic[]; muat: () => void; setGalat: (s: string) => void }) {
  const [buka, setBuka] = useState(false);
  const [f, setF] = useState({ nama: "", email: "", wa: "", kategori: "semua" });

  const tambah = async () => {
    if (!f.nama.trim()) return setGalat("Nama PIC wajib diisi.");
    const { error } = await supabase.from("pic").insert({ nama: f.nama.trim(), email: f.email.trim() || null, wa: f.wa.trim() || null, kategori: f.kategori, aktif: true });
    if (error) return setGalat(error.message);
    setF({ nama: "", email: "", wa: "", kategori: "semua" }); setBuka(false); muat();
  };
  const ubah = async (p: Pic, isi: Partial<Pic>) => {
    const { error } = await supabase.from("pic").update(isi).eq("id", p.id);
    if (error) return setGalat(error.message);
    muat();
  };

  return (
    <section className="mt-4 rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">PIC</h2>
        <button onClick={() => setBuka((b) => !b)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-700">{buka ? "Tutup" : "+ PIC"}</button>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">Tugas serah terima, pengembalian, cek unit, dan maintenance otomatis diberikan ke PIC sesuai kategori unit (laptop/sepatu). Tiap PIC punya tautan kalender sendiri: tugasnya muncul di Google Calendar HP-nya dengan pengingat 1 jam sebelumnya.</p>

      {buka && (
        <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg border border-border bg-slate-50 p-3">
          <Kol label="Nama"><input className={inp} value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} /></Kol>
          <Kol label="Kategori">
            <select className={inp} value={f.kategori} onChange={(e) => setF({ ...f, kategori: e.target.value })}>
              <option value="semua">Semua</option><option value="laptop">Laptop</option><option value="sepatu">Sepatu</option>
            </select>
          </Kol>
          <Kol label="Email Google"><input className={inp} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Kol>
          <Kol label="No. WA"><input className={inp} value={f.wa} onChange={(e) => setF({ ...f, wa: e.target.value })} /></Kol>
          <button onClick={tambah} className="col-span-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">Simpan PIC</button>
        </div>
      )}

      <ul className="space-y-2.5">
        {pic.map((p) => {
          const feed = p.ics_token ? `${ICS}?p=${p.ics_token}` : "";
          return (
            <li key={p.id} className={"rounded-xl border border-border p-3 " + (p.aktif ? "" : "opacity-60")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{p.nama}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.email || "tanpa email"}{p.wa ? ` · ${p.wa}` : ""}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <select className="rounded-lg border border-border px-2 py-1 text-xs" value={p.kategori || "semua"} onChange={(e) => ubah(p, { kategori: e.target.value })}>
                    <option value="semua">Semua</option><option value="laptop">Laptop</option><option value="sepatu">Sepatu</option>
                  </select>
                  <button onClick={() => ubah(p, { aktif: !p.aktif })} className="rounded-lg border border-border px-2 py-1 text-xs font-semibold text-slate-600">{p.aktif ? "Nonaktifkan" : "Aktifkan"}</button>
                </div>
              </div>
              {feed && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button onClick={() => navigator.clipboard?.writeText(feed)} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700">📅 Salin tautan kalender</button>
                  {p.wa && (
                    <a href={waLink(p.wa, `Halo ${p.nama}, ini kalender tugas Techpora kamu. Buka calendar.google.com di laptop → Kalender lain → + → Dari URL → tempel tautan ini:\n\n${feed}\n\nTugas baru akan muncul otomatis dengan pengingat 1 jam sebelumnya.`)}
                      target="_blank" rel="noreferrer" className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">Kirim ke WA PIC</a>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
