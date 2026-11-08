// Map unit name -> product photo URL
//
// Foto stok bebas-pakai (Unsplash License, boleh komersial) dipakai sementara
// menggantikan foto unit asli yang sebelumnya tersimpan di aset Lovable dan
// tidak ikut terbawa ke hosting lain. Untuk mengembalikan foto unit asli,
// taruh file-nya di /public/units dan ganti URL di bawah ke path lokal
// (contoh: "/units/thinkpad.png"), seperti "HP 14s".

const LAPTOP_A =
  "https://images.unsplash.com/photo-1603056359772-8803d3eae79a?w=800&q=80&auto=format&fit=crop";
const LAPTOP_B =
  "https://images.unsplash.com/photo-1709721835709-a7440f7f99e6?w=800&q=80&auto=format&fit=crop";
const LAPTOP_C =
  "https://images.unsplash.com/photo-1709721821603-8f0f11ce3e0d?w=800&q=80&auto=format&fit=crop";
const MACBOOK =
  "https://images.unsplash.com/photo-1607603289612-71ae134aa577?w=800&q=80&auto=format&fit=crop";
const PRINTER =
  "https://images.unsplash.com/photo-1710857679450-ecd7945dd4bd?w=800&q=80&auto=format&fit=crop";
const PROJECTOR =
  "https://images.unsplash.com/photo-1728771175581-3cb1e21fac92?w=800&q=80&auto=format&fit=crop";

export const unitImages: Record<string, string> = {
  // Foto milik sendiri, latar sudah dihapus (disimpan di /public/units)
  "HP 14s": "/units/hp-14s.png",
  "Lenovo ThinkPad": LAPTOP_A,
  "ASUS VivoBook": LAPTOP_B,
  "RedmiBook 15": LAPTOP_C,
  "Acer Aspire 5": LAPTOP_B,
  "MacBook Air M1": MACBOOK,
  "Epson L3210": PRINTER,
  "HP Smart Tank 215": PRINTER,
  "ViewSonic SP3": PROJECTOR,
  "Epson EB-E600": PROJECTOR,
  "Epson EB-X600": PROJECTOR,
};

export const getUnitImage = (name: string): string | undefined => unitImages[name];

/**
 * Foto produk yang latarnya putih solid (bukan PNG transparan).
 * Dipakai untuk mem-blend latar putih agar menyatu dengan kartu.
 */
const whiteBackdropUnits = new Set<string>([]);

export const hasWhiteBackdrop = (name: string): boolean => whiteBackdropUnits.has(name);
