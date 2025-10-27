// 游戏奖励
import { getCollect, getCollects } from "./collect";
import { ItemIdCount } from "./item";
import { getMoney, getMoneyGrid } from "./money";
import { fetchXls, XlsBase } from "./xls";

// type,num,
type RewardMoney = [number, number];

// item,num,rand
type RewardItem = [number, number, number];

export type RewardItemRand = [(number|number[])[], number, number, number]

export interface XlsReward extends XlsBase {
  Money: RewardMoney[];
  Item: RewardItem[];
  Drop: RewardItem[];

  ItemRand: RewardItemRand[];
  ItemClass: RewardItem[];
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


export async function getRewardAll(id: number): Promise<ItemIdCount[]> {
  const items = await getRewardItems(id);
  const moneys = await getRewardMoneys(id);
  return [...items, ...moneys];
}

// 返回 {id: count:} 给ItemList使用
function item2RewardItems(a: RewardItem[]): ItemIdCount[] {
    if (typeof(a) === "number") {
      return [{ id: a, count: 1, rand: 1 }];
    }
    return a.map((i) => { return { id: i[0], count: i[1], rand:i[2] } });
}

export async function getRewardItems(id: number): Promise<ItemIdCount[]> {
  const r = await getReward(id);
  if (!r) return [];

  let rt: ItemIdCount[] = [];
  if (r.Drop) {
    for (const i of r.Drop) {
      const c = await getCollect(i[0]);
      if (c) {
        rt.push({ id: c.PickupItem, count: i[1] }); //rand=1
      }
    }
    return rt;
  }

  if (r.Item) {
    rt.push(...item2RewardItems(r.Item));
  }
  if (r.ItemRand){
    rt.push({id: 999, count: '???'});
  }
  if (r.ItemClass) {
    rt.push(...item2RewardItems(r.ItemClass));
  }
  

  return rt;
}

// 把money渲染为grid
export async function getRewardMoneys(id: number): Promise<ItemIdCount[]> {
  const r = await getReward(id);
  if (!r?.Money) return [];
  const rt = []
  const money: RewardMoney[] = typeof(r.Money[0]) === "number" ? [r.Money] as any: r.Money;
  for (const m of money){
    const g = await getMoneyGrid(m[0], m[1], true);
    if (g) rt.push(g);
  }
  return rt;
}

