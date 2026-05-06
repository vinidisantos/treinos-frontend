"use client";

import { Button } from "@/components/ui/button";
import { startWorkoutSessionAction } from "../_actions";

type StartWorkoutButtonProps = {
  workoutPlanId: string;
  workoutDayId: string;
};

export function StartWorkoutButton({
  workoutPlanId,
  workoutDayId,
}: StartWorkoutButtonProps) {
  return (
    <Button
      onClick={() => startWorkoutSessionAction(workoutPlanId, workoutDayId)}
      className="rounded-[100px] px-[16px] py-[8px] h-auto text-[14px]"
    >
      Iniciar Treino
    </Button>
  );
}
