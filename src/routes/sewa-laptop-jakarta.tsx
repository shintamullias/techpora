import { createFileRoute } from "@tanstack/react-router";
import { JakartaHub, jakartaHubCopy } from "@/components/JakartaHub";

const SITE_URL = "https://techpora.id";
const PATH = "/sewa-laptop-jakarta";
const c = jakartaHubCopy.sewa;

export const Route = createFileRoute("/sewa-laptop-jakarta")({
  head: () => ({
    meta: [
      { title: c.title },
      { name: "description", content: c.metaDescription },
      { name: "keywords", content: c.keywords },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { property: "og:title", content: c.ogTitle },
      { property: "og:description", content: c.ogDesc },
      { property: "og:url", content: `${SITE_URL}${PATH}` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: c.ogTitle },
      { name: "twitter:description", content: c.ogDesc },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}${PATH}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Techpora.id — Sewa Laptop Jakarta",
          image: `${SITE_URL}/og-image.jpg`,
          url: `${SITE_URL}${PATH}`,
          telephone: "+62821-7798-4041",
          priceRange: "Rp49.000 - Rp4.500.000",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jl. R. Mangun Muka Raya, Rawamangun",
            addressLocality: "Jakarta Timur",
            addressRegion: "DKI Jakarta",
            postalCode: "13220",
            addressCountry: "ID",
          },
          areaServed: [
            { "@type": "City", name: "Jakarta Selatan" },
            { "@type": "City", name: "Jakarta Timur" },
            { "@type": "City", name: "Jakarta Barat" },
            { "@type": "City", name: "Jakarta Utara" },
            { "@type": "City", name: "Jakarta Pusat" },
          ],
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "08:00",
            closes: "21:00",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "128",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Beranda", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Sewa Laptop Jakarta", item: `${SITE_URL}${PATH}` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: c.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: () => <JakartaHub variant="sewa" />,
});
