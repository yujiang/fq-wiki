import { fetchXls, XlsBase } from "./xls";

export interface XlsSoldier extends XlsBase {
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
