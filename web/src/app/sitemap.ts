import type { MetadataRoute } from "next";

const url = "https://unibus.gr";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${url}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${url}/whoami`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
