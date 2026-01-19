import { fetchXls, XlsSceneObj } from "./xls";

export interface XlsSay extends XlsSceneObj {
    Reward: number;
    Say: string;
};


export type Says = Record<number, XlsSay>;

let says: Says;
export async function getSays() {
  if (!says) {
    says = (await fetchXls('say')) as Says 
  }
  return says;
}

export async function getSay(id: number) {
  return (await getSays())[id]
}

export async function getSayReward(id: number) {
  const xls = await getSay(id);
  return xls?.Reward;
}
