"use client";

import { useEffect, useState } from "react";

import { me } from "@/lib/api";
import { User } from "@/lib/types";

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const current = await me();
        setUser(current);
      } catch {
        setUser(null);
      }
    };
    const handleAuthChange = () => {
      load();
    };

    load();
    window.addEventListener("auth-changed", handleAuthChange);
    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, []);

  return (
    <nav className="nav">
      <a href="/">Produtos</a>
      <a href="/cart">Carrinho</a>
      <a href="/orders">Pedidos</a>
      {user?.is_staff ? <a href="/admin/products">Admin</a> : null}
      {user ? <a href="/logout">Sair</a> : <a href="/auth">Entrar</a>}
    </nav>
  );
}
