// 游戏奖励
import { getCollect } from "./collect";
import { ItemIdCount } from "./item";
import { getMoneyGrid } from "./money";
import { NpcFriend } from "./npc";
import { getScene } from "./scene";
import { SkillIdLevel } from "./skill";
import { fetchXls, XlsBase } from "./xls";

// type,num,
type RewardMoney = [number, number];

// item,num,rand
type RewardItem = [number, number, number];

export type RewardItemRand = [(number | number[])[], number, number, number]
export type RewardNpcFriend = RewardItem | RewardItem[];

export interface XlsReward extends XlsBase {
  Money: RewardMoney[];

  Item: number | number[] | RewardItem[];
  ItemRand: RewardItemRand[];
  ItemClass: RewardItem[];
  Drop: RewardItem[];

  SkillExp: RewardMoney[]; // lifeskill
  Secret: [number, number, number]; // 秘技
  SecretExp: number | [number, number]; // 秘技经验

  Scene: number;
  SceneScore: number;
  NpcFriend: RewardNpcFriend; // npc友好度！ 
  subReward: number | number[]; // 额外奖励id

  // 无法识别MoneyFunc/ItemFunc
  //MoneyFunc: string; // 复杂money脚本
  //ItemFunc: string; // 复杂item脚本
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


export async function getRewardItemMoney(id: number): Promise<ItemIdCount[]> {
  const items = await getRewardItems(id);
  const moneys = await getRewardMoneys(id);
  return [...moneys, ...items];
}

// 返回 {id: count:} 给ItemList使用
function item2RewardItems(a: RewardItem[]): ItemIdCount[] {
  if (typeof (a) === "number") {
    if (a > 0) return [{ id: a, count: 1, rand: 0 }];
    return [{ id: -a, count: -1, rand: 0 }];
  }
  if (typeof(a[0]) === "number") {
    return a.map((i) => { return { id: i, count: 1, rand: 0 } });
  }
  return a.map((i) => { return { id: i[0], count: i[1], rand: i[2] } });
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
  if (r.ItemRand) {
    rt.push({ id: 999, count: '???' });
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
  const money: RewardMoney[] = typeof (r.Money[0]) === "number" ? [r.Money] as any : r.Money;
  for (const m of money) {
    const g = await getMoneyGrid(m[0], m[1], true);
    if (g) rt.push(g);
  }
  return rt;
}

export function getRewardSkills(xls: XlsReward): SkillIdLevel[] {
  const rt: SkillIdLevel[] = [];
  if (xls.SecretExp) {
    if (Array.isArray(xls.SecretExp)) {
      const [skill, exp] = xls.SecretExp;
      rt.push({ id: skill, exp });
    } else {
      const skill = 20000; //通用战斗，取其icon使用
      const exp = xls.SecretExp;
      rt.push({ id: skill, exp });
    }
  }
  if (xls.SkillExp) {
    for (const m of xls.SkillExp) {
      rt.push({ id: m[0], exp: m[1] })
    }
  }
  if (xls.Secret) {
    const [skill, level, maxlv] = xls.Secret;
    rt.push({ id: skill, exp: -1 });
  }
  return rt;
}

export function getRewardFriends(xls: XlsReward): NpcFriend[] {
  if (xls.NpcFriend) {
    const nf: RewardItem[] = (typeof xls.NpcFriend[0] === 'number' ? [xls.NpcFriend] : xls.NpcFriend) as any;
    return nf.map((i) => { return { npcId: i[0], friend: i[1] } });
  }
  return [];
}

export interface SceneScore {
  Id: number;
  Name: string;
  Score: number;
}

export interface RewardAll {
  items: ItemIdCount[];
  moneys: ItemIdCount[];
  lifeskills: SkillIdLevel[];
  friend: NpcFriend[];
  sceneScore: SceneScore | null;
}

// 获得所有可以显示的reward内容
export async function getRewardA(newId: number): Promise<RewardAll | null> {
  const xls = await getReward(newId);
  if (!xls) return null;
  const items = await getRewardItems(newId);
  const moneys = await getRewardMoneys(newId);
  const lifeskills = getRewardSkills(xls);
  const friend = getRewardFriends(xls);
  let sceneScore = null;
  if (xls.Scene && xls.SceneScore) {
    const info = await getScene(xls.Scene);
    if (info) {
      sceneScore = {
        Id: xls.Scene,
        Name: info.Name,
        Score: xls.SceneScore,
      }
    }
  }
  return { items, moneys, lifeskills, friend, sceneScore };
}

export async function getRewardAll(newId: number): Promise<RewardAll | null> {
  const xls = await getReward(newId);
  if (!xls) return null;
  const rt = await getRewardA(newId);
  if (!rt) return null;
  if (xls.subReward) {
    const subs = Array.isArray(xls.subReward) ? xls.subReward : [xls.subReward];
    for (const r of subs) {
      const sub = await getRewardA(r);
      if (sub) {
        rt.items.push(...sub.items);
        rt.moneys.push(...sub.moneys);
        rt.lifeskills.push(...sub.lifeskills);
        if (sub.sceneScore && !rt.sceneScore) {
          rt.sceneScore = sub.sceneScore;
        }
      }
    }
  }
  return rt;
}