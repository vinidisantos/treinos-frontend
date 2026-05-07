"use client";

import { authClient } from "@/app/_lib/auth-client";
import { useState } from "react";

const imgLogin =
  "https://www.figma.com/api/mcp/asset/bf448a4f-de9b-4b0c-9549-236f88ae5f46";
const imgGroup =
  "https://www.figma.com/api/mcp/asset/5784196d-9f0e-4864-9cf1-96749e28ce72";
const imgFitAi =
  "https://www.figma.com/api/mcp/asset/ca3c8852-e698-401c-b66e-bf37657413b5";

export default function AuthPage() {
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const homeUrl = `${(process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "")}/`;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      /** Evita redirect pelo cliente dentro de frame / estado estranho (chrome-error://…) */
      disableRedirect: true,
    });

    if (result.error) {
      setError(
        result.error.message ?? "Erro ao fazer login. Tente novamente.",
      );
      setIsLoading(false);
      return;
    }

    const url = result.data?.url;
    if (typeof url === "string" && url.length > 0) {
      const target = window.top ?? window;
      target.location.assign(url);
      return;
    }

    setError("Resposta inesperada do servidor. Tente novamente.");
    setIsLoading(false);
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute h-full max-w-none"
          style={{ left: "-115.84%", top: "-9.82%", width: "354.25%" }}
          src={imgLogin}
        />
      </div>

      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <img alt="FIT.AI" className="block h-[38px] w-auto" src={imgFitAi} />
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] bg-[#2b54ff] rounded-tl-[20px] rounded-tr-[20px] flex flex-col gap-[60px] items-center pb-10 pt-12 px-5">
        <div className="flex flex-col gap-6 items-center w-full">
          <p
            className="text-[32px] font-semibold leading-[1.05] text-white text-center"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            O app que vai transformar a forma como você treina.
          </p>

          {session?.user && !isPending ? (
            <p className="text-[14px] text-white/90 text-center leading-[1.4]">
              Você já está logado.{" "}
              {/* Navegação completa (não client-side) para o cookie de sessão ir na requisição à `/` */}
              <a href={homeUrl} className="font-semibold underline">
                Ir para o app
              </a>
            </p>
          ) : null}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="bg-white flex gap-2 h-[38px] items-center justify-center px-6 rounded-full cursor-pointer hover:bg-gray-50 transition-colors shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="relative size-4 overflow-hidden shrink-0">
              <img
                alt=""
                className="absolute inset-0 size-full object-contain"
                src={imgGroup}
              />
            </div>
            <span className="font-semibold text-[14px] text-black whitespace-nowrap">
              {isLoading ? "Entrando..." : "Fazer login com Google"}
            </span>
          </button>

          {error && (
            <p className="text-[12px] text-red-300 text-center">{error}</p>
          )}
        </div>

        <p className="text-[12px] text-white/70 whitespace-nowrap leading-[1.4]">
          ©2026 Copyright FIT.AI. Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
