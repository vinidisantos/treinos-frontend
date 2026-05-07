import { Calendar, Dumbbell, Timer, Zap } from "lucide-react";
import { redirect } from "next/navigation";

import { getWorkoutDay } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { Button } from "@/components/ui/button";
import { BackButton } from "./_components/back-button";
import { CompleteWorkoutButton } from "./_components/complete-workout-button";
import { ExerciseHelpButton } from "./_components/exercise-help-button";
import { StartWorkoutButton } from "./_components/start-workout-button";

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
  params: Promise<{ planId: string; dayId: string }>;
};

export default async function WorkoutDayPage({ params }: PageProps) {
  const { planId: workoutPlanId, dayId: workoutDayId } = await params;

  const response = await getWorkoutDay(workoutPlanId, workoutDayId);

  if (response.status === 401) {
    redirect("/auth");
  }

  if (response.status !== 200) {
    redirect("/");
  }

  const workoutDay = response.data;
  const weekDayLabel =
    WEEK_DAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay;
  const duration = formatDuration(workoutDay.estimatedDurationInSeconds);

  const inProgressSession = workoutDay.sessions.find(
    (s) => s.startedAt && !s.completedAt,
  );
  const completedSession = workoutDay.sessions.find((s) => s.completedAt);

  return (
    <div className="flex flex-col flex-1 relative pb-[88px]">
      {/* Topbar */}
      <div className="flex items-center justify-between p-[20px] shrink-0">
        <BackButton />
        <p className="font-semibold text-[18px] text-foreground leading-[1.4]">
          {workoutDay.name}
        </p>
        <div className="size-[24px]" />
      </div>

      <div className="flex flex-col gap-[20px] px-[20px] pb-[20px]">
        {/* Card de capa */}
        <div className="relative h-[200px] w-full rounded-[12px] overflow-hidden flex flex-col justify-between p-[20px] shrink-0">
          {workoutDay.coverImageUrl ? (
            <img
              src={workoutDay.coverImageUrl}
              alt={workoutDay.name}
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
          <div className="relative flex items-end justify-between">
            <div className="flex flex-col gap-[8px] items-start">
              <p className="font-semibold text-[24px] text-primary-foreground leading-[1.05]">
                {workoutDay.name}
              </p>
              <div className="flex gap-[8px] items-center">
                <div className="flex gap-[4px] items-center">
                  <Timer className="size-[14px] text-primary-foreground/70" />
                  <span className="text-[12px] text-primary-foreground/70 leading-[1.4]">
                    {duration}
                  </span>
                </div>
                <div className="flex gap-[4px] items-center">
                  <Dumbbell className="size-[14px] text-primary-foreground/70" />
                  <span className="text-[12px] text-primary-foreground/70 leading-[1.4]">
                    {workoutDay.exercises.length}{" "}
                    {workoutDay.exercises.length === 1
                      ? "exercício"
                      : "exercícios"}
                  </span>
                </div>
              </div>
            </div>

            {/* Botão dentro do card (sem sessão ativa) */}
            {!inProgressSession &&
              (completedSession ? (
                <Button
                  disabled
                  variant="ghost"
                  className="rounded-[100px] px-[16px] py-[8px] h-auto text-[14px] text-primary-foreground border border-primary-foreground/40 hover:bg-transparent hover:text-primary-foreground"
                >
                  Concluído!
                </Button>
              ) : (
                <StartWorkoutButton
                  workoutPlanId={workoutPlanId}
                  workoutDayId={workoutDayId}
                />
              ))}
          </div>
        </div>


        {/* Lista de exercícios */}
        <div className="flex flex-col gap-[12px]">
          {workoutDay.exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="border border-border flex items-start justify-center p-[20px] rounded-[12px]"
            >
              <div className="flex flex-1 flex-col gap-[12px] min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[16px] text-foreground leading-[1.4]">
                    {exercise.name}
                  </p>
                  <ExerciseHelpButton exerciseName={exercise.name} />
                </div>

                <div className="flex gap-[6px] items-center flex-wrap">
                  <span className="bg-muted flex items-center justify-center px-[10px] py-[5px] rounded-[99px] font-semibold text-[12px] text-muted-foreground uppercase leading-none">
                    {exercise.sets} séries
                  </span>
                  <span className="bg-muted flex items-center justify-center px-[10px] py-[5px] rounded-[99px] font-semibold text-[12px] text-muted-foreground uppercase leading-none">
                    {exercise.reps} reps
                  </span>
                  <span className="bg-muted flex gap-[4px] items-center justify-center px-[10px] py-[5px] rounded-[99px] font-semibold text-[12px] text-muted-foreground uppercase leading-none">
                    <Zap className="size-[14px]" />
                    {exercise.restTimeInSeconds}s
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão "Marcar como concluído" (apenas com sessão em progresso) */}
        {inProgressSession && (
          <CompleteWorkoutButton
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
            sessionId={inProgressSession.id}
          />
        )}
      </div>

      <BottomNav activeTab="calendar" />
    </div>
  );
}
