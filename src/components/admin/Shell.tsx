import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, CalendarRange, CalendarCheck, Wallet, Users, Settings, ChevronLeft, Laptop2, LogOut,
} from "lucide-react";
import { tglHariIndo } from "@/lib/supabase";

export type Tab = "beranda" | "kalender" | "pesanan" | "uang" | "data" | "atur";

type Ikon = React.ComponentType<{ className?: string }>;
export const NAV: { tab: Tab; label: string; ikon: Ikon; grup: string }[] = [
  { tab: "beranda", label: "Ringkasan", ikon: LayoutDashboard, grup: "Utama" },
  { tab: "kalender", label: "Kalender Sewa", ikon: CalendarRange, grup: "Operasional" },
  { tab: "pesanan", label: "Pesanan", ikon: CalendarCheck, grup: "Operasional" },
  { tab: "data", label: "Pelanggan & Unit", ikon: Users, grup: "Operasional" },
  { tab: "uang", label: "Keuangan", ikon: Wallet, grup: "Bisnis" },
  { tab: "atur", label: "Pengaturan", ikon: Settings, grup: "Sistem" },
];
const GRUP = ["Utama", "Operasional", "Bisnis", "Sistem"];

const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

/** Sidebar desktop (lg ke atas). Di HP dipakai navigasi bawah. */
export function Sidebar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const [ciut, setCiut] = useState(false);
  return (
    <aside className={cx("hidden shrink-0 flex-col border-r border-border bg-card transition-[width] duration-300 lg:flex", ciut ? "w-[76px]" : "w-[248px]")}>
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Laptop2 className="h-5 w-5" />
        </div>
        {!ciut && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">Techpora</p>
            <p className="truncate text-[11px] text-muted-foreground">Operations Dashboard</p>
          </div>
        )}
      </div>
      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4" aria-label="Menu utama">
        {GRUP.map((g) => {
          const item = NAV.filter((n) => n.grup === g);
          if (!item.length) return null;
          return (
            <div key={g} className="mb-4">
              {!ciut && <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{g}</p>}
              <div className="space-y-0.5">
                {item.map(({ tab: k, label, ikon: Ikon }) => (
                  <button key={k} onClick={() => setTab(k)} title={ciut ? label : undefined} aria-current={tab === k ? "page" : undefined}
                    className={cx("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                      ciut && "justify-center px-0",
                      tab === k ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/80 hover:bg-muted")}>
                    <Ikon className="h-[18px] w-[18px] shrink-0" />
                    {!ciut && <span className="truncate">{label}</span>}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <button onClick={() => setCiut((c) => !c)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
          <ChevronLeft className={cx("h-4 w-4 transition-transform", ciut && "rotate-180")} />
          {!ciut && <span>Ciutkan</span>}
        </button>
      </div>
    </aside>
  );
}

/** Navigasi bawah di HP, mudah dijangkau jempol. */
export function NavBawah({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur lg:hidden" aria-label="Menu utama">
      <div className="mx-auto flex max-w-3xl">
        {NAV.map(({ tab: k, label, ikon: Ikon }) => {
          const on = tab === k;
          const pendek = k === "data" ? "Data" : k === "kalender" ? "Kalender" : k === "beranda" ? "Ringkasan" : k === "atur" ? "Atur" : k === "uang" ? "Uang" : "Pesanan";
          return (
            <button key={k} onClick={() => setTab(k)} aria-current={on ? "page" : undefined} aria-label={label}
              className={cx("flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold", on ? "text-primary" : "text-muted-foreground")}>
              <span className={cx("flex h-7 w-11 items-center justify-center rounded-full", on && "bg-accent")}>
                <Ikon className="h-5 w-5" />
              </span>
              {pendek}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/** Bilah atas: judul halaman, tanggal, saringan kategori, profil. */
export function Topbar({ tab, tanggal, nama, kategori, onKeluar }: {
  tab: Tab; tanggal: string; nama: string; kategori: ReactNode; onKeluar: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const aktif = NAV.find((n) => n.tab === tab);
  const awal = (nama || "AD").slice(0, 2).toUpperCase();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-foreground">{aktif?.label || "Dashboard"}</h2>
          <p className="text-xs text-muted-foreground">{tglHariIndo(tanggal)}</p>
        </div>
        <div className="ml-auto hidden md:block">{kategori}</div>
        <div className="relative">
          <button onClick={() => setMenu((m) => !m)} aria-label="Menu akun" aria-expanded={menu}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-muted">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{awal}</span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium leading-tight text-foreground">{nama || "Admin"}</span>
              <span className="block text-[11px] text-muted-foreground">Administrator</span>
            </span>
          </button>
          {menu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-border bg-card p-1.5 card-shadow-md">
                <button onClick={onKeluar} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" /> Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="px-4 pb-2.5 md:hidden">{kategori}</div>
    </header>
  );
}
