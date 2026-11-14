import { useState } from "react";
import { supabase, rp, type Pengaturan, type Pic } from "@/lib/supabase";
import { inp, Kol, Kartu, Tombol, Lencana, Buka, Kosong } from "./ui";

export default function PengaturanTab({ pic, set, muat, setGalat }: {
  pic: Pic[]; set: Pengaturan; muat: () => void; setGalat: (s: string) => void;
}) {
  return (
    <>
      <DaftarPic pic={pic} muat={muat} setGalat={setGalat} />
      <Ongkir set={set} muat={muat} setGalat={setGalat} />
    </>
  );
}

function Ongkir({ set, muat, setGalat }: { set: Pengaturan; muat: () => void; setGalat: (s: string) => void }) {
  const [o, setO] = useState(set);
  const simpan = async () => {
    const { error } = await supabase.from("pengaturan").update(o).eq("id", true);
    if (error) return setGalat(error.message);
    muat();
  };
  return (
    <Kartu judul="Ongkir antar">
      <div className="grid grid-cols-2 gap-3">
        <Kol label="Per km"><input type="number" className={inp} value={o.ongkir_per_km} onChange={(e) => setO({ ...o, ongkir_per_km: Number(e.target.value) || 0 })} /></Kol>
        <Kol label="Minimum"><input type="number" className={inp} value={o.ongkir_minimum} onChange={(e) => setO({ ...o, ongkir_minimum: Number(e.target.value) || 0 })} /></Kol>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Contoh: 3 km → {rp(Math.max(o.ongkir_minimum, 3 * o.ongkir_per_km))} · 8 km → {rp(Math.max(o.ongkir_minimum, 8 * o.ongkir_per_km))}
      </p>
      <Tombol varian="utama" penuh className="mt-3" onClick={simpan}>Simpan ongkir</Tombol>
    </Kartu>
  );
}

function DaftarPic({ pic, muat, setGalat }: { pic: Pic[]; muat: () => void; setGalat: (s: string) => void }) {
  const [buka, setBuka] = useState(false);
  const [f, setF] = useState({ nama: "", email: "", wa: "" });

  const tambah = async () => {
    if (!f.nama.trim()) return setGalat("Nama PIC wajib diisi.");
    const { error } = await supabase.from("pic").insert({
      nama: f.nama.trim(), email: f.email.trim() || null, wa: f.wa.trim() || null, aktif: true,
    });
    if (error) return setGalat(error.message);
    setF({ nama: "", email: "", wa: "" }); setBuka(false); muat();
  };

  const ubah = async (id: string, patch: Partial<Pic>) => {
    const { error } = await supabase.from("pic").update(patch).eq("id", id);
    if (error) return setGalat(error.message);
    muat();
  };

  return (
    <Kartu judul="PIC (penanggung jawab)" aksi={<Tombol kecil varian="utama" onClick={() => setBuka((b) => !b)}>{buka ? "Tutup" : "+ PIC"}</Tombol>}>
      <p className="mb-3 text-xs text-muted-foreground">
        PIC menerima pengingat WhatsApp untuk tiap serah terima dan pengembalian. Tanpa nomor WA, pengingat ke PIC tidak muncul.
      </p>
      <Buka buka={buka}>
        <div className="mb-4 space-y-3 rounded-xl border border-border bg-muted/50 p-3">
          <Kol label="Nama"><input className={inp} value={f.nama} onChange={(e) => setF((p) => ({ ...p, nama: e.target.value }))} /></Kol>
          <Kol label="No. WhatsApp"><input className={inp} inputMode="tel" placeholder="08…" value={f.wa} onChange={(e) => setF((p) => ({ ...p, wa: e.target.value }))} /></Kol>
          <Kol label="Email (undangan Google Calendar)"><input type="email" className={inp} value={f.email} onChange={(e) => setF((p) => ({ ...p, email: e.target.value }))} /></Kol>
          <Tombol varian="utama" penuh onClick={tambah}>Simpan PIC</Tombol>
        </div>
      </Buka>

      {pic.length === 0 ? <Kosong>Belum ada PIC.</Kosong> : (
        <ul className="space-y-2.5">
          {pic.map((p) => (
            <li key={p.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{p.nama} {!p.aktif && <Lencana>nonaktif</Lencana>}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.wa || <b className="text-amber-600">belum ada WA</b>}{p.email ? " · " + p.email : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Tombol kecil onClick={() => {
                    const wa = prompt("Nomor WhatsApp PIC", p.wa || "");
                    if (wa !== null) ubah(p.id, { wa: wa.trim() || null });
                  }}>Ubah WA</Tombol>
                  <Tombol kecil varian="hantu" onClick={() => ubah(p.id, { aktif: !p.aktif })}>{p.aktif ? "Nonaktifkan" : "Aktifkan"}</Tombol>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Kartu>
  );
}
