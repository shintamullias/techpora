import { useMemo } from "react";
import { supabase, rp, hariIni, tambahHari, tglHariIndo, waLink, type Tugas, type Pesanan, type Pembayaran, type StatusTugas } from "@/lib/supabase";
import { hitungBayar } from "@/lib/admin-data";
import { Kartu, Kosong, Lencana, Tombol, TautanTombol } from "./ui";

type Tab = "beranda" | "kalender" | "pesanan" | "uang" | "data" | "atur";

const jamTampil = (j?: string | null, bawaan = "09:00") => (j || bawaan).slice(0, 5);

function pesanPelanggan(t: Tugas, p?: Pesanan) {
  const nama = t.pelanggan?.nama || p?.pelanggan?.nama || "";
  const unit = p?.unit?.nama || t.unit_id || "unit";
  const jam = jamTampil(t.jam);
  if (t.jenis === "pengembalian")
    return `Halo kak ${nama}, mengingatkan ${unit} dijadwalkan kembali ${tglHariIndo(t.jatuh_tempo)} pukul ${jam}. Kalau mau perpanjang, kabari kami dulu ya. Terima kasih 🙏`;
  if (t.jenis === "pengingat_bayar")
    return `Halo kak ${nama}, mengingatkan sisa pembayaran sewa ${unit}. Terima kasih 🙏`;
  const lokasi = p && p.antar !== "tidak" ? `Kami antar ke ${p.alamat || "alamat yang disepakati"}.` : "Diambil di tempat kami.";
  return `Halo kak ${nama}, mengingatkan serah terima ${unit} ${tglHariIndo(t.jatuh_tempo)} pukul ${jam}. ${lokasi} Mohon siapkan KTP asli ya. Terima kasih 🙏`;
}

function pesanPic(t: Tugas, p?: Pesanan) {
  const nama = t.pelanggan?.nama || p?.pelanggan?.nama || "-";
  const wa = t.pelanggan?.wa || p?.pelanggan?.wa || "-";
  return `Pengingat tugas: ${t.judul}\n${tglHariIndo(t.jatuh_tempo)} pukul ${jamTampil(t.jam)}\nPelanggan: ${nama} (${wa})` +
    (p && p.antar !== "tidak" ? `\nAlamat: ${p.alamat || "-"}` : "") + (p?.catatan ? `\nCatatan: ${p.catatan}` : "");
}

export default function Beranda({ tugas, pesanan, pembayaran, muat, galat, keTab }: {
  tugas: Tugas[]; pesanan: Pesanan[]; pembayaran: Pembayaran[];
  muat: () => void; galat: (s: string) => void; keTab: (t: Tab) => void;
}) {
  const ini = hariIni();
  const besok = tambahHari(ini, 1);
  const pesananById = useMemo(() => Object.fromEntries(pesanan.map((p) => [p.id, p])), [pesanan]);
  const bayar = useMemo(() => hitungBayar(pesanan, pembayaran), [pesanan, pembayaran]);

  const aktif = pesanan.filter((p) => p.status === "berjalan").length;
  const datang = pesanan.filter((p) => p.status === "dipesan").length;
  const piutang = pesanan.reduce((s, p) => s + (bayar[p.id]?.status === "batal" ? 0 : bayar[p.id]?.sisa || 0), 0);

  const tugasAktif = tugas.filter((t) => t.status === "menunggu" || t.status === "dikerjakan");
  const telat = tugasAktif.filter((t) => t.jatuh_tempo < ini);
  const tugasIni = tugasAktif.filter((t) => t.jatuh_tempo <= ini);
  const urut = (a: Tugas, b: Tugas) => (a.jatuh_tempo + (a.jam || "")).localeCompare(b.jatuh_tempo + (b.jam || ""));

  // Pesanan lama (sebelum otomasi) belum punya tugas: tetap muncul di agenda.
  const adaTugas = new Set(tugas.filter((t) => t.status !== "batal").map((t) => t.pesanan_id).filter(Boolean));
  const tanpaTugas = (tgl: string) =>
    pesanan.filter((p) => p.status === "dipesan" && p.mulai === tgl && !adaTugas.has(p.id));

  const ubah = async (t: Tugas, status: StatusTugas) => {
    const { error } = await supabase.from("tugas").update({ status }).eq("id", t.id);
    if (error) return galat(error.message);
    muat();
  };

  const tandaiWa = async (t: Tugas, siapa: "pel" | "pic") => {
    const { error } = await supabase.from("tugas")
      .update(siapa === "pel" ? { wa_pelanggan_terkirim: true } : { wa_pic_terkirim: true }).eq("id", t.id);
    if (error) galat(error.message); else muat();
  };

  const Baris = ({ t }: { t: Tugas }) => {
    const p = t.pesanan_id ? pesananById[t.pesanan_id] : undefined;
    const lewat = t.jatuh_tempo < ini;
    const waPel = t.pelanggan?.wa || p?.pelanggan?.wa;
    const waPic = t.pic?.wa;
    return (
      <li className={"rounded-xl border p-3 " + (lewat ? "border-red-200 bg-red-50/50" : "border-border bg-card")}>
        <div className="flex items-start gap-3">
          <button
            onClick={() => ubah(t, "selesai")}
            aria-label={"Tandai selesai: " + t.judul}
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border text-transparent hover:border-primary hover:text-primary"
          >✓</button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-foreground">{t.judul}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <span className={lewat ? "font-semibold text-red-600" : ""}>{lewat ? "Telat · " : ""}{tglHariIndo(t.jatuh_tempo)}</span>
              {" · "}{jamTampil(t.jam)}
              {t.pic?.nama ? <> · PIC <b className="text-foreground">{t.pic.nama}</b></> : <> · <span className="text-amber-600">belum ada PIC</span></>}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {waPel && (
                <TautanTombol
                  varian={t.wa_pelanggan_terkirim ? "hantu" : "lembut"}
                  href={waLink(waPel, pesanPelanggan(t, p))}
                  onClick={() => tandaiWa(t, "pel")}
                >{t.wa_pelanggan_terkirim ? "✓ WA pelanggan terkirim" : "WA pelanggan"}</TautanTombol>
              )}
              {waPic && (
                <TautanTombol
                  varian={t.wa_pic_terkirim ? "hantu" : "garis"}
                  href={waLink(waPic, pesanPic(t, p))}
                  onClick={() => tandaiWa(t, "pic")}
                >{t.wa_pic_terkirim ? "✓ WA PIC terkirim" : "WA PIC"}</TautanTombol>
              )}
              {t.status === "menunggu" && <Tombol kecil varian="hantu" onClick={() => ubah(t, "dikerjakan")}>Mulai</Tombol>}
            </div>
          </div>
        </div>
      </li>
    );
  };

  const hariIniList = [...tugasIni].sort(urut);
  const besokList = tugasAktif.filter((t) => t.jatuh_tempo === besok).sort(urut);

  return (
    <>
      {/* Ringkasan: satu baris angka yang bisa diketuk */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Angka label="Unit di luar" nilai={aktif} onClick={() => keTab("pesanan")} />
        <Angka label="Akan datang" nilai={datang} onClick={() => keTab("kalender")} />
        <Angka label="Tugas hari ini" nilai={tugasIni.length} nada={telat.length > 0 ? "merah" : undefined} sub={telat.length > 0 ? `${telat.length} telat` : undefined} />
        <Angka label="Belum dibayar" nilai={rp(piutang)} nada={piutang > 0 ? "merah" : "hijau"} onClick={() => keTab("uang")} />
      </div>

      <Kartu judul="Hari ini" aksi={<Lencana nada={hariIniList.length ? "biru" : "hijau"}>{hariIniList.length} tugas</Lencana>}>
        {hariIniList.length === 0 && tanpaTugas(ini).length === 0 ? (
          <Kosong>Tidak ada jadwal hari ini. Santai dulu ✨</Kosong>
        ) : (
          <ul className="space-y-2.5">
            {hariIniList.map((t) => <Baris key={t.id} t={t} />)}
            {tanpaTugas(ini).map((p) => (
              <li key={p.id} className="rounded-xl border border-border bg-card p-3 text-sm">
                <p className="font-semibold text-foreground">Antar {p.unit?.nama || p.unit_id} — {p.pelanggan?.nama}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{jamTampil(p.jam, "08:00")} · {p.antar === "tidak" ? "Diambil di tempat" : "Diantar"} · belum punya tugas</p>
              </li>
            ))}
          </ul>
        )}

        {besokList.length > 0 && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-2.5 text-sm font-semibold text-muted-foreground">Besok</p>
            <ul className="space-y-2.5">{besokList.slice(0, 4).map((t) => <Baris key={t.id} t={t} />)}</ul>
          </div>
        )}
      </Kartu>

      <div className="grid grid-cols-2 gap-3">
        <Tombol varian="utama" penuh onClick={() => keTab("pesanan")}>+ Pesanan baru</Tombol>
        <Tombol penuh onClick={() => keTab("uang")}>Catat pembayaran</Tombol>
      </div>
    </>
  );
}

function Angka({ label, nilai, sub, nada, onClick }: {
  label: string; nilai: number | string; sub?: string; nada?: "merah" | "hijau"; onClick?: () => void;
}) {
  const warna = nada === "merah" ? "text-red-600" : nada === "hijau" ? "text-emerald-600" : "text-foreground";
  const isi = (
    <>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={"mt-1 text-2xl font-bold tabular-nums " + warna}>{nilai}</p>
      {sub && <p className="text-xs font-semibold text-red-600">{sub}</p>}
    </>
  );
  const kelas = "aui-masuk rounded-2xl border border-border bg-card p-3.5 text-left shadow-sm";
  return onClick
    ? <button onClick={onClick} className={kelas + " hover:border-primary/40"}>{isi}</button>
    : <div className={kelas}>{isi}</div>;
}
