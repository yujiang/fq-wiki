// 游戏奖励
import { getCollect } from "./collect";
import { ItemIdCount } from "./item";
import { getMoneyGrid } from "./money";
import { NpcFriend } from "./npc";
import { getScene } from "./scene";
import { SkillIdLevel } from "./skill";
import { fetchXls, XlsBase } from "./xls";
const isDev = import.meta.env.DEV;

// type,num,
type RewardMoney = [number, number];

// item,num,rand
type RewardItem = [number, number, number];

export type RewardItemRand = [(number | number[])[], number, number, number];
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

  Remarks: string;
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
  return (await getRewards())[id];
}

export function getRewardSync(id: number) {
  return rewards[id];
}


export async function getRewardItemMoney(id: number): Promise<ItemIdCount[]> {
  const items = await getRewardItems(id);
  const moneys = await getRewardMoneys(id);
  return [...moneys, ...items];
}

// 返回 {id: count:} 给ItemList使用
function item2RewardItems(a: number | number[] | RewardItem[]): ItemIdCount[] {
  if (typeof a === "number") {
    return a > 0
      ? [{ id: a, count: 1, rand: 0 }]
      : [{ id: -a, count: -1, rand: 0 }];
  }
  if (typeof a[0] === "number") {
    return a.map((i: any) => {
      return i > 0
        ? { id: i, count: 1, rand: 0 }
        : { id: -i, count: -1, rand: 0 };
    });
  }
  return (a as RewardItem[]).map((i) => {
    return i[0] > 0
      ? { id: i[0], count: i[1], rand: i[2] || 0 }
      : { id: -i[0], count: -i[1], rand: i[2] || 0};
  });
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
    rt.push({ id: 999, count: "???" });
  }
  if (r.ItemClass) {
    rt.push(...item2RewardItems(r.ItemClass));
  }

  return rt;
}

// 把money渲染为grid
export async function getRewardMoneys(id: number): Promise<MoneyCount[]> {
  const r = await getReward(id);
  if (!r?.Money) return [];
  const rt = [];
  const money: RewardMoney[] =
    typeof r.Money[0] === "number" ? ([r.Money] as any) : r.Money;
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
      // const skill = 20000; //通用战斗，取其icon使用
      // const exp = xls.SecretExp;
      rt.push({ id: 20000, exp: xls.SecretExp });
    }
  }
  if (xls.SkillExp) {
    for (const m of xls.SkillExp) {
      rt.push({ id: m[0], exp: m[1] });
    }
  }
  // -1 获得秘技!
  if (xls.Secret) {
    const [skill, level, maxlv] = xls.Secret;
    rt.push({ id: skill, exp: -1 });
  }
  return rt;
}

export function getRewardFriends(xls: XlsReward): NpcFriend[] {
  if (xls.NpcFriend) {
    const nf: RewardItem[] = (
      typeof xls.NpcFriend[0] === "number" ? [xls.NpcFriend] : xls.NpcFriend
    ) as any;
    return nf.map((i) => {
      return { id: i[0], friend: i[1] };
    });
  }
  return [];
}

export interface SceneScore {
  Id: number;
  Name: string;
  Score: number;
}

export interface MoneyCount{
  id: number;
  count?: number|string;
}

export interface RewardAll {
  items: ItemIdCount[];
  moneys: MoneyCount[];
  skills: SkillIdLevel[]; //包括,秘技
  friend: NpcFriend[];
  sceneScore: SceneScore | null;
}

// 获得所有可以显示的reward内容
export async function getRewardA(newId: number): Promise<RewardAll | null> {
  const xls = await getReward(newId);
  if (!xls) return null;
  const items = await getRewardItems(newId);
  const moneys = await getRewardMoneys(newId);
  const skills = getRewardSkills(xls);
  const friend = getRewardFriends(xls);
  let sceneScore = null;
  if (xls.Scene && xls.SceneScore) {
    const info = await getScene(xls.Scene);
    if (info) {
      sceneScore = {
        Id: xls.Scene,
        Name: info.Name,
        Score: xls.SceneScore,
      };
    }
  }
  return { items, moneys, skills, friend, sceneScore };
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
        rt.skills.push(...sub.skills);
        // if (sub.sceneScore && !rt.sceneScore) {
        //   rt.sceneScore = sub.sceneScore;
        // }
      }
    }
  }
  return rt;
}

function getNpcFriendDesc(r: XlsReward, f: RewardItem) {
  const desc = f[1] + " " + (r.Remarks || r.Name);
  return isDev ? `[${r.Id}]${desc}` : desc;
}

export async function getFriendRewards(npc: number) {
  const rt: string[] = [];
  const rs = await getRewards();


  for (const r of Object.values(rs)) {
    const nf = r.NpcFriend;
    if (nf) {
        if (Array.isArray(nf[0])) {
          for (const npc2 of nf as RewardItem[] ) {
            if (npc2[0] === npc) {
              rt.push(getNpcFriendDesc(r, npc2));
              break;
            }
          }
        }
        else if (nf[0] === npc) {
          rt.push(getNpcFriendDesc(r, nf as RewardItem));
        }
    }
  }
  return rt;
}

export enum MoneyTypeEnum {
	null,
	gold,// 元宝
	silver,// 银两
	exp,// 经验
	yueli,// 阅历
	school,// 门贡
	camp,// 势力贡献
	imperial,// 皇宫声望
	u1,// lakeprestige, // 江湖声望
	u2,// athleticglory, // 竞技荣誉
	strength,// 10 当前体力
	morals,// 道德值
	antique,// 古董升星石
	u4,// strengthMax, // 最大体力值
	prestige,// 声望
	zhenqi,// 真气
	Satiety,// 饱食度
	u5,// item, // 道具 for cost use

	u6,// hunterBlood, // 打猎血量
	u7,// rod, // 鱼竿
	u8,// 20 bait, // 鱼饵
	u9,// seaRod, // 海鱼竿
	u10,// seaBait, // 海鱼饵
	u11,// meat, // 肉

	lotteryMoney,// 抽奖代币
	lotteryTicket,// 抽奖券
	tower,//爬塔
	memory,// 记忆碎片 没有用到,用的是counter 8127
	shaolinSin,// 少林破戒

	Shilian,//试炼

	MaxNum,
	voucher
}

// 有声望吗?
export function hasScore(xls: XlsReward): boolean {
  if (!xls) return false;
  // return xls.Scene > 0 && xls.SceneScore > 0 || xls.Money?.some(m => m[0] === Monetype_Score);
  return xls.Scene > 0 && xls.SceneScore > 0 ;
}

export function hasSliver(xls: XlsReward): boolean {
  if (!xls) return false;
  // return xls.Scene > 0 && xls.SceneScore > 0 || xls.Money?.some(m => m[0] === Monetype_Score);
  return xls.Money && xls.Money.find(m => m[0] === MoneyTypeEnum.silver) != null ;
}

// export function getRewardMoney(rw: number, my: MoneyTypeEnum): number {
//   const xls: XlsReward = getRewardSync(rw);
//   const money = xls.Money;
//   if (!money) return 0;
//   return money.find((m) => m[0] === my)?.[1] || 0;
// }

export async function sumRewards(rws: number[]) {
  const rewards = await getRewards();
  let rt: RewardAll|null = null;
  for (const rw of rws) {
    const xls = rewards[rw];
    if (!xls) continue;
    if (!rt) {
      rt = await getRewardAll(rw) ;
    }
    else {
      const r2 = await getRewardAll(rw) ;
      if (r2) {
        MergeRerwardAll(rt, r2);
      }
    }
  }
  // console.log('sumRewards', rws, rt);
  return rt;
}

export function MergeRerwardAll(rt: RewardAll, r2: RewardAll) {
  MergeArray(rt.items, r2.items);
  MergeArray(rt.moneys, r2.moneys);
  MergeArray(rt.skills, r2.skills, 'exp');
  MergeArray(rt.friend, r2.friend, 'friend'); 
  if (!rt.sceneScore){
    rt.sceneScore = r2.sceneScore;
  } 
  else if (r2.sceneScore && rt.sceneScore.Id === r2.sceneScore.Id) {
    rt.sceneScore.Score += r2.sceneScore.Score;
  }
}

function MergeArray<T extends { id: number }>(a1: T[], a2: T[], key: string = 'count') {
  for (const a of a2) {
    const find = a1.find(i => i.id === a.id);
    if (find) {
      (find as any)[key] += (a as any)[key] || 0;
    }
    else {
      a1.push(a);
    }
  }
}