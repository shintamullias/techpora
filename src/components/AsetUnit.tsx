import { useEffect, useMemo, useState } from "react";
import { supabase, rp, tglIndo, type Unit, type Pesanan, type Pembayaran, type Pengeluaran } from "@/lib/supabase";
import { hitungPerUnitBulan, jumlahkan, penyusutan } from "@/lib/keuangan";

type Riwayat = { id: string; tanggal: string; jenis: string; judul: string; biaya: number; foto: string[] };
const JENIS: Record<string, string> = { maintenance: "🔧 Maintenance", kerusakan: "⚠ Kerusakan", sparepart: "🔩 Ganti spare part", foto: "📷 Foto unit", catatan: "📝 Catatan" };
const inp = "w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary";

/** Detail aset: identitas, kepemilikan, nilai & penyusutan, ROI/profit, riwayat rental/maintenance/kerusakan/spare part, foto, siklus hidup. */
export default function AsetUnit({ u, pesanan, pembayaran, biaya, onTutup, muat, setGalat }: {
  u: Unit; pesanan: Pesanan[]; pembayaran: Pembayaran[]; biaya: Pengeluaran[]; onTutup: () => void; muat: () => void; setGalat: (s: string) => void;
}) {
  const [f, setF] = useState({
    kode_aset: u.kode_aset || "", serial_number: u.serial_number || "", imei: u.imei || "", tgl_beli: u.tgl_beli || "",
    harga_beli: String(u.harga_beli || u.modal || ""), lokasi: u.lokasi || "", status_kepemilikan: u.status_kepemilikan || "milik_sendiri",
    umur_ekonomis_bulan: String(u.umur_ekonomis_bulan || 36), nilai_sisa: String(u.nilai_sisa || ""), interval_maintenance_hari: String(u.interval_maintenance_hari || 90),
  });
  const [riwayat, setRiwayat] = useState<Riwayat[]>([]);
  const [baru, setBaru] = useState({ jenis: "maintenance", judul: "", biaya: "", tanggal: new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10) });
  const [file, setFile] = useState<FileList | null>(null);
  const [url, setUrl] = useState<Record<string, string>>({});
  const s = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const angka = (x: string) => Number(String(x).replace(/\D/g, "")) || 0;

  const muatR = async () => {
    const { data } = await supabase.from("riwayat_unit").select("*").eq("unit_id", u.id).order("tanggal", { ascending: false });
    const r = (data as Riwayat[]) || [];
    setRiwayat(r);
    const semua = r.flatMap((x) => x.foto);
    if (semua.length) {
      const { data: su } = await supabase.storage.from("dokumen").createSignedUrls(semua, 900);
      setUrl(Object.fromEntries((su || []).map((x, i) => [semua[i], x.signedUrl || ""])));
    }
  };
  useEffect(() => { muatR(); }, [u.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const simpan = async () => {
    const { error } = await supabase.from("unit").update({
      kode_aset: f.kode_aset || null, serial_number: f.serial_number || null, imei: f.imei || null, tgl_beli: f.tgl_beli || null,
      harga_beli: angka(f.harga_beli) || null, modal: angka(f.harga_beli) || u.modal, lokasi: f.lokasi || null, status_kepemilikan: f.status_kepemilikan,
      umur_ekonomis_bulan: angka(f.umur_ekonomis_bulan) || 36, nilai_sisa: angka(f.nilai_sisa), interval_maintenance_hari: angka(f.interval_maintenance_hari) || 90,
    }).eq("id", u.id);
    if (error) return setGalat(error.message);
    muat();
  };

  const tambahRiwayat = async () => {
    if (!baru.judul.trim() && !file?.length) return setGalat("Isi keterangan atau pilih foto.");
    const foto: string[] = [];
    for (const fl of Array.from(file || [])) {
      const path = `unit/${u.id}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${(fl.name.split(".").pop() || "jpg").toLowerCase()}`;
      const { error } = await supabase.storage.from("dokumen").upload(path, fl, { contentType: fl.type || undefined });
      if (error) return setGalat(error.message);
      foto.push(path);
    }
    const { error } = await supabase.from("riwayat_unit").insert({ unit_id: u.id, tanggal: baru.tanggal, jenis: baru.jenis, judul: baru.judul.trim() || JENIS[baru.jenis], biaya: angka(baru.biaya), foto });
    if (error) return setGalat(error.message);
    if (baru.jenis === "kerusakan") await supabase.from("unit").update({ kondisi: "rusak" }).eq("id", u.id);
    setBaru({ ...baru, judul: "", biaya: "" }); setFile(null); muatR(); muat();
  };

  const pensiun = async (status: "pensiun" | "dijual" | "hilang" | "aktif") => {
    const alasan = status === "aktif" ? null : prompt(`Alasan unit ${status}?`);
    if (status !== "aktif" && alasan === null) return;
    const { error } = await supabase.from("unit").update({ status_aset: status, aktif: status === "aktif", pensiun_pada: status === "aktif" ? null : new Date().toISOString().slice(0, 10), pensiun_alasan: alasan }).eq("id", u.id);
    if (error) setGalat(error.message); else muat();
  };

  const fin = useMemo(() => jumlahkan(hitungPerUnitBulan(pesanan, pembayaran, biaya, [u]).filter((r) => r.unit_id === u.id)), [pesanan, pembayaran, biaya, u]);
  const dep = penyusutan({ ...u, harga_beli: angka(f.harga_beli), tgl_beli: f.tgl_beli || null, umur_ekonomis_bulan: angka(f.umur_ekonomis_bulan), nilai_sisa: angka(f.nilai_sisa) });
  const modal = dep.harga;
  const sewa = pesanan.filter((p) => p.unit_id === u.id && p.status !== "batal").sort((a, b) => b.mulai.localeCompare(a.mulai));
  const umurBln = dep.bulanJalan;
  const terakhirMt = riwayat.find((r) => r.jenis === "maintenance")?.tanggal || u.tgl_beli;
  const mtBerikut = terakhirMt ? new Date(Date.parse(terakhirMt) + (u.interval_maintenance_hari || 90) * 864e5).toISOString().slice(0, 10) : null;
  const tahap = u.status_aset && u.status_aset !== "aktif" ? `Selesai (${u.status_aset})` : dep.sisaUmur <= 3 ? "Akhir umur — siapkan pengganti" : umurBln < 6 ? "Baru" : "Produktif";

  const kol = (l: string, k: keyof typeof f, ph?: string, t = "text") => (
    <label key={k} className="min-w-0 text-xs font-semibold text-muted-foreground">{l}<input type={t} className={inp + " mt-1"} value={f[k]} placeholder={ph} onChange={(e) => s(k, e.target.value)} onBlur={simpan} /></label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onTutup}>
      <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div><p className="font-semibold text-slate-900">{u.id} · {u.nama}</p><p className="text-xs text-muted-foreground">{u.spek} · {u.kategori} · tahap: <b>{tahap}</b></p></div>
          <button onClick={onTutup} aria-label="Tutup" className="text-slate-400">✕</button>
        </div>
        <div className="space-y-4 px-5 py-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {([["Laba kumulatif", rp(fin.laba)], ["ROI", modal ? `${Math.round((fin.laba / modal) * 100)}%` : "—"], ["Nilai buku", rp(dep.nilaiBuku)], ["Balik modal", modal && fin.laba > 0 && umurBln ? (fin.laba >= modal ? "✓ sudah" : `±${Math.ceil((modal - fin.laba) / (fin.laba / Math.max(1, umurBln)))} bln lagi`) : "—"],
              ["Pendapatan", rp(fin.pendapatan)], ["Biaya (langsung + bersama)", rp(fin.biayaLangsung + fin.biayaBersama)], ["Penyusutan/bln", rp(dep.perBulan)], ["Maintenance berikut", mtBerikut ? tglIndo(mtBerikut) : "—"]] as const).map(([l, v]) => (
              <div key={l} className="rounded-lg bg-slate-50 px-3 py-2"><p className="text-[10px] text-muted-foreground">{l}</p><p className="truncate text-sm font-bold">{v}</p></div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {kol("Asset ID", "kode_aset", "TPR-L-001")}
            {kol("Serial number", "serial_number")}
            {kol("IMEI (bila ada)", "imei")}
            {kol("Tanggal beli", "tgl_beli", undefined, "date")}
            {kol("Harga beli / modal (Rp)", "harga_beli")}
            {kol("Lokasi penyimpanan", "lokasi", "Rawamangun / Bandung / Jogja")}
            <label className="min-w-0 text-xs font-semibold text-muted-foreground">Status kepemilikan
              <select className={inp + " mt-1"} value={f.status_kepemilikan} onChange={(e) => { s("status_kepemilikan", e.target.value); }} onBlur={simpan}>
                <option value="milik_sendiri">Milik sendiri</option><option value="kerja_sama">Kerja sama (bagi hasil)</option><option value="titipan">Titipan</option><option value="sewa_beli">Kredit / cicilan</option>
              </select>
            </label>
            {kol("Umur ekonomis (bulan)", "umur_ekonomis_bulan")}
            {kol("Nilai sisa (Rp)", "nilai_sisa")}
            {kol("Interval maintenance (hari)", "interval_maintenance_hari")}
          </div>
          <p className="-mt-2 text-[11px] text-muted-foreground">Tersimpan otomatis. Pemilik & persentase bagi hasil diatur di Keuangan → Bagi hasil pemilik. Pengingat maintenance dibuat otomatis jadi tugas sesuai interval.</p>

          <div className="space-y-2 rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-muted-foreground">Catat riwayat unit</p>
            <div className="grid grid-cols-2 gap-2">
              <select className={inp} value={baru.jenis} onChange={(e) => setBaru({ ...baru, jenis: e.target.value })}>{Object.entries(JENIS).map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select>
              <input type="date" className={inp} value={baru.tanggal} onChange={(e) => setBaru({ ...baru, tanggal: e.target.value })} />
              <input className={inp + " col-span-2"} value={baru.judul} placeholder="mis. ganti baterai, keyboard rusak, cuci sepatu" onChange={(e) => setBaru({ ...baru, judul: e.target.value })} />
              <input className={inp} inputMode="numeric" value={baru.biaya} placeholder="Biaya (Rp)" onChange={(e) => setBaru({ ...baru, biaya: e.target.value })} />
              <label className={inp + " cursor-pointer truncate text-slate-600"}>{file?.length ? `📎 ${file.length} foto` : "📎 Foto"}<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setFile(e.target.files)} /></label>
            </div>
            <button onClick={tambahRiwayat} className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white">Simpan riwayat</button>
            <p className="text-[11px] text-muted-foreground">Biaya otomatis masuk ke Pengeluaran unit ini (dihitung di profit & bagi hasil). Kerusakan mengubah kondisi unit jadi Rusak.</p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Riwayat maintenance, kerusakan, spare part & foto</p>
            {riwayat.length === 0 ? <p className="text-xs text-muted-foreground">Belum ada riwayat.</p> : (
              <ul className="space-y-1.5">
                {riwayat.map((r) => (
                  <li key={r.id} className="rounded-lg bg-slate-50 px-2.5 py-2 text-xs">
                    <div className="flex justify-between gap-2"><span><b>{JENIS[r.jenis]}</b> · {r.judul}</span><span className="shrink-0 text-muted-foreground">{tglIndo(r.tanggal)}{r.biaya ? ` · ${rp(r.biaya)}` : ""}</span></div>
                    {r.foto.length > 0 && <div className="mt-1.5 flex gap-1.5">{r.foto.map((p) => <a key={p} href={url[p]} target="_blank" rel="noreferrer" className="h-14 w-14 overflow-hidden rounded bg-slate-200">{url[p] && <img src={url[p]} alt="" className="h-full w-full object-cover" />}</a>)}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Riwayat rental ({sewa.length})</p>
            <ul className="max-h-48 divide-y divide-border/60 overflow-y-auto rounded-lg border border-border">
              {sewa.slice(0, 50).map((p) => <li key={p.id} className="flex justify-between gap-2 px-2.5 py-1.5 text-xs"><span className="truncate">{tglIndo(p.mulai)}–{tglIndo(p.selesai)} · {p.pelanggan?.nama}</span><span className="shrink-0">{rp(p.total)}</span></li>)}
              {sewa.length === 0 && <li className="px-2.5 py-2 text-xs text-muted-foreground">Belum pernah disewa.</li>}
            </ul>
          </div>

          <div className="rounded-lg border border-border p-3 text-xs">
            <p className="font-semibold text-slate-900">Siklus hidup aset</p>
            <p className="mt-1 text-slate-600">Dibeli {u.tgl_beli ? tglIndo(u.tgl_beli) : "—"} · umur {umurBln} bln dari {u.umur_ekonomis_bulan || 36} bln · sisa {dep.sisaUmur} bln{u.pensiun_pada ? ` · ${u.status_aset} ${tglIndo(u.pensiun_pada)}: ${u.pensiun_alasan || ""}` : ""}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(u.status_aset || "aktif") === "aktif" ? (<>
                <button onClick={() => pensiun("pensiun")} className="rounded-lg border border-border px-2.5 py-1.5 font-semibold">Pensiunkan</button>
                <button onClick={() => pensiun("dijual")} className="rounded-lg border border-border px-2.5 py-1.5 font-semibold">Tandai dijual</button>
                <button onClick={() => pensiun("hilang")} className="rounded-lg border border-rose-200 px-2.5 py-1.5 font-semibold text-rose-700">Tandai hilang</button>
              </>) : <button onClick={() => pensiun("aktif")} className="rounded-lg border border-border px-2.5 py-1.5 font-semibold">Aktifkan kembali</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
