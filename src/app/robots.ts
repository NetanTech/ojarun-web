import type { MetadataRoute } from "next";

/**
 * Lets search engines find the sitemap. Account pages are left out of search
 * results. (Cloudflare may add its own content-signal lines in front of this.)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/checkout",
        "/my-profile",
        "/order-history",
        "/notifications",
        "/favourites",
        "/rewards",
        "/shopping-list",
      ],
    },
    sitemap: "https://www.ojarun.com/sitemap.xml",
  };
}
