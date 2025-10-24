import { getScenePositionClient } from "./scene";
import { SkillIdLevel } from "./skill";
import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsTaolu extends XlsBase {
    TaoluSkill: number[];
    // [skill, level, unlock]
    SkillLevelUnlock: [number, number, number][];
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