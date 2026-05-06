import { Calendar, Dumbbell, Goal, Timer, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getWorkoutPlan } from "@/app/_lib/api/fetch-generated";
import { authClient } from "@/app/_lib/auth-client";
import { BottomNav } from "@/app/_components/bottom-nav";

const WEEK_DAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return remaining > 0 ? `${hours}h${remaining}min` : `${hours}h`;
  }
  return `${mins}min`;
}

type PageProps = {
  params: Promise<{ planId: string }>;
};

export default async function WorkoutPlanPage({ params }: PageProps) {
  const { planId } = await params;

  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) {
    redirect("/auth");
  }

  const response = await getWorkoutPlan(planId);

  if (response.status === 401) {
    redirect("/auth");
  }

  if (response.status !== 200) {
    redirect("/");
  }

  const workoutPlan = response.data;

  return (
    <div className="flex flex-col flex-1 relative pb-[88px]">
      {/* Banner */}
      <div className="relative flex flex-col justify-between h-[296px] rounded-bl-[20px] rounded-br-[20px] overflow-hidden px-[20px] pt-[20px] pb-[40px] shrink-0">
        <div className="absolute inset-0 bg-foreground overflow-hidden rounded-bl-[20px] rounded-br-[20px]">
          <Image
            src="/images/banner.jpg"
            alt=""
            aria-hidden="true"
            fill
            className="object-cover pointer-events-none"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(238deg, transparent 0%, black 100%)",
            }}
          />
        </div>

        <p className="relative font-anton text-[22px] text-primary-foreground uppercase leading-[1.15]">
          Fit.ai
        </p>

        <div className="relative flex items-end justify-between">
          <div className="flex flex-col gap-[12px] items-start">
            <div className="bg-primary flex gap-[4px] items-center justify-center px-[10px] py-[5px] rounded-[99px]">
              <Goal className="size-[16px] text-primary-foreground" />
              <span className="font-semibold text-[12px] text-primary-foreground uppercase leading-none">
                {workoutPlan.name}
              </span>
            </div>
            <p className="font-semibold text-[24px] text-primary-foreground leading-[1.05]">
              Plano de Treino
            </p>
          </div>
          <div className="size-[48px]" />
        </div>
      </div>

      {/* Lista de dias */}
      <div className="flex flex-col gap-[12px] p-[20px]">
        {workoutPlan.workoutDays.map((day) => {
          const weekDayLabel = WEEK_DAY_LABELS[day.weekDay] ?? day.weekDay;

          if (day.isRest) {
            return (
              <div
                key={day.id}
                className="bg-muted flex flex-col h-[110px] items-start justify-between p-[20px] rounded-[12px] shrink-0"
              >
                {/* Badge dia da semana (descanso) */}
                <div className="backdrop-blur-xs bg-black/8 flex gap-[4px] items-center justify-center px-[10px] py-[5px] rounded-[99px]">
                  <Calendar className="size-[14px] text-foreground" />
                  <span className="font-semibold text-[12px] text-foreground uppercase leading-none">
                    {weekDayLabel}
                  </span>
                </div>

                {/* Rodapé descanso */}
                <div className="flex gap-[8px] items-center">
                  <Zap className="size-[20px] text-primary fill-primary" />
                  <p className="font-semibold text-[24px] text-foreground leading-[1.05]">
                    Descanso
                  </p>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={day.id}
              href={`/workout-plans/${planId}/days/${day.id}`}
              className="relative h-[200px] w-full rounded-[12px] overflow-hidden flex flex-col justify-between p-[20px] shrink-0"
            >
              {day.coverImageUrl ? (
                <img
                  src={day.coverImageUrl}
                  alt={day.name}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div className="absolute inset-0 bg-foreground" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent pointer-events-none" />

              {/* Badge dia da semana */}
              <div className="relative flex items-center">
                <div className="backdrop-blur-xs bg-primary-foreground/16 flex gap-[4px] items-center justify-center px-[10px] py-[5px] rounded-[99px]">
                  <Calendar className="size-[14px] text-primary-foreground" />
                  <span className="font-semibold text-[12px] text-primary-foreground uppercase leading-none">
                    {weekDayLabel}
                  </span>
                </div>
              </div>

              {/* Rodapé do card */}
              <div className="relative flex flex-col gap-[8px] items-start">
                <p className="font-semibold text-[24px] text-primary-foreground leading-[1.05]">
                  {day.name}
                </p>
                <div className="flex gap-[8px] items-center">
                  <div className="flex gap-[4px] items-center">
                    <Timer className="size-[14px] text-primary-foreground/70" />
                    <span className="text-[12px] text-primary-foreground/70 leading-[1.4]">
                      {formatDuration(day.estimatedDurationInSeconds)}
                    </span>
                  </div>
                  <div className="flex gap-[4px] items-center">
                    <Dumbbell className="size-[14px] text-primary-foreground/70" />
                    <span className="text-[12px] text-primary-foreground/70 leading-[1.4]">
                      {day.exercisesCount}{" "}
                      {day.exercisesCount === 1 ? "exercício" : "exercícios"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <BottomNav activeTab="calendar" />
    </div>
  );
}
