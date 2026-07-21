import { useMemo, useState } from "react";
import {
  supabase, rp, tglIndo, bulanDari, namaBulan, KATEGORI_BIAYA,
  type Unit, type Pesanan, type Pengeluaran,
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

/** Pemasukan diakui saat unit sudah diantar (status berjalan/selesai). */
const DIAKUI = ["berjalan", "selesai"];

export default function TabKeuangan({
  pesanan, unit, biaya, muat, setGalat,
}: {
  pesanan: Pesanan[]; unit: Unit[]; biaya: Pengeluaran[]; muat: () => void; setGalat: (s: string) => void;
}) {
  const kini = new Date().toISOString().slice(0, 7);
  const [bulan, setBulan] = useState(kini);
  const [buka, setBuka] = useState(false);
  const kosong = { tanggal: new Date().toISOString().slice(0, 10), kategori: "operasional", keterangan: "", jumlah: "", unit_id: "" };
  const [f, setF] = useState(kosong);
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  /* ---------- daftar bulan yang punya data ---------- */
  const bulanTersedia = useMemo(() => {
    const set = new Set<string>([kini]);
    pesanan.filter((p) => DIAKUI.includes(p.status)).forEach((p) => set.add(bulanDari(p.mulai)));
    biaya.forEach((b) => set.add(bulanDari(b.tanggal)));
    return [...set].sort().reverse();
  }, [pesanan, biaya]);

  /* ---------- hitungan bulan terpilih ---------- */
  const masukBln = pesanan.filter((p) => DIAKUI.includes(p.status) && bulanDari(p.mulai) === bulan);
  const keluarBln = biaya.filter((b) => bulanDari(b.tanggal) === bulan);
  const totalMasuk = masukBln.reduce((a, p) => a + p.total, 0);
  const totalKeluar = keluarBln.reduce((a, b) => a + b.jumlah, 0);
  const laba = totalMasuk - totalKeluar;

  /* ---------- bagi hasil per unit (porsi pemilik : sisanya untuk sistem) ---------- */
  const bagi = useMemo(() => {
    let pemilik = 0, sistem = 0;
    const perPemilik: Record<string, number> = {};
    // biaya dibagi rata proporsional terhadap pemasukan tiap unit
    for (const p of masukBln) {
      const u = unit.find((x) => x.id === p.unit_id);
      const porsi = u ? u.porsi_pemilik : 70;
      const namaP = u ? u.pemilik : "Techpora";
      const bagianBiaya = totalMasuk > 0 ? (p.total / totalMasuk) * totalKeluar : 0;
      const labaUnit = p.total - bagianBiaya;
      const bagianPemilik = (labaUnit * porsi) / 100;
      pemilik += bagianPemilik;
      sistem += labaUnit - bagianPemilik;
      perPemilik[namaP] = (perPemilik[namaP] || 0) + bagianPemilik;
    }
    return { pemilik: Math.round(pemilik), sistem: Math.round(sistem), perPemilik };
  }, [masukBln, keluarBln, unit, totalMasuk, totalKeluar]);

  /* ---------- ROI & BEP per unit (sepanjang waktu) ---------- */
  const perUnit = useMemo(() =>
    unit.map((u) => {
      const semua = pesanan.filter((p) => p.unit_id === u.id && DIAKUI.includes(p.status));
      const pendapatan = semua.reduce((a, p) => a + p.total, 0);
      const biayaUnit = biaya.filter((b) => b.unit_id === u.id).reduce((a, b) => a + b.jumlah, 0);
      const modal = u.modal || 0;
      const bersih = pendapatan - biayaUnit;
      const roi = modal > 0 ? (bersih / modal) * 100 : 0;
      const sisaBep = Math.max(0, modal - bersih);
      // rata-rata per bulan aktif
      const bulanAktif = new Set(semua.map((p) => bulanDari(p.mulai))).size || 1;
      const perBulan = bersih / bulanAktif;
      const bulanLagi = sisaBep > 0 && perBulan > 0 ? Math.ceil(sisaBep / perBulan) : 0;
      return { u, pendapatan, biayaUnit, bersih, modal, roi, sisaBep, bulanLagi, jumlahSewa: semua.length };
    }), [unit, pesanan, biaya]);

  const simpanBiaya = async () => {
    const jml = Number(f.jumlah) || 0;
    if (jml <= 0) return setGalat("Isi jumlah pengeluaran.");
    const { error } = await supabase.from("pengeluaran").insert({
      tanggal: f.tanggal, kategori: f.kategori, keterangan: f.keterangan.trim(),
      jumlah: jml, unit_id: f.unit_id || null,
    });
    if (error) return setGalat(error.message);
    setF(kosong); setBuka(false); muat();
  };

  const hapusBiaya = async (id: string) => {
    const { error } = await supabase.from("pengeluaran").delete().eq("id", id);
    if (error) setGalat(error.message); else muat();
  };

  /* ---------- buku kas gabungan ---------- */
  const kas = [
    ...masukBln.map((p) => ({ id: p.id, tanggal: p.mulai, ket: `${p.pelanggan?.nama || "—"} · ${p.unit_id}`, masuk: p.total, keluar: 0, hapus: null as null | (() => void) })),
    ...keluarBln.map((b) => ({ id: b.id, tanggal: b.tanggal, ket: `${KATEGORI_BIAYA.find((k) => k.key === b.kategori)?.label || b.kategori}${b.keterangan ? " · " + b.keterangan : ""}`, masuk: 0, keluar: b.jumlah, hapus: () => hapusBiaya(b.id) })),
  ].sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));

  return (
    <>
      {/* Ringkasan bulan */}
      <section className="rounded-2xl border border-border bg-background p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl text-foreground">Keuangan</h2>
          <select value={bulan} onChange={(e) => setBulan(e.target.value)} className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm">
            {bulanTersedia.map((b) => <option key={b} value={b}>{namaBulan(b)}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Kotak label="Pemasukan" nilai={totalMasuk} nada="text-emerald-700" />
          <Kotak label="Pengeluaran" nilai={totalKeluar} nada="text-red-700" />
        </div>

        <div className="mt-2 rounded-xl border border-border bg-secondary/40 p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-muted-foreground">Laba bersih</span>
            <span className={"font-serif text-3xl " + (laba >= 0 ? "text-foreground" : "text-red-700")}>{rp(laba)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{masukBln.length} transaksi sewa bulan ini</p>
        </div>

        {laba > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pembagian hasil</p>
            <Bagi label="Bagian pemilik unit (70%)" nilai={bagi.pemilik} kuat />
            <Bagi label="Kas sistem Techpora (30%)" nilai={bagi.sistem} />
            {Object.keys(bagi.perPemilik).length > 1 && (
              <div className="mt-2 rounded-lg border border-border p-2">
                <p className="mb-1 text-xs font-semibold text-muted-foreground">Rincian per pemilik</p>
                {Object.entries(bagi.perPemilik).map(([n, v]) => (
                  <div key={n} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{n}</span>
                    <span className="text-foreground">{rp(Math.round(v))}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Kas sistem dipisahkan untuk beli unit baru, perawatan, dan dana darurat — bukan untuk dipakai harian.
            </p>
          </div>
        )}
      </section>

      {/* Buku kas */}
      <section className="rounded-2xl border border-border bg-background p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl text-foreground">Buku kas</h2>
          <button onClick={() => setBuka(!buka)} className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
            {buka ? "Tutup" : "+ Pengeluaran"}
          </button>
        </div>

        {buka && (
          <div className="mb-4 space-y-3 rounded-xl border border-border bg-secondary/40 p-3">
            <div className="grid grid-cols-2 gap-3">
              <Kol label="Tanggal"><input type="date" value={f.tanggal} onChange={(e) => s("tanggal", e.target.value)} className={inp} /></Kol>
              <Kol label="Jumlah"><input type="number" value={f.jumlah} onChange={(e) => s("jumlah", e.target.value)} placeholder="50000" className={inp} /></Kol>
            </div>
            <Kol label="Kategori">
              <select value={f.kategori} onChange={(e) => s("kategori", e.target.value)} className={inp}>
                {KATEGORI_BIAYA.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
              </select>
            </Kol>
            <Kol label="Keterangan"><input value={f.keterangan} onChange={(e) => s("keterangan", e.target.value)} placeholder="mis. bensin antar Kelapa Gading" className={inp} /></Kol>
            <Kol label="Terkait unit (opsional)">
              <select value={f.unit_id} onChange={(e) => s("unit_id", e.target.value)} className={inp}>
                <option value="">— umum —</option>
                {unit.map((u) => <option key={u.id} value={u.id}>{u.id} · {u.nama}</option>)}
              </select>
            </Kol>
            <button onClick={simpanBiaya} className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground">Simpan pengeluaran</button>
          </div>
        )}

        {kas.length === 0 ? <p className="text-sm text-muted-foreground">Belum ada catatan bulan ini.</p> : (
          <ul className="divide-y divide-border">
            {kas.map((k) => (
              <li key={k.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{k.ket}</p>
                  <p className="text-xs text-muted-foreground">{tglIndo(k.tanggal)}</p>
                </div>
                <span className={"shrink-0 text-sm font-semibold " + (k.masuk ? "text-emerald-700" : "text-red-700")}>
                  {k.masuk ? "+" : "−"}{rp(k.masuk || k.keluar)}
                </span>
                {k.hapus && <button onClick={k.hapus} className="shrink-0 text-xs text-muted-foreground">hapus</button>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ROI & BEP */}
      <section className="rounded-2xl border border-border bg-background p-4">
        <h2 className="mb-1 font-serif text-xl text-foreground">Modal &amp; balik modal</h2>
        <p className="mb-3 text-xs text-muted-foreground">Dihitung sejak unit mulai disewakan, bukan per bulan.</p>
        <div className="space-y-3">
          {perUnit.map(({ u, pendapatan, bersih, modal, roi, sisaBep, bulanLagi, jumlahSewa }) => {
            const persen = modal > 0 ? Math.min(100, Math.max(0, (bersih / modal) * 100)) : 0;
            return (
              <div key={u.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      <span className="font-mono text-xs text-muted-foreground">{u.id}</span> · {u.nama}
                    </p>
                    <p className="text-xs text-muted-foreground">Pemilik: {u.pemilik} · porsi {u.porsi_pemilik}%</p>
                  </div>
                  <span className={"shrink-0 text-sm font-semibold " + (roi >= 100 ? "text-emerald-700" : "text-foreground")}>
                    ROI {roi.toFixed(0)}%
                  </span>
                </div>

                {modal > 0 ? (
                  <>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                      <div className={"h-full rounded-full " + (persen >= 100 ? "bg-emerald-500" : "bg-primary")} style={{ width: persen + "%" }} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                      <span>{rp(bersih)} dari {rp(modal)}</span>
                      <span>{jumlahSewa}× sewa</span>
                    </div>
                    <p className="mt-1.5 text-xs">
                      {sisaBep === 0
                        ? <span className="text-emerald-700">Sudah balik modal. Selebihnya keuntungan.</span>
                        : <span className="text-muted-foreground">Sisa {rp(sisaBep)} lagi{bulanLagi > 0 ? ` — sekitar ${bulanLagi} bulan dengan laju sekarang` : ""}.</span>}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-amber-700">Isi nilai modal unit ini di tab Unit supaya ROI dan BEP bisa dihitung.</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function Kotak({ label, nilai, nada }: { label: string; nilai: number; nada: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={"mt-0.5 text-lg font-semibold " + nada}>{rp(nilai)}</p>
    </div>
  );
}

function Bagi({ label, nilai, kuat }: { label: string; nilai: number; kuat?: boolean }) {
  return (
    <div className={"flex items-baseline justify-between rounded-lg px-3 py-2 " + (kuat ? "bg-primary/10" : "bg-secondary")}>
      <span className={"text-sm " + (kuat ? "font-semibold text-primary" : "text-muted-foreground")}>{label}</span>
      <span className={"font-semibold " + (kuat ? "text-primary" : "text-foreground")}>{rp(nilai)}</span>
    </div>
  );
}
