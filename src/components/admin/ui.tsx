import type { ReactNode, ButtonHTMLAttributes } from "react";

/** Satu gaya untuk semua kolom isian di dashboard. */
export const inp =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20";

export function Kol({ label, children, petunjuk }: { label: string; children: ReactNode; petunjuk?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
      {petunjuk && <p className="mt-1 text-xs text-muted-foreground">{petunjuk}</p>}
    </div>
  );
}

export function Kartu({ judul, aksi, children, kecil }: { judul?: string; aksi?: ReactNode; children: ReactNode; kecil?: boolean }) {
  return (
    <section className={"aui-masuk rounded-2xl border border-border bg-card shadow-sm " + (kecil ? "p-3" : "p-4")}>
      {(judul || aksi) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {judul && <h2 className="text-lg text-foreground">{judul}</h2>}
          {aksi}
        </div>
      )}
      {children}
    </section>
  );
}

type Varian = "utama" | "lembut" | "garis" | "bahaya" | "hantu";
const VARIAN: Record<Varian, string> = {
  utama: "bg-primary text-primary-foreground hover:bg-primary/90",
  lembut: "bg-accent text-accent-foreground hover:bg-accent/70",
  garis: "border border-border bg-card text-foreground hover:bg-muted",
  bahaya: "bg-destructive/10 text-destructive hover:bg-destructive/15",
  hantu: "text-muted-foreground hover:bg-muted hover:text-foreground",
};

export function Tombol({
  varian = "garis", kecil, penuh, className = "", ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { varian?: Varian; kecil?: boolean; penuh?: boolean }) {
  return (
    <button
      {...rest}
      className={
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold disabled:opacity-50 " +
        (kecil ? "px-2.5 py-1.5 text-xs " : "px-4 py-2.5 text-sm ") +
        (penuh ? "w-full " : "") + VARIAN[varian] + " " + className
      }
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
      className={
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold " +
        (kecil ? "px-2.5 py-1.5 text-xs " : "px-4 py-2.5 text-sm ") + VARIAN[varian] + " " + className
      }
    />
  );
}

const NADA = {
  hijau: "bg-emerald-50 text-emerald-700",
  kuning: "bg-amber-50 text-amber-700",
  biru: "bg-sky-50 text-sky-700",
  merah: "bg-red-50 text-red-700",
  abu: "bg-muted text-muted-foreground",
} as const;
export type Nada = keyof typeof NADA;

export function Lencana({ nada = "abu", children }: { nada?: Nada; children: ReactNode }) {
  return <span className={"inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold " + NADA[nada]}>{children}</span>;
}

export function Kosong({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-muted/60 px-4 py-8 text-center text-sm text-muted-foreground">{children}</p>;
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
