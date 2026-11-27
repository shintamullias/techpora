import { useEffect, useState } from "react";
import { supabase, rp, tglIndo, waktuPesanan, pesanGalat, type Pesanan, type Unit, type Pembayaran, type ItemPesanan } from "@/lib/supabase";

const inp = "w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2.5 text-foreground outline-none focus:border-primary";
const kiniWIB = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 16);
const tambahMenit = (t: string, m: number) => new Date(Date.parse(t + ":00Z") + m * 60000).toISOString().slice(0, 16);
const hariAntara = (a: string, b: string) => Math.max(1, Math.round((Date.parse(b) - Date.parse(a)) / 864e5));
const jumlahItem = (it: ItemPesanan[]) => it.reduce((s, i) => s + (Number(i.jumlah) || 0), 0);

type Foto = { id: string; tahap: string; path: string; catatan: string | null };

function Modal({ judul, sub, onTutup, children }: { judul: string; sub?: string; onTutup: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onTutup}>
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div><p className="font-semibold text-slate-900">{judul}</p>{sub && <p className="text-xs text-muted-foreground">{sub}</p>}</div>
          <button onClick={onTutup} aria-label="Tutup" className="text-slate-400">✕</button>
        </div>
        <div className="space-y-3 px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

/** Foto kondisi unit per tahap (serah terima / pengembalian). */
function FotoKondisi({ p, tahap }: { p: Pesanan; tahap: "serah" | "kembali" }) {
  const [foto, setFoto] = useState<Foto[]>([]);
  const [url, setUrl] = useState<Record<string, string>>({});
  const [sibuk, setSibuk] = useState(false);
  const muat = async () => {
    const { data } = await supabase.from("foto_kondisi").select("*").eq("pesanan_id", p.id).eq("tahap", tahap).order("dibuat_pada");
    const f = (data as Foto[]) || [];
    setFoto(f);
    if (f.length) {
      const { data: s } = await supabase.storage.from("dokumen").createSignedUrls(f.map((x) => x.path), 600);
      setUrl(Object.fromEntries((s || []).map((x, i) => [f[i].id, x.signedUrl || ""])));
    }
  };
  useEffect(() => { muat(); }, [p.id, tahap]); // eslint-disable-line react-hooks/exhaustive-deps
  const unggah = async (files: FileList | null) => {
    if (!files?.length) return;
    setSibuk(true);
    for (const file of Array.from(files)) {
      const path = `kondisi/${p.id}/${tahap}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${(file.name.split(".").pop() || "jpg").toLowerCase()}`;
      const { error } = await supabase.storage.from("dokumen").upload(path, file, { contentType: file.type || undefined });
      if (!error) await supabase.from("foto_kondisi").insert({ pesanan_id: p.id, tahap, path });
    }
    setSibuk(false); muat();
  };
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Foto kondisi unit {tahap === "serah" ? "sebelum diserahkan" : "saat dikembalikan"}</p>
      <div className="grid grid-cols-4 gap-1.5">
        {foto.map((f) => (
          <a key={f.id} href={url[f.id]} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden rounded-lg bg-slate-100">
            {url[f.id] && <img src={url[f.id]} alt="" className="h-full w-full object-cover" />}
          </a>
        ))}
        <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border text-center text-[11px] text-muted-foreground">
          {sibuk ? "…" : "+ Foto"}
          <input type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={(e) => unggah(e.target.files)} />
        </label>
      </div>
    </div>
  );
}

/** Serah terima: foto kondisi awal, terima deposit, lalu status Berjalan. */
export function ModalSerahTerima({ p, onTutup, onSelesai, setGalat }: { p: Pesanan; onTutup: () => void; onSelesai: () => void; setGalat: (s: string) => void }) {
  const [depositMasuk, setDepositMasuk] = useState(p.deposit_status !== "belum");
  const simpan = async () => {
    const { error } = await supabase.from("pesanan").update({
      status: "berjalan", ...(p.deposit ? { deposit_status: depositMasuk ? "diterima" : "belum" } : {}),
    }).eq("id", p.id);
    if (error) return setGalat(pesanGalat(error.message));
    onSelesai();
  };
  return (
    <Modal judul="Serah terima unit" sub={`${p.unit_id} ${p.unit?.nama || ""} · ${p.pelanggan?.nama}`} onTutup={onTutup}>
      <FotoKondisi p={p} tahap="serah" />
      {!!p.deposit && (
        <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm">
          <input type="checkbox" checked={depositMasuk} onChange={(e) => setDepositMasuk(e.target.checked)} />
          Deposit {rp(p.deposit)} sudah diterima
        </label>
      )}
      <button onClick={simpan} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">Serahkan unit (status Berjalan)</button>
    </Modal>
  );
}

/** Pengembalian: hitung denda telat otomatis, biaya kerusakan/kehilangan, kembali lebih awal, deposit. */
export function ModalPengembalian({ p, unit, onTutup, onSelesai, setGalat }: { p: Pesanan; unit: Unit[]; onTutup: () => void; onSelesai: () => void; setGalat: (s: string) => void }) {
  const u = unit.find((x) => x.id === p.unit_id);
  const kini = kiniWIB();
  const rencana = waktuPesanan(p).sampai;
  const telatMenit = Math.max(0, (Date.parse(kini + ":00Z") - Date.parse(rencana + ":00Z")) / 60000);
  const hariTelat = telatMenit > 60 ? Math.ceil((telatMenit - 60) / 1440) : 0; // toleransi 1 jam
  const lebihAwal = kini < rencana;
  const [denda, setDenda] = useState(String(hariTelat * (u?.harian || 0)));
  const [rusak, setRusak] = useState("");
  const [catatan, setCatatan] = useState("");
  const [potongAwal, setPotongAwal] = useState("");
  const [potongDeposit, setPotongDeposit] = useState("");
  const angka = (s: string) => Number(s.replace(/\D/g, "")) || 0;

  const simpan = async () => {
    const tambah: ItemPesanan[] = [];
    if (angka(denda)) tambah.push({ nama: `Denda keterlambatan (${hariTelat || "?"} hari)`, jumlah: angka(denda) });
    if (angka(rusak)) tambah.push({ nama: `Biaya kerusakan/kehilangan${catatan ? `: ${catatan}` : ""}`, jumlah: angka(rusak) });
    if (lebihAwal && angka(potongAwal)) tambah.push({ nama: "Potongan kembali lebih awal", jumlah: -angka(potongAwal) });
    const item = [...(p.item || []), ...tambah];
    const total = (p.harga_sewa || 0) - (p.diskon || 0) + (p.harga_antar || 0) + jumlahItem(item);
    const selesai = lebihAwal ? kini.slice(0, 10) : p.selesai;
    const isi: Record<string, unknown> = {
      status: "selesai", item, total, kembali_pada: new Date().toISOString(), kembali_catatan: catatan || null,
      ...(lebihAwal ? { selesai, jam_selesai: kini.slice(11), total_hari: hariAntara(p.mulai, selesai) } : {}),
    };
    if (p.deposit && p.deposit_status === "diterima") {
      const pot = Math.min(angka(potongDeposit), p.deposit);
      Object.assign(isi, { deposit_status: pot ? "dipotong" : "dikembalikan", deposit_potong: pot });
    }
    const { error } = await supabase.from("pesanan").update(isi).eq("id", p.id);
    if (error) return setGalat(pesanGalat(error.message));
    onSelesai();
  };

  return (
    <Modal judul="Pengembalian unit" sub={`${p.unit_id} ${u?.nama || ""} · ${p.pelanggan?.nama}`} onTutup={onTutup}>
      <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
        Jadwal kembali <b>{tglIndo(rencana.slice(0, 10))} {rencana.slice(11)}</b> · sekarang <b>{tglIndo(kini.slice(0, 10))} {kini.slice(11)}</b>
        {hariTelat > 0 && <span className="block font-semibold text-rose-700">Terlambat {hariTelat} hari (toleransi 1 jam) · {rp(u?.harian || 0)}/hari</span>}
        {lebihAwal && <span className="block font-semibold text-sky-700">Kembali lebih awal — tanggal selesai disesuaikan ke hari ini.</span>}
      </div>
      <FotoKondisi p={p} tahap="kembali" />
      {(hariTelat > 0 || angka(denda) > 0) && (
        <label className="block text-xs font-semibold text-muted-foreground">Denda keterlambatan (Rp)
          <input className={inp + " mt-1"} inputMode="numeric" value={denda} onChange={(e) => setDenda(e.target.value)} />
        </label>
      )}
      <label className="block text-xs font-semibold text-muted-foreground">Biaya kerusakan / kehilangan (Rp)
        <input className={inp + " mt-1"} inputMode="numeric" value={rusak} placeholder="0 bila unit baik" onChange={(e) => setRusak(e.target.value)} />
      </label>
      <input className={inp} value={catatan} placeholder="Catatan kondisi (mis. layar tergores)" onChange={(e) => setCatatan(e.target.value)} />
      {lebihAwal && (
        <label className="block text-xs font-semibold text-muted-foreground">Potongan untuk sisa hari (opsional, Rp)
          <input className={inp + " mt-1"} inputMode="numeric" value={potongAwal} placeholder="0 = tanpa potongan" onChange={(e) => setPotongAwal(e.target.value)} />
        </label>
      )}
      {!!p.deposit && p.deposit_status === "diterima" && (
        <label className="block text-xs font-semibold text-muted-foreground">Deposit {rp(p.deposit)} — dipotong berapa? (Rp)
          <input className={inp + " mt-1"} inputMode="numeric" value={potongDeposit} placeholder="0 = dikembalikan penuh" onChange={(e) => setPotongDeposit(e.target.value)} />
        </label>
      )}
      <button onClick={simpan} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">Selesaikan sewa</button>
      <p className="text-[11px] text-muted-foreground">Denda dan biaya kerusakan masuk ke tagihan pesanan, jadi muncul di Piutang sampai dibayar.</p>
    </Modal>
  );
}

/** Perpanjang sewa: geser tanggal kembali & tambah biaya perpanjangan. */
export function ModalPerpanjang({ p, unit, onTutup, onSelesai, setGalat }: { p: Pesanan; unit: Unit[]; onTutup: () => void; onSelesai: () => void; setGalat: (s: string) => void }) {
  const u = unit.find((x) => x.id === p.unit_id);
  const lama = waktuPesanan(p).sampai;
  const [hari, setHari] = useState("1");
  const n = Math.max(1, Number(hari) || 1);
  const baru = tambahMenit(lama, n * 1440);
  const [biaya, setBiaya] = useState(String((u?.harian || 0) * n));
  useEffect(() => { setBiaya(String((u?.harian || 0) * n)); }, [n, u?.harian]);
  const simpan = async () => {
    const item = [...(p.item || []), { nama: `Perpanjangan ${n} hari s/d ${tglIndo(baru.slice(0, 10))}`, jumlah: Number(biaya.replace(/\D/g, "")) || 0 }];
    const total = (p.harga_sewa || 0) - (p.diskon || 0) + (p.harga_antar || 0) + jumlahItem(item);
    const { error } = await supabase.from("pesanan").update({
      item, total, selesai: baru.slice(0, 10), jam_selesai: baru.slice(11), total_hari: hariAntara(p.mulai, baru.slice(0, 10)),
    }).eq("id", p.id);
    if (error) return setGalat(pesanGalat(error.message));
    onSelesai();
  };
  return (
    <Modal judul="Perpanjang sewa" sub={`${p.unit_id} ${u?.nama || ""} · ${p.pelanggan?.nama}`} onTutup={onTutup}>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs font-semibold text-muted-foreground">Tambah hari<input className={inp + " mt-1"} type="number" min={1} value={hari} onChange={(e) => setHari(e.target.value)} /></label>
        <label className="text-xs font-semibold text-muted-foreground">Biaya (Rp)<input className={inp + " mt-1"} inputMode="numeric" value={biaya} onChange={(e) => setBiaya(e.target.value)} /></label>
      </div>
      <p className="text-xs text-slate-600">Kembali baru: <b>{tglIndo(baru.slice(0, 10))} {baru.slice(11)}</b> (sebelumnya {tglIndo(lama.slice(0, 10))} {lama.slice(11)})</p>
      <button onClick={simpan} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">Simpan perpanjangan</button>
      <p className="text-[11px] text-muted-foreground">Ditolak otomatis kalau unit sudah dibooking orang lain di tanggal baru.</p>
    </Modal>
  );
}

/** Cetak invoice / konfirmasi booking (bisa disimpan sebagai PDF dari menu cetak). */
export function cetakDokumen(jenis: "invoice" | "konfirmasi", p: Pesanan, unit: Unit[], bayar: Pembayaran[]) {
  const u = unit.find((x) => x.id === p.unit_id);
  const w = waktuPesanan(p);
  const milik = bayar.filter((b) => b.pesanan_id === p.id);
  const diterima = milik.reduce((s, b) => s + (b.jenis === "refund" ? -1 : 1) * b.jumlah, 0);
  const no = `${jenis === "invoice" ? "INV" : "BK"}-${p.mulai.replaceAll("-", "").slice(2)}-${p.id.slice(0, 4).toUpperCase()}`;
  const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
  const baris = [
    [`Sewa ${u?.nama || p.unit_id} · ${p.durasi_jumlah} ${p.durasi_tipe}`, p.harga_sewa],
    ...(p.diskon ? [[`Voucher ${p.voucher_kode || ""}`, -p.diskon]] : []),
    ...(p.harga_antar ? [["Antar / jemput", p.harga_antar]] : []),
    ...(p.item || []).map((i) => [i.nama, i.jumlah]),
  ] as [string, number][];
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${no}</title>
<style>body{font-family:system-ui,sans-serif;color:#0f172a;max-width:720px;margin:24px auto;padding:0 16px;font-size:14px}h1{font-size:20px;margin:0}
.k{color:#64748b;font-size:12px}table{width:100%;border-collapse:collapse;margin-top:12px}td,th{padding:8px 4px;border-bottom:1px solid #e2e8f0;text-align:left}
td:last-child,th:last-child{text-align:right}.tot td{font-weight:700;border-top:2px solid #0f172a}.g{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
.box{border:1px solid #e2e8f0;border-radius:8px;padding:10px}.b{display:inline-block;padding:2px 8px;border-radius:99px;background:#ecfeff;color:#0e7490;font-size:12px;font-weight:600}
@media print{button{display:none}}</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div><h1>Techpora</h1><div class="k">Sewa laptop & sepatu · Rawamangun, Jakarta Timur<br>WA 0821-7798-4041 · techpora.id</div></div>
<div style="text-align:right"><b>${jenis === "invoice" ? "INVOICE" : "KONFIRMASI BOOKING"}</b><br><span class="k">${no}<br>${tglIndo(new Date().toISOString().slice(0, 10))}</span></div></div>
<div class="g"><div class="box"><div class="k">Penyewa</div><b>${esc(p.pelanggan?.nama)}</b><br>${esc(p.pelanggan?.wa)}</div>
<div class="box"><div class="k">Unit</div><b>${esc(p.unit_id)} · ${esc(u?.nama)}</b><br><span class="k">${esc(u?.spek)}</span></div>
<div class="box"><div class="k">Ambil</div><b>${tglIndo(p.mulai)} ${w.dari.slice(11)}</b></div><div class="box"><div class="k">Kembali</div><b>${tglIndo(p.selesai)} ${w.sampai.slice(11)}</b></div></div>
<table><tr><th>Rincian</th><th>Jumlah</th></tr>${baris.map(([n, v]) => `<tr><td>${esc(n)}</td><td>${rp(v)}</td></tr>`).join("")}
<tr class="tot"><td>Total</td><td>${rp(p.total)}</td></tr>
${jenis === "invoice" ? `<tr><td>Sudah dibayar</td><td>${rp(diterima)}</td></tr><tr class="tot"><td>Sisa tagihan</td><td>${rp(Math.max(0, p.total - diterima))}</td></tr>` : ""}
${p.deposit ? `<tr><td>Deposit (dikembalikan setelah unit kembali)</td><td>${rp(p.deposit)}</td></tr>` : ""}</table>
${jenis === "konfirmasi" ? `<p><span class="b">Booking ${p.status === "menunggu" ? "menunggu konfirmasi" : "terkonfirmasi"}</span></p><p class="k">Mohon datang tepat waktu dan bawa identitas asli. Perjanjian sewa: techpora.id/ttd/${esc(p.token)}</p>`
    : `<p class="k">Pembayaran ke rekening yang tertera di WhatsApp admin. Simpan invoice ini sebagai bukti transaksi.</p>`}
<button onclick="print()" style="margin-top:12px;padding:10px 16px;border-radius:8px;border:0;background:#0891b2;color:#fff;font-weight:600">Cetak / simpan PDF</button>
</body></html>`;
  const win = window.open("", "_blank");
  if (!win) return alert("Izinkan pop-up untuk membuka dokumen.");
  win.document.write(html); win.document.close();
}
