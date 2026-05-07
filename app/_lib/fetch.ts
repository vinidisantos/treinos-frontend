import { cookies } from "next/headers";

import { getPublicApiUrl } from "./env-public";

function resolveRequestUrl(path: string): string {
  const origin = getPublicApiUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}

function parseResponseBody(status: number, text: string): unknown {
  if (!text.trim()) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {
      error: "Non-JSON response from API",
      code: "INVALID_RESPONSE_BODY",
      status,
      preview: text.slice(0, 200),
    };
  }
}

const getHeaders = async (headers?: HeadersInit): Promise<HeadersInit> => {
  const store = await cookies();
  const cookieHeader = store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return {
    ...headers,
    ...(cookieHeader ? { cookie: cookieHeader } : {}),
  };
};

export const customFetch = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const requestUrl = resolveRequestUrl(url);
  const requestHeaders = await getHeaders(options.headers);

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: "include",
  };

  let response: Response;
  try {
    response = await fetch(requestUrl, requestInit);
  } catch {
    return {
      status: 503,
      data: {
        error: "Could not reach API",
        code: "NETWORK_ERROR",
      },
      headers: new Headers(),
    } as T;
  }

  const text = await response.text();
  const data = parseResponseBody(response.status, text);

  return {
    status: response.status,
    data,
    headers: response.headers,
  } as T;
};
