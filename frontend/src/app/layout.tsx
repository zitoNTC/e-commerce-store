import type { Metadata } from "next";
import { Bebas_Neue, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/nav-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
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
            <a href="/" className={`logo ${bebasNeue.className}`}>
              EAARTH
            </a>
            <NavBar />
          </div>
        </header>
        <main className="container main-content">{children}</main>
      </body>
    </html>
  );
}
