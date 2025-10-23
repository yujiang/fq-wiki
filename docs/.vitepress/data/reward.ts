// 游戏奖励
import { fetchXls, XlsBase } from "./xls";

// type,num,
type RewardMoney = [number, number];

// item,num,rand
type RewardItem = [number, number, number];

interface XlsReward extends XlsBase {
  Money: RewardMoney[];
  Item: RewardItem[];
}

export type Rewards = Record<number, XlsReward>;

let rewards: Rewards;
export async function getRewards() {
  if (!rewards) {
    rewards = (await fetchXls("reward")) as Rewards;
  }
  return rewards;
}
