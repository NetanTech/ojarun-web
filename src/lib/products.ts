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

export async function fetchProducts(params?: {
  search?: string;
  category?: string;
}): Promise<ProductCardProps[]> {
  const query = new URLSearchParams();
  if (params?.search?.trim()) query.set("search", params.search.trim());
  if (params?.category && params.category !== "all") query.set("category", params.category);
  const qs = query.toString();

  const res = await fetch(`${API_URL}/storefront-products${qs ? `?${qs}` : ""}`);
  if (!res.ok) {
    throw new Error("Could not load products. Please try again.");
  }
  const data = (await res.json()) as BackendProduct[];
  return data.map(toProductCard);
}
