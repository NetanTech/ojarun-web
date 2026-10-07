const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type BackendProduct = {
  id: string;
  name: string;
  unit: string;
  currentPrice: number;
  isAvailable: boolean;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
};

export function toProductCard(p: BackendProduct): ProductCardProps {
  return {
    id: p.id,
    name: p.name,
    category: p.category || "Uncategorized",
    price: p.currentPrice,
    imageURL: p.imageUrl || "/assets/Untitled design.png",
    more: p.unit,
  };
}

type CacheEntry = {
  at: number;
  products: ProductCardProps[];
};

const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;
const inflight = new Map<string, Promise<ProductCardProps[]>>();

function cacheKey(params?: { search?: string; category?: string }) {
  return `${params?.search?.trim().toLowerCase() ?? ""}|${(params?.category ?? "all").toLowerCase()}`;
}

export function filterProductsByCategory(
  products: ProductCardProps[],
  category: string,
): ProductCardProps[] {
  if (!category || category === "all") return products;
  if (category.toLowerCase() === "other") {
    return products.filter((p) => {
      const c = (p.category || "").trim().toLowerCase();
      return !c || c === "other" || c === "uncategorized";
    });
  }
  const wanted = category.toLowerCase();
  return products.filter((p) => (p.category || "").toLowerCase() === wanted);
}

export async function fetchProducts(params?: {
  search?: string;
  category?: string;
}): Promise<ProductCardProps[]> {
  const key = cacheKey(params);
  const hit = memoryCache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.products;
  }

  const pending = inflight.get(key);
  if (pending) return pending;

  const request = (async () => {
    const query = new URLSearchParams();
    if (params?.search?.trim()) query.set("search", params.search.trim());
    if (params?.category && params.category !== "all") {
      query.set("category", params.category);
    }
    const qs = query.toString();

    const res = await fetch(
      `${API_URL}/storefront-products${qs ? `?${qs}` : ""}`,
    );
    if (!res.ok) {
      throw new Error("Could not load products. Please try again.");
    }
    const data = (await res.json()) as BackendProduct[];
    const products = data.map(toProductCard);
    memoryCache.set(key, { at: Date.now(), products });
    return products;
  })();

  inflight.set(key, request);
  try {
    return await request;
  } finally {
    inflight.delete(key);
  }
}

/** Drop client cache after cart-side mutations that shouldn't apply to products, or when forcing refresh. */
export function clearProductsCache() {
  memoryCache.clear();
}
