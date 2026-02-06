"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(username, email, password);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="stack" style={{ maxWidth: 420 }}>
      <h1>Cadastro</h1>
      <form className="stack" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Usuário"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error ? <p>{error}</p> : null}
        <button className="button" type="submit" disabled={loading}>
          Criar conta
        </button>
      </form>
    </section>
  );
}
