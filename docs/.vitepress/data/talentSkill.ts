import { fetchXls, XlsBase } from "./xls";

export interface XlsTalentSkill extends XlsBase {
  Kind?: string;
  Type?: string;
}

export type TalentSkills = Record<number, XlsTalentSkill>;

let talentSkills: TalentSkills | undefined;
export async function getTalentSkills(): Promise<TalentSkills> {
  if (!talentSkills) {
    talentSkills = (await fetchXls("talentSkill")) as TalentSkills;
  }
  return talentSkills;
}

export async function getTalentSkill(id: number): Promise<XlsTalentSkill | undefined> {
  return (await getTalentSkills())[id];
}
