"use client";

import { useChat } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Sparkles, X } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().trim().min(1),
});

export function ChatBot() {
  const [chatOpen, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [initialMessage, setInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );

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
  const autoSentRef = useRef("");

  useEffect(() => {
    if (chatOpen && initialMessage && autoSentRef.current !== initialMessage) {
      autoSentRef.current = initialMessage;
      sendMessage({ text: initialMessage });
    }
  }, [chatOpen, initialMessage, sendMessage]);

  useEffect(() => {
    if (!chatOpen) {
      autoSentRef.current = "";
    }
  }, [chatOpen]);

  useEffect(() => {
    if (chatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatOpen]);

  function handleClose() {
    setChatOpen(false);
    setInitialMessage(null);
  }

  function onSubmit(values: z.infer<typeof chatSchema>) {
    if (status === "streaming" || status === "submitted") return;
    sendMessage({ text: values.message });
    form.reset();
  }

  if (!chatOpen) return null;

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={handleClose} />

      {/* Chat panel */}
      <div className="fixed top-[160px] bottom-[16px] left-[16px] right-[16px] z-50 bg-background rounded-[20px] flex flex-col overflow-hidden">
        {/* Header */}
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
                <p className="text-[12px] text-primary leading-[1.15]">
                  Online
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="size-[24px] flex items-center justify-center shrink-0"
            aria-label="Fechar"
          >
            <X className="size-[24px] text-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto min-h-0">
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
                  <div className="bg-primary p-[12px] rounded-[12px] w-full">
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

        {/* Bottom */}
        <div className="shrink-0">
          {/* Sugestões - apenas quando não há mensagens */}
          {messages.length === 0 && (
            <div className="flex gap-[10px] items-start px-[20px] pb-[12px] overflow-x-auto">
              <button
                onClick={() =>
                  sendMessage({ text: "Monte meu plano de treino" })
                }
                className="bg-primary/10 flex items-center justify-center px-[16px] py-[8px] rounded-[100px] shrink-0 text-[14px] text-foreground whitespace-nowrap"
              >
                Monte meu plano de treino
              </button>
            </div>
          )}

          {/* Input */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="border-t border-border flex items-center gap-[8px] p-[20px]"
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
      </div>
    </>
  );
}
