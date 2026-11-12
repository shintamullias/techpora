import { useState } from "react";
import { supabase, rp, tglIndo, type Voucher } from "@/lib/supabase";

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

export default function TabVoucher({
  voucher, muat, setGalat,
}: {
  voucher: Voucher[]; muat: () => void; setGalat: (s: string) => void;
}) {
  const [buka, setBuka] = useState(false);
  const kosong = { kode: "", nama: "", tipe: "persen", nilai: "", periode: "semua", mulai: "", selesai: "" };
  const [f, setF] = useState(kosong);
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const tambah = async () => {
    if (!f.kode.trim() || !f.nilai) return setGalat("Kode dan nilai voucher wajib diisi.");
    setGalat("");
    const { error } = await supabase.from("voucher").insert({
      kode: f.kode.trim().toUpperCase(), nama: f.nama.trim() || f.kode.trim(),
      tipe: f.tipe, nilai: Number(f.nilai.replace(/\D/g, "")), periode: f.periode,
      mulai: f.mulai || null, selesai: f.selesai || null, maks_pakai: 0, terpakai: 0, aktif: true,
    });
    if (error) return setGalat(error.message);
    setF(kosong); setBuka(false); muat();
  };

  const toggle = async (v: Voucher) => {
    const { error } = await supabase.from("voucher").update({ aktif: !v.aktif }).eq("id", v.id);
    if (error) return setGalat(error.message);
    muat();
  };

  const hapus = async (v: Voucher) => {
    if (!confirm(`Hapus voucher ${v.kode}?`)) return;
    const { error } = await supabase.from("voucher").delete().eq("id", v.id);
    if (error) return setGalat(error.message);
    muat();
  };

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Voucher</h2>
        <button onClick={() => setBuka((b) => !b)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white">
          {buka ? "Tutup" : "+ Voucher"}
        </button>
      </div>

      {buka && (
        <div className="mb-4 space-y-3 rounded-xl border border-border bg-[#F8FAFC] p-3">
          <div className="grid grid-cols-2 gap-3">
            <Kol label="Kode"><input className={inp} value={f.kode} onChange={(e) => s("kode", e.target.value)} placeholder="DISC25" /></Kol>
            <Kol label="Nama"><input className={inp} value={f.nama} onChange={(e) => s("nama", e.target.value)} placeholder="Promo mingguan" /></Kol>
            <Kol label="Tipe">
              <select className={inp} value={f.tipe} onChange={(e) => s("tipe", e.target.value)}>
                <option value="persen">Persen (%)</option><option value="nominal">Nominal (Rp)</option>
              </select>
            </Kol>
            <Kol label={f.tipe === "persen" ? "Nilai (%)" : "Nilai (Rp)"}>
              <input className={inp} inputMode="numeric" value={f.nilai} onChange={(e) => s("nilai", e.target.value)} />
            </Kol>
            <Kol label="Berlaku untuk">
              <select className={inp} value={f.periode} onChange={(e) => s("periode", e.target.value)}>
                <option value="semua">Semua sewa</option><option value="harian">Harian</option>
                <option value="mingguan">Mingguan</option><option value="bulanan">Bulanan</option>
              </select>
            </Kol>
            <div />
            <Kol label="Mulai (opsional)"><input type="date" className={inp} value={f.mulai} onChange={(e) => s("mulai", e.target.value)} /></Kol>
            <Kol label="Selesai (opsional)"><input type="date" className={inp} value={f.selesai} onChange={(e) => s("selesai", e.target.value)} /></Kol>
          </div>
          <button onClick={tambah} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">Simpan voucher</button>
        </div>
      )}

      {voucher.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Belum ada voucher.</p>}

      <ul className="space-y-2.5">
        {voucher.map((v) => (
          <li key={v.id} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {v.kode}
                  <span className={"ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold " + (v.aktif ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500")}>
                    {v.aktif ? "Aktif" : "Nonaktif"}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {v.tipe === "persen" ? `Diskon ${v.nilai}%` : `Potongan ${rp(v.nilai)}`} · {v.periode === "semua" ? "semua sewa" : "sewa " + v.periode}
                  {v.selesai ? ` · s.d. ${tglIndo(v.selesai)}` : ""} · dipakai {v.terpakai}×
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button onClick={() => toggle(v)} className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                  {v.aktif ? "Matikan" : "Aktifkan"}
                </button>
                <button onClick={() => hapus(v)} className="rounded-lg px-2 py-1.5 text-xs text-red-500">Hapus</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
