import {
  Calendar,
  ChartNoAxesColumn,
  House,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

import { getHome } from "../_lib/api/fetch-generated";
import { Button } from "@/components/ui/button";

type BottomNavProps = {
  activeTab?: "home" | "calendar" | "stats";
};

export async function BottomNav({ activeTab }: BottomNavProps) {
  const today = dayjs();
  const homeDataResponse = await getHome(today.format("YYYY-MM-DD"));
  const homeData =
    homeDataResponse.status === 200 ? homeDataResponse.data : null;

  const calendarHref =
    homeData?.todayWorkoutDay
      ? `/workout-plans/${homeData.todayWorkoutDay.workoutPlanId}`
      : "/";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border border-border flex gap-[24px] items-center justify-center px-[24px] py-[16px] rounded-tl-[20px] rounded-tr-[20px]">
      <Button
        variant="ghost"
        size="icon"
        className={`size-[48px] ${activeTab === "home" ? "text-primary" : "text-muted-foreground"}`}
        aria-label="Home"
        asChild
      >
        <Link href="/">
          <House className="size-[24px]" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`size-[48px] ${activeTab === "calendar" ? "text-primary" : "text-muted-foreground"}`}
        aria-label="Calendário"
        asChild
      >
        <Link href={calendarHref}>
          <Calendar className="size-[24px]" />
        </Link>
      </Button>
      <Button
        className="bg-primary p-[16px] rounded-full text-primary-foreground size-auto"
        aria-label="IA"
      >
        <Sparkles className="size-[24px]" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`size-[48px] ${activeTab === "stats" ? "text-primary" : "text-muted-foreground"}`}
        aria-label="Estatísticas"
        asChild
      >
        <Link href="/stats">
          <ChartNoAxesColumn className="size-[24px]" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground size-[48px]"
        aria-label="Perfil"
      >
        <UserRound className="size-[24px]" />
      </Button>
    </div>
  );
}
