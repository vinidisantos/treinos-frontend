import { redirect } from "next/navigation";

import { getServerSession } from "@/app/_lib/get-server-session";
import { needsOnboarding } from "@/app/_lib/check-onboarding";
import { OnboardingChat } from "./_components/onboarding-chat";

export default async function OnboardingPage() {
  const session = await getServerSession();

  if (!session.data?.user) {
    redirect("/auth");
  }

  const onboarding = await needsOnboarding();

  if (!onboarding) {
    redirect("/");
  }

  return (
    <div className="flex flex-col h-screen">
      <OnboardingChat />
    </div>
  );
}
