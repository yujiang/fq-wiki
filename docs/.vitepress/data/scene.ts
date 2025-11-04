import { formatClientPos } from "./public";
import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsScene extends XlsBase {
  Type: string;
  MapId: number;
  Shop: string;
  SceneArea: number;
  Belong: number; //属于哪个scene， 比如室内属于城市~
  showMap: number;
};


export type Scenes = Record<number, XlsScene>;

let scenes: Scenes;
export async function getScenes() {
  if (!scenes) {
    scenes = (await fetchXls('scene')) as Scenes 
  }
  return scenes;
}

export async function getScene(id: number) {
  return (await getScenes())[id]
}

// x,y is client.
export async function getScenePositionClient(SceneId: number, x: number, y: number) {
    const scene = await getScene(SceneId);
    return formatPositionClient(scene, SceneId, x, y);
}

export function formatPositionClient(scene: XlsScene, SceneId: number, x: number, y: number) {
    const pos = formatClientPos(x, y);
    return scene ? `${scene.Name} (${pos})` : `${SceneId} (${pos})`;
}

export function getSceneSmap(xls: XlsScene){
  if (isIndoor(xls.Type)) return '';
  if (xls.showMap === 0) return '';
  if(xls?.MapId) return `/images/map/${xls.MapId}.jpg` ;
  return '';
}

//室内
export function isIndoor(Type:string) {
    return Type?.includes('室内') 
}

//山洞
export function isCave(Type:string) {
    return Type?.includes('山洞') 
}

//野外
export function isWilderness(Type:string) {
    return Type?.includes('野外') 
}


//城市
export function isCity(Type:string) {
    return Type?.includes('城市') || Type?.includes('门派') 
}

export function isSceneType(xlsType:string, type:string) {
  if (!type) return true;
  switch (type) {
    case '野外':
      return isWilderness(xlsType);
    case '室内':
      return isIndoor(xlsType);
    case '山洞':
      return isCave(xlsType);
    case '城市':
      return isCity(xlsType)
    default:
      return false;
  }
}

export function getSceneType(xlsType:string) {
  if (isWilderness(xlsType)) return '野外';
  if (isIndoor(xlsType)) return '室内';
  if (isCave(xlsType)) return '山洞';
  if (isCity(xlsType)) return '城市';
  return '未知';
}

export async function getScenesArea(area: number) {
  const scenes = await getScenes();
  return Object.values(scenes).filter(x => x.SceneArea == area);
}