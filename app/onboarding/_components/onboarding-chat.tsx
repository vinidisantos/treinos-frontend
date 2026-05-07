"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const chatSchema = z.object({
  message: z.string().trim().min(1),
});

const WELCOME_MESSAGES = [
  { id: "w1", role: "assistant" as const, text: "Bem-vindo ao FIT.AI! 🎉" },
  {
    id: "w2",
    role: "assistant" as const,
    text: "O app que vai transformar a forma como você treina. Aqui você monta seu plano de treino personalizado, acompanha sua evolução com estatísticas detalhadas e conta com uma IA disponível 24h para te guiar em cada exercício.",
  },
  {
    id: "w3",
    role: "assistant" as const,
    text: "Tudo pensado para você alcançar seus objetivos de forma inteligente e consistente.",
  },
  {
    id: "w4",
    role: "assistant" as const,
    text: "Vamos configurar seu perfil?",
  },
  { id: "w5", role: "user" as const, text: "Começar!" },
];

export function OnboardingChat() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
  });

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" },
  });

  const messageValue = useWatch({ control: form.control, name: "message" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function onSubmit(values: z.infer<typeof chatSchema>) {
    if (isLoading) return;
    sendMessage({ text: values.message });
    form.reset();
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Topbar */}
      <div className="border-b border-border flex items-center justify-between p-[20px] shrink-0">
        <div className="flex gap-[8px] items-center">
          <div className="bg-primary/8 border border-primary/8 flex items-center justify-center p-[12px] rounded-full shrink-0">
            <Sparkles className="size-[18px] text-primary" />
          </div>
          <div className="flex flex-col gap-[6px] items-start justify-center">
            <p className="font-semibold text-[16px] text-foreground leading-[1.05]">
              Coach AI
            </p>
            <div className="flex gap-[4px] items-center">
              <div className="bg-[#2b54ff] rounded-full size-[8px] shrink-0" />
              <p className="text-[12px] text-primary leading-[1.15]">Online</p>
            </div>
          </div>
        </div>
        <Link
          href="/"
          className="bg-primary/10 flex items-center justify-center px-[16px] py-[8px] rounded-[100px] text-[14px] text-foreground font-medium whitespace-nowrap"
        >
          Acessar FIT.AI
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Static welcome messages */}
        {WELCOME_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col pt-[20px] ${
              msg.role === "user"
                ? "pl-[60px] pr-[20px] items-end"
                : "pl-[20px] pr-[60px] items-start"
            }`}
          >
            {msg.role === "user" ? (
              <div className="bg-primary p-[12px] rounded-[12px]">
                <p className="text-[14px] text-primary-foreground leading-[1.4]">
                  {msg.text}
                </p>
              </div>
            ) : (
              <div className="bg-secondary p-[12px] rounded-[12px] w-full">
                <p className="text-[14px] text-foreground leading-[1.4]">
                  {msg.text}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Dynamic chat messages */}
        {messages.map((message) => {
          const text = message.parts
            .filter(
              (p): p is { type: "text"; text: string } => p.type === "text",
            )
            .map((p) => p.text)
            .join("");

          return (
            <div
              key={message.id}
              className={`flex flex-col pt-[20px] ${
                message.role === "user"
                  ? "pl-[60px] pr-[20px] items-end"
                  : "pl-[20px] pr-[60px] items-start"
              }`}
            >
              {message.role === "user" ? (
                <div className="bg-primary p-[12px] rounded-[12px]">
                  <p className="text-[14px] text-primary-foreground leading-[1.4]">
                    {text}
                  </p>
                </div>
              ) : (
                <div className="bg-secondary p-[12px] rounded-[12px] w-full">
                  <Streamdown className="text-[14px] text-foreground leading-[1.4]">
                    {text}
                  </Streamdown>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-[20px]" />
      </div>

      {/* Input */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-t border-border flex items-center gap-[8px] p-[20px] shrink-0"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="bg-muted flex items-center overflow-hidden px-[16px] py-[12px] rounded-[99px]">
                    <input
                      {...field}
                      type="text"
                      placeholder="Digite sua mensagem"
                      disabled={isLoading}
                      className="bg-transparent flex-1 text-[14px] text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <button
            type="submit"
            disabled={!messageValue?.trim() || isLoading}
            className="bg-primary flex items-center justify-center p-[10px] rounded-[99px] size-[42px] shrink-0 disabled:opacity-50"
          >
            <ArrowUp className="size-[20px] text-primary-foreground" />
          </button>
        </form>
      </Form>
    </div>
  );
}
