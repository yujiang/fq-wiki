import { getAllItems, getItemIcon, ItemIdCount } from "./item";
import { getScenePositionClient } from "./scene";
import { SkillIdLevel } from "./skill";
import { getLearnTaoluInfo } from "./taolu";
import { fetchXls, XlsSceneObj } from "./xls";

//id ,num, rand, friendlevel, recovernum
type ObserveItem = [number, number, number, number, number];
//id ,num, cond, !say
type AskItem = [number, number, number, number, number];

//id,level,say,reward,friendlevel
type ObserveSkillType = [number, number, number, number, number];
type ObserveWillType = string | [string, number] | ObserveSkillType;

interface TaskParamLike {
	rand?: number; //默认0
	tags: string | string[];
	num: number;  // 默认1
	grade?: number; // 等级
	rank?: number; // rank品质
}

export interface TaskParamGiveSay {
	rand?: number; //默认0
	itemid: number | number[];
	// tag?: string;
	num: number | number[];
	// tips: number; // 是否提示他！
	say?: number;
}

export interface XlsObserve extends XlsSceneObj {
    Npc: number;
    School: string;
    Power: string;
    Like: TaskParamLike;
    Item: TaskParamGiveSay;
    Items: ObserveItem[];
    AskItems: AskItem[];
    Skills: ObserveWillType[];
    Soldier: number;
};


export type Observes = Record<number, XlsObserve>;

let observes: Observes;
export async function getObserves() {
  if (!observes) {
    observes = (await fetchXls('observe')) as Observes 
  }
  return observes;
}

export async function getObserve(id: number) {
  return (await getObserves())[id]
}

// 输出:(杏花村 100,100)
export async function getObservePosition(id: number) {
  const xls = await getObserve(id);
  if (xls.Scene && xls.x && xls.y) {
    return getScenePositionClient(xls.Scene,xls.x,xls.y)
  }
  return '';
}


async function mapSkill(_Skill: ObserveWillType, curLevel: number): Promise<SkillIdLevel> {
	let Skill = _Skill;
	if (typeof Skill === 'string') {
		Skill = [Skill, 0];
	}

	if (typeof Skill[0] === 'string') {
		const xls = await getLearnTaoluInfo(Skill[0]);
		if (!xls) {
			return {} as SkillIdLevel;
		}
		return {
			id: xls.Taolu || xls.LifeSkill || xls.Secret,
			level: xls.MaxLevel,
			fLevel: Skill[1],
		};
	}
	const [id, level, say, reward, needLevel] = Skill;
	return { id, level, fLevel:needLevel };
}

function mapItem(item: ObserveItem): ItemIdCount {
	const [id, count, rand, needLevel] = item;
	return {
		id,
		count: count || 1,
		fLevel: needLevel,
	};
}

function mapAsk(item: AskItem): ItemIdCount {
	const [id, count, cond, nsay] = item;
  const needLevel = cond < 10 ? cond : 0;
	return {
		id,
		count,
		fLevel: needLevel,
	};
}

export async function getLikeDesc(xls: XlsObserve): Promise<string> {
  const like = observe2Like(xls.Like);
  if (xls.Item) {
    const allitems = await getAllItems();
    const items = Array.isArray(xls.Item.itemid) ? xls.Item.itemid : [xls.Item.itemid];
    const names = items.map((id) => allitems[id]?.Name);
    names.unshift(like);
    return names.join(' ');
  }
  return like;
}

export function observe2Like(like: TaskParamLike): string{
    const str = like?.tags;
    if (!str) {
        return '';
    }
    return Array.isArray(str) ? str.join(',')  : str;
}

export function observe2Items(items: ObserveItem[]): ItemIdCount[]{
    if (!items){
        return [];
    }
    if (typeof items[0] === "number"){
      items = [items as any];
    }
    return items.map(mapItem);
}

export function observe2Asks(items: AskItem[]): ItemIdCount[]{
    if (!items){
        return [];
    }
    if (typeof items[0] === "number"){
      items = [items as any];
    }
    return items.map(mapAsk);
}



export async function observe2Skills(skills: ObserveWillType[]): Promise<SkillIdLevel[]>{
    if (!skills){
        return [];
    }
    return Promise.all(skills.map(mapSkill));

}