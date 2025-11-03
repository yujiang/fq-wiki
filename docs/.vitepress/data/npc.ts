import { getScenePositionClient, getScenes } from "./scene";
import { DisplayStruct, fetchXls, XlsSceneObj } from "./xls";

export interface XlsNpc extends XlsSceneObj {
  Display: DisplayStruct;
  Scene: number;
  Observe: number;
};

export interface NpcFriend{
  npcId: number;
  friend: number; // 友好度
}

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

export async function getNpcNameAndPosition(id: number) {
  const xls = await getNpc(id);
  if (xls.Scene && xls.x && xls.y) {
    const desc = await getScenePositionClient(xls.Scene,xls.x,xls.y);
    return `${xls.Name}(${desc})`
  }
  return '';
}

export function getNpcAvater(icon: number|undefined) {
   if (!icon) return "";
   return `/images/icon/char/268x249/${icon}.png`;
}

export function getNpcIcon(icon: number|undefined) {
   if (!icon) return "";
   return `/images/icon/char/80x80/${icon}.png`;
}

const fLevelDesc = ['', '普通','友好','挚友','知己'];
export function getFriendLevelDesc(level: number) {
  return fLevelDesc[level] || '未知';
}

export async function fillterNpcByScene(scene: number) {
   const npcs = await getNpcs();
   const scenes = await getScenes();
   return Object.values(npcs).filter(npc => npc.Scene === scene || (npc.Scene && scenes[npc.Scene]?.Belong === scene));
}