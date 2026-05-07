import {
  BicepsFlexed,
  Ruler,
  User,
  WeightTilde,
} from "lucide-react";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserTrainData } from "@/app/_lib/api/fetch-generated";
import { authClient } from "@/app/_lib/auth-client";
import { AppLogo } from "@/app/_components/app-logo";
import { BottomNav } from "@/app/_components/bottom-nav";
import { SignOutButton } from "./_components/sign-out-button";

function formatWeight(weightInGrams: number): string {
  const kg = weightInGrams / 1000;
  return kg % 1 === 0 ? kg.toString() : kg.toFixed(1);
}

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) {
    redirect("/auth");
  }

  const trainDataResponse = await getUserTrainData();

  if (trainDataResponse.status === 401) {
    redirect("/auth");
  }

  const trainData =
    trainDataResponse.status === 200 ? trainDataResponse.data : null;

  const user = session.data.user;

  return (
    <div className="flex flex-col flex-1 relative pb-[88px]">
      {/* Header */}
      <div className="flex h-[56px] items-center px-[20px]">
        <AppLogo className="text-foreground" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[20px] items-center p-[20px]">
        {/* Profile Info */}
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-[12px] items-center">
            <div className="relative rounded-full shrink-0 size-[52px] overflow-hidden bg-muted">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center size-full bg-primary/10">
                  <User className="size-[24px] text-primary" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-[6px] items-start justify-center">
              <p className="font-semibold text-[18px] text-foreground leading-[1.05]">
                {user.name}
              </p>
              <p className="text-[14px] text-foreground/70 leading-[1.15]">
                Plano Básico
              </p>
            </div>
          </div>
          <div className="size-[44px]" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-[12px] w-full">
          {/* Weight */}
          <div className="bg-primary/8 flex flex-col gap-[20px] items-center p-[20px] rounded-[12px]">
            <div className="bg-primary/8 flex items-center justify-center p-[9px] rounded-[99px] size-[34px]">
              <WeightTilde className="size-[16px] text-primary" />
            </div>
            <div className="flex flex-col gap-[6px] items-center">
              <p className="font-semibold text-[24px] text-foreground leading-[1.15]">
                {trainData ? formatWeight(trainData.weightInGrams) : "-"}
              </p>
              <p className="text-[12px] text-muted-foreground leading-[1.4] uppercase text-center">
                Kg
              </p>
            </div>
          </div>

          {/* Height */}
          <div className="bg-primary/8 flex flex-col gap-[20px] items-center p-[20px] rounded-[12px]">
            <div className="bg-primary/8 flex items-center justify-center p-[9px] rounded-[99px] size-[34px]">
              <Ruler className="size-[16px] text-primary" />
            </div>
            <div className="flex flex-col gap-[6px] items-center">
              <p className="font-semibold text-[24px] text-foreground leading-[1.15]">
                {trainData?.heightInCentimeters ?? "-"}
              </p>
              <p className="text-[12px] text-muted-foreground leading-[1.4] uppercase">
                Cm
              </p>
            </div>
          </div>

          {/* Body Fat */}
          <div className="bg-primary/8 flex flex-col gap-[20px] items-center p-[20px] rounded-[12px]">
            <div className="bg-primary/8 flex items-center justify-center p-[9px] rounded-[99px] size-[34px]">
              <BicepsFlexed className="size-[16px] text-primary" />
            </div>
            <div className="flex flex-col gap-[6px] items-center">
              <p className="font-semibold text-[24px] text-foreground leading-[1.15]">
                {trainData ? `${trainData.bodyFatPercentage}%` : "-"}
              </p>
              <p className="text-[12px] text-muted-foreground leading-[1.4] uppercase">
                GC
              </p>
            </div>
          </div>

          {/* Age */}
          <div className="bg-primary/8 flex flex-col gap-[20px] items-center p-[20px] rounded-[12px]">
            <div className="bg-primary/8 flex items-center justify-center p-[9px] rounded-[99px] size-[34px]">
              <User className="size-[16px] text-primary" />
            </div>
            <div className="flex flex-col gap-[6px] items-center">
              <p className="font-semibold text-[24px] text-foreground leading-[1.15]">
                {trainData?.age ?? "-"}
              </p>
              <p className="text-[12px] text-muted-foreground leading-[1.4] uppercase">
                Anos
              </p>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <SignOutButton />
      </div>

      <BottomNav activeTab="profile" />
    </div>
  );
}
