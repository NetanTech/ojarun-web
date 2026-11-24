import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/productsServer";
import { productPath } from "@/lib/productSlug";

/**
 * /sitemap.xml for search engines: the public pages plus one entry per
 * product page. Rebuilt every few minutes as the catalog changes.
 */
const SITE = "https://www.ojarun.com";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/marketplace`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/contact-us`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/photo-credits`, changeFrequency: "monthly", priority: 0.1 },
  ].map((p) => ({ ...p, lastModified: now }) as MetadataRoute.Sitemap[number]);

  const products = (await getAllProducts()).map((p) => ({
    url: `${SITE}${productPath(p)}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
    ...(p.imageURL?.startsWith("http") ? { images: [p.imageURL] } : {}),
  }));

  return [...pages, ...products];
}
