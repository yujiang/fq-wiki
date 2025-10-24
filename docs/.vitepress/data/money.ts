import { getItemById, getItemIcon } from "./item";
import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsMoney extends XlsBase {
    ItemId: number;
};


export type Moneys = Record<number, XlsMoney>;

let moneys: Moneys;
export async function getMoneys() {
  if (!moneys) {
    moneys = (await fetchXls('monetrayType')) as Moneys 
  }
  return moneys;
}

export async function getMoney(id: number) {
  return (await getMoneys())[id]
}

export async function getMoneyIcon(id: number) {
  const xls = await getMoney(id);
  if (!xls) return '';
  const info = await getItemById(xls.ItemId)
  if (!info) return '';
  return getItemIcon(info.Icon)
}
