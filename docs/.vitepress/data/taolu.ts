import { getScenePositionClient } from "./scene";
import { SkillIdLevel } from "./skill";
import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsTaolu extends XlsBase {
    Rank: number;
    TaoluSkill: number[];
    // [skill, level, unlock]
    SkillLevelUnlock: [number, number, number][];
    Detail: string;
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

interface XlsLearnTaolu extends XlsBase {
	Taolu: number;
	MaxLevel: number;
	Level: number;
	NpcId: number;
	Say: string | number;
}

export async function getLearnTaoluInfo(name: string){
    const learns = await fetchXls("learnTaolu") as Record<string, XlsLearnTaolu>;
    return learns[name];
}
