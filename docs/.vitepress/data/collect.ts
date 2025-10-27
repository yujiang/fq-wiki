// 资源/采集点

import { getReward } from "./reward";
import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsCollect extends XlsSceneObj {
  Type: string;
  TopLimit: number;  
  Rewards: number;
  PickupItem: number;
  say: number;
  CreateType: string;
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


export type CollectsType = 'box' | 'collect' | 'say';

export async function getCollectsTypeByScene(type:CollectsType, scene: number): Promise<XlsCollect[]> {
  const collects = await getCollects();
  let ctype = type;
  if (type === 'say'){
    ctype = 'box';
  }
  let rt = Object.values(collects).filter(
    (c) => c.Scene === scene && c.Type === ctype && c.CreateType !== 'task'
  ) ;
  if (ctype === 'box'){
    rt = rt.filter(c=>!!c.say == (type === 'say'));
  }
  console.log('getCollectsByScene', type, scene, Object.keys(collects).length, rt.length);
  return rt;
}
