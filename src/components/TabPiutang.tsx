import { useMemo, useState } from "react";
import BuktiBayar, { perluBukti } from "./BuktiBayar";
import { supabase, rp, tglIndo, waLink, kelompokkanBayar, sisaTagihan, pesanGalat, type Pesanan, type Pembayaran, type ItemPesanan } from "@/lib/supabase";

/* Piutang & penagihan: jatuh tempo, umur piutang (aging), pengingat WA sebelum/sesudah jatuh tempo,
   denda telat bayar, riwayat penagihan, konfirmasi pelunasan. */

const hariIni = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
const selisihHari = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
const EMBER: [string, (h: number) => boolean, string][] = [
  ["Belum jatuh tempo", (h) => h < 0, "bg-slate-100 text-slate-700"],
  ["1–7 hari", (h) => h >= 0 && h <= 7, "bg-amber-100 text-amber-800"],
  ["8–30 hari", (h) => h > 7 && h <= 30, "bg-orange-100 text-orange-800"],
  ["31–60 hari", (h) => h > 30 && h <= 60, "bg-rose-100 text-rose-800"],
  ["> 60 hari", (h) => h > 60, "bg-rose-200 text-rose-900"],
];

export default function TabPiutang({ pesanan, pembayaran, muat, setGalat }: {
  pesanan: Pesanan[]; pembayaran: Pembayaran[]; muat: () => void; setGalat: (s: string) => void;
}) {
  const [modal, setModal] = useState<Pesanan | null>(null);
  const [ember, setEmber] = useState<number | null>(null);
  const [riwayat, setRiwayat] = useState<{ id: string; isi: string; waktu: string; jenis: string }[] | null>(null);
  const [riwayatUntuk, setRiwayatUntuk] = useState("");
  const kini = hariIni();
  const bayar = useMemo(() => kelompokkanBayar(pembayaran), [pembayaran]);

  const daftar = useMemo(() => pesanan
    .filter((p) => p.status !== "batal" && p.status !== "menunggu")
    .map((p) => {
      const jt = p.jatuh_tempo_bayar || p.mulai;
      return { p, jt, sisa: sisaTagihan(p, bayar), telatHari: selisihHari(jt, kini) };
    })
    .filter((x) => x.sisa > 0)
    .sort((a, b) => a.jt.localeCompare(b.jt)), [pesanan, bayar, kini]);

  const perEmber = EMBER.map(([, f]) => daftar.filter((x) => f(x.telatHari)));
  const total = daftar.reduce((a, x) => a + x.sisa, 0);
  const lewat = daftar.filter((x) => x.telatHari > 0).reduce((a, x) => a + x.sisa, 0);
  const tampil = ember == null ? daftar : perEmber[ember];
  const tanpaBukti = pesanan.filter((p) => p.status !== "batal" && pembayaran.some((b) => b.pesanan_id === p.id && perluBukti(b)));

  // pembayaran yang masuk setelah jatuh tempo (late payment tracking)
  const telatBayar = useMemo(() => pesanan.filter((p) => p.status !== "batal" && p.status_bayar === "lunas").filter((p) => {
    const akhir = pembayaran.filter((b) => b.pesanan_id === p.id && b.jenis !== "refund").map((b) => b.tanggal).sort().pop();
    return akhir && akhir > (p.jatuh_tempo_bayar || p.mulai);
  }).length, [pesanan, pembayaran]);

  const catatKom = (p: Pesanan, isi: string, jenis = "tagihan") =>
    supabase.from("komunikasi").insert({ pelanggan_id: p.pelanggan_id, isi, jenis });

  const ingatkan = async (x: (typeof daftar)[number]) => {
    const n = x.p.pelanggan?.nama?.split(" ")[0] || "kak";
    const isi = x.telatHari < 0
      ? `Halo kak ${n} 👋 mengingatkan pembayaran sewa ${x.p.unit?.nama || x.p.unit_id} sebesar ${rp(x.sisa)} jatuh tempo ${tglIndo(x.jt)}. Terima kasih 🙏`
      : `Halo kak ${n}, pembayaran sewa ${x.p.unit?.nama || x.p.unit_id} sebesar ${rp(x.sisa)} sudah lewat jatuh tempo (${tglIndo(x.jt)}, ${x.telatHari} hari). Mohon segera ditransfer ya kak 🙏`;
    if (x.p.pelanggan?.wa) window.open(waLink(x.p.pelanggan.wa, isi), "_blank");
    await catatKom(x.p, isi);
  };

  const denda = async (x: (typeof daftar)[number]) => {
    const saran = Math.round((x.sisa * 0.01 * Math.max(1, x.telatHari)) / 1000) * 1000; // saran 1%/hari dari sisa
    const masuk = prompt(`Denda keterlambatan bayar untuk ${x.p.pelanggan?.nama} (${x.telatHari} hari). Nominal (Rp):`, String(saran));
    const n = Number(String(masuk || "").replace(/\D/g, ""));
    if (!n) return;
    const item: ItemPesanan[] = [...(x.p.item || []), { nama: `Denda telat bayar (${x.telatHari} hari)`, jumlah: n }];
    const totalBaru = (x.p.harga_sewa || 0) - (x.p.diskon || 0) + (x.p.harga_antar || 0) + item.reduce((a, i) => a + i.jumlah, 0);
    const { error } = await supabase.from("pesanan").update({ item, total: totalBaru }).eq("id", x.p.id);
    if (error) return setGalat(pesanGalat(error.message));
    await catatKom(x.p, `Denda telat bayar ${rp(n)} ditambahkan ke tagihan.`, "sistem");
    muat();
  };

  const ubahJt = async (p: Pesanan, tgl: string) => {
    const { error } = await supabase.from("pesanan").update({ jatuh_tempo_bayar: tgl }).eq("id", p.id);
    if (error) setGalat(error.message); else muat();
  };

  const lihatRiwayat = async (p: Pesanan) => {
    if (riwayatUntuk === p.id) { setRiwayatUntuk(""); return; }
    const { data } = await supabase.from("komunikasi").select("id,isi,waktu,jenis").eq("pelanggan_id", p.pelanggan_id).order("waktu", { ascending: false }).limit(15);
    setRiwayat(data || []); setRiwayatUntuk(p.id);
  };

  const konfirmasiLunas = async (p: Pesanan) => {
    const isi = `Halo kak ${p.pelanggan?.nama?.split(" ")[0] || ""}, pembayaran sewa ${p.unit?.nama || p.unit_id} sebesar ${rp(p.total)} sudah kami terima LUNAS ✅ Terima kasih sudah sewa di Techpora 🙏`;
    if (p.pelanggan?.wa) window.open(waLink(p.pelanggan.wa, isi), "_blank");
    await catatKom(p, isi, "pelunasan");
  };
  const baruLunas = pesanan.filter((p) => p.status !== "batal" && p.status_bayar === "lunas" && pembayaran.some((b) => b.pesanan_id === p.id && b.jenis !== "refund" && selisihHari(b.tanggal, kini) <= 3 && b.metode !== "tidak tercatat"));

  return (
    <section className="space-y-4">
      {modal && <BuktiBayar pesanan={modal} onTutup={() => setModal(null)} onUbah={muat} />}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {([["Total piutang", rp(total), "text-rose-700"], ["Lewat jatuh tempo", rp(lewat), "text-rose-700"], ["Transaksi belum lunas", String(daftar.length), "text-slate-900"], ["Lunas tapi telat bayar", String(telatBayar), "text-amber-700"]] as const).map(([l, v, w]) => (
          <div key={l} className="rounded-xl border border-border bg-white px-3 py-2.5 shadow-sm"><p className="text-[11px] text-muted-foreground">{l}</p><p className={"text-lg font-bold tabular-nums " + w}>{v}</p></div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-slate-900">Umur piutang (aging)</p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
          {EMBER.map(([l, , w], i) => (
            <button key={l} onClick={() => setEmber(ember === i ? null : i)} className={"rounded-lg px-2 py-2 text-left " + w + (ember === i ? " ring-2 ring-slate-900" : "")}>
              <p className="text-[11px] font-semibold">{l}</p>
              <p className="text-sm font-bold">{rp(perEmber[i].reduce((a, x) => a + x.sisa, 0))}</p>
              <p className="text-[10px]">{perEmber[i].length} transaksi</p>
            </button>
          ))}
        </div>
      </div>

      {tanpaBukti.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-900">{tanpaBukti.length} pesanan punya pembayaran tanpa bukti</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tanpaBukti.slice(0, 20).map((p) => <button key={p.id} onClick={() => setModal(p)} className="rounded-md border border-amber-300 bg-white px-2 py-1 text-[11px] text-amber-900">{p.pelanggan?.nama} · {p.unit_id}</button>)}
          </div>
        </div>
      )}

      {baruLunas.length > 0 && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs font-semibold text-emerald-900">Baru lunas (3 hari terakhir) — kirim konfirmasi pelunasan</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {baruLunas.map((p) => <button key={p.id} onClick={() => konfirmasiLunas(p)} className="rounded-md border border-emerald-300 bg-white px-2 py-1 text-[11px] text-emerald-900">✅ {p.pelanggan?.nama} · {rp(p.total)}</button>)}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-slate-900">{ember == null ? "Semua tagihan belum lunas" : EMBER[ember][0]} <span className="font-normal text-muted-foreground">({tampil.length})</span></p>
        {tampil.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Tidak ada tagihan. 🎉</p>}
        <ul className="space-y-2.5">
          {tampil.map((x) => (
            <li key={x.p.id} className={"rounded-xl border p-3 " + (x.telatHari > 0 ? "border-rose-200 bg-rose-50/40" : "border-border")}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{x.p.pelanggan?.nama}</p>
                  <p className="text-xs text-muted-foreground">{x.p.unit_id} · sewa {tglIndo(x.p.mulai)} · tagihan {rp(x.p.total)}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">Jatuh tempo</span>
                    <input type="date" value={x.jt} onChange={(e) => e.target.value && ubahJt(x.p, e.target.value)} className="rounded border border-border px-1.5 py-0.5 text-xs" />
                    {x.telatHari > 0 ? <b className="text-rose-600">lewat {x.telatHari} hari</b> : x.telatHari === 0 ? <b className="text-amber-600">hari ini</b> : <span className="text-slate-500">{-x.telatHari} hari lagi</span>}
                  </p>
                </div>
                <p className="shrink-0 text-right text-sm font-bold text-rose-700">{rp(x.sisa)}<span className="block text-[10px] font-normal text-muted-foreground">sisa</span></p>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <button onClick={() => setModal(x.p)} className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-white">Catat bayar + bukti</button>
                {x.p.pelanggan?.wa && <button onClick={() => ingatkan(x)} className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white">{x.telatHari < 0 ? "Ingatkan (WA)" : "Tagih (WA)"}</button>}
                {x.telatHari > 0 && <button onClick={() => denda(x)} className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700">+ Denda telat bayar</button>}
                <button onClick={() => lihatRiwayat(x.p)} className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate-600">Riwayat penagihan</button>
              </div>
              {riwayatUntuk === x.p.id && riwayat && (
                <ul className="mt-2 space-y-1 rounded-lg bg-slate-50 p-2 text-xs">
                  {riwayat.length === 0 && <li className="text-muted-foreground">Belum ada riwayat penagihan.</li>}
                  {riwayat.map((r) => <li key={r.id}><span className="text-[10px] text-muted-foreground">{new Date(r.waktu).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })} · {r.jenis}</span><br />{r.isi}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground">Pengingat otomatis: setiap pagi sistem membuat tugas penagihan H-1 sebelum jatuh tempo, lalu tiap minggu setelah lewat jatuh tempo (ke PIC, muncul di Google Calendar PIC). Setiap WA yang dikirim dari sini tercatat di riwayat penagihan.</p>
      </div>
    </section>
  );
}
