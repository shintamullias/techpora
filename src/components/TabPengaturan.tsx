import RiwayatCadangan from "./RiwayatCadangan";
import { useEffect, useState } from "react";
import { supabase, rp, KATEGORI_BIAYA, type Pengaturan } from "@/lib/supabase";

const inp =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const BAGIAN = [
  { key: "bisnis", label: "Profil bisnis" },
  { key: "ongkir", label: "Ongkir antar-jemput" },
  { key: "biaya", label: "Kategori pengeluaran" },
  { key: "akun", label: "Akun saya" },
  { key: "riwayat", label: "Riwayat & cadangan" },
] as const;
type Bagian = (typeof BAGIAN)[number]["key"];

function Kartu({ judul, ket, children }: { judul: string; ket?: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{judul}</h3>
        {ket && <p className="mt-0.5 text-xs text-muted-foreground">{ket}</p>}
      </div>
      {children}
    </section>
  );
}

function Info({ label, isi }: { label: string; isi: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-slate-900">{isi}</p>
    </div>
  );
}

export default function TabPengaturan({
  set, muat, setGalat,
}: {
  set: Pengaturan; muat: () => void; setGalat: (s: string) => void;
}) {
  const [aktif, setAktif] = useState<Bagian>("bisnis");
  const [ongkir, setOngkir] = useState(set);
  const [tersimpan, setTersimpan] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => setOngkir(set), [set]);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || "")); }, []);

  const simpanOngkir = async () => {
    setGalat("");
    const { error } = await supabase.from("pengaturan").update(ongkir).eq("id", true);
    if (error) return setGalat(error.message);
    setTersimpan(true); setTimeout(() => setTersimpan(false), 2000);
    muat();
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr]">
      <div className="flex gap-1.5 overflow-x-auto lg:flex-col">
        {BAGIAN.map((b) => (
          <button key={b.key} onClick={() => setAktif(b.key)}
            className={"shrink-0 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors " +
              (aktif === b.key ? "bg-primary text-white" : "text-slate-700 hover:bg-slate-100")}>
            {b.label}
          </button>
        ))}
      </div>

      <div>
        {aktif === "bisnis" && (
          <Kartu judul="Profil bisnis" ket="Data yang tampil di situs techpora.id">
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <Info label="Nama bisnis" isi="Techpora" />
              <Info label="Mata uang" isi="IDR — Rupiah" />
              <Info label="WhatsApp" isi="0821-7798-4041" />
              <Info label="Instagram" isi="@sewalaptopjakarta.co" />
              <div className="sm:col-span-2"><Info label="Alamat" isi="Jl. R. Mangun Muka Raya, Rawamangun, Jakarta Timur" /></div>
            </div>
            <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">Mau mengubah data ini? Kabari Claude — perubahan langsung tayang di situs.</p>
          </Kartu>
        )}

        {aktif === "ongkir" && (
          <Kartu judul="Ongkir antar-jemput" ket="Dipakai otomatis saat membuat pesanan dengan pengantaran">
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Tarif per km</span>
                <input type="number" className={inp} value={ongkir.ongkir_per_km}
                  onChange={(e) => setOngkir({ ...ongkir, ongkir_per_km: Number(e.target.value) || 0 })} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Ongkir minimum</span>
                <input type="number" className={inp} value={ongkir.ongkir_minimum}
                  onChange={(e) => setOngkir({ ...ongkir, ongkir_minimum: Number(e.target.value) || 0 })} />
              </label>
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Contoh: 3 km → {rp(Math.max(ongkir.ongkir_minimum, 3 * ongkir.ongkir_per_km))} · 8 km → {rp(Math.max(ongkir.ongkir_minimum, 8 * ongkir.ongkir_per_km))}
              </p>
            </div>
            <div className="flex justify-end border-t border-border px-5 py-4">
              <button onClick={simpanOngkir} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                {tersimpan ? "✓ Tersimpan" : "Simpan"}
              </button>
            </div>
          </Kartu>
        )}

        {aktif === "biaya" && (
          <Kartu judul="Kategori pengeluaran" ket="Pilihan kategori saat mencatat biaya di halaman Keuangan">
            <div className="flex flex-wrap gap-2 p-5">
              {KATEGORI_BIAYA.map((k) => (
                <span key={k.key} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{k.label}</span>
              ))}
            </div>
          </Kartu>
        )}

        {aktif === "akun" && (
          <Kartu judul="Akun saya" ket="Akun yang sedang membuka dashboard">
            <div className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                {(email || "A").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{email || "—"}</p>
                <p className="text-sm text-muted-foreground">Administrator · kelola admin lain di menu Manajemen Admin</p>
              </div>
            </div>
          </Kartu>
        )}
        {aktif === "riwayat" && <RiwayatCadangan setGalat={setGalat} muat={muat} />}
      </div>
    </div>
  );
}
