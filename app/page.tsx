"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "./_lib/auth-client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth");
    }
  }, [session, isPending, router]);

  if (isPending || !session) return null;

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="flex flex-1 w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold">Bem-vindo ao FIT.AI</h1>
      </main>
    </div>
  );
}
