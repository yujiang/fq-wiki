// secretskill

import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsSecretskill extends XlsSceneObj {
}

export type Secretskills = Record<number, XlsSecretskill>;

let secretskills: Secretskills;
export async function getSecretskills() {
  if (!secretskills) {
    secretskills = (await fetchXls("secretskill")) as Secretskills;
  }
  return secretskills;
}

export async function getSecretskill(id: number) {
  return (await getSecretskills())[id]
}
