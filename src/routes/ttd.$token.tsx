import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase, rp, tglIndo } from "@/lib/supabase";

export const Route = createFileRoute("/ttd/$token")({
  head: () => ({
    meta: [
      { title: "Perjanjian Sewa — Techpora" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Ttd,
});

type Data = Record<string, any>;

function Ttd() {
  const { token } = useParams({ from: "/ttd/$token" });
  const [data, setData] = useState<Data | null>(null);
  const [siap, setSiap] = useState(false);
  const [nama, setNama] = useState("");
  const [setuju, setSetuju] = useState(false);
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");
  const kanvas = useRef<HTMLCanvasElement>(null);
  const adaCoretan = useRef(false);

  const muat = async () => {
    const { data: d, error } = await supabase.rpc("lihat_perjanjian", { p_token: token });
    if (error) setGalat(error.message);
    setData(d as Data);
    if (d?.nama) setNama(d.nama);
    setSiap(true);
  };

  useEffect(() => { muat(); }, [token]);

  /* ---------- kanvas tanda tangan ---------- */
  useEffect(() => {
    const c = kanvas.current;
    if (!c || data?.ttd_setuju) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = c.offsetWidth * dpr;
    c.height = c.offsetHeight * dpr;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";

    let gambar = false;
    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const mulai = (e: PointerEvent) => {
      gambar = true; adaCoretan.current = true;
      c.setPointerCapture(e.pointerId);
      const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y);
    };
    const gerak = (e: PointerEvent) => {
      if (!gambar) return;
      e.preventDefault();
      const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke();
    };
    const selesai = () => { gambar = false; };

    c.addEventListener("pointerdown", mulai);
    c.addEventListener("pointermove", gerak);
    c.addEventListener("pointerup", selesai);
    c.addEventListener("pointerleave", selesai);
    return () => {
      c.removeEventListener("pointerdown", mulai);
      c.removeEventListener("pointermove", gerak);
      c.removeEventListener("pointerup", selesai);
      c.removeEventListener("pointerleave", selesai);
    };
  }, [data]);

  const bersihkan = () => {
    const c = kanvas.current;
    if (!c) return;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    adaCoretan.current = false;
  };

  const kirim = async () => {
    setGalat("");
    if (!nama.trim() || nama.trim().length < 3) return setGalat("Tulis nama lengkapmu.");
    if (!setuju) return setGalat("Centang persetujuan dulu.");
    if (!adaCoretan.current) return setGalat("Bubuhkan tanda tangan di kotak.");
    setSibuk(true);
    try {
      const gambar = kanvas.current!.toDataURL("image/png");
      const { data: ok, error } = await supabase.rpc("tandatangani", {
        p_token: token, p_nama: nama.trim(), p_ttd: gambar,
      });
      if (error) throw error;
      if (!ok) throw new Error("Perjanjian ini sudah ditandatangani sebelumnya.");
      await muat();
    } catch (e: any) {
      setGalat(String(e?.message || e));
    } finally { setSibuk(false); }
  };

  if (!siap) return <Pusat>Memuat perjanjian…</Pusat>;
  if (!data) return <Pusat>Link tidak ditemukan atau sudah tidak berlaku.</Pusat>;

  const durasi = `${data.durasi_jumlah} ${data.durasi_tipe} (${data.total_hari} × 24 jam)`;
  /* Ketentuan mengikuti jenis barang: laptop dan sepatu punya risiko yang
     berbeda, jadi isinya tidak boleh disamakan. */
  const sepatu = data.kategori === "sepatu";
  const merek = sepatu ? "Sewa Sepatu Jakarta" : "Techpora · Sewa Laptop Jakarta";
  const judul = sepatu ? "Perjanjian Sewa Sepatu" : "Perjanjian Sewa Laptop";

  return (
    <div className="min-h-screen bg-secondary/30 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{merek}</p>
          <h1 className="mt-1 font-serif text-2xl text-foreground">{judul}</h1>

          {data.ttd_setuju && (
            <p className="mt-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm text-primary">
              Sudah ditandatangani oleh <b>{data.ttd_nama}</b> pada{" "}
              {new Date(data.ttd_pada).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}.
              Simpan halaman ini sebagai bukti.
            </p>
          )}

          <dl className="mt-4 space-y-2 text-sm">
            <B k="Penyewa" v={data.nama} />
            <B k={sepatu ? "Sepatu" : "Unit"} v={`${data.unit} (${data.unit_id}) — ${data.spek}`} />
            <B k="Periode" v={`${tglIndo(data.mulai)} pukul ${String(data.jam).slice(0,5)} → ${tglIndo(data.selesai)} pukul ${String(data.jam).slice(0,5)}`} />
            <B k="Durasi" v={durasi} />
            {data.antar !== "tidak" && <B k="Pengantaran" v={`${data.alamat_antar || "-"} · ${data.jarak_km} km`} />}
            <B k="Biaya sewa" v={rp(data.harga_sewa)} />
            {data.harga_antar > 0 && <B k="Antar-jemput" v={rp(data.harga_antar)} />}
            {(data.item || []).map((it: { nama: string; jumlah: number }, i: number) => (
              <B key={i} k={it.nama || (it.jumlah < 0 ? "Potongan" : "Tambahan")}
                v={`${it.jumlah < 0 ? "− " : ""}${rp(Math.abs(it.jumlah))}`} />
            ))}
            <div className="flex items-baseline justify-between border-t border-border pt-2">
              <dt className="font-semibold text-foreground">Total</dt>
              <dd className="font-serif text-2xl text-foreground">{rp(data.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5">
          <h2 className="font-serif text-lg text-foreground">Ketentuan</h2>
          <ol className="mt-3 space-y-2.5 text-sm text-muted-foreground">
            {sepatu ? (
              <>
                <Li n="1">Penyewa menerima sepatu dalam kondisi bersih dan layak pakai sesuai ukuran yang dipesan, dan wajib mengembalikannya dalam kondisi yang sama.</Li>
                <Li n="2">Masa sewa dihitung per 24 jam sejak sepatu diterima. Keterlambatan pengembalian dikenakan tarif sewa harian penuh untuk setiap hari keterlambatan.</Li>
                <Li n="3">Sepatu hanya boleh dipakai oleh penyewa yang namanya tercantum di perjanjian ini, dan dilarang dipindahtangankan atau disewakan ulang kepada pihak lain.</Li>
                <Li n="4">Sepatu wajib dikembalikan dalam keadaan sudah dibersihkan dari tanah, lumpur, dan rumput. Bila dikembalikan kotor, dikenakan biaya pencucian.</Li>
                <Li n="5">Sepatu hanya boleh dipakai sesuai peruntukannya. Pemakaian di permukaan yang tidak sesuai — misalnya sepatu FG di lapangan berbatu atau aspal — mempercepat keausan sol dan menjadi tanggung jawab penyewa.</Li>
                <Li n="6">Kerusakan akibat kelalaian seperti sol terlepas, jahitan atau bagian atas sobek, serta noda permanen yang tidak dapat dihilangkan, menjadi tanggung jawab penyewa sesuai biaya perbaikan yang berlaku.</Li>
                <Li n="7">Apabila sepatu hilang atau tidak dikembalikan, penyewa wajib mengganti sebesar {rp(data.nilai_ganti)} dan hal ini dapat diproses secara hukum.</Li>
                <Li n="8">Data pribadi dan dokumen yang diserahkan hanya digunakan untuk keperluan verifikasi sewa dan tidak dibagikan kepada pihak lain.</Li>
              </>
            ) : (
              <>
                <Li n="1">Penyewa menerima unit dalam kondisi baik dan berfungsi, lengkap dengan charger, dan wajib mengembalikannya dalam kondisi yang sama.</Li>
                <Li n="2">Masa sewa dihitung per 24 jam sejak unit diterima. Keterlambatan pengembalian dikenakan tarif sewa harian penuh untuk setiap hari keterlambatan.</Li>
                <Li n="3">Unit hanya boleh dipakai oleh penyewa yang namanya tercantum di perjanjian ini, dan dilarang dipindahtangankan, disewakan ulang, atau dijaminkan kepada pihak lain.</Li>
                <Li n="4">Penyewa dilarang membongkar, mengganti komponen, menghapus sistem operasi, atau mengubah pengaturan keamanan pada unit.</Li>
                <Li n="5">Unit dilengkapi perangkat lunak pelacak. Penyewa mengetahui dan menyetujui bahwa posisi unit dapat dipantau selama masa sewa, semata-mata untuk pengamanan aset.</Li>
                <Li n="6">Kerusakan akibat kelalaian menjadi tanggung jawab penyewa sesuai biaya perbaikan yang berlaku.</Li>
                <Li n="7">Apabila unit hilang, dicuri, atau tidak dikembalikan, penyewa wajib mengganti sebesar {rp(data.nilai_ganti)} dan hal ini dapat diproses secara hukum.</Li>
                <Li n="8">Data pribadi dan dokumen yang diserahkan hanya digunakan untuk keperluan verifikasi sewa dan tidak dibagikan kepada pihak lain.</Li>
              </>
            )}
          </ol>
        </div>

        {!data.ttd_setuju ? (
          <div className="rounded-2xl border border-border bg-background p-5">
            <h2 className="font-serif text-lg text-foreground">Tanda tangan</h2>
            <p className="mt-1 text-sm text-muted-foreground">Bubuhkan tanda tangan dengan jari di kotak berikut.</p>

            <div className="mt-3">
              <canvas ref={kanvas} className="h-44 w-full touch-none rounded-xl border-2 border-dashed border-border bg-secondary/30" />
              <button onClick={bersihkan} className="mt-1.5 text-xs text-muted-foreground underline underline-offset-2">Ulangi tanda tangan</button>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nama lengkap</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </div>

            <label className="mt-4 flex items-start gap-2.5 text-sm text-foreground">
              <input type="checkbox" checked={setuju} onChange={(e) => setSetuju(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border" />
              Saya telah membaca dan menyetujui seluruh ketentuan di atas, serta menyatakan data yang saya berikan benar.
            </label>

            {galat && <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{galat}</p>}

            <button onClick={kirim} disabled={sibuk}
              className="mt-4 w-full rounded-xl bg-primary px-4 py-3.5 font-semibold text-primary-foreground disabled:opacity-60">
              {sibuk ? "Mengirim…" : "Tanda tangani perjanjian"}
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Tanda tangan elektronik ini tercatat beserta waktunya sebagai bukti kesepakatan.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-background p-5 text-center">
            <p className="font-serif text-xl text-foreground">Terima kasih</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Perjanjian sudah ditandatangani. Saat serah terima nanti tinggal pengecekan {sepatu ? "sepatu" : "unit"} — tidak perlu tanda tangan lagi.
            </p>
            <a href="https://wa.me/6282177984041" target="_blank" rel="noreferrer"
              className="mt-4 inline-block rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground">
              Hubungi admin
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const Pusat = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen items-center justify-center px-6 text-center text-sm text-muted-foreground">{children}</div>
);

const B = ({ k, v }: { k: string; v: string }) => (
  <div className="flex items-baseline justify-between gap-3">
    <dt className="shrink-0 text-muted-foreground">{k}</dt>
    <dd className="text-right text-foreground">{v}</dd>
  </div>
);

const Li = ({ n, children }: { n: string; children: React.ReactNode }) => (
  <li className="flex gap-2.5">
    <span className="shrink-0 font-mono text-xs text-muted-foreground">{n}.</span>
    <span>{children}</span>
  </li>
);
