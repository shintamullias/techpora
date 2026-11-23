import { useEffect, useState } from "react";
import { supabase, rp } from "@/lib/supabase";

type Log = { id: number; waktu: string; tabel: string; aksi: string; baris_id: string; oleh_email: string | null; lama: Record<string, unknown> | null; baru: Record<string, unknown> | null };
type Snap = { tanggal: string; tabel: string; jumlah_baris: number; id: number };

const NAMA_TABEL: Record<string, string> = { pesanan: "Pesanan", pembayaran: "Pembayaran", pelanggan: "Pelanggan", unit: "Unit", voucher: "Voucher", pengeluaran: "Pengeluaran" };
const AKSI: Record<string, [string, string]> = { INSERT: ["Dibuat", "bg-emerald-50 text-emerald-700"], UPDATE: ["Diubah", "bg-amber-50 text-amber-700"], DELETE: ["Dihapus", "bg-rose-50 text-rose-700"] };
const ABAIKAN = new Set(["dibuat_pada", "token", "ttd_gambar"]);
const waktu = (t: string) => new Date(t).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
const nilai = (k: string, v: unknown) =>
  v == null || v === "" ? "—" : typeof v === "number" && /total|harga|jumlah|diskon|harian|mingguan|bulanan/.test(k) ? rp(v) : typeof v === "object" ? JSON.stringify(v) : String(v);

function ringkasan(l: Log) {
  const r = l.baru || l.lama || {};
  const label = String(r.nama ?? r.kode ?? r.keterangan ?? (r.jumlah != null ? rp(Number(r.jumlah)) : "") ?? "");
  if (l.aksi !== "UPDATE" || !l.lama || !l.baru) return { label, ubah: [] as [string, unknown, unknown][] };
  const ubah = Object.keys(l.baru).filter((k) => !ABAIKAN.has(k) && JSON.stringify(l.lama![k]) !== JSON.stringify(l.baru![k]))
    .map((k) => [k, l.lama![k], l.baru![k]] as [string, unknown, unknown]);
  return { label, ubah };
}

/** Riwayat perubahan data (audit log) dengan tombol kembalikan, dan daftar cadangan harian. */
export default function RiwayatCadangan({ setGalat, muat }: { setGalat: (s: string) => void; muat: () => void }) {
  const [log, setLog] = useState<Log[]>([]);
  const [tabel, setTabel] = useState("");
  const [snap, setSnap] = useState<Snap[]>([]);

  const ambil = async () => {
    let q = supabase.from("audit_log").select("*").order("waktu", { ascending: false }).limit(100);
    if (tabel) q = q.eq("tabel", tabel);
    const { data, error } = await q;
    if (error) return setGalat(error.message);
    setLog((data as Log[]) || []);
  };
  useEffect(() => { ambil(); }, [tabel]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { supabase.rpc("daftar_cadangan").then(({ data }) => setSnap((data as Snap[]) || [])); }, []);

  const kembalikan = async (l: Log) => {
    const apa = l.aksi === "INSERT" ? "menghapus data yang dibuat ini" : l.aksi === "DELETE" ? "mengembalikan data yang dihapus ini" : "mengembalikan nilai sebelum perubahan ini";
    if (!confirm(`Yakin ${apa}?`)) return;
    const { error } = await supabase.rpc("pulihkan_perubahan", { p_id: l.id });
    if (error) return setGalat(error.message);
    ambil(); muat();
  };

  const unduh = async (s: Snap) => {
    const { data, error } = await supabase.rpc("ambil_cadangan", { p_id: s.id });
    if (error) return setGalat(error.message);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: "application/json" }));
    a.download = `cadangan-${s.tabel}-${s.tanggal.slice(0, 10)}.json`; a.click();
  };

  const tanggalSnap = [...new Set(snap.map((s) => s.tanggal))];

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Riwayat perubahan</h3>
            <p className="text-xs text-muted-foreground">Setiap tambah, ubah, dan hapus data tercatat otomatis</p>
          </div>
          <select value={tabel} onChange={(e) => setTabel(e.target.value)} className="rounded-lg border border-border px-2 py-1.5 text-sm">
            <option value="">Semua data</option>
            {Object.entries(NAMA_TABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        {log.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted-foreground">Belum ada perubahan tercatat.</p>}
        <ul className="divide-y divide-border/60">
          {log.map((l) => {
            const { label, ubah } = ringkasan(l);
            const [teks, gaya] = AKSI[l.aksi] || [l.aksi, ""];
            return (
              <li key={l.id} className="px-4 py-2.5 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-slate-900">
                      <span className={"mr-1.5 rounded px-1.5 py-0.5 text-[11px] font-semibold " + gaya}>{teks}</span>
                      {NAMA_TABEL[l.tabel] || l.tabel}{label ? ` · ${label}` : ""}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{waktu(l.waktu)} · {l.oleh_email || "sistem"}</p>
                    {ubah.length > 0 && (
                      <ul className="mt-1 space-y-0.5 text-xs text-slate-600">
                        {ubah.slice(0, 6).map(([k, a, b]) => (
                          <li key={k} className="break-words"><span className="text-muted-foreground">{k}:</span> {nilai(k, a)} → <b>{nilai(k, b)}</b></li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button onClick={() => kembalikan(l)} className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">Kembalikan</button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">Cadangan otomatis</h3>
          <p className="text-xs text-muted-foreground">Seluruh data disalin setiap hari pukul 02.00 WIB dan disimpan 30 hari. Unduh untuk simpan di laptop.</p>
        </div>
        {tanggalSnap.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted-foreground">Belum ada cadangan.</p>}
        <ul className="divide-y divide-border/60">
          {tanggalSnap.slice(0, 10).map((t) => (
            <li key={t} className="px-4 py-2.5">
              <p className="text-sm font-medium text-slate-900">{waktu(t)}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {snap.filter((s) => s.tanggal === t).map((s) => (
                  <button key={s.id} onClick={() => unduh(s)} className="rounded-md border border-border px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50">
                    ⬇ {s.tabel} ({s.jumlah_baris})
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
