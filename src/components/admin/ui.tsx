import { useEffect, type ReactNode, type ButtonHTMLAttributes, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { X, Loader2 } from "lucide-react";

/* Komponen bersama dashboard. Bentuknya mengikuti versi Base44:
 * kartu bergaris halus dengan bayangan tipis, kartu statistik berikon,
 * badge pil dengan titik, tombol kecil, dan modal yang naik dari bawah di HP. */

const cx = (...a: (string | false | undefined | null)[]) => a.filter(Boolean).join(" ");

/** Satu gaya untuk semua kolom isian di dashboard. */
export const inp =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50";

export function Kol({ label, children, petunjuk, galat, wajib, className }: {
  label?: string; children: ReactNode; petunjuk?: string; galat?: string; wajib?: boolean; className?: string;
}) {
  return (
    <div className={cx("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}{wajib && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {children}
      {petunjuk && !galat && <p className="text-xs text-muted-foreground">{petunjuk}</p>}
      {galat && <p className="text-xs text-red-600">{galat}</p>}
    </div>
  );
}

export function Kartu({ judul, deskripsi, aksi, children, kecil, tanpaIsi, className }: {
  judul?: string; deskripsi?: string; aksi?: ReactNode; children: ReactNode; kecil?: boolean; tanpaIsi?: boolean; className?: string;
}) {
  return (
    <section className={cx("aui-masuk rounded-xl border border-border bg-card card-shadow", className)}>
      {(judul || aksi) && (
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            {judul && <h2 className="text-sm font-semibold text-foreground">{judul}</h2>}
            {deskripsi && <p className="mt-0.5 text-xs text-muted-foreground">{deskripsi}</p>}
          </div>
          {aksi}
        </div>
      )}
      <div className={tanpaIsi ? "" : kecil ? "p-3" : "p-4 sm:p-5"}>{children}</div>
    </section>
  );
}

export function Judul({ judul, deskripsi, aksi, ikon: Ikon }: {
  judul: string; deskripsi?: string; aksi?: ReactNode; ikon?: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {Ikon && (
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <Ikon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{judul}</h1>
          {deskripsi && <p className="mt-1 text-sm text-muted-foreground">{deskripsi}</p>}
        </div>
      </div>
      {aksi && <div className="flex flex-wrap items-center gap-2">{aksi}</div>}
    </div>
  );
}

const AKSEN = {
  utama: "bg-primary/10 text-primary",
  hijau: "bg-emerald-50 text-emerald-600",
  kuning: "bg-amber-50 text-amber-600",
  merah: "bg-red-50 text-red-600",
  biru: "bg-sky-50 text-sky-600",
  ungu: "bg-indigo-50 text-indigo-600",
} as const;
export type Aksen = keyof typeof AKSEN;

export function KartuAngka({ label, nilai, ikon: Ikon, aksen = "utama", sub, onClick, className }: {
  label: string; nilai: ReactNode; ikon?: ComponentType<{ className?: string }>; aksen?: Aksen; sub?: string; onClick?: () => void; className?: string;
}) {
  const isi = (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground sm:text-sm">{label}</p>
        <p className="mt-1.5 truncate text-xl font-semibold tracking-tight tabular-nums text-foreground sm:mt-2 sm:text-2xl">{nilai}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </div>
      {Ikon && (
        <div className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10", AKSEN[aksen])}>
          <Ikon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </div>
      )}
    </div>
  );
  const kelas = cx("aui-masuk w-full rounded-xl border border-border bg-card p-4 text-left card-shadow sm:p-5", className);
  return onClick
    ? <button onClick={onClick} className={cx(kelas, "hover:border-primary/40")}>{isi}</button>
    : <div className={kelas}>{isi}</div>;
}

type Varian = "utama" | "lembut" | "garis" | "bahaya" | "hantu";
const VARIAN: Record<Varian, string> = {
  utama: "bg-primary text-primary-foreground hover:bg-primary/90",
  lembut: "bg-accent text-accent-foreground hover:bg-accent/70",
  garis: "border border-border bg-card text-foreground hover:bg-muted",
  bahaya: "bg-red-600 text-white hover:bg-red-700",
  hantu: "text-muted-foreground hover:bg-muted hover:text-foreground",
};

export function Tombol({
  varian = "garis", kecil, penuh, className = "", ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { varian?: Varian; kecil?: boolean; penuh?: boolean }) {
  return (
    <button
      {...rest}
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-50",
        kecil ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        penuh && "w-full", VARIAN[varian], className,
      )}
    />
  );
}

/** Tautan bergaya tombol (mis. WhatsApp). */
export function TautanTombol({
  varian = "garis", kecil = true, className = "", ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { varian?: Varian; kecil?: boolean }) {
  return (
    <a
      target="_blank" rel="noreferrer" {...rest}
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium",
        kecil ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm", VARIAN[varian], className,
      )}
    />
  );
}

const NADA = {
  hijau: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  kuning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  biru: "bg-sky-50 text-sky-700 ring-sky-600/20",
  ungu: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  merah: "bg-red-50 text-red-700 ring-red-600/20",
  abu: "bg-slate-100 text-slate-500 ring-slate-500/20",
} as const;
export type Nada = keyof typeof NADA;

/** Badge pil dengan titik, seperti StatusBadge di Base44. */
export function Lencana({ nada = "abu", children }: { nada?: Nada; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", NADA[nada])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}

export function Kosong({ children, ikon: Ikon }: { children: ReactNode; ikon?: ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      {Ikon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Ikon className="h-6 w-6" />
        </div>
      )}
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

/** Pilihan bersegmen (Semua / Akan datang / Aktif …). */
export function Segmen<T extends string>({ nilai, pilihan, onChange }: {
  nilai: T; pilihan: readonly (readonly [T, string])[]; onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-0.5">
      {pilihan.map(([k, t]) => (
        <button key={k} onClick={() => onChange(k)}
          className={cx("rounded-md px-3 py-1.5 text-xs font-medium",
            nilai === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
          {t}
        </button>
      ))}
    </div>
  );
}

/** Modal: naik dari bawah di HP, di tengah di layar lebar. Esc / klik latar menutup. */
export function Modal({ buka, tutup, judul, deskripsi, children, kaki, lebar = "md" }: {
  buka: boolean; tutup: () => void; judul: string; deskripsi?: string; children: ReactNode; kaki?: ReactNode; lebar?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!buka) return;
    const tekan = (e: KeyboardEvent) => e.key === "Escape" && tutup();
    window.addEventListener("keydown", tekan);
    const awal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", tekan); document.body.style.overflow = awal; };
  }, [buka, tutup]);

  if (!buka || typeof document === "undefined") return null;
  const L = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" }[lebar];
  return createPortal(
    <div className="admin-ui fixed inset-0 z-50 flex items-end justify-center bg-transparent p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={judul}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={tutup} />
      <div className={cx("aui-modal relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-border bg-card shadow-xl sm:rounded-2xl", L)}>
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">{judul}</h3>
            {deskripsi && <p className="mt-0.5 text-sm text-muted-foreground">{deskripsi}</p>}
          </div>
          <button onClick={tutup} aria-label="Tutup" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {kaki && <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">{kaki}</div>}
      </div>
    </div>,
    document.body,
  );
}

/** Konfirmasi hapus: menggantikan window.confirm yang jelek di HP. */
export function Konfirmasi({ buka, tutup, onYa, judul, pesan, label = "Hapus" }: {
  buka: boolean; tutup: () => void; onYa: () => void | Promise<void>; judul: string; pesan: string; label?: string;
}) {
  return (
    <Modal buka={buka} tutup={tutup} judul={judul} lebar="sm"
      kaki={<><Tombol onClick={tutup}>Batal</Tombol><Tombol varian="bahaya" onClick={async () => { await onYa(); tutup(); }}>{label}</Tombol></>}>
      <p className="text-sm text-muted-foreground">{pesan}</p>
    </Modal>
  );
}

export function Memuat() {
  return <div className="flex h-40 items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>;
}

/** Wadah yang membuka-menutup dengan animasi tinggi, bukan muncul tiba-tiba. */
export function Buka({ buka, children }: { buka: boolean; children: ReactNode }) {
  return (
    <div className="aui-buka" data-buka={buka} aria-hidden={!buka}>
      <div>{buka ? children : null}</div>
    </div>
  );
}

export function Kerangka({ baris = 3 }: { baris?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Memuat">
      {Array.from({ length: baris }).map((_, i) => <div key={i} className="aui-kerangka h-20" />)}
    </div>
  );
}

export const labelBayar = {
  lunas: { teks: "Lunas", nada: "hijau" as Nada },
  sebagian: { teks: "Sebagian", nada: "kuning" as Nada },
  belum: { teks: "Belum bayar", nada: "merah" as Nada },
  batal: { teks: "Batal", nada: "abu" as Nada },
};
