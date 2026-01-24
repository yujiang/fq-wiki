import { getScenePositionClient } from "./scene";
import { SkillIdLevel } from "./skill";
import { fetchXls, findXlsesByName, XlsBase, XlsSceneObj } from "./xls";

export type TaoluType = 'wu'|'nei'|'qing'
export type TaoluClassType = '刀'|'剑'|'拳'|'棍'|'内功'|'轻功'

export interface XlsTaolu extends XlsBase {
    Rank: number;
    TaoluSkill: number[];
    // [skill, level, unlock]
    SkillLevelUnlock: [number, number, number][];
    Detail: string;

    School: string;
    Type: TaoluType;
    大类: TaoluClassType;
};


export type Taolus = Record<number, XlsTaolu>;

let taolus: Taolus;
export async function getTaolus() {
  if (!taolus) {
    taolus = (await fetchXls('taolu')) as Taolus 
  }
  return taolus;
}

export async function getTaolu(id: number) {
  return (await getTaolus())[id]
}

export async function getTaoluSkills(taolu: number) : Promise<SkillIdLevel[]> {
  const xls = await getTaolu(taolu);
  if (!xls?.SkillLevelUnlock) return [];
  return xls.SkillLevelUnlock.map(x => {return {id:x[0], level:0, unlock:x[2]}});
}

export async function findTaolusByName(name: string): Promise<XlsTaolu[]> {
  const datas = await getTaolus();
  return findXlsesByName(name, datas) as XlsTaolu[];
}

export async function searchTaolus(name: string): Promise<{id: number, display: string}[]> {
  const found = await findTaolusByName(name);
  
  return found.map(item => ({
    id: item.Id,
    display: `${item.Id}: ${item.Name} - ${item.Desc || item.Detail}`
  }))
}

interface XlsLearnTaolu extends XlsBase {
	Taolu: number;
  LifeSkill: number;
  Secret: number; //秘技
  
	MaxLevel: number;
	Level: number;
	NpcId: number;
	Say: string | number;
}

export async function getLearnTaoluInfo(name: string){
    const learns = await fetchXls("learnTaolu") as Record<string, XlsLearnTaolu>;
    return learns[name];
}

export async function getTaolusBySchool(name: string, type: TaoluClassType): Promise<XlsTaolu[]>{
    const taolus = await getTaolus();
    return Object.values(taolus).filter(x => x.School === name && x.大类 === type);
}

//获取门派支持的武功类型（如 ['棍','内功']）
export async function getSchoolTaoluTypes(name: string): Promise<TaoluClassType[]>{
    const taolus = await getTaolus();
    const types = new Set<TaoluClassType>();
    Object.values(taolus).forEach(x => {
        if(x.School === name) types.add(x.大类);
    })
    return Array.from(types);
}