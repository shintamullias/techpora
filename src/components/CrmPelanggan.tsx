import { useEffect, useMemo, useState } from "react";
import { supabase, rp, tglIndo, waLink, waktuPesanan, kelompokkanBayar, type Pelanggan, type Pesanan, type Pembayaran } from "@/lib/supabase";

/* CRM: metrik per pelanggan, segmen, loyalitas, risiko, blacklist, catatan internal, riwayat komunikasi WA. */

type Kom = { id: string; waktu: string; jenis: string; isi: string; oleh: string | null };
type Seg = "vip" | "reguler" | "baru" | "tidur" | "berisiko" | "blacklist" | "prospek";
const SEGMEN: Record<Seg, [string, string]> = {
  vip: ["VIP", "bg-amber-100 text-amber-800"], reguler: ["Reguler", "bg-emerald-100 text-emerald-800"],
  baru: ["Baru", "bg-sky-100 text-sky-800"], tidur: ["Tidur", "bg-slate-200 text-slate-700"],
  berisiko: ["Berisiko", "bg-rose-100 text-rose-800"], blacklist: ["Blacklist", "bg-slate-900 text-white"],
  prospek: ["Prospek", "bg-violet-100 text-violet-800"],
};
/* Loyalitas: tier dari jumlah sewa selesai; 1 poin per Rp10.000 yang dibayar. */
const tier = (n: number) => (n >= 10 ? ["Gold", "🥇", "Diskon 15% sewa berikutnya"] : n >= 5 ? ["Silver", "🥈", "Diskon 10% sewa berikutnya"] : n >= 2 ? ["Bronze", "🥉", "Diskon 5% sewa berikutnya"] : ["Member", "·", "Sewa 2× untuk jadi Bronze"]);
const hariSejak = (t?: string | null) => (t ? Math.floor((Date.now() - Date.parse(t)) / 864e5) : Infinity);
const inp = "w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary";

export function hitungMetrik(pelanggan: Pelanggan[], pesanan: Pesanan[], pembayaran: Pembayaran[]) {
  const bayar = kelompokkanBayar(pembayaran);
  const kini = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 16);
  return pelanggan.map((c) => {
    const semua = pesanan.filter((p) => p.pelanggan_id === c.id);
    const sah = semua.filter((p) => p.status !== "batal");
    const selesai = sah.filter((p) => p.status === "selesai");
    const dibayar = sah.reduce((s, p) => s + Math.min(p.total || 0, bayar[p.id] || 0), 0);
    const tagihan = sah.reduce((s, p) => s + (p.total || 0), 0);
    const tunggak = sah.filter((p) => p.mulai <= kini.slice(0, 10)).reduce((s, p) => s + Math.max(0, (p.total || 0) - (bayar[p.id] || 0)), 0);
    const terakhir = sah.map((p) => p.mulai).sort().pop() || null;
    const pertama = sah.map((p) => p.mulai).sort()[0] || null;
    const telat = sah.filter((p) => (p.kembali_pada && new Date(p.kembali_pada).getTime() > Date.parse(waktuPesanan(p).sampai + ":00+07:00") + 3600e3) || (p.status === "berjalan" && waktuPesanan(p).sampai < kini)).length;
    const rusak = sah.filter((p) => (p.item || []).some((i) => /kerusakan|kehilangan/i.test(i.nama))).length;
    const batal = semua.filter((p) => p.status === "batal").length;
    const sewa6bln = sah.filter((p) => hariSejak(p.mulai) <= 180).length;
    // skor risiko 0–100
    const skor = Math.min(100, (c.blacklist ? 100 : 0) + telat * 20 + rusak * 25 + batal * 10 + (tunggak > 0 ? 25 : 0) + (!c.terverifikasi ? 15 : 0));
    const seg: Seg = c.blacklist ? "blacklist" : skor >= 50 ? "berisiko" : sah.length === 0 ? "prospek"
      : dibayar >= 2_000_000 || sah.length >= 8 ? "vip" : sewa6bln >= 3 || sah.length >= 3 ? "reguler"
      : hariSejak(terakhir) > 60 ? "tidur" : "baru";
    return { c, sah, jml: sah.length, selesai: selesai.length, dibayar, tagihan, tunggak, terakhir, pertama, telat, rusak, batal, skor, seg,
      poin: Math.floor(dibayar / 10000), tier: tier(selesai.length), rata: sah.length ? Math.round(tagihan / sah.length) : 0 };
  });
}
export type Metrik = ReturnType<typeof hitungMetrik>[number];

export default function CrmPelanggan({ pelanggan, pesanan, pembayaran, muat, setGalat }: {
  pelanggan: Pelanggan[]; pesanan: Pesanan[]; pembayaran: Pembayaran[]; muat: () => void; setGalat: (s: string) => void;
}) {
  const data = useMemo(() => hitungMetrik(pelanggan, pesanan, pembayaran), [pelanggan, pesanan, pembayaran]);
  const [seg, setSeg] = useState<"" | Seg | "sapa">("");
  const [urut, setUrut] = useState<"dibayar" | "jml" | "terakhir" | "skor">("dibayar");
  const [cari, setCari] = useState("");
  const [pilih, setPilih] = useState<string>("");

  const ada = data.filter((d) => d.jml > 0);
  const aktif90 = ada.filter((d) => hariSejak(d.terakhir) <= 90).length;
  const repeat = ada.length ? Math.round((ada.filter((d) => d.jml >= 2).length / ada.length) * 100) : 0;
  const clv = ada.length ? Math.round(ada.reduce((s, d) => s + d.dibayar, 0) / ada.length) : 0;
  // retensi: pelanggan yang sewa di 90–180 hari lalu dan kembali sewa dalam 90 hari terakhir
  const lalu = ada.filter((d) => d.sah.some((p) => hariSejak(p.mulai) > 90 && hariSejak(p.mulai) <= 180));
  const kembali = lalu.filter((d) => hariSejak(d.terakhir) <= 90).length;
  const retensi = lalu.length ? Math.round((kembali / lalu.length) * 100) : 0;
  // perlu disapa: pernah sewa, sudah 30+ hari tidak sewa, tidak blacklist, belum dihubungi 14 hari terakhir
  const sapa = ada.filter((d) => !d.c.blacklist && hariSejak(d.terakhir) >= 30 && hariSejak(d.c.dihubungi_pada) > 14 && !d.sah.some((p) => p.status !== "selesai"));

  const tampil = (seg === "sapa" ? sapa : data.filter((d) => !seg || d.seg === seg))
    .filter((d) => !cari || d.c.nama.toLowerCase().includes(cari.toLowerCase()) || (d.c.wa || "").includes(cari))
    .sort((a, b) => urut === "terakhir" ? (b.terakhir || "").localeCompare(a.terakhir || "") : (b[urut] as number) - (a[urut] as number));
  const d = data.find((x) => x.c.id === pilih);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {([["Pelanggan", pelanggan.length], ["Aktif 90 hari", aktif90], ["Repeat rate", `${repeat}%`], ["Retensi 90 hari", `${retensi}%`], ["Rata-rata CLV", rp(clv)]] as const).map(([l, v]) => (
          <div key={l} className="rounded-xl border border-border bg-white px-3 py-2.5 shadow-sm">
            <p className="text-[11px] text-muted-foreground">{l}</p><p className="text-lg font-bold tabular-nums text-slate-900">{v}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap gap-1.5">
          <button onClick={() => setSeg("")} className={"rounded-full px-3 py-1.5 text-xs font-semibold " + (!seg ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600")}>Semua</button>
          {(Object.keys(SEGMEN) as Seg[]).map((k) => (
            <button key={k} onClick={() => setSeg(k)} className={"rounded-full px-3 py-1.5 text-xs font-semibold " + (seg === k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600")}>
              {SEGMEN[k][0]} ({data.filter((x) => x.seg === k).length})
            </button>
          ))}
          <button onClick={() => setSeg("sapa")} className={"rounded-full px-3 py-1.5 text-xs font-semibold " + (seg === "sapa" ? "bg-primary text-white" : "bg-cyan-50 text-cyan-800")}>📣 Perlu disapa ({sapa.length})</button>
        </div>
        <div className="mb-3 grid grid-cols-2 gap-2">
          <input className={inp} placeholder="Cari nama / WA" value={cari} onChange={(e) => setCari(e.target.value)} />
          <select className={inp} value={urut} onChange={(e) => setUrut(e.target.value as typeof urut)}>
            <option value="dibayar">Urut: total belanja (CLV)</option><option value="jml">Urut: frekuensi sewa</option>
            <option value="terakhir">Urut: sewa terakhir</option><option value="skor">Urut: risiko</option>
          </select>
        </div>
        {seg === "sapa" && <p className="mb-2 text-xs text-muted-foreground">Pelanggan yang sudah 30+ hari tidak menyewa dan belum dihubungi 2 minggu terakhir. Kirim WA lalu otomatis tercatat.</p>}

        <div className="-mx-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">Pelanggan</th><th className="px-2 py-2 font-medium">Segmen</th>
              <th className="px-2 py-2 text-right font-medium">Sewa</th><th className="px-2 py-2 text-right font-medium">Total belanja</th>
              <th className="px-2 py-2 text-right font-medium">Terakhir</th><th className="px-4 py-2 text-right font-medium">Risiko</th>
            </tr></thead>
            <tbody>
              {tampil.slice(0, 150).map((x) => (
                <tr key={x.c.id} onClick={() => setPilih(x.c.id)} className="cursor-pointer border-b border-border/60 hover:bg-slate-50">
                  <td className="px-4 py-2"><p className="font-medium text-slate-900">{x.c.nama} <span className="text-xs">{x.tier[1]}</span></p><p className="text-[11px] text-muted-foreground">{x.c.wa}</p></td>
                  <td className="px-2 py-2"><span className={"rounded-full px-2 py-0.5 text-[11px] font-semibold " + SEGMEN[x.seg][1]}>{SEGMEN[x.seg][0]}</span></td>
                  <td className="px-2 py-2 text-right tabular-nums">{x.jml}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{rp(x.dibayar)}</td>
                  <td className="px-2 py-2 text-right text-xs text-slate-600">{x.terakhir ? tglIndo(x.terakhir) : "—"}</td>
                  <td className={"px-4 py-2 text-right text-xs font-semibold " + (x.skor >= 50 ? "text-rose-600" : x.skor >= 25 ? "text-amber-600" : "text-emerald-600")}>{x.skor >= 50 ? "Tinggi" : x.skor >= 25 ? "Sedang" : "Rendah"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tampil.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Tidak ada pelanggan di segmen ini.</p>}
      </section>

      {d && <DetailCrm d={d} onTutup={() => setPilih("")} muat={muat} setGalat={setGalat} />}
    </div>
  );
}

function DetailCrm({ d, onTutup, muat, setGalat }: { d: Metrik; onTutup: () => void; muat: () => void; setGalat: (s: string) => void }) {
  const c = d.c;
  const [kom, setKom] = useState<Kom[]>([]);
  const [catatan, setCatatan] = useState(c.catatan_internal || "");
  const [baru, setBaru] = useState("");
  const muatKom = async () => {
    const { data } = await supabase.from("komunikasi").select("*").eq("pelanggan_id", c.id).order("waktu", { ascending: false }).limit(50);
    setKom((data as Kom[]) || []);
  };
  useEffect(() => { muatKom(); setCatatan(c.catatan_internal || ""); }, [c.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const catat = async (isi: string, jenis = "catatan") => {
    const { error } = await supabase.from("komunikasi").insert({ pelanggan_id: c.id, isi, jenis });
    if (error) return setGalat(error.message);
    if (jenis !== "catatan") await supabase.from("pelanggan").update({ dihubungi_pada: new Date().toISOString() }).eq("id", c.id);
    muatKom(); muat();
  };
  const kirimWA = (isi: string, jenis: string) => { if (c.wa) window.open(waLink(c.wa, isi), "_blank"); catat(isi, jenis); };
  const simpanCatatan = async () => {
    const { error } = await supabase.from("pelanggan").update({ catatan_internal: catatan.trim() || null }).eq("id", c.id);
    if (error) setGalat(error.message); else muat();
  };
  const blacklist = async () => {
    if (c.blacklist) {
      if (!confirm(`Buka blacklist ${c.nama}?`)) return;
      await supabase.from("pelanggan").update({ blacklist: false, blacklist_alasan: null }).eq("id", c.id);
      await catat(`Blacklist dibuka`, "sistem");
    } else {
      const alasan = prompt(`Alasan blacklist ${c.nama}?`);
      if (!alasan) return;
      await supabase.from("pelanggan").update({ blacklist: true, blacklist_alasan: alasan }).eq("id", c.id);
      await catat(`Masuk blacklist: ${alasan}`, "sistem");
    }
    muat();
  };

  const nama1 = c.nama.split(" ")[0];
  const TEMPLATE: [string, string, string][] = [
    ["Sapa kembali", "sapa", `Halo kak ${nama1}! 👋 Lama nggak sewa di Techpora nih. Kalau butuh laptop atau sepatu lagi, unit kami ready — kabari aja tanggalnya ya 🙏`],
    ["Info loyalitas", "promo", `Halo kak ${nama1}, terima kasih sudah ${d.selesai}× sewa di Techpora! Kakak sekarang member ${d.tier[0]} ${d.tier[1]} dengan ${d.poin} poin. Benefit: ${d.tier[2]}. Mau booking lagi kapan kak?`],
    ...(d.tunggak > 0 ? [["Tagih sisa", "tagihan", `Halo kak ${nama1}, mengingatkan masih ada sisa pembayaran sewa ${rp(d.tunggak)}. Boleh dibantu transfer ya kak 🙏`] as [string, string, string]] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onTutup}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{c.nama} <span className={"ml-1 rounded-full px-2 py-0.5 text-[11px] font-semibold " + SEGMEN[d.seg][1]}>{SEGMEN[d.seg][0]}</span></p>
            <p className="text-xs text-muted-foreground">{c.wa}{c.terverifikasi ? " · ✓ terverifikasi" : " · belum diverifikasi"}</p>
            {c.blacklist && <p className="mt-1 text-xs font-semibold text-rose-700">Blacklist: {c.blacklist_alasan}</p>}
          </div>
          <button onClick={onTutup} aria-label="Tutup" className="text-slate-400">✕</button>
        </div>
        <div className="space-y-4 px-5 py-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            {([["Sewa", d.jml], ["Total belanja", rp(d.dibayar)], ["Rata-rata", rp(d.rata)], ["Sewa terakhir", d.terakhir ? tglIndo(d.terakhir) : "—"], ["Pelanggan sejak", d.pertama ? tglIndo(d.pertama) : "—"], ["Tunggakan", rp(d.tunggak)]] as const).map(([l, v]) => (
              <div key={l} className="rounded-lg bg-slate-50 px-2 py-2"><p className="text-[10px] text-muted-foreground">{l}</p><p className="truncate text-sm font-bold text-slate-900">{v}</p></div>
            ))}
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2.5 text-sm">
            <b>{d.tier[1]} {d.tier[0]}</b> · {d.poin} poin · <span className="text-slate-600">{d.tier[2]}</span>
          </div>

          <div className="rounded-lg border border-border px-3 py-2.5">
            <p className="text-xs font-semibold text-muted-foreground">Penilaian risiko: <span className={d.skor >= 50 ? "text-rose-600" : d.skor >= 25 ? "text-amber-600" : "text-emerald-600"}>{d.skor}/100</span></p>
            <p className="mt-1 text-xs text-slate-600">Telat kembali {d.telat}× · kerusakan/kehilangan {d.rusak}× · batal {d.batal}× · {d.tunggak ? `tunggakan ${rp(d.tunggak)}` : "tanpa tunggakan"} · {c.terverifikasi ? "terverifikasi" : "belum diverifikasi"}</p>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold text-muted-foreground">Catatan internal (tidak terlihat pelanggan)</p>
            <textarea className={inp + " min-h-[64px]"} value={catatan} onChange={(e) => setCatatan(e.target.value)} onBlur={simpanCatatan} placeholder="mis. suka minta antar pagi, selalu tepat waktu" />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Kirim WhatsApp (otomatis tercatat)</p>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATE.map(([t, j, isi]) => <button key={t} onClick={() => kirimWA(isi, j)} disabled={!c.wa} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">{t}</button>)}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Riwayat komunikasi</p>
            <div className="mb-2 flex gap-2">
              <input className={inp} value={baru} onChange={(e) => setBaru(e.target.value)} placeholder="Catat obrolan/telepon…" />
              <button onClick={() => { if (baru.trim()) { catat(baru.trim(), "manual"); setBaru(""); } }} className="shrink-0 rounded-lg bg-primary px-3 text-xs font-semibold text-white">Catat</button>
            </div>
            {kom.length === 0 ? <p className="text-xs text-muted-foreground">Belum ada catatan komunikasi.</p> : (
              <ul className="max-h-48 space-y-1.5 overflow-y-auto">
                {kom.map((k) => (
                  <li key={k.id} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs">
                    <p className="text-[10px] text-muted-foreground">{new Date(k.waktu).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })} · {k.jenis}{k.oleh ? ` · ${k.oleh}` : ""}</p>
                    <p className="whitespace-pre-line text-slate-700">{k.isi}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Riwayat transaksi</p>
            <ul className="divide-y divide-border/60 rounded-lg border border-border">
              {[...d.sah, ...[]].sort((a, b) => b.mulai.localeCompare(a.mulai)).slice(0, 20).map((p) => (
                <li key={p.id} className="flex justify-between gap-2 px-2.5 py-1.5 text-xs">
                  <span className="truncate">{tglIndo(p.mulai)} · {p.unit_id} {p.unit?.nama}</span>
                  <span className={"shrink-0 " + (p.status_bayar === "lunas" ? "text-emerald-700" : "text-rose-600")}>{rp(p.total)}</span>
                </li>
              ))}
              {d.sah.length === 0 && <li className="px-2.5 py-2 text-xs text-muted-foreground">Belum ada transaksi.</li>}
            </ul>
          </div>

          <button onClick={blacklist} className={"w-full rounded-lg py-2.5 text-sm font-semibold " + (c.blacklist ? "border border-border text-slate-700" : "bg-slate-900 text-white")}>
            {c.blacklist ? "Buka blacklist" : "Masukkan ke blacklist"}
          </button>
        </div>
      </div>
    </div>
  );
}
