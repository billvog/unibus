import "@web/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";

import PostHogPageView from "@web/components/posthog-page-view";
import Providers from "@web/components/providers";

const inter = Inter({
  weight: ["500", "700", "800", "900"],
  subsets: ["latin", "greek"],
});

const marketing = {
  title: "unibus",
  description: "Public transit, without the buzz – with unibus.",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://unibus.gr"),
  title: marketing.title,
  description: marketing.description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  alternates: {
    canonical: "https://unibus.gr",
  },
  openGraph: {
    type: "website",
    title: marketing.title,
    description: marketing.description,
    images: [
      {
        url: "/og-image.png",
        width: 1667,
        height: 875,
        alt: marketing.title,
      },
    ],
  },
  robots: "index, follow",
  authors: [
    {
      name: "Vasilis Voyiadjis",
      url: "https://github.com/billvog",
    },
  ],
  keywords: [
    "bus routes",
    "city bus",
    "public transport",
    "bus schedules",
    "unibus",
    "αστικο",
    "λαμια",
    "δρομολογια",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className}`} suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-48x48.png"
          sizes="48x48"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="unibus" />
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <body
        className="h-dvh w-screen overflow-x-hidden"
        suppressHydrationWarning
      >
        <Providers>
          <PostHogPageView />
          {children}
        </Providers>
      </body>
    </html>
  );
}
