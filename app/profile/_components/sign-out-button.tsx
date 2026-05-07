"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/app/_lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex gap-[8px] items-center justify-center px-[16px] py-[8px] rounded-[100px]"
    >
      <span className="font-semibold text-[16px] text-destructive leading-none">
        Sair da conta
      </span>
      <LogOut className="size-[16px] text-destructive" />
    </button>
  );
}
