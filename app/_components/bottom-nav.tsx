import { Calendar, ChartNoAxesColumn, House, Sparkles, UserRound } from "lucide-react";

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border border-border flex gap-[24px] items-center justify-center px-[24px] py-[16px] rounded-tl-[20px] rounded-tr-[20px]">
      <button className="flex items-center p-[12px] text-primary" aria-label="Home">
        <House className="size-[24px]" />
      </button>
      <button className="flex items-center p-[12px] text-muted-foreground" aria-label="Calendário">
        <Calendar className="size-[24px]" />
      </button>
      <button
        className="bg-primary flex items-center justify-center p-[16px] rounded-full text-primary-foreground"
        aria-label="IA"
      >
        <Sparkles className="size-[24px]" />
      </button>
      <button className="flex items-center p-[12px] text-muted-foreground" aria-label="Estatísticas">
        <ChartNoAxesColumn className="size-[24px]" />
      </button>
      <button className="flex items-center p-[12px] text-muted-foreground" aria-label="Perfil">
        <UserRound className="size-[24px]" />
      </button>
    </div>
  );
}
