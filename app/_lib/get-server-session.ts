import { headers } from "next/headers";

import { authClient } from "./auth-client";

/**
 * Lê a sessão no Server Component. Repassa o header `Cookie` explicitamente —
 * repassar o objeto `headers()` inteiro para o fetch nem sempre propaga cookies
 * corretamente para a API (Better Auth em outro host), o que pode causar loop
 * `/` ↔ `/auth` após o login com OAuth.
 */
export async function getServerSession() {
  const h = await headers();
  const cookie = h.get("cookie");
  return authClient.getSession({
    fetchOptions: {
      headers: cookie ? { cookie } : {},
    },
  });
}
