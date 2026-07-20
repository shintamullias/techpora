import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const SITE_URL = "https://techpora.id";

export const Route = createFileRoute("/masuk")({
  head: () => ({
    meta: [
      { title: "Masuk / Daftar — Techpora" },
      { name: "description", content: "Masuk atau daftar akun untuk menyewa laptop di Techpora." },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/masuk` }],
  }),
  component: Masuk,
});

function Masuk() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"masuk" | "daftar">("masuk");
  const [email, setEmail] = useState("");
  const [sandi, setSandi] = useState("");
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [pesan, setPesan] = useState("");
  const [galat, setGalat] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/akun" });
    });
  }, []);

  const kirim = async () => {
    setGalat("");
    setPesan("");
    if (!email.trim() || sandi.length < 6) {
      setGalat("Isi email dan kata sandi minimal 6 karakter.");
      return;
    }
    if (mode === "daftar" && (!nama.trim() || !wa.trim())) {
      setGalat("Nama dan nomor WhatsApp wajib diisi.");
      return;
    }
    setSibuk(true);
    try {
      if (mode === "daftar") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: sandi,
          options: { data: { nama: nama.trim(), wa: wa.trim() } },
        });
        if (error) throw error;
        const { data } = await supabase.auth.getSession();
        if (data.session) nav({ to: "/akun" });
        else setPesan("Akun dibuat. Cek email untuk konfirmasi, lalu masuk kembali.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: sandi });
        if (error) throw error;
        nav({ to: "/akun" });
      }
    } catch (e: any) {
      const m = String(e?.message || e);
      setGalat(
        m.includes("Invalid login")
          ? "Email atau kata sandi salah."
          : m.includes("already registered")
          ? "Email ini sudah terdaftar. Coba masuk."
          : m
      );
    } finally {
      setSibuk(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="mb-6 block text-center text-sm text-muted-foreground hover:text-foreground">
          ← Kembali ke techpora.id
        </Link>

        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <h1 className="font-serif text-2xl text-foreground">
            {mode === "masuk" ? "Masuk ke akunmu" : "Buat akun penyewa"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "masuk"
              ? "Lanjutkan pengajuan sewa atau lihat status verifikasimu."
              : "Setelah daftar, unggah dokumen syarat. Kami verifikasi dulu sebelum kamu bisa memesan unit."}
          </p>

          <div className="mt-5 space-y-3">
            {mode === "daftar" && (
              <>
                <Kolom label="Nama sesuai KTP" value={nama} onChange={setNama} placeholder="Nama lengkap" />
                <Kolom label="Nomor WhatsApp" value={wa} onChange={setWa} placeholder="08…" inputMode="tel" />
              </>
            )}
            <Kolom label="Email" value={email} onChange={setEmail} placeholder="nama@email.com" type="email" />
            <Kolom label="Kata sandi" value={sandi} onChange={setSandi} placeholder="minimal 6 karakter" type="password" />
          </div>

          {galat && <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{galat}</p>}
          {pesan && <p className="mt-3 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{pesan}</p>}

          <button
            onClick={kirim}
            disabled={sibuk}
            className="mt-5 w-full rounded-xl bg-primary px-4 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {sibuk ? "Memproses…" : mode === "masuk" ? "Masuk" : "Daftar"}
          </button>

          <button
            onClick={() => {
              setMode(mode === "masuk" ? "daftar" : "masuk");
              setGalat("");
              setPesan("");
            }}
            className="mt-4 w-full text-center text-sm text-muted-foreground underline underline-offset-4"
          >
            {mode === "masuk" ? "Belum punya akun? Daftar di sini" : "Sudah punya akun? Masuk"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Dokumen identitasmu disimpan terenkripsi dan hanya bisa dilihat oleh admin Techpora.
        </p>
      </div>
    </div>
  );
}

function Kolom({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  [k: string]: any;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}
