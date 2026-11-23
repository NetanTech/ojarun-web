import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { formatCurrency } from "../../../../../lib/utils";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";
import { getAllProducts, getProduct } from "@/lib/productsServer";
import { idFromSlug, productPath, productSlug } from "@/lib/productSlug";
import ProductCard, {
  CartControls,
  FavoriteButton,
} from "../../Acomponents/product-card";

/**
 * Shareable product page (/product/palm-oil-<id>). Rendered on the server so
 * WhatsApp link previews and search engines see the name, price and photo.
 */

type Props = { params: Promise<{ slug: string }> };

const SITE = "https://www.ojarun.com";

function unitLabel(unit: string): string {
  return `Per ${unit.replace(/^per\s+/i, "")}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = idFromSlug(slug);
  const product = id ? await getProduct(id) : null;
  if (!product) return { title: "Product not found" };

  const price = `${formatCurrency(product.price)} ${unitLabel(product.more).toLowerCase()}`;
  const description =
    product.description?.trim() ||
    `${product.name}, fresh from the market in Ibadan, delivered to your doorstep.`;
  const image = product.imageURL?.startsWith("http") ? product.imageURL : undefined;

  return {
    title: product.name,
    description: `${price}. ${description}`,
    alternates: { canonical: `${SITE}${productPath(product)}` },
    openGraph: {
      title: `${product.name} — ${price} | Ojarun`,
      description,
      url: `${SITE}${productPath(product)}`,
      type: "website",
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const id = idFromSlug(slug);
  if (!id) notFound();

  const product = await getProduct(id);
  if (!product) notFound();

  // Old or hand-typed links with a different name part go to the real URL.
  if (slug !== productSlug(product)) permanentRedirect(productPath(product));

  const related = (await getAllProducts())
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const shareText = `${product.name} on Ojarun — ${formatCurrency(product.price)} ${unitLabel(product.more).toLowerCase()}: ${SITE}${productPath(product)}`;

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <div className="lg:max-w-300 lg:w-full mx-3 lg:mx-auto flex flex-col gap-5 py-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-grey-300">
          <Link href="/marketplace" className="hover:text-primary">Market</Link>
          <span aria-hidden>›</span>
          {product.category && product.category !== "Uncategorized" && (
            <>
              <Link
                href={`/marketplace?category=${encodeURIComponent(product.category)}`}
                className="hover:text-primary"
              >
                {product.category}
              </Link>
              <span aria-hidden>›</span>
            </>
          )}
          <span className="text-primary truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-6">
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3] w-full md:w-1/2 bg-[#F3F4F6]">
            <Image
              src={product.imageURL || "/assets/Untitled design.png"}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
            />
            <FavoriteButton product={product} />
          </div>

          <div className="flex flex-col gap-4 md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-semibold">{product.name}</h1>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <p className="text-xl font-semibold">{formatCurrency(product.price)}</p>
                <p className="text-grey-300 text-sm capitalize">{unitLabel(product.more)}</p>
              </div>
              <CartControls product={product} />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold">About this item</h2>
              <p className="text-sm text-grey-400 leading-relaxed">
                {product.description?.trim() ||
                  "Our market agent will pick the freshest available and contact you if anything differs."}
              </p>
            </div>

            <p className="text-sm text-grey-400">
              Picked fresh by a trained Ojarun agent and delivered within Ibadan.
            </p>

            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
              >
                Share on WhatsApp
              </a>
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                Go to checkout
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">More in {product.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {related.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
