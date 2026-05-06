import { Calendar, Dumbbell, Timer } from "lucide-react";

import { GetHome200TodayWorkoutDay } from "../_lib/api/fetch-generated";

type WorkoutDayCardProps = {
  workoutDay: NonNullable<GetHome200TodayWorkoutDay>;
};

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

export function WorkoutDayCard({ workoutDay }: WorkoutDayCardProps) {
  const weekDayLabel = WEEK_DAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay;
  const duration = formatDuration(workoutDay.estimatedDurationInSeconds);

  return (
    <div className="relative h-[200px] w-full rounded-[12px] overflow-hidden flex flex-col justify-between p-[20px]">
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

      <div className="relative flex items-center">
        <div className="backdrop-blur-xs bg-primary-foreground/16 flex gap-[4px] items-center justify-center px-[10px] py-[5px] rounded-[99px]">
          <Calendar className="size-[14px] text-primary-foreground" />
          <span className="font-semibold text-[12px] text-primary-foreground uppercase leading-none">
            {weekDayLabel}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col gap-[8px] items-start">
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
              {workoutDay.exercisesCount}{" "}
              {workoutDay.exercisesCount === 1 ? "exercício" : "exercícios"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
