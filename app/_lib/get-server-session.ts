import { cookies } from "next/headers";

import { authClient } from "./auth-client";

/**
 * Lê a sessão no Server Component e repassa cookies para a API (Better Auth).
 * Usa `cookies()` do Next para montar o header `Cookie` (equivalente ao do navegador).
 */
export async function getServerSession() {
  const store = await cookies();
  const cookieHeader = store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return authClient.getSession({
    fetchOptions: {
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    },
  });
}
