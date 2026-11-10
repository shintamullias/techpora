import { createFileRoute } from "@tanstack/react-router";
import { ProductPage, productHead, type ProductPageData } from "@/components/ProductPage";

const data: ProductPageData = {
  slug: "sewa-printer-jakarta",
  title: "Sewa Printer Jakarta Harian — Epson & HP | Techpora",
  description:
    "Sewa printer di Jakarta: Epson L3210 mulai Rp100.000/hari dan HP Smart Tank 215. Print, scan, copy. Harian, mingguan, bulanan — antar ke lokasi Anda.",
  keywords:
    "sewa printer jakarta, rental printer jakarta, sewa printer harian, sewa printer jakarta timur, sewa printer terdekat, sewa printer bulanan, sewa printer epson, sewa printer hp",
  eyebrow: "Rental Printer — Jakarta & Jabodetabek",
  h1: "Sewa Printer Jakarta — Epson L3210 & HP Smart Tank",
  intro:
    "Butuh printer untuk acara, ujian, kantor sementara, atau tugas kuliah tanpa beli unit baru? Techpora menyewakan printer print-scan-copy untuk sewa harian, mingguan, dan bulanan di Jakarta dan sekitarnya.",
  waUnit: "printer",
  unitsHeading: "Printer yang bisa disewa",
  units: [
    { name: "Epson L3210", specs: "Print · Scan · Copy", daily: "Rp100.000", weekly: "Rp500.000", monthly: "Rp1.500.000", dailyNum: 100000, monthlyNum: 1500000 },
    { name: "HP Smart Tank 215", specs: "Print · Scan · Copy", daily: "Rp125.000", weekly: "Rp650.000", monthly: "Rp2.000.000", dailyNum: 125000, monthlyNum: 2000000 },
  ],
  whyHeading: "Kenapa Sewa Printer di Techpora",
  why: [
    { title: "Print, scan, dan copy", body: "Kedua printer adalah model multifungsi, jadi cocok untuk dokumen kantor, berkas administrasi, dan keperluan kuliah." },
    { title: "Harian sampai bulanan", body: "Pilih durasi sesuai kebutuhan. Makin panjang durasi sewa, biaya per hari makin hemat." },
    { title: "Antar ke lokasi", body: "Kami melayani pengantaran area Jakarta, Bekasi, Depok, dan Tangerang. Biaya antar disesuaikan jarak." },
    { title: "Satu vendor untuk laptop dan proyektor", body: "Perlu laptop atau proyektor sekalian untuk acara yang sama? Cukup satu chat WhatsApp." },
  ],
  faqs: [
    { q: "Berapa harga sewa printer per hari di Jakarta?", a: "Epson L3210 Rp100.000 per hari dan HP Smart Tank 215 Rp125.000 per hari. Sewa mingguan mulai Rp500.000 dan bulanan mulai Rp1.500.000." },
    { q: "Apakah printer yang disewa bisa scan dan fotokopi?", a: "Bisa. Epson L3210 dan HP Smart Tank 215 adalah printer multifungsi yang mendukung print, scan, dan copy." },
    { q: "Bisa diantar ke lokasi acara atau kantor saya?", a: "Bisa. Pengantaran melayani area Jakarta, Bekasi, Depok, dan Tangerang. Biaya antar dikonfirmasi lewat WhatsApp sesuai jarak." },
    { q: "Bagaimana cara memesan dan apa syaratnya?", a: "Chat WhatsApp Techpora untuk cek stok pada tanggal yang Anda butuhkan. Syarat identitas dan detail sewa dijelaskan saat konfirmasi." },
  ],
  related: [
    { to: "/sewa-laptop-jakarta", label: "Sewa Laptop Jakarta" },
    { to: "/sewa-proyektor-jakarta", label: "Sewa Proyektor Jakarta" },
    { to: "/sewa-macbook", label: "Sewa MacBook" },
    { to: "/sewa-laptop-jakarta-timur", label: "Sewa Laptop Jakarta Timur" },
    { to: "/sewa-laptop-event-jakarta", label: "Sewa Laptop untuk Event" },
  ],
};

export const Route = createFileRoute("/sewa-printer-jakarta")({
  head: () => productHead(data),
  component: () => <ProductPage data={data} />,
});
