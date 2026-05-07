import dayjs from "dayjs";

import { getHome, getUserTrainData } from "./api/fetch-generated";

export async function needsOnboarding(): Promise<boolean> {
  const today = dayjs().format("YYYY-MM-DD");
  const [homeResponse, trainResponse] = await Promise.all([
    getHome(today),
    getUserTrainData(),
  ]);

  const hasNoActivePlan = homeResponse.status !== 200;
  const hasNoTrainData =
    trainResponse.status === 200 && trainResponse.data === null;

  return hasNoActivePlan || hasNoTrainData;
}
