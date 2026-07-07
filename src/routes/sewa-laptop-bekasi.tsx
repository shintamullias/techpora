import { createFileRoute, notFound } from "@tanstack/react-router";
import { AreaPage } from "@/components/AreaPage";
import { areaBySlug } from "@/data/areas";

const SLUG = "sewa-laptop-bekasi";
const SITE_URL = "https://techpora.id";
const area = areaBySlug(SLUG)!;

export const Route = createFileRoute("/sewa-laptop-bekasi")({
  head: () => ({
    meta: [
      { title: area.title },
      { name: "description", content: area.metaDescription },
      { name: "keywords", content: area.keywords },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { property: "og:title", content: area.title },
      { property: "og:description", content: area.metaDescription },
      { property: "og:url", content: `${SITE_URL}/${SLUG}` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: area.title },
      { name: "twitter:description", content: area.metaDescription },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/${SLUG}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: area.h1,
          serviceType: "Sewa Laptop",
          areaServed: { "@type": "Place", name: area.area },
          provider: {
            "@type": "LocalBusiness",
            name: "Techpora.id",
            url: SITE_URL,
            telephone: "+62821-7798-4041",
          },
          url: `${SITE_URL}/${SLUG}`,
          description: area.metaDescription,
        }),
      },
    ],
  }),
  loader: () => {
    if (!areaBySlug(SLUG)) throw notFound();
    return null;
  },
  component: () => <AreaPage area={area} />,
});
