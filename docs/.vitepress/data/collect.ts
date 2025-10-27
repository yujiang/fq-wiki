// 资源/采集点

import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsCollect extends XlsSceneObj {
  Type: string;
  TopLimit: number;  
  Rewards: number;
  PickupItem: number;
  say: number;
}

export type Collects = Record<number, XlsCollect>;

let collects: Collects;
export async function getCollects() {
  if (!collects) {
    collects = (await fetchXls("collect")) as Collects;
  }
  return collects;
}

export async function getCollect(id: number) {
  return (await getCollects())[id]
}


export async function getCollectsTypeByScene(type:string, scene: number): Promise<XlsCollect[]> {
  const collects = await getCollects();
  const rt = Object.values(collects).filter(
    (c) => c.Scene === scene && c.Type === type
  ) ;
  console.log('getCollectsByScene', scene, Object.keys(collects).length, rt.length);
  return rt;
}
