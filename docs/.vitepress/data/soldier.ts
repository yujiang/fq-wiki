import { SkillIdLevel, XlsSkill } from "./skill";
import { DisplayStruct, fetchXls, XlsBase } from "./xls";
import { ItemIdCount } from "./item";
import { getTalent, XlsTalent } from "./talent";


interface TaoluInit{
  Wu: SkillIdLevel;
  Qing: SkillIdLevel;
  Nei: SkillIdLevel;
}

export interface XlsSoldier extends XlsBase {
  display: DisplayStruct;
  
	// Origin: number; //来源 1 剧情 2 活动 3 元宝 不填不显示在商城里

  //pointdata: number;
  //basedata: number;
  //spcialdata: number;  
  //zizhidata: number;
  equip: number[]; //装备,6个id

  weapon: string;

  Taolu: TaoluInit; //初始武学

  talentdata: number; //指向talent表
  // MallClickTips: string;

	biography: string; //人物传记
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

export function soldier2EquipItems(equip: number[]): ItemIdCount[] {
  return equip.map(id => ({ id, count: 1 }));
}

export function soldier2TaoluSkills(Taolu: TaoluInit): SkillIdLevel[] {
  return [Taolu.Wu, Taolu.Nei, Taolu.Qing];
}

export async function soldier2TalentSkills(talentdata: number): Promise<SkillIdLevel[]> {
  const talent = await getTalent(talentdata);
  if (!talent || !talent.Skills) return [];

  return talent.Skills.map(skill => {
    if (Array.isArray(skill)) {
      return { id: skill[0], level: skill[1] };
    } else {
      return { id: skill, level: 1 };
    }
  });
}

export function getSoldierIcon(icon: number | undefined) {
  if (!icon) return "";
  return `/images/icon/char/268x249/${icon}.png`; // Same as NPC for now
}
