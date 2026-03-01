"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      ログアウト
    </Button>
  );
}
