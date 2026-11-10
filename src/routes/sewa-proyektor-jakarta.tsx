import { createFileRoute } from "@tanstack/react-router";
import { ProductPage, productHead, type ProductPageData } from "@/components/ProductPage";

const data: ProductPageData = {
  slug: "sewa-proyektor-jakarta",
  title: "Sewa Proyektor Jakarta Harian — Epson & ViewSonic | Techpora",
  description:
    "Sewa proyektor di Jakarta: ViewSonic SP3 mulai Rp150.000/hari, Epson EB-E600 dan EB-X600 3LCD. Untuk seminar, rapat, dan event. Antar ke lokasi Anda.",
  keywords:
    "sewa proyektor jakarta, rental proyektor jakarta, sewa proyektor harian, sewa proyektor jakarta timur, sewa proyektor terdekat, sewa proyektor epson, sewa infocus, sewa proyektor seminar",
  eyebrow: "Rental Proyektor — Jakarta & Jabodetabek",
  h1: "Sewa Proyektor Jakarta — Epson 3LCD & ViewSonic",
  intro:
    "Proyektor untuk seminar, presentasi kantor, kelas, atau nonton bareng. Techpora menyewakan proyektor portable dan 3LCD terang untuk sewa harian, mingguan, dan bulanan di Jakarta dan sekitarnya.",
  waUnit: "proyektor",
  unitsHeading: "Proyektor yang bisa disewa",
  units: [
    { name: "ViewSonic SP3", specs: "Portable · HD", daily: "Rp150.000", weekly: "Rp850.000", monthly: "Rp2.500.000", dailyNum: 150000, monthlyNum: 2500000 },
    { name: "Epson EB-E600", specs: "3LCD · 3500 Lumens", daily: "Rp200.000", weekly: "Rp1.200.000", monthly: "Rp3.500.000", dailyNum: 200000, monthlyNum: 3500000 },
    { name: "Epson EB-X600", specs: "3LCD · XGA · 3700 Lumens", daily: "Rp225.000", weekly: "Rp1.350.000", monthly: "Rp4.000.000", dailyNum: 225000, monthlyNum: 4000000 },
  ],
  whyHeading: "Kenapa Sewa Proyektor di Techpora",
  why: [
    { title: "Pilihan sesuai ruangan", body: "ViewSonic SP3 praktis dibawa untuk ruang kecil. Epson EB-E600 (3500 lumens) dan EB-X600 (3700 lumens) lebih terang untuk ruang meeting dan aula." },
    { title: "Teknologi 3LCD", body: "Seri Epson EB menggunakan 3LCD, cocok untuk presentasi dengan teks dan grafik yang jelas." },
    { title: "Harian sampai bulanan", body: "Sewa untuk satu acara atau berbulan-bulan. Durasi lebih panjang berarti biaya per hari lebih hemat." },
    { title: "Paket laptop + proyektor", body: "Butuh laptop dan printer di acara yang sama? Satu chat WhatsApp cukup untuk semuanya." },
  ],
  faqs: [
    { q: "Berapa harga sewa proyektor per hari di Jakarta?", a: "ViewSonic SP3 Rp150.000, Epson EB-E600 Rp200.000, dan Epson EB-X600 Rp225.000 per hari. Tersedia juga paket mingguan dan bulanan." },
    { q: "Proyektor mana yang cocok untuk seminar atau aula?", a: "Untuk ruangan lebih besar atau yang cahayanya terang, pilih Epson EB-X600 (3700 lumens) atau EB-E600 (3500 lumens). ViewSonic SP3 cocok untuk ruang kecil dan presentasi ringkas." },
    { q: "Bisa diantar ke lokasi acara saya?", a: "Bisa. Pengantaran melayani area Jakarta, Bekasi, Depok, dan Tangerang. Biaya antar dikonfirmasi lewat WhatsApp sesuai jarak." },
    { q: "Bagaimana cara memesan dan apa syaratnya?", a: "Chat WhatsApp Techpora untuk cek stok pada tanggal acara Anda. Syarat identitas dan detail sewa dijelaskan saat konfirmasi." },
  ],
  related: [
    { to: "/sewa-laptop-jakarta", label: "Sewa Laptop Jakarta" },
    { to: "/sewa-printer-jakarta", label: "Sewa Printer Jakarta" },
    { to: "/sewa-laptop-event-jakarta", label: "Sewa Laptop untuk Event" },
    { to: "/sewa-laptop-jakarta-timur", label: "Sewa Laptop Jakarta Timur" },
    { to: "/sewa-macbook", label: "Sewa MacBook" },
  ],
};

export const Route = createFileRoute("/sewa-proyektor-jakarta")({
  head: () => productHead(data),
  component: () => <ProductPage data={data} />,
});
