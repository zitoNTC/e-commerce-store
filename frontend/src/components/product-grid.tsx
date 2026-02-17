"use client";

import { useState } from "react";

import { useCartStore } from "@/lib/cart-store";
import { Product, Tag } from "@/lib/types";

type Props = {
  products: Product[];
  tags: Tag[];
};

export default function ProductGrid({ products, tags }: Props) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const addItem = useCartStore((state) => state.addItem);
  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));

  const filteredProducts = products.filter((product) => {
    const nameMatches = product.name.toLowerCase().includes(search.toLowerCase());
    if (!nameMatches) return false;
    if (selectedTagIds.length === 0) return true;
    return product.tags.some((tag) => selectedTagIds.includes(tag.id));
  });

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <>
      <div className="catalog-layout">
        <aside className="filters-panel">
          <h3>Busca e filtro</h3>
          <input
            className="input"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="filter-tag-list">
            {sortedTags.map((tag) => (
              <label key={tag.id} className="filter-tag-item">
                <input
                  type="checkbox"
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </aside>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card product-card">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-image"
                />
              ) : (
                <div className="product-image placeholder" />
              )}
              <div className="stack">
                <strong>{product.name}</strong>
                <span>R$ {product.price}</span>
                <div className="button-row">
                  <button
                    className="button secondary"
                    onClick={() => setSelected(product)}
                  >
                    Detalhes
                  </button>
                  <button
                    className="button"
                    onClick={() => addItem(product, 1)}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 ? (
            <div className="empty-state">Nenhum produto encontrado.</div>
          ) : null}
        </div>
      </div>

      {selected ? (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            {selected.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.image_url}
                alt={selected.name}
                className="modal-image"
              />
            ) : null}
            <div className="stack modal-content">
              <h2>{selected.name}</h2>
              <p>{selected.description}</p>
              <strong>R$ {selected.price}</strong>
            </div>
            <div className="modal-actions">
              <button
                className="button"
                onClick={() => addItem(selected, 1)}
              >
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
