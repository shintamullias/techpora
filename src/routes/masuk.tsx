import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/masuk")({
  head: () => ({
    meta: [{ title: "Masuk — Techpora" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: Masuk,
});

function Masuk() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [sandi, setSandi] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) nav({ to: "/admin" }); });
  }, []);

  const masuk = async () => {
    setGalat("");
    if (!email.trim() || !sandi) return setGalat("Isi email dan kata sandi.");
    setSibuk(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: sandi });
    setSibuk(false);
    if (error) setGalat(error.message.includes("Invalid login") ? "Email atau kata sandi salah." : error.message);
    else nav({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 block text-center text-sm text-muted-foreground hover:text-foreground">
          ← techpora.id
        </Link>
        <div className="rounded-2xl border border-border bg-background p-6">
          <h1 className="font-serif text-2xl text-foreground">Masuk dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Halaman ini khusus pengelola Techpora.</p>

          <div className="mt-5 space-y-3">
            <Kolom label="Email" value={email} onChange={setEmail} type="email" placeholder="nama@email.com" />
            <Kolom label="Kata sandi" value={sandi} onChange={setSandi} type="password" placeholder="••••••" />
          </div>

          {galat && <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{galat}</p>}

          <button
            onClick={masuk}
            disabled={sibuk}
            className="mt-5 w-full rounded-xl bg-primary px-4 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {sibuk ? "Memproses…" : "Masuk"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Kolom({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void; [k: string]: any }) {
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
