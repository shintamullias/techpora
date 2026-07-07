export const WA_NUMBER = "6282177984041";
export const SITE_DOMAIN = "techpora.id";

export function buildWaSimple(unit?: string, area?: string) {
  const unitPart = unit ? `unit ${unit}` : "unit yang tersedia";
  const areaPart = area ? ` untuk area ${area}` : "";
  return [
    `Halo Techpora, saya mau sewa ${unitPart}${areaPart}.`,
    "Mohon info ketersediaan dan durasi sewa yang paling hemat.",
    `Saya lihat dari ${SITE_DOMAIN}.`,
  ].join("\n");
}

export function waLink(text: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
