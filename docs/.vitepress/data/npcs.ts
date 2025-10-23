import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

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

export async function getNpcPosition(id: number) {
  const xls = await getNpc(id);
  if (xls.Scene && xls.x && xls.y) {
    const scenes = await fetchXls('scene');
    const x = Math.floor(xls.x / 20);
    const y = Math.floor(xls.y / 20);
    const scene = scenes[xls.Scene];
    if (scene) {
      return `(${scene.Name} ${x},${y})`
    }
    return `(${xls.Scene} ${x},${y})`
  }
  return '';
}