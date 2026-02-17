import ProductGrid from "@/components/product-grid";
import { Product, Tag } from "@/lib/types";

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

async function getTags(): Promise<Tag[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const response = await fetch(`${apiUrl}/api/tags/`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export default async function Home() {
  const [products, tags] = await Promise.all([getProducts(), getTags()]);
  return (
    <section className="stack">
      <h1>Produtos</h1>
      {products.length === 0 ? (
        <div className="empty-state-wrapper">
          <div className="empty-state">Nenhum produto disponível.</div>
        </div>
      ) : (
        <ProductGrid products={products} tags={tags} />
      )}
    </section>
  );
}
