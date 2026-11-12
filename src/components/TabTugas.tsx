import { useMemo, useState } from "react";
import {
  supabase, tglHariIndo, waLink, gcalLinkTugas, JENIS_TUGAS,
  type Tugas, type Pic, type Pesanan, type StatusTugas, type JenisTugas,
} from "@/lib/supabase";

const inp =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function Kol({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const WARNA_STATUS: Record<string, string> = {
  menunggu: "bg-amber-100 text-amber-800",
  dikerjakan: "bg-blue-100 text-blue-800",
  selesai: "bg-emerald-100 text-emerald-800",
  batal: "bg-slate-100 text-slate-500",
};
const LABEL_STATUS: Record<string, string> = {
  menunggu: "Menunggu", dikerjakan: "Dikerjakan", selesai: "Selesai", batal: "Batal",
};

export default function TabTugas({
  tugas, pic, pesanan, muat, setGalat,
}: {
  tugas: Tugas[]; pic: Pic[]; pesanan: Pesanan[]; muat: () => void; setGalat: (s: string) => void;
}) {
  const [saring, setSaring] = useState<"aktif" | StatusTugas>("aktif");
  const [buka, setBuka] = useState(false);
  const kosong = {
    judul: "", jenis: "serah_terima" as JenisTugas, pic_id: "", pesanan_id: "",
    jatuh_tempo: new Date().toISOString().slice(0, 10), jam: "09:00", deskripsi: "",
  };
  const [f, setF] = useState(kosong);
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const tampil = useMemo(() => {
    const urut = [...tugas].sort((a, b) => (a.jatuh_tempo + (a.jam || "")).localeCompare(b.jatuh_tempo + (b.jam || "")));
    if (saring === "aktif") return urut.filter((t) => t.status === "menunggu" || t.status === "dikerjakan");
    return urut.filter((t) => t.status === saring);
  }, [tugas, saring]);

  const nAktif = tugas.filter((t) => t.status === "menunggu" || t.status === "dikerjakan").length;

  const simpan = async () => {
    if (!f.judul.trim()) return setGalat("Judul tugas wajib diisi.");
    setGalat("");
    const pes = pesanan.find((p) => p.id === f.pesanan_id);
    const { error } = await supabase.from("tugas").insert({
      judul: f.judul.trim(),
      jenis: f.jenis,
      pic_id: f.pic_id || null,
      pesanan_id: f.pesanan_id || null,
      pelanggan_id: pes?.pelanggan_id || null,
      unit_id: pes?.unit_id || null,
      jatuh_tempo: f.jatuh_tempo,
      jam: f.jam ? f.jam + ":00" : null,
      deskripsi: f.deskripsi.trim() || null,
      status: "menunggu",
      prioritas: "normal",
    });
    if (error) return setGalat(error.message);
    setF(kosong); setBuka(false); muat();
  };

  const ubahStatus = async (t: Tugas, status: StatusTugas) => {
    setGalat("");
    const { error } = await supabase.from("tugas").update({ status }).eq("id", t.id);
    if (error) return setGalat(error.message);
    muat();
  };

  const hapus = async (t: Tugas) => {
    if (!confirm("Hapus tugas ini?")) return;
    const { error } = await supabase.from("tugas").delete().eq("id", t.id);
    if (error) return setGalat(error.message);
    muat();
  };

  return (
    <>
      {/* ---------- daftar tugas ---------- */}
      <section className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl text-slate-900">Tugas <span className="text-sm font-normal text-muted-foreground">({nAktif} aktif)</span></h2>
          <button onClick={() => setBuka((b) => !b)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white">
            {buka ? "Tutup" : "+ Tugas"}
          </button>
        </div>

        {buka && (
          <div className="mb-4 space-y-3 rounded-xl border border-border bg-[#F8FAFC] p-3">
            <Kol label="Judul"><input className={inp} value={f.judul} onChange={(e) => s("judul", e.target.value)} placeholder="mis. Serah terima MacBook — Budi" /></Kol>
            <div className="grid grid-cols-2 gap-3">
              <Kol label="Jenis">
                <select className={inp} value={f.jenis} onChange={(e) => s("jenis", e.target.value)}>
                  {JENIS_TUGAS.map((j) => <option key={j.key} value={j.key}>{j.label}</option>)}
                </select>
              </Kol>
              <Kol label="PIC">
                <select className={inp} value={f.pic_id} onChange={(e) => s("pic_id", e.target.value)}>
                  <option value="">— pilih —</option>
                  {pic.filter((p) => p.aktif).map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
                </select>
              </Kol>
            </div>
            <Kol label="Pesanan terkait (opsional)">
              <select className={inp} value={f.pesanan_id} onChange={(e) => s("pesanan_id", e.target.value)}>
                <option value="">— tanpa pesanan —</option>
                {pesanan.slice(0, 40).map((p) => (
                  <option key={p.id} value={p.id}>{p.pelanggan?.nama || "?"} — {p.unit?.nama || p.unit_id} ({tglHariIndo(p.mulai)})</option>
                ))}
              </select>
            </Kol>
            <div className="grid grid-cols-2 gap-3">
              <Kol label="Tanggal"><input type="date" className={inp} value={f.jatuh_tempo} onChange={(e) => s("jatuh_tempo", e.target.value)} /></Kol>
              <Kol label="Jam"><input type="time" className={inp} value={f.jam} onChange={(e) => s("jam", e.target.value)} /></Kol>
            </div>
            <Kol label="Catatan (opsional)"><input className={inp} value={f.deskripsi} onChange={(e) => s("deskripsi", e.target.value)} /></Kol>
            <button onClick={simpan} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">Simpan tugas</button>
          </div>
        )}

        {/* saringan status */}
        <div className="mb-3 flex gap-1.5 overflow-x-auto pb-0.5">
          {([["aktif", "Aktif"], ["selesai", "Selesai"], ["menunggu", "Menunggu"], ["dikerjakan", "Dikerjakan"]] as const).map(([k, t]) => (
            <button key={k} onClick={() => setSaring(k)}
              className={"shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition " +
                (saring === k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600")}>
              {t}
            </button>
          ))}
        </div>

        {tampil.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Tidak ada tugas di saringan ini.</p>}

        <ul className="space-y-2.5">
          {tampil.map((t) => {
            const telat = t.status !== "selesai" && t.status !== "batal" && t.jatuh_tempo < new Date().toISOString().slice(0, 10);
            return (
              <li key={t.id} className={"rounded-xl border p-3 " + (telat ? "border-red-200 bg-red-50/60" : "border-slate-200 bg-white")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-slate-900">{t.judul}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tglHariIndo(t.jatuh_tempo)}{t.jam ? " · " + t.jam.slice(0, 5) : ""}
                      {t.pic?.nama ? <> · PIC <b className="text-slate-700">{t.pic.nama}</b></> : null}
                      {telat && <b className="text-red-600"> · TELAT</b>}
                    </p>
                  </div>
                  <span className={"shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold " + (WARNA_STATUS[t.status] || "")}>
                    {LABEL_STATUS[t.status] || t.status}
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {t.status === "menunggu" && (
                    <button onClick={() => ubahStatus(t, "dikerjakan")} className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white">Mulai</button>
                  )}
                  {(t.status === "menunggu" || t.status === "dikerjakan") && (
                    <button onClick={() => ubahStatus(t, "selesai")} className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white">✓ Selesai</button>
                  )}
                  {t.status === "selesai" && (
                    <button onClick={() => ubahStatus(t, "menunggu")} className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate-600">Buka lagi</button>
                  )}
                  <a href={gcalLinkTugas(t)} target="_blank" rel="noreferrer"
                    className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                    📅 Kalender{t.pic?.email ? "" : " (PIC tanpa email)"}
                  </a>
                  {t.pelanggan?.wa && (
                    <a href={waLink(t.pelanggan.wa)} target="_blank" rel="noreferrer"
                      className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-emerald-700">WA pelanggan</a>
                  )}
                  <button onClick={() => hapus(t)} className="ml-auto rounded-lg px-2 py-1.5 text-xs text-red-500">Hapus</button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <DaftarPic pic={pic} muat={muat} setGalat={setGalat} />
    </>
  );
}

/* ---------- kelola PIC ---------- */
function DaftarPic({ pic, muat, setGalat }: { pic: Pic[]; muat: () => void; setGalat: (s: string) => void }) {
  const [buka, setBuka] = useState(false);
  const [f, setF] = useState({ nama: "", email: "", wa: "" });
  const [ubahId, setUbahId] = useState("");
  const [ubahEmail, setUbahEmail] = useState("");

  const tambah = async () => {
    if (!f.nama.trim()) return setGalat("Nama PIC wajib diisi.");
    setGalat("");
    const { error } = await supabase.from("pic").insert({
      nama: f.nama.trim(), email: f.email.trim() || null, wa: f.wa.trim() || null, aktif: true,
    });
    if (error) return setGalat(error.message);
    setF({ nama: "", email: "", wa: "" }); setBuka(false); muat();
  };

  const simpanEmail = async (id: string) => {
    setGalat("");
    const { error } = await supabase.from("pic").update({ email: ubahEmail.trim() || null }).eq("id", id);
    if (error) return setGalat(error.message);
    setUbahId(""); muat();
  };

  const toggleAktif = async (p: Pic) => {
    const { error } = await supabase.from("pic").update({ aktif: !p.aktif }).eq("id", p.id);
    if (error) return setGalat(error.message);
    muat();
  };

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-xl text-slate-900">PIC</h2>
        <button onClick={() => setBuka((b) => !b)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white">
          {buka ? "Tutup" : "+ PIC"}
        </button>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        PIC yang punya email Gmail otomatis ikut diundang saat tugas disimpan ke Google Calendar.
      </p>

      {buka && (
        <div className="mb-4 space-y-3 rounded-xl border border-border bg-[#F8FAFC] p-3">
          <Kol label="Nama"><input className={inp} value={f.nama} onChange={(e) => setF((p) => ({ ...p, nama: e.target.value }))} /></Kol>
          <Kol label="Email (untuk Google Calendar)"><input type="email" className={inp} value={f.email} onChange={(e) => setF((p) => ({ ...p, email: e.target.value }))} placeholder="nama@gmail.com" /></Kol>
          <Kol label="No. WA"><input className={inp} value={f.wa} onChange={(e) => setF((p) => ({ ...p, wa: e.target.value }))} /></Kol>
          <button onClick={tambah} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">Simpan PIC</button>
        </div>
      )}

      <ul className="space-y-2.5">
        {pic.map((p) => (
          <li key={p.id} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{p.nama} {!p.aktif && <span className="text-xs font-normal text-slate-400">(nonaktif)</span>}</p>
                {ubahId === p.id ? (
                  <div className="mt-1.5 flex gap-1.5">
                    <input type="email" className={inp + " !py-1.5 text-sm"} value={ubahEmail} onChange={(e) => setUbahEmail(e.target.value)} placeholder="nama@gmail.com" />
                    <button onClick={() => simpanEmail(p.id)} className="shrink-0 rounded-lg bg-primary px-3 text-xs font-semibold text-white">OK</button>
                  </div>
                ) : (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.email || <b className="text-amber-600">belum ada email</b>}{p.wa ? " · " + p.wa : ""}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button onClick={() => { setUbahId(ubahId === p.id ? "" : p.id); setUbahEmail(p.email || ""); }}
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate-600">Email</button>
                <button onClick={() => toggleAktif(p)}
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate-600">{p.aktif ? "Nonaktifkan" : "Aktifkan"}</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
