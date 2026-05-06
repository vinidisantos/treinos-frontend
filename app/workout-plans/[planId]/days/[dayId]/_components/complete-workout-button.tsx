"use client";

import { Button } from "@/components/ui/button";
import { completeWorkoutSessionAction } from "../_actions";

type CompleteWorkoutButtonProps = {
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
};

export function CompleteWorkoutButton({
  workoutPlanId,
  workoutDayId,
  sessionId,
}: CompleteWorkoutButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={() =>
        completeWorkoutSessionAction(workoutPlanId, workoutDayId, sessionId)
      }
      className="rounded-[100px] w-full h-auto py-[12px] text-[14px]"
    >
      Marcar como concluído
    </Button>
  );
}
