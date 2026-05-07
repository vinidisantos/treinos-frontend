import dayjs from "dayjs";
import { Flame } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AppLogo } from "./_components/app-logo";
import { BottomNav } from "./_components/bottom-nav";
import { WorkoutDayCard } from "./_components/workout-day-card";
import { getHome } from "./_lib/api/fetch-generated";
import { authClient } from "./_lib/auth-client";
import { needsOnboarding } from "./_lib/check-onboarding";

const WEEK_DAYS_ORDER = [
  { label: "S", offset: 1 }, // Segunda (Monday)
  { label: "T", offset: 2 }, // Terça (Tuesday)
  { label: "Q", offset: 3 }, // Quarta (Wednesday)
  { label: "Q", offset: 4 }, // Quinta (Thursday)
  { label: "S", offset: 5 }, // Sexta (Friday)
  { label: "S", offset: 6 }, // Sábado (Saturday)
  { label: "D", offset: 0 }, // Domingo (Sunday — weekStart itself)
];

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  if (await needsOnboarding()) {
    redirect("/onboarding");
  }

  const today = dayjs();
  const homeDataResponse = await getHome(today.format("YYYY-MM-DD"));

  if (homeDataResponse.status === 401) {
    redirect("/auth");
  }

  const homeData =
    homeDataResponse.status === 200 ? homeDataResponse.data : null;

  const weekStart = today.startOf("week"); // Sunday
  const weekDays = WEEK_DAYS_ORDER.map(({ label, offset }) => {
    const date = weekStart.add(offset, "day").format("YYYY-MM-DD");
    const consistency = homeData?.consistencyByDay[date];
    return { label, date, consistency };
  });

  const userName = session.data.user.name?.split(" ")[0] ?? "Olá";

  return (
    <div className="flex flex-col flex-1 relative pb-[88px]">
      {/* Banner */}
      <div className="relative flex flex-col justify-between h-[296px] rounded-bl-[20px] rounded-br-[20px] overflow-hidden px-[20px] pt-[20px] pb-[40px] shrink-0">
        <div className="absolute inset-0 bg-foreground overflow-hidden">
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
                "linear-gradient(242deg, transparent 34%, black 100%)",
            }}
          />
        </div>

        <AppLogo className="relative text-primary-foreground" />

        <div className="relative flex items-end justify-between">
          <div className="flex flex-col gap-[6px]">
            <p className="font-semibold text-[24px] text-primary-foreground leading-[1.05]">
              Olá, {userName}
            </p>
            <p className="text-[14px] text-primary-foreground/70 leading-[1.15]">
              Bora treinar hoje?
            </p>
          </div>
          <div className="bg-primary flex items-center justify-center px-[16px] py-[8px] rounded-full">
            <span className="font-semibold text-[14px] text-primary-foreground leading-none">
              Bora!
            </span>
          </div>
        </div>
      </div>

      {/* Consistência */}
      <div className="flex flex-col gap-[12px] pt-[20px] px-[20px] shrink-0">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[18px] text-foreground leading-[1.4]">
            Consistência
          </p>
          <button className="text-primary text-[12px] leading-[1.4]">
            Ver histórico
          </button>
        </div>

        <div className="flex gap-[12px] items-center w-full">
          <div className="border border-border flex items-center justify-between p-[20px] rounded-[12px] flex-1">
            {weekDays.map(({ label, date, consistency }) => {
              let squareClass =
                "border border-border relative rounded-[6px] size-[20px]";
              if (consistency?.workoutDayCompleted) {
                squareClass = "bg-primary relative rounded-[6px] size-[20px]";
              } else if (consistency?.workoutDayStarted) {
                squareClass =
                  "bg-primary/20 relative rounded-[6px] size-[20px]";
              }
              return (
                <div
                  key={date}
                  className="flex flex-col gap-[6px] items-center"
                >
                  <div className={squareClass} />
                  <span className="text-muted-foreground text-[12px] leading-[1.4]">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-streak-bg flex gap-[8px] items-center px-[20px] py-[8px] rounded-[12px] self-stretch">
            <Flame className="size-[20px] text-streak fill-streak" />
            <span className="font-semibold text-[16px] text-foreground leading-[1.15]">
              {homeData?.workoutStreak ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Treino de Hoje */}
      <div className="flex flex-col gap-[12px] p-[20px] shrink-0">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[18px] text-foreground leading-[1.4]">
            Treino de Hoje
          </p>
          <button className="text-primary text-[12px] leading-[1.4]">
            Ver treinos
          </button>
        </div>

        {homeData?.todayWorkoutDay ? (
          <Link
            href={`/workout-plans/${homeData.todayWorkoutDay.workoutPlanId}/days/${homeData.todayWorkoutDay.id}`}
            className="w-full"
          >
            <WorkoutDayCard workoutDay={homeData.todayWorkoutDay} />
          </Link>
        ) : (
          <div className="border border-border rounded-[12px] p-[20px] flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground text-[14px]">
              {homeData
                ? "Nenhum treino para hoje"
                : "Nenhum plano de treino ativo"}
            </p>
          </div>
        )}
      </div>

      <BottomNav activeTab="home" />
    </div>
  );
}
