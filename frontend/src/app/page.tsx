import Link from "next/link";

import { Product } from "@/lib/types";

async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const response = await fetch(`${apiUrl}/api/products/`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export default async function Home() {
  const products = await getProducts();
  return (
    <section className="stack">
      <h1>Produtos</h1>
      {products.length === 0 ? (
        <div className="empty-state-wrapper">
          <div className="empty-state">Nenhum produto disponível.</div>
        </div>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <div key={product.id} className="card product-card">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-image"
                />
              ) : (
                <div
                  className="product-image placeholder"
                />
              )}
              <div className="stack">
                <strong>{product.name}</strong>
                <span>R$ {product.price}</span>
                <Link className="button" href={`/product/${product.id}`}>
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
