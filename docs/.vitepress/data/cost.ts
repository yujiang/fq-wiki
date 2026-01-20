// cost

import { fetchXls, XlsBase, } from "./xls";

export interface XlsCost extends XlsBase {
	Money: number;
	Costs: number[];
}

export type Costs = Record<number, XlsCost>;

let costs: Costs;
export async function getCosts() {
  if (!costs) {
    costs = (await fetchXls("cost")) as Costs;
  }
  return costs;
}

export async function getCost(id: number) {
  return (await getCosts())[id];
}

//计算可能升到多少级
export function getCostUpgrade(soldier?: boolean) {
  return getCost(soldier ? 20100 : 20101);
}
