// lifeskill

import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsLifeskill extends XlsSceneObj {
}

export type Lifeskills = Record<number, XlsLifeskill>;

let lifeskills: Lifeskills;
export async function getLifeskills() {
  if (!lifeskills) {
    lifeskills = (await fetchXls("lifeskill")) as Lifeskills;
  }
  return lifeskills;
}

export async function getLifeskill(id: number) {
  return (await getLifeskills())[id]
}
