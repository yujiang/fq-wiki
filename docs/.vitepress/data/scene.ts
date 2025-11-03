import { formatClientPos } from "./public";
import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsScene extends XlsBase {
  Type: string;
  MapId: number;
  Shop: string;
  SceneArea: number;
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
    const pos = formatClientPos(x, y);
    const scene = await getScene(SceneId);
    return scene ? `(${scene.Name} ${pos})` : `(${SceneId} ${pos})`;
}

export function getSceneSmap(xls: XlsScene){
  if (isIndoor(xls.Type)) return '';
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

export async function getScenesArea(area: number) {
  const scenes = await getScenes();
  return Object.values(scenes).filter(x => x.SceneArea == area);
}