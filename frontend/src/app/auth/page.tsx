"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login, register } from "@/lib/api";

type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
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
      if (mode === "login") {
        await login(username, password);
        window.dispatchEvent(new Event("auth-changed"));
        router.push("/");
      } else {
        await register(username, email, password);
        setMode("login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao continuar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card stack">
        <div className="auth-switch">
          <button
            className={`auth-switch-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`auth-switch-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
            type="button"
          >
            Cadastro
          </button>
        </div>
        <h1>{mode === "login" ? "Entrar" : "Cadastro"}</h1>
        <form className="stack" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Usuário"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          {mode === "register" ? (
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          ) : null}
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
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
      </div>
    </section>
  );
}
