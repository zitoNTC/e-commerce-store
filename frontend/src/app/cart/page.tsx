"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { checkout, me } from "@/lib/api";
import { useCartStore } from "@/lib/cart-store";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clear } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0
    );
  }, [items]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      await me();
      await checkout(
        items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        }))
      );
      clear();
      router.push("/orders");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao finalizar.";
      if (message.includes("401")) {
        router.push("/auth");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="stack">
      <h1>Carrinho</h1>
      {items.length === 0 ? (
        <div className="empty-state-wrapper">
          <div className="empty-state">Seu carrinho está vazio.</div>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="stack cart-items-column">
            {items.map((item) => (
              <div key={item.product.id} className="card stack">
                <strong>{item.product.name}</strong>
                <span>R$ {item.product.price}</span>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.product.id, Number(event.target.value))
                  }
                />
                <button
                  className="button danger"
                  onClick={() => removeItem(item.product.id)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <aside className="card stack cart-summary-panel">
            <strong>Resumo da compra</strong>
            <span>{items.length} {items.length === 1 ? "produto" : "produtos"}</span>
            <strong>Total: R$ {total.toFixed(2)}</strong>
            {error ? <p>{error}</p> : null}
            <button
              className="button"
              onClick={handleCheckout}
              disabled={loading}
            >
              Finalizar compra
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
