import { BackendProduct, toProductCard } from "@/lib/products";

/**
 * Server-side product lookups for product pages and the sitemap. Responses are
 * cached by Next.js for a few minutes so price changes show up quickly without
 * hitting the backend on every visit.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const REVALIDATE_SECONDS = 300;

export async function getProduct(id: string): Promise<ProductCardProps | null> {
  try {
    const res = await fetch(
      `${API_URL}/storefront-products/${encodeURIComponent(id)}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!res.ok) return null;
    return toProductCard((await res.json()) as BackendProduct);
  } catch {
    return null;
  }
}

export async function getAllProducts(): Promise<ProductCardProps[]> {
  try {
    const res = await fetch(`${API_URL}/storefront-products`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    return ((await res.json()) as BackendProduct[]).map(toProductCard);
  } catch {
    return [];
  }
}
