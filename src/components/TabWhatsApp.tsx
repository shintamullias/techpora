import { useMemo } from "react";
import {
  supabase, rp, tglIndo, waLink, kelompokkanBayar, sisaTagihan, sudahJatuhTempo,
  type Pesanan, type Pembayaran, type Tugas, type Pic,
} from "@/lib/supabase";

function Kartu({ judul, ket, children }: { judul: string; ket: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{judul}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{ket}</p>
      </div>
      {children}
    </section>
  );
}

const tombol =
  "inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 aria-disabled:pointer-events-none aria-disabled:opacity-40";

const pesanPengembalian = (nama: string, unit: string, tgl: string, pic?: Pic | null) =>
  `Halo ${nama},\n\nIni pengingat dari *Techpora* bahwa sewa unit *${unit}* akan jatuh tempo pada *${tgl}*.\n\nMohon kembalikan unit sesuai jadwal.` +
  (pic ? ` PIC serah terima: ${pic.nama}${pic.wa ? ` (${pic.wa})` : ""}.` : "") + `\n\nTerima kasih.`;

const pesanBayar = (nama: string, unit: string, jumlah: number, tgl: string) =>
  `Halo ${nama},\n\nPengingat pembayaran dari *Techpora* untuk sewa unit *${unit}*.\n\nSisa tagihan: ${rp(jumlah)}\nJatuh tempo: ${tgl}\n\nMohon segera lakukan pembayaran. Terima kasih.`;

const pesanTugas = (pic: string, t: Tugas) =>
  `Halo ${pic},\n\nPengingat tugas dari *Techpora*:\n\n*Tugas:* ${t.judul}\n` +
  (t.pelanggan?.nama ? `*Pelanggan:* ${t.pelanggan.nama}\n` : "") +
  `*Jatuh tempo:* ${tglIndo(t.jatuh_tempo)}${t.jam ? ` pukul ${t.jam.slice(0, 5)}` : ""}\n\nMohon segera ditindaklanjuti. Terima kasih.`;

export default function TabWhatsApp({
  pesanan, pembayaran, tugas, pic, muat,
}: {
  pesanan: Pesanan[]; pembayaran: Pembayaran[]; tugas: Tugas[]; pic: Pic[]; muat: () => void;
}) {
  const hariIni = new Date().toISOString().slice(0, 10);
  const bayar = useMemo(() => kelompokkanBayar(pembayaran), [pembayaran]);
  const picDari = (id: string | null) => pic.find((p) => p.id === id) || null;

  const serahTerima = useMemo(() => tugas
    .filter((t) => t.jenis === "serah_terima" && (t.status === "menunggu" || t.status === "dikerjakan"))
    .sort((a, b) => (a.jatuh_tempo + (a.jam || "")).localeCompare(b.jatuh_tempo + (b.jam || ""))), [tugas]);

  const pengembalian = useMemo(() => pesanan
    .filter((p) => p.status === "berjalan" || p.status === "dipesan")
    .sort((a, b) => a.selesai.localeCompare(b.selesai)), [pesanan]);

  const tagihan = useMemo(() => pesanan
    .map((p) => ({ p, sisa: sisaTagihan(p, bayar) }))
    .filter((x) => x.sisa > 0 && sudahJatuhTempo(x.p)), [pesanan, bayar]);

  // Tandai "terkirim" setelah tombol WA ke PIC ditekan, seperti di aplikasi lama.
  const tandaiTerkirim = async (t: Tugas) => {
    await supabase.from("tugas").update({ wa_pic_terkirim: true }).eq("id", t.id);
    muat();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs text-sky-900">
        <p className="text-sm font-semibold">Cara kerja</p>
        <p className="mt-1">Tombol di bawah membuka WhatsApp dengan pesan yang sudah terisi — tinggal tekan kirim. Tidak perlu login atau koneksi tambahan.</p>
      </div>

      <Kartu judul="Jadwal serah terima" ket="Kirim pengingat ke PIC yang bertugas">
        {serahTerima.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">Tidak ada jadwal serah terima.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {serahTerima.map((t) => {
              const p = picDari(t.pic_id);
              const terkirim = (t as Tugas & { wa_pic_terkirim?: boolean }).wa_pic_terkirim;
              return (
                <li key={t.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{t.judul}</p>
                    <p className="text-xs text-muted-foreground">
                      {tglIndo(t.jatuh_tempo)}{t.jam ? ` · ${t.jam.slice(0, 5)}` : ""} · PIC {p?.nama || "-"}{p?.wa ? ` (${p.wa})` : ""}
                      {t.jatuh_tempo < hariIni && <b className="text-rose-600"> · lewat jadwal</b>}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {terkirim && <span className="text-[11px] font-medium text-emerald-600">✓ Terkirim</span>}
                    <a href={p?.wa ? waLink(p.wa, pesanTugas(p.nama, t)) : undefined} target="_blank" rel="noreferrer"
                      aria-disabled={!p?.wa} onClick={() => tandaiTerkirim(t)} className={tombol}>Kirim WA ke PIC</a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Kartu>

      <Kartu judul="Pengingat pengembalian" ket="Kirim ke pelanggan atau PIC sebelum jatuh tempo">
        {pengembalian.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">Tidak ada sewa aktif atau akan datang.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {pengembalian.map((p) => {
              const terlambat = p.status === "berjalan" && p.selesai < hariIni;
              const tPic = tugas.find((t) => t.pesanan_id === p.id && t.pic_id);
              const petugas = picDari(tPic?.pic_id || null);
              const nama = p.pelanggan?.nama || "Pelanggan";
              const unit = p.unit?.nama || p.unit_id;
              return (
                <li key={p.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{nama} · <span className="text-muted-foreground">{unit}</span></p>
                    <p className="text-xs text-muted-foreground">
                      Kembali {tglIndo(p.selesai)} {terlambat && <b className="text-rose-600">(terlambat)</b>} · Telp {p.pelanggan?.wa || "-"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <a href={p.pelanggan?.wa ? waLink(p.pelanggan.wa, pesanPengembalian(nama, unit, tglIndo(p.selesai), petugas)) : undefined}
                      target="_blank" rel="noreferrer" aria-disabled={!p.pelanggan?.wa} className={tombol}>Pelanggan</a>
                    <a href={petugas?.wa ? waLink(petugas.wa, pesanPengembalian(nama, unit, tglIndo(p.selesai), petugas)) : undefined}
                      target="_blank" rel="noreferrer" aria-disabled={!petugas?.wa} className={tombol}>PIC</a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Kartu>

      <Kartu judul="Pengingat pembayaran" ket="Kirim ke pelanggan yang tagihannya belum lunas">
        {tagihan.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">Semua tagihan sudah lunas.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {tagihan.map(({ p, sisa }) => {
              const nama = p.pelanggan?.nama || "Pelanggan";
              const unit = p.unit?.nama || p.unit_id;
              return (
                <li key={p.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{nama} · <span className="text-muted-foreground">{unit}</span></p>
                    <p className="text-xs text-muted-foreground">
                      Sisa <b className="text-rose-600">{rp(sisa)}</b> dari {rp(p.total)} · {p.status_bayar === "sebagian" ? "bayar sebagian" : "belum bayar"} · Telp {p.pelanggan?.wa || "-"}
                    </p>
                  </div>
                  <a href={p.pelanggan?.wa ? waLink(p.pelanggan.wa, pesanBayar(nama, unit, sisa, tglIndo(p.selesai))) : undefined}
                    target="_blank" rel="noreferrer" aria-disabled={!p.pelanggan?.wa} className={tombol}>Kirim pengingat</a>
                </li>
              );
            })}
          </ul>
        )}
      </Kartu>
    </div>
  );
}
