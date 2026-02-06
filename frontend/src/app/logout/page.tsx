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
      } catch {
        // ignore
      } finally {
        router.push("/login");
      }
    };
    handleLogout();
  }, [router]);

  return <p>Saindo...</p>;
}
