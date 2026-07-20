import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, rp, tglIndo, type Profil, type Dokumen, type Pesanan } from "@/lib/supabase";

const SITE_URL = "https://techpora.id";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard Admin — Techpora" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/admin` }],
  }),
  component: Admin,
});

function Admin() {
  const nav = useNavigate();
  const [siap, setSiap] = useState(false);
  const [boleh, setBoleh] = useState(false);
  const [tab, setTab] = useState<"verifikasi" | "pesanan">("verifikasi");
  const [profilList, setProfilList] = useState<Profil[]>([]);
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [galat, setGalat] = useState("");

  const muat = async () => {
    const { data: sesi } = await supabase.auth.getSession();
    if (!sesi.session) {
      nav({ to: "/masuk" });
      return;
    }
    const { data: me } = await supabase.from("profil").select("is_admin").eq("id", sesi.session.user.id).maybeSingle();
    if (!me?.is_admin) {
      setBoleh(false);
      setSiap(true);
      return;
    }
    setBoleh(true);
    const [p, o] = await Promise.all([
      supabase.from("profil").select("*").order("dibuat_pada", { ascending: false }),
      supabase.from("pesanan").select("*, profil(nama, wa), unit(nama)").order("dibuat_pada", { ascending: false }),
    ]);
    setProfilList((p.data as Profil[]) || []);
    setPesanan((o.data as Pesanan[]) || []);
    setSiap(true);
  };

  useEffect(() => {
    muat();
  }, []);

  if (!siap) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Memuat…</div>;

  if (!boleh)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="font-serif text-2xl">Halaman khusus admin</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Akun ini belum ditandai sebagai admin. Buka Supabase → tabel <code>profil</code> → ubah <code>is_admin</code> menjadi{" "}
          <code>true</code> untuk akunmu.
        </p>
        <Link to="/akun" className="text-sm text-primary underline underline-offset-4">
          Kembali ke akun
        </Link>
      </div>
    );

  const menunggu = profilList.filter((p) => p.status_verifikasi === "menunggu").length;
  const pesananBaru = pesanan.filter((p) => p.status === "menunggu").length;

  return (
    <div className="min-h-screen bg-secondary/30 px-4 py-8">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl text-foreground">Dashboard Techpora</h1>
          <Link to="/akun" className="text-sm text-muted-foreground underline underline-offset-4">
            Akun saya
          </Link>
        </div>

        <div className="flex gap-1 rounded-xl bg-background p-1">
          {(
            [
              ["verifikasi", `Verifikasi${menunggu ? ` (${menunggu})` : ""}`],
              ["pesanan", `Pesanan${pesananBaru ? ` (${pesananBaru})` : ""}`],
            ] as const
          ).map(([k, t]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {galat && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{galat}</p>}

        {tab === "verifikasi"
          ? profilList.map((p) => <KartuProfil key={p.id} p={p} muat={muat} setGalat={setGalat} />)
          : pesanan.map((o) => <KartuPesanan key={o.id} o={o} muat={muat} setGalat={setGalat} />)}
      </div>
    </div>
  );
}

/* ---------------- Kartu verifikasi penyewa ---------------- */

function KartuProfil({ p, muat, setGalat }: { p: Profil; muat: () => void; setGalat: (s: string) => void }) {
  const [buka, setBuka] = useState(false);
  const [dok, setDok] = useState<Dokumen[]>([]);
  const [tautan, setTautan] = useState<Record<string, string>>({});
  const [catatan, setCatatan] = useState(p.catatan_review || "");

  const muatDokumen = async () => {
    const { data } = await supabase.from("dokumen").select("*").eq("user_id", p.id);
    const list = (data as Dokumen[]) || [];
    setDok(list);
    const t: Record<string, string> = {};
    for (const d of list) {
      const { data: s } = await supabase.storage.from("dokumen").createSignedUrl(d.path, 600);
      if (s?.signedUrl) t[d.id] = s.signedUrl;
    }
    setTautan(t);
  };

  const ubahStatus = async (status: "disetujui" | "ditolak" | "menunggu") => {
    const { error } = await supabase
      .from("profil")
      .update({ status_verifikasi: status, catatan_review: catatan, direview_pada: new Date().toISOString() })
      .eq("id", p.id);
    if (error) setGalat(error.message);
    else muat();
  };

  const warna =
    p.status_verifikasi === "disetujui"
      ? "bg-primary/10 text-primary"
      : p.status_verifikasi === "ditolak"
      ? "bg-destructive/10 text-destructive"
      : "bg-secondary text-muted-foreground";

  return (
    <div className="rounded-2xl border border-border bg-background">
      <button
        onClick={() => {
          setBuka(!buka);
          if (!buka && !dok.length) muatDokumen();
        }}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{p.nama || "(tanpa nama)"}</p>
          <p className="truncate text-sm text-muted-foreground">{p.wa}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${warna}`}>
          {p.status_verifikasi}
        </span>
      </button>

      {buka && (
        <div className="space-y-4 border-t border-border p-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Info k="Instagram" v={p.instagram || "—"} />
            <Info k="Daftar" v={tglIndo(p.dibuat_pada?.slice(0, 10))} />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Dokumen ({dok.length})
            </p>
            {dok.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada dokumen diunggah.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {dok.map((d) => (
                  <a
                    key={d.id}
                    href={tautan[d.id]}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-border p-2 text-xs hover:bg-secondary"
                  >
                    <span className="block font-semibold capitalize text-foreground">{d.jenis}</span>
                    <span className="block truncate text-muted-foreground">{d.nama_file || "lihat file"}</span>
                  </a>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">Tautan dokumen berlaku 10 menit demi keamanan.</p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Catatan untuk penyewa
            </label>
            <input
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="mis. foto KTP buram, mohon diulang"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {p.status_verifikasi !== "disetujui" && (
              <button onClick={() => ubahStatus("disetujui")} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                Setujui
              </button>
            )}
            {p.status_verifikasi !== "ditolak" && (
              <button onClick={() => ubahStatus("ditolak")} className="flex-1 rounded-lg border border-destructive/40 px-4 py-2.5 text-sm font-semibold text-destructive">
                Tolak
              </button>
            )}
            <a
              href={`https://wa.me/${(p.wa || "").replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-foreground"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Kartu pesanan ---------------- */

function KartuPesanan({ o, muat, setGalat }: { o: Pesanan; muat: () => void; setGalat: (s: string) => void }) {
  const [buka, setBuka] = useState(false);
  const [catatan, setCatatan] = useState(o.catatan_admin || "");

  const ubah = async (status: Pesanan["status"]) => {
    const { error } = await supabase.from("pesanan").update({ status, catatan_admin: catatan }).eq("id", o.id);
    if (error) setGalat(error.message);
    else muat();
  };

  const wa = (o.profil?.wa || "").replace(/[^0-9]/g, "").replace(/^0/, "62");
  const pesanAntar = `Halo kak ${o.profil?.nama || ""}, unit ${o.unit?.nama || o.unit_id} siap diantar ${tglIndo(
    o.mulai
  )} pukul ${o.jam} ke ${o.alamat || "lokasi yang disepakati"}. Nanti kita cek unit bersama dan tanda tangan perjanjian sewa saat serah terima ya 🙏`;
  const pesanTagihan = `Halo kak ${o.profil?.nama || ""}, pesanan disetujui ✅\n\nUnit: ${o.unit?.nama || o.unit_id}\nDurasi: ${
    o.durasi_jumlah
  } ${o.durasi_tipe} (${tglIndo(o.mulai)} — ${tglIndo(o.selesai)}, pukul ${o.jam})\nTotal: ${rp(
    o.total
  )}\n\nSilakan lakukan pelunasan, lalu unit kami antar sesuai jadwal 🙌`;

  return (
    <div className="rounded-2xl border border-border bg-background">
      <button onClick={() => setBuka(!buka)} className="flex w-full items-start justify-between gap-3 p-4 text-left">
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{o.profil?.nama || "—"}</p>
          <p className="truncate text-sm text-muted-foreground">
            {o.unit?.nama || o.unit_id} · {tglIndo(o.mulai)} → {tglIndo(o.selesai)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-semibold text-foreground">{rp(o.total)}</p>
          <span className="text-xs capitalize text-muted-foreground">{o.status}</span>
        </div>
      </button>

      {buka && (
        <div className="space-y-4 border-t border-border p-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Info k="WhatsApp" v={o.profil?.wa || "—"} />
            <Info k="Jam ambil" v={o.jam} />
            <Info k="Sewa" v={rp(o.harga_sewa)} />
            <Info k="Antar" v={o.antar === "tidak" ? "Ambil sendiri" : `${rp(o.harga_antar)} · ${o.jarak_km} km`} />
          </div>
          {o.alamat && <Info k="Alamat" v={o.alamat} />}
          {o.catatan && <Info k="Catatan penyewa" v={o.catatan} />}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Catatan admin
            </label>
            <input
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {o.status === "menunggu" && (
              <>
                <button onClick={() => ubah("disetujui")} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                  Setujui
                </button>
                <button onClick={() => ubah("ditolak")} className="flex-1 rounded-lg border border-destructive/40 px-4 py-2.5 text-sm font-semibold text-destructive">
                  Tolak
                </button>
              </>
            )}
            {o.status === "disetujui" && (
              <button onClick={() => ubah("berjalan")} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                Tandai unit sudah diantar
              </button>
            )}
            {o.status === "berjalan" && (
              <button onClick={() => ubah("selesai")} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                Tandai selesai (unit kembali)
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            <a
              href={`https://wa.me/${wa}?text=${encodeURIComponent(pesanTagihan)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground"
            >
              Kirim tagihan
            </a>
            <a
              href={`https://wa.me/${wa}?text=${encodeURIComponent(pesanAntar)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground"
            >
              Jadwalkan antar
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{k}</p>
      <p className="text-foreground">{v}</p>
    </div>
  );
}
