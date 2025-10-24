// 游戏奖励
import { getCollect, getCollects } from "./collect";
import { ItemIdCount } from "./item";
import { fetchXls, XlsBase } from "./xls";

// type,num,
type RewardMoney = [number, number];

// item,num,rand
type RewardItem = [number, number, number];

export interface XlsReward extends XlsBase {
  Money: RewardMoney[];
  Item: RewardItem[];
  Drop: RewardItem[];
}

export type Rewards = Record<number, XlsReward>;

let rewards: Rewards;
export async function getRewards() {
  if (!rewards) {
    rewards = (await fetchXls("reward")) as Rewards;
  }
  return rewards;
}

export async function getReward(id: number) {
  return (await getRewards())[id]
}


// 返回 {id: count:} 给ItemList使用
export async function getRewardItems(id: number): Promise<ItemIdCount[]> {
  const r = await getReward(id);
  if (!r) return [];
  const a = r.Item;
  if (a) return a.map((i) => { return { id: i[0], count: i[1], rand:i[2] } });
  if (r.Drop) {
    let rt: ItemIdCount[] = [];
    for (const i of r.Drop) {
      const c = await getCollect(i[0]);
      if (c) {
        rt.push({ id: c.PickupItem, count: i[1] }); //rand=1
      }
    }
    return rt;
  }
  return [];
}