import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loja Online",
  description: "E-commerce tradicional com Next.js e Django",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="site-header">
          <div className="container">
            <a href="/" className="logo">
              <img
                src="/images/EaarthLogo.png"
                alt="Logo"
                className="logo-img"
              />
            </a>
            <nav className="nav">
              <a href="/">Produtos</a>
              <a href="/cart">Carrinho</a>
              <a href="/orders">Pedidos</a>
              <a href="/admin/products">Admin</a>
              <a href="/login">Entrar</a>
              <a href="/register">Cadastro</a>
              <a href="/logout">Sair</a>
            </nav>
          </div>
        </header>
        <main className="container main-content">{children}</main>
      </body>
    </html>
  );
}
