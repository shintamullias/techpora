import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Techpora.id" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "s38inJ6I2e5zwqwEqQDEWc5sxUeleIoG8d0rNvugujA" },
      { title: "Sewa / Rental Laptop Jakarta - Techpora.id" },
      { property: "og:title", content: "Sewa / Rental Laptop Jakarta - Techpora.id" },
      { name: "twitter:title", content: "Sewa / Rental Laptop Jakarta - Techpora.id" },
      { name: "description", content: "Sewa laptop, printer & proyektor di Jakarta. Harian, mingguan, bulanan. Unit siap pakai, pengiriman cepat untuk mahasiswa, kantor, dan event." },
      { property: "og:description", content: "Sewa laptop, printer & proyektor di Jakarta. Harian, mingguan, bulanan. Unit siap pakai, pengiriman cepat untuk mahasiswa, kantor, dan event." },
      { name: "twitter:description", content: "Sewa laptop, printer & proyektor di Jakarta. Harian, mingguan, bulanan. Unit siap pakai, pengiriman cepat untuk mahasiswa, kantor, dan event." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5874f92e-35ee-4710-ae8d-3edda3edb5ea" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5874f92e-35ee-4710-ae8d-3edda3edb5ea" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Fira+Sans:wght@300;400;500;600;700;800&display=swap",
      },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    ],
    scripts: GA_ID
      ? [
          {
            src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
            async: true,
          },
          {
            children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
          },
        ]
      : [],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
        {/*
          Pengaman domain kembar: bila situs diakses lewat domain staging
          *.lovable.app, beri tahu mesin pencari untuk tidak mengindeksnya.
          Sengaja HANYA menyasar akhiran ".lovable.app" — bukan "selain
          techpora.id" — supaya domain produksi (termasuk www dan preview
          Netlify) tidak pernah ikut ter-noindex.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(location.hostname.endsWith(".lovable.app")){var m=document.createElement("meta");m.name="robots";m.content="noindex, follow";document.head.appendChild(m);}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
