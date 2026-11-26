import { useMemo, useRef, useState } from "react";
import { supabase, rp, tglIndo, waLink, waktuPesanan, pesanGalat, type Pesanan, type Unit, type Tugas, type Pic } from "@/lib/supabase";

/* Kalender sewa: satu baris per unit. Tampilan harian (per jam), mingguan, bulanan.
   Blok bisa digeser (drag) untuk memindah jadwal atau unit; database menolak bila bentrok/maintenance. */

export type Maintenance = { id: string; unit_id: string; mulai: string; selesai: string; catatan: string | null };
type Mode = "hari" | "minggu" | "bulan";

const TINGGI_LAJUR = 46;
const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BLOK: Record<string, string> = {
  menunggu: "border-2 border-dashed border-slate-400 bg-slate-100 text-slate-700",
  dipesan: "bg-indigo-500 text-white",
  berjalan: "bg-sky-500 text-white",
  selesai: "bg-emerald-500 text-white",
};
const LABEL_STATUS: Record<string, string> = { menunggu: "Menunggu Konfirmasi", dipesan: "Dikonfirmasi", berjalan: "Berjalan", selesai: "Selesai", batal: "Dibatalkan" };
const GAYA_STATUS: Record<string, string> = {
  menunggu: "bg-slate-100 text-slate-700 ring-slate-500/20",
  dipesan: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  berjalan: "bg-sky-50 text-sky-700 ring-sky-600/20",
  selesai: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  batal: "bg-rose-50 text-rose-700 ring-rose-600/20",
};
const LABEL_BAYAR: Record<string, string> = { lunas: "Lunas", sebagian: "DP", belum: "Belum Bayar", refund: "Refund" };
const GAYA_BAYAR: Record<string, string> = {
  lunas: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  sebagian: "bg-amber-50 text-amber-700 ring-amber-600/20",
  belum: "bg-rose-50 text-rose-700 ring-rose-600/20",
  refund: "bg-violet-50 text-violet-700 ring-violet-600/20",
};
const TITIK_BAYAR: Record<string, string> = { lunas: "bg-emerald-300", sebagian: "bg-amber-300", belum: "bg-rose-400", refund: "bg-violet-300" };

const kiniWIB = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 16);
const tambahMenit = (t: string, m: number) => new Date(Date.parse(t + ":00Z") + m * 60000).toISOString().slice(0, 16);
const tambahHari = (d: string, n: number) => tambahMenit(d + "T00:00", n * 1440).slice(0, 10);
const selisih = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
const labelBulan = (iso: string) => new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
const ringkas = (n: number) => (n >= 1000 ? `Rp${Math.round(n / 1000)}rb` : rp(n));

/** Rentang yang tampil: awal (tanggal), jumlah kolom, menit per kolom, lebar kolom. */
function rentang(mode: Mode, jangkar: string) {
  if (mode === "hari") return { awal: jangkar, kolom: 24, menit: 60, lebar: 46 };
  if (mode === "minggu") {
    const dow = (new Date(jangkar + "T00:00:00Z").getUTCDay() + 6) % 7; // Senin = 0
    return { awal: tambahHari(jangkar, -dow), kolom: 7, menit: 1440, lebar: 112 };
  }
  const awal = jangkar.slice(0, 8) + "01";
  const [y, m] = awal.split("-").map(Number);
  return { awal, kolom: new Date(Date.UTC(y, m, 0)).getUTCDate(), menit: 1440, lebar: 42 };
}

function Lencana({ teks, gaya }: { teks: string; gaya: string }) {
  return (
    <span className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset " + gaya}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{teks}
    </span>
  );
}

function Baris({ label, isi }: { label: string; isi: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">{isi}</span>
    </div>
  );
}

const sel = "rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-primary focus:outline-none min-w-0";

export default function TabKalender({
  pesanan, unit, tugas, pic, maintenance, icsUrl, onBaru, muat, setGalat,
}: {
  pesanan: Pesanan[]; unit: Unit[]; tugas: Tugas[]; pic: Pic[]; maintenance: Maintenance[]; icsUrl: string;
  onBaru: (isi?: { unit_id?: string; mulai?: string }) => void; muat: () => void; setGalat: (s: string) => void;
}) {
  const kini = kiniWIB();
  const hariIni = kini.slice(0, 10);
  const [mode, setMode] = useState<Mode>(() => { try { return (localStorage.getItem("kalender-mode") as Mode) || "bulan"; } catch { return "bulan"; } });
  const [jangkar, setJangkar] = useState(hariIni);
  const [fUnit, setFUnit] = useState("");
  const [fStatus, setFStatus] = useState("aktif");
  const [detail, setDetail] = useState<Pesanan | null>(null);
  const [formMt, setFormMt] = useState<null | { id?: string; unit_id: string; mulai: string; selesai: string; catatan: string }>(null);
  const [bukaIcs, setBukaIcs] = useState(false);
  const geserX = useRef<number | null>(null);

  const [lebarUnit, setLebarUnit] = useState(() => { try { return Number(localStorage.getItem("kalender-lebar-unit")) || 150; } catch { return 150; } });
  const tarik = useRef<{ x: number; w: number } | null>(null);
  const mulaiTarik = (e: React.PointerEvent) => { e.stopPropagation(); e.preventDefault(); tarik.current = { x: e.clientX, w: lebarUnit }; (e.target as HTMLElement).setPointerCapture(e.pointerId); };
  const saatTarik = (e: React.PointerEvent) => { if (!tarik.current) return; e.stopPropagation(); setLebarUnit(Math.min(360, Math.max(110, tarik.current.w + e.clientX - tarik.current.x))); };
  const selesaiTarik = (e: React.PointerEvent) => { e.stopPropagation(); tarik.current = null; try { localStorage.setItem("kalender-lebar-unit", String(lebarUnit)); } catch { /* abaikan */ } };

  const R = rentang(mode, jangkar);
  const awalT = R.awal + "T00:00";
  const akhirT = tambahMenit(awalT, R.kolom * R.menit);
  const lebarTotal = R.kolom * R.lebar;
  const posisi = (t: string) => ((Date.parse(t + ":00Z") - Date.parse(awalT + ":00Z")) / 60000 / R.menit) * R.lebar;
  const kolomTgl = (i: number) => (mode === "hari" ? R.awal : tambahHari(R.awal, i));

  const ganti = (n: number) => setJangkar((j) => mode === "bulan" ? tambahHari(rentang("bulan", j).awal, n > 0 ? 32 : -1).slice(0, 8) + "01" : tambahHari(j, n * (mode === "minggu" ? 7 : 1)));
  const gantiMode = (m: Mode) => { setMode(m); try { localStorage.setItem("kalender-mode", m); } catch { /* abaikan */ } };

  const terlihat = useMemo(() => pesanan.filter((p) => {
    if (p.status === "batal") return false;
    if (fStatus !== "aktif" && p.status !== fStatus) return false;
    if (fUnit && p.unit_id !== fUnit) return false;
    const w = waktuPesanan(p);
    return w.sampai > awalT && w.dari < akhirT;
  }), [pesanan, fStatus, fUnit, awalT, akhirT]);
  const mtTerlihat = maintenance.filter((m) => (!fUnit || m.unit_id === fUnit) && m.selesai >= R.awal && m.mulai < akhirT.slice(0, 10));

  const barisUnit = useMemo(() => unit.filter((u) => (!fUnit || u.id === fUnit) && (u.aktif || terlihat.some((p) => p.unit_id === u.id))), [unit, fUnit, terlihat]);

  const telat = (p: Pesanan) => p.status === "berjalan" && waktuPesanan(p).sampai < kini;
  const sedangMt = (uid: string) => maintenance.some((m) => m.unit_id === uid && m.mulai <= hariIni && m.selesai >= hariIni);

  /* ---------- drag & drop ---------- */
  const seret = useRef<{ p: Pesanan; x: number; y: number; pindah: boolean } | null>(null);
  const [geser, setGeser] = useState<{ id: string; dx: number; dy: number } | null>(null);
  const bisaGeser = (p: Pesanan) => p.status === "menunggu" || p.status === "dipesan";

  const mulaiSeret = (e: React.PointerEvent, p: Pesanan) => {
    e.stopPropagation();
    seret.current = { p, x: e.clientX, y: e.clientY, pindah: false };
    if (bisaGeser(p)) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const saatSeret = (e: React.PointerEvent) => {
    const s = seret.current; if (!s || !bisaGeser(s.p)) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (!s.pindah && Math.hypot(dx, dy) < 8) return;
    s.pindah = true; e.stopPropagation();
    setGeser({ id: s.p.id, dx, dy });
  };
  const selesaiSeret = async (e: React.PointerEvent) => {
    e.stopPropagation();
    const s = seret.current; seret.current = null; setGeser(null);
    if (!s) return;
    if (!s.pindah) { setDetail(s.p); return; }
    const langkah = Math.round((e.clientX - s.x) / R.lebar);
    const menit = langkah * R.menit;
    const baris = [...document.querySelectorAll<HTMLElement>("[data-unit]")].find((el) => { const r = el.getBoundingClientRect(); return e.clientY >= r.top && e.clientY <= r.bottom; });
    const unitBaru = baris?.dataset.unit || s.p.unit_id;
    if (!menit && unitBaru === s.p.unit_id) return;
    const w = waktuPesanan(s.p);
    const dari = tambahMenit(w.dari, menit), sampai = tambahMenit(w.sampai, menit);
    const u = unit.find((x) => x.id === unitBaru);
    if (!confirm(`Pindahkan ${s.p.pelanggan?.nama || "pesanan"} ke ${u?.nama || unitBaru}\n${tglIndo(dari.slice(0, 10))} ${dari.slice(11)} → ${tglIndo(sampai.slice(0, 10))} ${sampai.slice(11)}?`)) return;
    const { error } = await supabase.from("pesanan").update({
      unit_id: unitBaru, mulai: dari.slice(0, 10), jam: dari.slice(11), selesai: sampai.slice(0, 10),
      jam_selesai: s.p.jam_selesai ? sampai.slice(11) : null, total_hari: Math.max(1, selisih(dari.slice(0, 10), sampai.slice(0, 10))),
    }).eq("id", s.p.id);
    if (error) return setGalat(pesanGalat(error.message));
    muat();
  };

  /* ---------- maintenance ---------- */
  const simpanMt = async () => {
    if (!formMt?.unit_id || !formMt.mulai || !formMt.selesai) return setGalat("Isi unit dan tanggal maintenance.");
    const isi = { unit_id: formMt.unit_id, mulai: formMt.mulai, selesai: formMt.selesai, catatan: formMt.catatan.trim() || null };
    const bentrok = pesanan.find((p) => p.unit_id === isi.unit_id && (p.status === "dipesan" || p.status === "berjalan") && p.mulai <= isi.selesai && p.selesai >= isi.mulai);
    if (bentrok && !confirm(`Ada booking ${bentrok.pelanggan?.nama} (${tglIndo(bentrok.mulai)}–${tglIndo(bentrok.selesai)}) di unit ini. Tetap simpan maintenance?`)) return;
    const { error } = formMt.id ? await supabase.from("maintenance").update(isi).eq("id", formMt.id) : await supabase.from("maintenance").insert(isi);
    if (error) return setGalat(error.message);
    setFormMt(null); muat();
  };
  const hapusMt = async (id: string) => {
    if (!confirm("Hapus jadwal maintenance ini?")) return;
    const { error } = await supabase.from("maintenance").delete().eq("id", id);
    if (error) return setGalat(error.message);
    setFormMt(null); muat();
  };

  /* ---------- jadwal ambil & kembali dalam rentang ---------- */
  const jadwal = useMemo(() => {
    const out: { t: string; jenis: "Ambil" | "Kembali"; p: Pesanan }[] = [];
    for (const p of terlihat) {
      if (p.status === "selesai") continue;
      const w = waktuPesanan(p);
      if (w.dari >= awalT && w.dari < akhirT) out.push({ t: w.dari, jenis: "Ambil", p });
      if (w.sampai >= awalT && w.sampai < akhirT) out.push({ t: w.sampai, jenis: "Kembali", p });
    }
    return out.sort((a, b) => a.t.localeCompare(b.t));
  }, [terlihat, awalT, akhirT]);

  const judul = mode === "bulan" ? labelBulan(R.awal) : mode === "minggu" ? `${tglIndo(R.awal)} – ${tglIndo(tambahHari(R.awal, 6))}` : tglIndo(R.awal);
  const xKini = posisi(kini);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => onBaru()} className="rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90">+ Pemesanan baru</button>
        <button onClick={() => setFormMt({ unit_id: fUnit || "", mulai: hariIni, selesai: hariIni, catatan: "" })}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-slate-700">🔧 Jadwal maintenance</button>
        <button onClick={() => setBukaIcs((b) => !b)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-slate-700">📅 Google Calendar</button>
      </div>

      {bukaIcs && (
        <div className="space-y-2 rounded-xl border border-border bg-white p-4 text-sm shadow-sm">
          <p className="font-semibold text-slate-900">Sambungkan ke Google Calendar</p>
          <p className="text-xs text-muted-foreground">Semua jadwal ambil, kembali, dan maintenance otomatis muncul di Google Calendar dan ikut terbarui sendiri (Google menyegarkan berkala, biasanya beberapa jam sekali).</p>
          <div className="flex gap-2">
            <input readOnly value={icsUrl} className="min-w-0 flex-1 rounded-lg border border-border bg-slate-50 px-2.5 py-1.5 text-xs" onFocus={(e) => e.target.select()} />
            <button onClick={() => navigator.clipboard?.writeText(icsUrl)} className="shrink-0 rounded-lg bg-primary px-3 text-xs font-semibold text-white">Salin</button>
          </div>
          <ol className="list-decimal space-y-0.5 pl-5 text-xs text-slate-600">
            <li>Salin tautan di atas. Jangan dibagikan — siapa pun yang punya tautan ini bisa melihat jadwal.</li>
            <li>Buka calendar.google.com di laptop → di kiri, “Kalender lain” → tanda + → “Dari URL”.</li>
            <li>Tempel tautan → “Tambahkan kalender”.</li>
          </ol>
        </div>
      )}

      {formMt && (
        <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">{formMt.id ? "Ubah" : "Tambah"} jadwal maintenance</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <select className={sel} value={formMt.unit_id} onChange={(e) => setFormMt({ ...formMt, unit_id: e.target.value })}>
              <option value="">Pilih unit</option>
              {unit.map((u) => <option key={u.id} value={u.id}>{u.id} · {u.nama}</option>)}
            </select>
            <input className={sel} value={formMt.catatan} placeholder="Catatan (mis. ganti baterai)" onChange={(e) => setFormMt({ ...formMt, catatan: e.target.value })} />
            <input type="date" className={sel} value={formMt.mulai} onChange={(e) => setFormMt({ ...formMt, mulai: e.target.value, selesai: formMt.selesai < e.target.value ? e.target.value : formMt.selesai })} />
            <input type="date" className={sel} value={formMt.selesai} min={formMt.mulai} onChange={(e) => setFormMt({ ...formMt, selesai: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button onClick={simpanMt} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Simpan</button>
            {formMt.id && <button onClick={() => hapusMt(formMt.id!)} className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600">Hapus</button>}
            <button onClick={() => setFormMt(null)} className="ml-auto rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-600">Batal</button>
          </div>
          <p className="text-[11px] text-muted-foreground">Selama maintenance, unit otomatis tidak bisa dikonfirmasi untuk booking.</p>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex cursor-grab touch-pan-y select-none flex-col gap-2.5 border-b border-border px-4 py-3"
          onPointerDown={(e) => { geserX.current = e.clientX; }}
          onPointerUp={(e) => { if (geserX.current == null) return; const dx = e.clientX - geserX.current; if (Math.abs(dx) > 60) ganti(dx < 0 ? 1 : -1); geserX.current = null; }}>
          <div className="flex flex-wrap items-center gap-2" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}>
            <div className="flex rounded-lg border border-border p-0.5">
              {(["hari", "minggu", "bulan"] as Mode[]).map((m) => (
                <button key={m} onClick={() => gantiMode(m)} className={"rounded-md px-3 py-1 text-xs font-semibold capitalize " + (mode === m ? "bg-primary text-white" : "text-slate-600")}>{m === "hari" ? "Harian" : m === "minggu" ? "Mingguan" : "Bulanan"}</button>
              ))}
            </div>
            <button onClick={() => ganti(-1)} aria-label="Sebelumnya" className="rounded-md border border-border px-2 py-1 text-sm">‹</button>
            <span className="min-w-0 text-sm font-semibold capitalize text-slate-900">{judul}</span>
            <button onClick={() => ganti(1)} aria-label="Berikutnya" className="rounded-md border border-border px-2 py-1 text-sm">›</button>
            <input type="date" value={jangkar} onChange={(e) => e.target.value && setJangkar(e.target.value)} className={sel + " w-36"} aria-label="Pilih tanggal" />
            <button onClick={() => setJangkar(hariIni)} className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-slate-100">Hari ini</button>
          </div>
          <div className="flex flex-wrap items-center gap-2" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}>
            <select className={sel} value={fUnit} onChange={(e) => setFUnit(e.target.value)}>
              <option value="">Semua unit</option>
              {unit.map((u) => <option key={u.id} value={u.id}>{u.id} · {u.nama}</option>)}
            </select>
            <select className={sel} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
              <option value="aktif">Semua status</option>
              <option value="menunggu">Menunggu konfirmasi</option>
              <option value="dipesan">Dikonfirmasi</option>
              <option value="berjalan">Berjalan</option>
              <option value="selesai">Selesai</option>
            </select>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm border border-dashed border-slate-400 bg-slate-100" />Menunggu</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />Dikonfirmasi</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-sky-500" />Berjalan</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />Selesai</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[repeating-linear-gradient(45deg,#fbbf24_0_3px,#fef3c7_3px_6px)]" />Maintenance</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm ring-2 ring-rose-500" />Telat/bentrok</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground" onPointerDown={(e) => e.stopPropagation()}>Tekan & geser blok untuk memindah jadwal atau unit (hanya booking yang belum berjalan). Ketuk kolom kosong untuk booking baru.</p>
        </div>

        {barisUnit.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">Tidak ada unit untuk saringan ini.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="flex border-b border-border bg-slate-50">
                <div className="sticky left-0 z-20 flex items-center bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" style={{ width: lebarUnit }}>
                  Unit
                  <span role="separator" aria-label="Geser untuk ubah lebar kolom unit" title="Geser untuk ubah lebar"
                    onPointerDown={mulaiTarik} onPointerMove={saatTarik} onPointerUp={selesaiTarik} onPointerCancel={selesaiTarik}
                    className="absolute right-0 top-0 flex h-full w-4 cursor-col-resize touch-none items-center justify-center">
                    <span className="h-5 w-1 rounded-full bg-slate-300" />
                  </span>
                </div>
                {Array.from({ length: R.kolom }, (_, i) => {
                  const d = kolomTgl(i);
                  const dow = new Date(d + "T00:00:00Z").getUTCDay();
                  const ini = mode === "hari" ? kini.slice(0, 13) === `${d}T${String(i).padStart(2, "0")}` : d === hariIni;
                  return (
                    <div key={i} className={"flex flex-col items-center justify-center py-1.5 text-center " + (mode !== "hari" && (dow === 0 || dow === 6) ? "bg-slate-100/60" : "")} style={{ width: R.lebar }}>
                      {mode === "hari" ? (
                        <span className={"text-[11px] font-semibold " + (ini ? "text-primary" : "text-slate-700")}>{String(i).padStart(2, "0")}.00</span>
                      ) : (
                        <>
                          <span className="text-[9px] text-muted-foreground">{HARI[dow]}</span>
                          <span className={"text-[11px] font-semibold " + (ini ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white" : "text-slate-900")}>{Number(d.slice(8))}{mode === "minggu" ? ` ${new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "UTC" }).format(new Date(d))}` : ""}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {barisUnit.map((u) => {
                const milik = terlihat.filter((p) => p.unit_id === u.id).map((p) => ({ p, w: waktuPesanan(p) }))
                  .sort((a, b) => a.w.dari.localeCompare(b.w.dari) || a.w.sampai.localeCompare(b.w.sampai));
                const ujung: string[] = []; const lajur = new Map<string, number>();
                for (const { p, w } of milik) {
                  let l = ujung.findIndex((x) => x <= w.dari);
                  if (l === -1) { l = ujung.length; ujung.push(w.sampai); } else ujung[l] = w.sampai;
                  lajur.set(p.id, l);
                }
                // bentrok = dua booking terkonfirmasi/berjalan yang jamnya beririsan
                const kunci = milik.filter(({ p }) => p.status === "dipesan" || p.status === "berjalan");
                const bentrok = new Set(kunci.filter((a) => kunci.some((b) => b.p.id !== a.p.id && a.w.dari < b.w.sampai && b.w.dari < a.w.sampai)).map((a) => a.p.id));
                const mtUnit = mtTerlihat.filter((m) => m.unit_id === u.id);
                const tinggi = Math.max(1, ujung.length) * TINGGI_LAJUR + 8;
                const disewa = pesanan.some((p) => p.unit_id === u.id && (p.status === "berjalan" || p.status === "dipesan") && waktuPesanan(p).dari <= kini && kini < waktuPesanan(p).sampai);
                const rusak = u.kondisi === "rusak", mt = u.kondisi === "maintenance" || sedangMt(u.id);
                return (
                  <div key={u.id} data-unit={u.id} className="flex border-b border-border/60 last:border-0">
                    <div className="sticky left-0 z-20 flex items-center gap-2 border-r border-border/60 bg-white px-3 py-2" style={{ width: lebarUnit }}>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 break-words text-sm font-medium leading-tight text-slate-900" title={u.nama}>{u.nama}</p>
                        {u.spek && <p className="line-clamp-2 break-words text-[11px] leading-tight text-slate-600" title={u.spek}>{u.spek}</p>}
                        <p className="truncate text-[11px] text-muted-foreground">{u.id} · {ringkas(u.harian)}/hr</p>
                        {(rusak || mt) && <p className={"mt-0.5 text-[10px] font-semibold " + (rusak ? "text-rose-600" : "text-amber-600")}>{rusak ? "⚠ Rusak" : "🔧 Maintenance"}</p>}
                      </div>
                      <span title={rusak ? "rusak" : mt ? "maintenance" : disewa ? "sedang disewa" : "tersedia"}
                        className={"h-2 w-2 shrink-0 rounded-full " + (rusak ? "bg-rose-500" : mt ? "bg-amber-500" : disewa ? "bg-sky-500" : "bg-emerald-500")} />
                    </div>
                    <div className="relative" style={{ width: lebarTotal, height: tinggi }}>
                      {Array.from({ length: R.kolom }, (_, i) => {
                        const d = kolomTgl(i);
                        const dow = new Date(d + "T00:00:00Z").getUTCDay();
                        return (
                          <button key={i} onClick={() => onBaru({ unit_id: u.id, mulai: d })} title={`Booking ${u.nama} ${tglIndo(d)}`}
                            className={"absolute top-0 border-r border-border/40 hover:bg-primary/10 " + (mode !== "hari" && (dow === 0 || dow === 6) ? "bg-slate-50 " : "") + (mode !== "hari" && d === hariIni ? "bg-primary/5" : "")}
                            style={{ left: i * R.lebar, width: R.lebar, height: tinggi }} />
                        );
                      })}
                      {xKini > 0 && xKini < lebarTotal && <div className="pointer-events-none absolute top-0 z-10 w-0.5 bg-rose-500/70" style={{ left: xKini, height: tinggi }} />}
                      {mtUnit.map((m) => {
                        const kiri = Math.max(0, posisi(m.mulai + "T00:00")), kanan = Math.min(lebarTotal, posisi(tambahHari(m.selesai, 1) + "T00:00"));
                        return (
                          <button key={m.id} onClick={() => setFormMt({ id: m.id, unit_id: m.unit_id, mulai: m.mulai, selesai: m.selesai, catatan: m.catatan || "" })}
                            title={`Maintenance ${tglIndo(m.mulai)}–${tglIndo(m.selesai)}${m.catatan ? " · " + m.catatan : ""}`}
                            className="absolute top-0 z-[1] overflow-hidden border-x-2 border-amber-400 bg-[repeating-linear-gradient(45deg,#fde68a_0_6px,#fffbeb_6px_12px)] px-1.5 text-left text-[10px] font-semibold text-amber-900"
                            style={{ left: kiri, width: Math.max(kanan - kiri, 16), height: tinggi }}>
                            <span className="block truncate pt-1">🔧 {m.catatan || "Maintenance"}</span>
                          </button>
                        );
                      })}
                      {milik.map(({ p, w }) => {
                        const kiri = Math.max(0, posisi(w.dari)), kanan = Math.min(lebarTotal, posisi(w.sampai));
                        const lama = p.total_hari || selisih(p.mulai, p.selesai) || 1;
                        const terlambat = telat(p), dobel = bentrok.has(p.id);
                        const g = geser?.id === p.id ? geser : null;
                        return (
                          <button key={p.id}
                            onPointerDown={(e) => mulaiSeret(e, p)} onPointerMove={saatSeret} onPointerUp={selesaiSeret} onPointerCancel={() => { seret.current = null; setGeser(null); }}
                            title={`${p.pelanggan?.nama || "Pelanggan"} · ambil ${tglIndo(p.mulai)} ${w.dari.slice(11)} · kembali ${tglIndo(p.selesai)} ${w.sampai.slice(11)} · ${LABEL_BAYAR[p.status_bayar || "belum"]}`}
                            className={"absolute z-[2] overflow-hidden rounded-md px-2 py-1 text-left text-[11px] font-medium shadow-sm " + (BLOK[p.status] || "bg-slate-400 text-white")
                              + (terlambat || dobel ? " ring-2 ring-rose-500 ring-offset-1" : "") + (bisaGeser(p) ? " cursor-grab touch-none" : "") + (g ? " z-30 opacity-80 shadow-lg" : "")}
                            style={{ top: 6 + (lajur.get(p.id) || 0) * TINGGI_LAJUR, left: kiri + 1, width: Math.max(kanan - kiri - 2, 26), height: TINGGI_LAJUR - 4,
                              transform: g ? `translate(${g.dx}px, ${g.dy}px)` : undefined }}>
                            <span className="flex items-center gap-1 truncate">
                              <span className={"h-1.5 w-1.5 shrink-0 rounded-full " + (TITIK_BAYAR[p.status_bayar || "belum"] || "bg-white")} />
                              <span className="truncate">{p.pelanggan?.nama || "Pelanggan"}</span>
                            </span>
                            <span className="block truncate opacity-90">
                              {terlambat ? "⚠ Telat · " : dobel ? "⚠ Bentrok · " : ""}{mode === "hari" ? `${w.dari.slice(11)}–${w.sampai.slice(11)}` : `${lama} hari`} · {LABEL_BAYAR[p.status_bayar || "belum"]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">Jadwal ambil & kembali · {judul}</h3>
        </div>
        {jadwal.length === 0 ? <p className="px-4 py-6 text-center text-sm text-muted-foreground">Tidak ada jadwal di rentang ini.</p> : (
          <ul className="divide-y divide-border/60">
            {jadwal.slice(0, 40).map(({ t, jenis, p }) => (
              <li key={p.id + jenis} className="flex items-center gap-3 px-4 py-2 text-sm">
                <span className={"w-16 shrink-0 rounded-md px-2 py-0.5 text-center text-[11px] font-semibold " + (jenis === "Ambil" ? "bg-indigo-50 text-indigo-700" : telat(p) ? "bg-rose-50 text-rose-700" : "bg-sky-50 text-sky-700")}>{jenis}</span>
                <button onClick={() => setDetail(p)} className="min-w-0 flex-1 truncate text-left text-slate-800">{p.pelanggan?.nama} · {p.unit_id} {p.unit?.nama}</button>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{tglIndo(t.slice(0, 10))} {t.slice(11)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {detail && <DetailPesanan p={detail} unit={unit} tugas={tugas} pic={pic} onTutup={() => setDetail(null)} />}
    </div>
  );
}

function DetailPesanan({ p, unit, tugas, pic, onTutup }: {
  p: Pesanan; unit: Unit[]; tugas: Tugas[]; pic: Pic[]; onTutup: () => void;
}) {
  const u = unit.find((x) => x.id === p.unit_id);
  const t = tugas.find((x) => x.pesanan_id === p.id && x.pic_id);
  const petugas = pic.find((x) => x.id === t?.pic_id);
  const lama = p.total_hari || selisih(p.mulai, p.selesai) || 1;
  const nama = p.pelanggan?.nama || "Pelanggan";
  const pesanKembali =
    `Halo ${nama},\n\nIni pengingat dari *Techpora* bahwa sewa unit *${u?.nama || p.unit_id}* akan jatuh tempo pada *${tglIndo(p.selesai)}*.\n\nMohon kembalikan unit sesuai jadwal.` +
    (petugas ? ` PIC serah terima: ${petugas.nama}${petugas.wa ? ` (${petugas.wa})` : ""}.` : "") + `\n\nTerima kasih.`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onTutup}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">Detail Pemesanan</h3>
          <button onClick={onTutup} aria-label="Tutup" className="rounded-md p-1 text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="space-y-3 px-5 py-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{u?.nama || p.unit?.nama || "Unit"}</p>
            <p className="text-xs text-muted-foreground">{u?.spek || p.unit_id}</p>
          </div>
          <Baris label="Pelanggan" isi={nama} />
          <Baris label="Telepon" isi={p.pelanggan?.wa || "-"} />
          <div className="grid grid-cols-2 gap-3">
            <Baris label="Mulai" isi={`${tglIndo(p.mulai)} · ${waktuPesanan(p).dari.slice(11)}`} />
            <Baris label="Kembali" isi={`${tglIndo(p.selesai)} · ${waktuPesanan(p).sampai.slice(11)}`} />
          </div>
          <Baris label="Durasi" isi={`${lama} hari`} />
          <div className="flex flex-wrap gap-2">
            <Lencana teks={LABEL_STATUS[p.status]} gaya={GAYA_STATUS[p.status]} />
            {p.status_bayar && <Lencana teks={LABEL_BAYAR[p.status_bayar]} gaya={GAYA_BAYAR[p.status_bayar]} />}
          </div>
          {!!p.diskon && <Baris label={`Voucher ${p.voucher_kode || ""}`} isi={`− ${rp(p.diskon)}`} />}
          <Baris label="Total Tagihan" isi={rp(p.total)} />
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">PIC Serah Terima</p>
            {petugas ? (
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{petugas.nama}</p>
                  <p className="text-xs text-muted-foreground">{petugas.wa}</p>
                </div>
                {petugas.wa && (
                  <a href={waLink(petugas.wa, `Halo ${petugas.nama}, terkait serah terima unit ${u?.nama || p.unit_id}.`)} target="_blank" rel="noreferrer"
                    className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">WA PIC</a>
                )}
              </div>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">Belum ada PIC ditugaskan</p>
            )}
          </div>
          {p.catatan && p.catatan !== "impor Base44" && <Baris label="Catatan" isi={p.catatan.replace(/\s*\|\s*impor Base44$/, "")} />}
          <div className="grid grid-cols-2 gap-2">
            {([["Ambil", waktuPesanan(p).dari], ["Kembali", waktuPesanan(p).sampai]] as const).map(([j, t]) => {
              const mulai = t.replace(/[-:]/g, "") + "00";
              const akhir = new Date(Date.parse(t + ":00Z") + 30 * 60000).toISOString().slice(0, 16).replace(/[-:]/g, "") + "00";
              const q = new URLSearchParams({ action: "TEMPLATE", text: `${j} ${u?.nama || p.unit_id} — ${nama}`, dates: `${mulai}/${akhir}`, ctz: "Asia/Jakarta",
                details: `${nama}${p.pelanggan?.wa ? " · " + p.pelanggan.wa : ""}\nTotal ${rp(p.total)} · ${LABEL_BAYAR[p.status_bayar || "belum"]}` });
              if (petugas?.email) q.set("add", petugas.email);
              return (
                <a key={j} href={"https://calendar.google.com/calendar/render?" + q} target="_blank" rel="noreferrer"
                  className="rounded-lg border border-border py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50">📅 {j} ke Google Calendar</a>
              );
            })}
          </div>
          {p.pelanggan?.wa && (
            <a href={waLink(p.pelanggan.wa, pesanKembali)} target="_blank" rel="noreferrer"
              className="block w-full rounded-lg border border-border py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Kirim Pengingat Pengembalian
            </a>
          )}
        </div>
        <div className="border-t border-border px-5 py-3 text-right">
          <button onClick={onTutup} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Tutup</button>
        </div>
      </div>
    </div>
  );
}
