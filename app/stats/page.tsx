import { CircleCheck, CirclePercent, Flame, Hourglass } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";

import { getStats } from "@/app/_lib/api/fetch-generated";
import { authClient } from "@/app/_lib/auth-client";
import { AppLogo } from "@/app/_components/app-logo";
import { BottomNav } from "@/app/_components/bottom-nav";

const MONTH_LABELS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function formatTotalTime(seconds: number): string {
  const totalMins = Math.floor(seconds / 60);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}m`;
}

type WeekDates = string[]; // 7 datas segunda→domingo

type MonthBlock = {
  label: string;
  weeks: WeekDates[];
};

function buildHeatmapMonths(today: dayjs.Dayjs): MonthBlock[] {
  const blocks: MonthBlock[] = [];

  for (let i = 2; i >= 0; i--) {
    const monthStart = today.subtract(i, "month").startOf("month");
    const monthIdx = monthStart.month();
    const monthYear = monthStart.year();

    // Encontra a primeira segunda-feira cujo dia está dentro deste mês
    let current = monthStart;
    const day = current.day(); // 0=dom, 1=seg, ..., 6=sáb
    if (day !== 1) {
      // Avança para a próxima segunda se não for segunda
      // ou recua se o dia for domingo
      const daysToMonday = day === 0 ? 1 : 8 - day;
      const candidate = current.add(daysToMonday, "day");
      // Se a segunda mais próxima ainda está no mês, use-a
      // Senão, a primeira segunda do mês é esta semana mesmo (sem dias do mês na semana anterior)
      if (candidate.month() === monthIdx && candidate.year() === monthYear) {
        current = candidate;
      } else {
        // não há segunda no mês com a lógica acima: começa no 1º dia do mês
        current = monthStart;
        // recalcula para segunda da semana que contém o 1º dia
        const offset = day === 0 ? -6 : 1 - day;
        current = monthStart.add(offset, "day");
      }
    }

    const weeks: WeekDates[] = [];
    let cursor = current;

    // Garante que a segunda-feira (cursor) começa dentro ou antes do mês
    // e gera semanas enquanto a segunda-feira estiver dentro do mês
    while (
      cursor.month() === monthIdx &&
      cursor.year() === monthYear
    ) {
      const week: string[] = [];
      for (let d = 0; d < 7; d++) {
        week.push(cursor.add(d, "day").format("YYYY-MM-DD"));
      }
      weeks.push(week);
      cursor = cursor.add(7, "day");
    }

    blocks.push({ label: MONTH_LABELS[monthIdx], weeks });
  }

  return blocks;
}

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) {
    redirect("/auth");
  }

  const today = dayjs();
  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.format("YYYY-MM-DD");

  const response = await getStats({ from, to });

  if (response.status === 401) {
    redirect("/auth");
  }

  if (response.status !== 200) {
    redirect("/");
  }

  const stats = response.data;
  const {
    workoutStreak,
    consistencyByDay,
    completedWorkoutsCount,
    conclusionRate,
    totalTimeInSeconds,
  } = stats;

  const heatmapMonths = buildHeatmapMonths(today);
  const conclusionRatePercent = Math.round(conclusionRate * 100);

  return (
    <div className="flex flex-col flex-1 relative pb-[88px]">
      {/* Header */}
      <div className="flex h-[56px] items-center px-[20px]">
        <AppLogo className="text-foreground" />
      </div>

      {/* Banner sequência */}
      <div className="px-[20px]">
        <div
          className="relative flex flex-col gap-[24px] items-center justify-center overflow-hidden px-[20px] py-[40px] rounded-[12px]"
          style={{
            background:
              workoutStreak > 0
                ? "linear-gradient(135deg, #c0392b 0%, #e74c3c 40%, #f39c12 100%)"
                : "linear-gradient(135deg, #2d2d2d 0%, #555555 50%, #3a3a3a 100%)",
          }}
        >
          <div className="flex flex-col gap-[12px] items-center relative">
            <div className="backdrop-blur-xs bg-white/12 border border-white/12 flex items-center justify-center p-[12px] rounded-[99px]">
              <Flame className="size-[32px] text-white fill-white" />
            </div>
            <div className="flex flex-col gap-[4px] items-center">
              <p className="font-semibold text-[48px] text-white text-center leading-[0.95]">
                {workoutStreak} {workoutStreak === 1 ? "dia" : "dias"}
              </p>
              <p className="text-[16px] text-white/60 leading-[1.15]">
                Sequência Atual
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consistência */}
      <div className="flex flex-col gap-[12px] p-[20px]">
        <p className="font-semibold text-[18px] text-foreground leading-[1.4]">
          Consistência
        </p>

        {/* Heatmap */}
        <div className="border border-border flex gap-[4px] items-start overflow-x-auto p-[20px] rounded-[12px]">
          {heatmapMonths.map((block) => (
            <div key={block.label} className="flex flex-col gap-[6px] items-start shrink-0">
              <p className="text-[12px] text-muted-foreground leading-[1.4]">
                {block.label}
              </p>
              <div className="flex gap-[4px] items-start">
                {block.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[4px] items-start">
                    {week.map((date) => {
                      const data = consistencyByDay[date];
                      let cellClass = "border border-border relative rounded-[6px] shrink-0 size-[20px]";
                      if (data?.workoutDayCompleted) {
                        cellClass = "bg-primary relative rounded-[6px] shrink-0 size-[20px]";
                      } else if (data?.workoutDayStarted) {
                        cellClass = "bg-primary/20 relative rounded-[6px] shrink-0 size-[20px]";
                      }
                      return <div key={date} className={cellClass} />;
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cards de estatísticas */}
        <div className="flex gap-[12px] items-stretch">
          {/* Treinos feitos */}
          <div className="bg-primary/8 flex flex-1 flex-col gap-[20px] items-center p-[20px] rounded-[12px] min-w-0">
            <div className="bg-primary/8 flex items-center justify-center p-[9px] rounded-[99px] size-[34px]">
              <CircleCheck className="size-[16px] text-primary" />
            </div>
            <div className="flex flex-col gap-[6px] items-center">
              <p className="font-semibold text-[24px] text-foreground leading-[1.15]">
                {completedWorkoutsCount}
              </p>
              <p className="text-[12px] text-muted-foreground leading-[1.4] text-center">
                Treinos Feitos
              </p>
            </div>
          </div>

          {/* Taxa de conclusão */}
          <div className="bg-primary/8 flex flex-1 flex-col gap-[20px] items-center p-[20px] rounded-[12px] min-w-0">
            <div className="bg-primary/8 flex items-center justify-center p-[9px] rounded-[99px] size-[34px]">
              <CirclePercent className="size-[16px] text-primary" />
            </div>
            <div className="flex flex-col gap-[6px] items-center">
              <p className="font-semibold text-[24px] text-foreground leading-[1.15]">
                {conclusionRatePercent}%
              </p>
              <p className="text-[12px] text-muted-foreground leading-[1.4] text-center">
                Taxa de conclusão
              </p>
            </div>
          </div>
        </div>

        {/* Tempo total */}
        <div className="bg-primary/8 flex flex-col gap-[20px] items-center p-[20px] rounded-[12px]">
          <div className="bg-primary/8 flex items-center justify-center p-[9px] rounded-[99px] size-[34px]">
            <Hourglass className="size-[16px] text-primary" />
          </div>
          <div className="flex flex-col gap-[6px] items-center">
            <p className="font-semibold text-[24px] text-foreground leading-[1.15]">
              {formatTotalTime(totalTimeInSeconds)}
            </p>
            <p className="text-[12px] text-muted-foreground leading-[1.4]">
              Tempo Total
            </p>
          </div>
        </div>
      </div>

      <BottomNav activeTab="stats" />
    </div>
  );
}
