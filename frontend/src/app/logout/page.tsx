"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/api";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        window.dispatchEvent(new Event("auth-changed"));
      } catch {
        // ignore
      } finally {
        router.push("/auth");
      }
    };
    handleLogout();
  }, [router]);

  return <p>Saindo...</p>;
}
