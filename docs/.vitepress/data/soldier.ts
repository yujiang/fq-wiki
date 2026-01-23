import { SkillIdLevel, XlsSkill } from "./skill";
import { DisplayStruct, fetchXls, XlsBase } from "./xls";


interface TaoluInit{
  wu: SkillIdLevel;
  qing: SkillIdLevel;
  nei: SkillIdLevel;
}

export interface XlsSoldier extends XlsBase {
  display: DisplayStruct;
  
  //pointdata: number;
  //basedata: number;
  //spcialdata: number;  
  //zizhidata: number;
  talentdata: number; //指向talent表

  //weapon: string;
  Taolu: TaoluInit; //初始武学
  equip: number[]; //装备,6个

  // MallClickTips: string;
};


export type Soldiers = Record<number, XlsSoldier>;

let soldiers: Soldiers;
export async function getSoldiers() {
  if (!soldiers) {
    soldiers = (await fetchXls('soldier')) as Soldiers 
  }
  return soldiers;
}

export async function getSoldier(id: number) {
  return (await getSoldiers())[id]
}
