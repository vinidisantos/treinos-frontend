"use client";

import { CircleHelp } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";

type ExerciseHelpButtonProps = {
  exerciseName: string;
};

export function ExerciseHelpButton({ exerciseName }: ExerciseHelpButtonProps) {
  const [, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [, setInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );

  function handleClick() {
    setInitialMessage(`Como executar o exercício ${exerciseName} corretamente?`);
    setChatOpen(true);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Informações do exercício"
      className="size-[20px] text-muted-foreground shrink-0"
      onClick={handleClick}
    >
      <CircleHelp className="size-[20px]" />
    </Button>
  );
}
