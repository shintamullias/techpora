// Shared official rates used by the catalog and editorial generation; never import a route into scripts.
export const RENTAL_PRICES = {
  laptop: { daily: 79_000, weekly: 450_000, monthly: 1_400_000 },
  macbook: { daily: 250_000, weekly: 1_500_000, monthly: 4_500_000 },
  macbookProM1: { daily: 300_000, weekly: 1_800_000, monthly: 5_500_000 },
  macbookNeo: { daily: 225_000, weekly: 1_350_000, monthly: 4_000_000 },
} as const;

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}