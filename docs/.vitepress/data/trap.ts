// trap

import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsTrap extends XlsSceneObj {
}

export type Traps = Record<number, XlsTrap>;

let traps: Traps;
export async function getTraps() {
  if (!traps) {
    traps = (await fetchXls("traps")) as Traps;
  }
  return traps;
}

export async function getTrap(id: number) {
  return (await getTraps())[id]
}
