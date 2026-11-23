"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartActions } from "@/lib/cart";
import { fetchProducts } from "@/lib/products";
import { useToast } from "@/components/ui/Toast";

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * "Reorder": puts a past order's items back in the cart at TODAY's prices and
 * opens checkout. Items are matched to the current catalog by product id
 * (newer orders) or by name (older orders); anything no longer sold is skipped
 * and named in the toast.
 */
export function useReorder() {
  const { addItem } = useCartActions();
  const { showToast } = useToast();
  const router = useRouter();
  const [reordering, setReordering] = useState(false);

  const reorder = useCallback(
    async (items: OrderItem[]) => {
      if (reordering) return;
      setReordering(true);
      try {
        const catalog = await fetchProducts();
        const byId = new Map(catalog.map((p) => [p.id, p]));
        const byName = new Map(catalog.map((p) => [normalize(p.name), p]));

        const added: string[] = [];
        const missing: string[] = [];
        for (const item of items) {
          const product =
            (item.productId && byId.get(item.productId)) ||
            byName.get(normalize(item.name));
          if (!product) {
            missing.push(item.name);
            continue;
          }
          addItem(
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.imageURL,
              unit: product.more,
            },
            Math.max(1, Math.round(item.quantity)),
          );
          added.push(product.name);
        }

        if (added.length === 0) {
          showToast("None of these items are available right now.");
          return;
        }
        showToast(
          missing.length
            ? `Added ${added.length} item${added.length === 1 ? "" : "s"} to your cart. No longer available: ${missing.join(", ")}.`
            : `Added ${added.length} item${added.length === 1 ? "" : "s"} to your cart at today's prices.`,
        );
        router.push("/checkout");
      } catch {
        showToast("Couldn't load the market right now. Please try again.");
      } finally {
        setReordering(false);
      }
    },
    [addItem, router, showToast, reordering],
  );

  return { reorder, reordering };
}
