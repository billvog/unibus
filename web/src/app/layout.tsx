import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

import Providers from "@/components/providers";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import PostHogPageView from "@/components/posthog-page-view";

const inter = Inter({
  weight: ["500", "700", "800", "900"],
  subsets: ["latin", "greek"],
});

export const metadata: Metadata = {
  title: "Unibus: Βρες το δρομολόγιο που σε ενδιαφέρει",
  description: "Βρες το δρομολόγιο που σε ενδιαφέρει, με το Unibus.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className}`}>
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
        <meta name="apple-mobile-web-app-title" content="Unibus" />
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <body className="h-dvh w-screen overflow-hidden">
        <Providers>
          <PostHogPageView />
          {children}
        </Providers>
      </body>
    </html>
  );
}
