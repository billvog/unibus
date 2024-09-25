import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

import Providers from "@/components/providers";
import { type Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["500", "700", "800", "900"],
  subsets: ["latin", "greek"],
});

export const metadata: Metadata = {
  title: "e-astiko",
  description: "Citybus.. but better ✨",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <head>
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="h-screen w-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
