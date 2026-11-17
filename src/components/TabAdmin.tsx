import { useEffect, useState } from "react";
import { supabase, tglIndo } from "@/lib/supabase";

type Admin = { id: string; nama: string | null; email: string; terakhir_masuk: string | null; dibuat_pada: string };

const inp =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

/** Panggil fungsi server kelola-admin (hanya admin yang diizinkan). */
async function panggil<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("kelola-admin", { body });
  if (error) {
    let pesan = error.message;
    try { pesan = (await (error as { context?: Response }).context?.json())?.error || pesan; } catch { /* abaikan */ }
    throw new Error(pesan);
  }
  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return data as T;
}

const buatSandi = () => {
  const huruf = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const acak = crypto.getRandomValues(new Uint32Array(10));
  return Array.from(acak, (n) => huruf[n % huruf.length]).join("");
};

export default function TabAdmin({ setGalat }: { setGalat: (s: string) => void }) {
  const [admin, setAdmin] = useState<Admin[]>([]);
  const [saya, setSaya] = useState("");
  const [memuat, setMemuat] = useState(true);
  const [buka, setBuka] = useState(false);
  const [f, setF] = useState({ nama: "", email: "", sandi: buatSandi() });
  const [menyimpan, setMenyimpan] = useState(false);
  const [info, setInfo] = useState<{ email: string; sandi: string; sudahAda: boolean } | null>(null);
  const [gantiId, setGantiId] = useState("");
  const [sandiBaru, setSandiBaru] = useState("");

  const muat = async () => {
    setMemuat(true);
    try {
      const r = await panggil<{ saya: string; admin: Admin[] }>({ aksi: "daftar" });
      setSaya(r.saya); setAdmin(r.admin);
    } catch (e) { setGalat((e as Error).message); }
    setMemuat(false);
  };
  useEffect(() => { muat(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tambah = async () => {
    if (!f.email.trim()) return setGalat("Email wajib diisi.");
    setGalat(""); setMenyimpan(true);
    try {
      const r = await panggil<{ sudahAda: boolean }>({ aksi: "tambah", ...f });
      setInfo({ email: f.email.trim(), sandi: r.sudahAda ? "" : f.sandi, sudahAda: r.sudahAda });
      setF({ nama: "", email: "", sandi: buatSandi() }); setBuka(false);
      muat();
    } catch (e) { setGalat((e as Error).message); }
    setMenyimpan(false);
  };

  const gantiSandi = async (a: Admin) => {
    if (sandiBaru.length < 8) return setGalat("Kata sandi minimal 8 karakter.");
    setGalat("");
    try {
      await panggil({ aksi: "sandi", id: a.id, sandi: sandiBaru });
      setInfo({ email: a.email, sandi: sandiBaru, sudahAda: true });
      setGantiId(""); setSandiBaru("");
    } catch (e) { setGalat((e as Error).message); }
  };

  const cabut = async (a: Admin) => {
    if (!confirm(`Cabut akses admin ${a.nama || a.email}? Ia tidak bisa membuka dashboard lagi.`)) return;
    try { await panggil({ aksi: "cabut", id: a.id }); muat(); } catch (e) { setGalat((e as Error).message); }
  };

  const pesanWA = info
    ? `Halo, kamu sudah punya akses dashboard Techpora.\n\nBuka: https://techpora.id/masuk\nEmail: ${info.email}\nKata sandi: ${info.sandi || "(pakai kata sandi lamamu)"}\n\nSimpan baik-baik ya.`
    : "";

  return (
    <div className="space-y-4">
      {info && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">
            Akses admin aktif ✓
          </p>
          <p className="mt-1 text-xs text-emerald-800">Kirim info masuk ini ke orangnya. Kata sandi hanya ditampilkan sekali di sini.</p>
          <div className="mt-3 rounded-lg bg-white p-3 font-medium text-sm text-slate-800">
            <p>techpora.id/masuk</p>
            <p>Email: {info.email}</p>
            <p>Kata sandi: {info.sandi || "(pakai kata sandi lamanya)"}</p>
          </div>
          {!info.sandi && (
            <p className="mt-2 text-xs text-emerald-800">Email ini sudah pernah terdaftar, jadi kata sandinya tidak diubah. Pakai tombol "Ganti sandi" kalau orangnya lupa.</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => navigator.clipboard?.writeText(pesanWA)}
              className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800">Salin pesan</button>
            <a href={`https://wa.me/?text=${encodeURIComponent(pesanWA)}`} target="_blank" rel="noreferrer"
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">Kirim lewat WhatsApp</a>
            <button onClick={() => setInfo(null)} className="ml-auto text-xs text-emerald-800 underline">Tutup</button>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Daftar admin</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Akun yang bisa membuka dashboard ini</p>
          </div>
          <button onClick={() => setBuka((b) => !b)}
            className="shrink-0 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90">
            {buka ? "Tutup" : "+ Tambah admin"}
          </button>
        </div>

        {buka && (
          <div className="space-y-3 border-b border-border bg-slate-50 px-5 py-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Nama</span>
                <input className={inp} value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} placeholder="mis. Dody" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
                <input type="email" className={inp} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="nama@gmail.com" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Kata sandi awal</span>
                <div className="flex gap-2">
                  <input className={inp} value={f.sandi} onChange={(e) => setF({ ...f, sandi: e.target.value })} />
                  <button type="button" onClick={() => setF({ ...f, sandi: buatSandi() })}
                    className="shrink-0 rounded-lg border border-border bg-white px-3 text-xs font-semibold text-slate-600">Acak</button>
                </div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">Akun langsung aktif tanpa perlu verifikasi email. Setelah disimpan, kirim email dan kata sandinya ke orang tersebut.</p>
            <button onClick={tambah} disabled={menyimpan}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
              {menyimpan ? "Menyimpan…" : "Simpan & beri akses admin"}
            </button>
          </div>
        )}

        {memuat ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">Memuat…</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {admin.map((a) => (
              <li key={a.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {(a.nama || a.email || "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {a.nama || a.email.split("@")[0]}{a.id === saya && <span className="text-xs font-normal text-muted-foreground"> (Anda)</span>}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {a.email}{a.terakhir_masuk ? ` · terakhir masuk ${tglIndo(a.terakhir_masuk.slice(0, 10))}` : " · belum pernah masuk"}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button onClick={() => { setGantiId(gantiId === a.id ? "" : a.id); setSandiBaru(buatSandi()); }}
                      className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Ganti sandi</button>
                    {a.id !== saya && (
                      <button onClick={() => cabut(a)} className="rounded-lg px-2 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50">Cabut</button>
                    )}
                  </div>
                </div>
                {gantiId === a.id && (
                  <div className="mt-2.5 flex gap-2">
                    <input className={inp} value={sandiBaru} onChange={(e) => setSandiBaru(e.target.value)} />
                    <button onClick={() => gantiSandi(a)} className="shrink-0 rounded-lg bg-primary px-3 text-xs font-semibold text-white">Simpan</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
