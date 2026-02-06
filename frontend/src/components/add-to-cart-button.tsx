"use client";

import { useState } from "react";

import { useCartStore } from "@/lib/cart-store";
import { Product } from "@/lib/types";

type Props = {
  product: Product;
};

export default function AddToCartButton({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="stack">
      <input
        className="input"
        type="number"
        min={1}
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
      />
      <button
        className="button"
        onClick={() => addItem(product, quantity)}
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}
