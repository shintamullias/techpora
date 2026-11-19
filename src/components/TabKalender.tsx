import { useMemo, useRef, useState } from "react";
import { rp, tglIndo, waLink, type Pesanan, type Unit, type Tugas, type Pic } from "@/lib/supabase";

/* Kalender sewa bergaya aplikasi operasional (Base44):
   satu baris per unit, satu kolom per tanggal, sebulan penuh. */

const LEBAR_HARI = 42;
const TINGGI_LAJUR = 44;
const LEBAR_UNIT = 150;
const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const BLOK: Record<string, string> = {
  dipesan: "bg-indigo-500 text-white",
  berjalan: "bg-sky-500 text-white",
  selesai: "bg-emerald-500 text-white",
};
const LABEL_STATUS: Record<string, string> = { dipesan: "Akan Datang", berjalan: "Aktif", selesai: "Selesai", batal: "Dibatalkan" };
const GAYA_STATUS: Record<string, string> = {
  dipesan: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  berjalan: "bg-sky-50 text-sky-700 ring-sky-600/20",
  selesai: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  batal: "bg-rose-50 text-rose-700 ring-rose-600/20",
};
const LABEL_BAYAR: Record<string, string> = { lunas: "Lunas", sebagian: "Sebagian", belum: "Belum Bayar" };
const GAYA_BAYAR: Record<string, string> = {
  lunas: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  sebagian: "bg-amber-50 text-amber-700 ring-amber-600/20",
  belum: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const isoHariIni = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const awalBulan = (iso: string) => iso.slice(0, 8) + "01";
const geserBulan = (iso: string, n: number) => {
  const [y, m] = iso.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
};
const daftarHari = (iso: string) => {
  const [y, m] = iso.split("-").map(Number);
  const n = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from({ length: n }, (_, i) => `${iso.slice(0, 8)}${String(i + 1).padStart(2, "0")}`);
};
const selisih = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
const labelBulan = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
const ringkas = (n: number) => (n >= 1000 ? `Rp${Math.round(n / 1000)}rb` : rp(n));

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

export default function TabKalender({
  pesanan, unit, tugas, pic, onBaru,
}: {
  pesanan: Pesanan[]; unit: Unit[]; tugas: Tugas[]; pic: Pic[];
  onBaru: (isi?: { unit_id?: string; mulai?: string }) => void;
}) {
  const hariIni = isoHariIni();
  const [bulan, setBulan] = useState(() => awalBulan(hariIni));
  const [detail, setDetail] = useState<Pesanan | null>(null);
  const geserX = useRef<number | null>(null);

  const hari = useMemo(() => daftarHari(bulan), [bulan]);
  const akhir = hari[hari.length - 1];

  const dalamBulan = useMemo(
    () => pesanan.filter((p) => p.status !== "batal" && !(p.selesai < bulan || p.mulai > akhir)),
    [pesanan, bulan, akhir],
  );

  // Unit aktif, ditambah unit nonaktif yang punya sewa di bulan ini.
  const barisUnit = useMemo(
    () => unit.filter((u) => u.aktif || dalamBulan.some((p) => p.unit_id === u.id)),
    [unit, dalamBulan],
  );

  const pilihanBulan = useMemo(() => {
    const out: string[] = [];
    for (let i = -12; i <= 24; i++) out.push(geserBulan(awalBulan(hariIni), i));
    if (!out.includes(bulan)) out.push(bulan);
    return out.sort();
  }, [bulan, hariIni]);

  const statusHariIni = (unitId: string) => {
    const p = pesanan.find((x) => x.unit_id === unitId && x.status !== "batal" && x.status !== "selesai" && x.mulai <= hariIni && x.selesai >= hariIni);
    if (!p) return "tersedia";
    return p.status === "dipesan" ? "dipesan" : "disewa";
  };

  const ganti = (n: number) => setBulan((b) => geserBulan(b, n));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Jadwal sewa per unit — satu baris per unit, kolom per tanggal (per bulan)</p>
        <button onClick={() => onBaru()}
          className="shrink-0 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90">+ Pemesanan Baru</button>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div
          className="flex cursor-grab touch-pan-y select-none flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          onPointerDown={(e) => { geserX.current = e.clientX; }}
          onPointerUp={(e) => {
            if (geserX.current == null) return;
            const dx = e.clientX - geserX.current;
            if (Math.abs(dx) > 60) ganti(dx < 0 ? 1 : -1);
            geserX.current = null;
          }}
        >
          <div className="flex flex-wrap items-center gap-2" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}>
            <select value={bulan} onChange={(e) => setBulan(e.target.value)} aria-label="Pilih bulan"
              className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-semibold capitalize text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
              {pilihanBulan.map((b) => <option key={b} value={b}>{labelBulan(b)}</option>)}
            </select>
            <button onClick={() => setBulan(awalBulan(hariIni))} className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-slate-100">Hari Ini</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">⇆ Geser untuk ganti bulan</span>
            <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-sky-500" />Aktif</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />Akan Datang</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />Selesai</span>
            </div>
          </div>
        </div>

        {barisUnit.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">Belum ada unit. Tambahkan unit di menu Inventaris.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="flex border-b border-border bg-slate-50">
                <div className="sticky left-0 z-10 flex items-center bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" style={{ width: LEBAR_UNIT }}>Unit</div>
                {hari.map((d) => {
                  const dow = new Date(d + "T00:00:00Z").getUTCDay();
                  const ini = d === hariIni;
                  return (
                    <div key={d} className={"flex flex-col items-center justify-center py-1.5 text-center " + (dow === 0 || dow === 6 ? "bg-slate-100/60" : "")} style={{ width: LEBAR_HARI }}>
                      <span className="text-[9px] text-muted-foreground">{HARI[dow]}</span>
                      <span className={"text-[11px] font-semibold " + (ini ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white" : "text-slate-900")}>{Number(d.slice(8))}</span>
                    </div>
                  );
                })}
              </div>

              {barisUnit.map((u) => {
                // Pesanan yang tanggalnya beririsan ditaruh di lajur berbeda supaya tidak saling menimpa.
                const milik = dalamBulan.filter((p) => p.unit_id === u.id).sort((a, b) => a.mulai.localeCompare(b.mulai) || a.selesai.localeCompare(b.selesai));
                const ujungLajur: string[] = [];
                const lajurDari = new Map<string, number>();
                for (const p of milik) {
                  let l = ujungLajur.findIndex((akhirL) => akhirL < p.mulai);
                  if (l === -1) { l = ujungLajur.length; ujungLajur.push(p.selesai); } else ujungLajur[l] = p.selesai;
                  lajurDari.set(p.id, l);
                }
                const tinggiBaris = Math.max(1, ujungLajur.length) * TINGGI_LAJUR + 8;
                const st = statusHariIni(u.id);
                return (
                  <div key={u.id} className="flex border-b border-border/60 last:border-0 hover:bg-slate-50/50">
                    <div className="sticky left-0 z-10 flex items-center gap-2 bg-white px-3 py-2" style={{ width: LEBAR_UNIT }}>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{u.nama}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{u.id} · {ringkas(u.harian)}/hr</p>
                      </div>
                      <span title={st} className={"h-2 w-2 shrink-0 rounded-full " + (st === "tersedia" ? "bg-emerald-500" : st === "dipesan" ? "bg-amber-500" : "bg-sky-500")} />
                    </div>
                    <div className="relative" style={{ width: hari.length * LEBAR_HARI, height: tinggiBaris }}>
                      {hari.map((d, i) => {
                        const dow = new Date(d + "T00:00:00Z").getUTCDay();
                        return (
                          <button key={d} onClick={() => onBaru({ unit_id: u.id, mulai: d })}
                            title={`Tambah pemesanan ${u.nama} ${tglIndo(d)}`}
                            className={"absolute top-0 border-r border-border/40 hover:bg-primary/10 " + (dow === 0 || dow === 6 ? "bg-slate-50 " : "") + (d === hariIni ? "bg-primary/5" : "")}
                            style={{ left: i * LEBAR_HARI, width: LEBAR_HARI, height: tinggiBaris }} />
                        );
                      })}
                      {milik.map((p) => {
                        const mulai = p.mulai < bulan ? bulan : p.mulai;
                        const selesai = p.selesai > akhir ? akhir : p.selesai;
                        const geser = selisih(bulan, mulai);
                        const rentang = selisih(mulai, selesai) + 1;
                        const lama = selisih(p.mulai, p.selesai) + 1;
                        return (
                          <button key={p.id} onClick={() => setDetail(p)}
                            title={`${p.pelanggan?.nama || "Pelanggan"} · ${tglIndo(p.mulai)} – ${tglIndo(p.selesai)}`}
                            className={"absolute overflow-hidden rounded-md px-2 py-1 text-left text-[11px] font-medium shadow-sm " + (BLOK[p.status] || "bg-slate-400 text-white")}
                            style={{ top: 6 + (lajurDari.get(p.id) || 0) * TINGGI_LAJUR, left: geser * LEBAR_HARI + 2, width: Math.max(rentang * LEBAR_HARI - 4, 24), height: TINGGI_LAJUR - 4 }}>
                            <span className="block truncate">{p.pelanggan?.nama || "Pelanggan"}</span>
                            <span className="block truncate opacity-90">{lama} hari</span>
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

      {detail && (
        <DetailPesanan p={detail} unit={unit} tugas={tugas} pic={pic} onTutup={() => setDetail(null)} />
      )}
    </div>
  );
}

function DetailPesanan({ p, unit, tugas, pic, onTutup }: {
  p: Pesanan; unit: Unit[]; tugas: Tugas[]; pic: Pic[]; onTutup: () => void;
}) {
  const u = unit.find((x) => x.id === p.unit_id);
  const t = tugas.find((x) => x.pesanan_id === p.id && x.pic_id);
  const petugas = pic.find((x) => x.id === t?.pic_id);
  const lama = selisih(p.mulai, p.selesai) + 1;
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
            <Baris label="Mulai" isi={tglIndo(p.mulai)} />
            <Baris label="Kembali" isi={tglIndo(p.selesai)} />
          </div>
          <Baris label="Durasi" isi={`${lama} hari`} />
          <div className="flex flex-wrap gap-2">
            <Lencana teks={LABEL_STATUS[p.status]} gaya={GAYA_STATUS[p.status]} />
            {p.status_bayar && <Lencana teks={LABEL_BAYAR[p.status_bayar]} gaya={GAYA_BAYAR[p.status_bayar]} />}
          </div>
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
