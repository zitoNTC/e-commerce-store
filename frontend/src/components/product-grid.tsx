"use client";

import { useState } from "react";

import { useCartStore } from "@/lib/cart-store";
import { Product } from "@/lib/types";

type Props = {
  products: Product[];
};

export default function ProductGrid({ products }: Props) {
  const [selected, setSelected] = useState<Product | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <>
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
