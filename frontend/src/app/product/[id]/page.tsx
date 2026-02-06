import { notFound } from "next/navigation";

import AddToCartButton from "@/components/add-to-cart-button";
import { Product } from "@/lib/types";

type PageProps = {
  params: { id: string };
};

async function getProduct(id: string): Promise<Product | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const response = await fetch(`${apiUrl}/api/products/${id}/`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export default async function ProductDetail({ params }: PageProps) {
  const product = await getProduct(params.id);
  if (!product) {
    notFound();
  }

  return (
    <section className="stack">
      <h1>{product.name}</h1>
      {product.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: "100%", maxWidth: 520, borderRadius: 8 }}
        />
      ) : null}
      <p>{product.description}</p>
      <strong>R$ {product.price}</strong>
      <AddToCartButton product={product} />
    </section>
  );
}
