// 资源/采集点

import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsCollect extends XlsSceneObj {
  Type: string;
  TopLimit: number;  
  Rewards: number;
  PickupItem: number;
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


export async function getCollectsByScene(scene: number): Promise<XlsCollect[]> {
  const collects = await getCollects();
  const rt = Object.values(collects).filter(
    (c) => c.Scene === scene && c.x && c.y && c.Type === "collect"
  ) ;
  console.log('getCollectsByScene', Object.keys(collects).length, scene, rt.length);
  return rt;
}
