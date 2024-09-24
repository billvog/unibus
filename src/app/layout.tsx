import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

import Providers from "@/providers";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "e-astiko",
  description: "Citybus.. but better ✨",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
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
