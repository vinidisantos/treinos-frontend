"use client";

import { Sparkles } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";

export function OpenChatButton() {
  const [, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );

  return (
    <Button
      className="bg-primary p-[16px] rounded-full text-primary-foreground size-auto"
      aria-label="IA"
      onClick={() => setChatOpen(true)}
    >
      <Sparkles className="size-[24px]" />
    </Button>
  );
}
