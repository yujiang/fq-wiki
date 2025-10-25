import { getItemById, getItemIcon, ItemIdCount } from "./item";
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

export interface MoneyNum{
  /** 货币名称，例如 “元宝” */
  type: number;
  /** 货币数量 */
  amount: number;
  /** 是否紧凑显示（如 1.2k） */
  compact?: boolean;
}

export async function getMoneyGrid(moneytype: number, num: number, compact: boolean) : Promise<ItemIdCount> {
    const xls = await getMoney(moneytype);
    if (xls) return { id: xls.ItemId, count: compact ? formatAmount(num) : num };
    return {id: 0, count: 0};
}

export function formatAmount(n: number) {
   const abs = Math.abs(n);
   if (abs >= 1_000_000_00) return (n / 1_000_000_00).toFixed(1) + "亿";
   if (abs >= 1_000_0) return (n / 1_000_0).toFixed(1) + "万";
   return n;
};