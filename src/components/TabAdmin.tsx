import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Akun = { id: string; nama: string | null; wa: string | null; is_admin: boolean; dibuat_pada: string };

/** Kelola siapa yang boleh membuka dashboard.
 *  Akun dibuat lewat halaman masuk techpora.id, lalu dijadikan admin di sini. */
export default function TabAdmin({ setGalat }: { setGalat: (s: string) => void }) {
  const [akun, setAkun] = useState<Akun[]>([]);
  const [saya, setSaya] = useState("");
  const [cari, setCari] = useState("");
  const [memuat, setMemuat] = useState(true);

  const muat = async () => {
    setMemuat(true);
    const [{ data: u }, { data, error }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("profil").select("id, nama, wa, is_admin, dibuat_pada").order("dibuat_pada", { ascending: false }),
    ]);
    if (error) setGalat(error.message);
    setSaya(u.user?.id || "");
    setAkun((data as Akun[]) || []);
    setMemuat(false);
  };
  useEffect(() => { muat(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const admin = akun.filter((a) => a.is_admin);
  const lainnya = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return akun.filter((a) => !a.is_admin && (!q || (a.nama || "").toLowerCase().includes(q) || (a.wa || "").includes(q)));
  }, [akun, cari]);

  const ubah = async (a: Akun, jadiAdmin: boolean) => {
    const teks = jadiAdmin
      ? `Jadikan ${a.nama || "akun ini"} admin? Ia akan bisa melihat semua data dashboard.`
      : `Cabut akses admin ${a.nama || "akun ini"}?`;
    if (!confirm(teks)) return;
    const { error } = await supabase.from("profil").update({ is_admin: jadiAdmin }).eq("id", a.id);
    if (error) return setGalat(error.message);
    muat();
  };

  const baris = (a: Akun, aksi: React.ReactNode) => (
    <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {(a.nama || "?").slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{a.nama || "Tanpa nama"}{a.id === saya && <span className="text-xs font-normal text-muted-foreground"> (Anda)</span>}</p>
          <p className="truncate text-xs text-muted-foreground">{a.wa || "—"}</p>
        </div>
      </div>
      {aksi}
    </li>
  );

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Admin aktif</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Akun yang bisa membuka dashboard ini</p>
        </div>
        {memuat ? <p className="px-5 py-8 text-center text-sm text-muted-foreground">Memuat…</p> : (
          <ul className="divide-y divide-border/60">
            {admin.map((a) => baris(a,
              <span className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Admin</span>
                {a.id !== saya && (
                  <button onClick={() => ubah(a, false)} className="rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50">Cabut</button>
                )}
              </span>,
            ))}
          </ul>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Tambah admin</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Minta orangnya daftar dulu di techpora.id/masuk, lalu cari namanya di sini dan tekan Jadikan admin.
          </p>
          <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama atau nomor WA…"
            className="mt-3 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        {!memuat && lainnya.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">{cari ? "Tidak ada akun yang cocok." : "Belum ada akun lain yang terdaftar."}</p>
        ) : (
          <ul className="max-h-[420px] divide-y divide-border/60 overflow-y-auto">
            {lainnya.slice(0, 50).map((a) => baris(a,
              <button onClick={() => ubah(a, true)}
                className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Jadikan admin</button>,
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
