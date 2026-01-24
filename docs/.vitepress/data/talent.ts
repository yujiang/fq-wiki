// talent

import { fetchXls, XlsBase, } from "./xls";

export interface XlsTalent extends XlsBase {
    Kind: string;
    Type: string;
    
	Skills: ([number,number] | number)[]; //[skill,level] or skill(level=1)
	UnlockCond: number[];
}

export type Talents = Record<number, XlsTalent>;

let talents: Talents;
export async function getTalents() {
  if (!talents) {
    talents = (await fetchXls("talent")) as Talents;
  }
  return talents;
}

export async function getTalent(id: number) {
  return (await getTalents())[id];
}

//计算可能升到多少级
export function getTalentUpgrade(soldier?: boolean) {
  return getTalent(soldier ? 20100 : 20101);
}
