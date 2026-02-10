"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { listOrders, me } from "@/lib/api";
import { Order } from "@/lib/types";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        await me();
        const data = await listOrders();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar.");
        router.push("/auth");
      }
    };
    load();
  }, [router]);

  return (
    <section className="stack">
      <h1>Meus pedidos</h1>
      {error ? <p>{error}</p> : null}
      {orders.length === 0 ? (
        <p>Você ainda não possui pedidos.</p>
      ) : (
        <div className="stack">
          {orders.map((order) => (
            <div key={order.id} className="card stack">
              <strong>Pedido #{order.id}</strong>
              <span>Status: {order.status}</span>
              <div className="stack">
                {order.items.map((item) => (
                  <span key={item.id}>
                    {item.product} x {item.quantity} (R$ {item.unit_price})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
