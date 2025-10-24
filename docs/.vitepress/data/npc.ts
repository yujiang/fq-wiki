import { getScenePositionClient } from "./scene";
import { fetchXls, XlsSceneObj } from "./xls";

export interface XlsNpc extends XlsSceneObj {};


export type Npcs = Record<number, XlsNpc>;

let npcs: Npcs;
export async function getNpcs() {
  if (!npcs) {
    npcs = (await fetchXls('npc')) as Npcs 
  }
  return npcs;
}

export async function getNpc(id: number) {
  return (await getNpcs())[id]
}

// 输出:(杏花村 100,100)
export async function getNpcPosition(id: number) {
  const xls = await getNpc(id);
  if (xls.Scene && xls.x && xls.y) {
    return getScenePositionClient(xls.Scene,xls.x,xls.y)
  }
  return '';
}