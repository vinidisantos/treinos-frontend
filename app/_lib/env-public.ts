/** Base URL da API (NEXT_PUBLIC_* — disponível no servidor e no cliente após o build). */
export function getPublicApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it in Render (Environment) for the frontend service — same value as your public API URL, e.g. https://treinos-api-tzec.onrender.com",
    );
  }
  return raw.replace(/\/$/, "");
}
