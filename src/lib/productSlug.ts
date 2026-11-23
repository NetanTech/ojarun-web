/**
 * Shareable product URLs: /product/palm-oil-<uuid>. The readable name part is
 * only for people and search engines; the page looks the product up by the
 * id at the end, so renaming a product never breaks an old link.
 */

const UUID_AT_END =
  /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function productSlug(product: { id: string; name: string }): string {
  const name = slugify(product.name);
  return name ? `${name}-${product.id}` : product.id;
}

export function productPath(product: { id: string; name: string }): string {
  return `/product/${productSlug(product)}`;
}

/** The product id at the end of a slug, or null if there isn't one. */
export function idFromSlug(slug: string): string | null {
  return slug.match(UUID_AT_END)?.[1] ?? null;
}
