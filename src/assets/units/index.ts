// Map unit name -> local product photo path served from /public/units.

export const unitImages: Record<string, string> = {
  // Foto milik sendiri, latar sudah dihapus (disimpan di /public/units)
  "HP 14s": "/units/hp-14s.png",
  "Lenovo ThinkPad": "/units/thinkpad.png",
  "ASUS VivoBook": "/units/vivobook.png",
  "RedmiBook 15": "/units/redmibook.png",
  "Acer Aspire 5": "/units/acer.png",
  "MacBook Air M1": "/units/macbook.png",
  "Epson L3210": "/units/epson-l3210.png",
  "HP Smart Tank 215": "/units/hp-smarttank.png",
  "ViewSonic SP3": "/units/viewsonic.png",
  "Epson EB-E600": "/units/epson-eb-e600.png",
  "Epson EB-X600": "/units/epson-eb-x600.png",
};

export const getUnitImage = (name: string): string | undefined => unitImages[name];

/**
 * Foto produk yang latarnya putih solid (bukan PNG transparan).
 * Dipakai untuk mem-blend latar putih agar menyatu dengan kartu.
 */
const whiteBackdropUnits = new Set<string>([]);

export const hasWhiteBackdrop = (name: string): boolean => whiteBackdropUnits.has(name);
