import { formatClientPos } from "./public";
import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsScene extends XlsBase {
  Type: string;
  MapId: number;
  Shop: string;
  SceneArea: number;
  Belong: number; //属于哪个scene， 比如室内属于城市~
  showSmap: number;
  wx: number; // 世界地图的x,y
  wy: number;
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
  if (xls.showSmap === 0) return '';
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
    return Type?.includes('城市') 
}


//门派
export function isSchool(Type:string) {
    return Type?.includes('门派') 
}

//势力
export function isShili(Type:string) {
    return Type?.includes('势力') || Type?.includes('阵营')
}

//村庄
export function isCun(Type:string) {
    return Type?.includes('村庄');
}


//城市2
export function isCityArea(Type:string) {
    return isCity(Type) || isSchool(Type) || isShili(Type)
}

//Area下分类, 把门派+城市合并到城市
export function isSceneTypeArea(xlsType:string, type:SceneTypeString) {
  if (!type) return true;
  switch (type) {
    case '野外':
      return isWilderness(xlsType);
    case '室内':
      return isIndoor(xlsType);
    case '山洞':
      return isCave(xlsType);
    case '城市':
      return isCity(xlsType) || isSchool(xlsType) || isShili(xlsType) || isCun(xlsType);
    default:
      return false;
  }
}

export const SceneTypeStrings = ['野外', '室内', '山洞', '城市', '门派', '势力', '村庄'];
export type SceneTypeString = '野外' | '室内' | '山洞' | '城市' | '门派' | '势力' | '村庄' | '未知';

export function getSceneType(xlsType:string) : SceneTypeString{
  if (isWilderness(xlsType)) return '野外';
  if (isIndoor(xlsType)) return '室内';
  if (isCave(xlsType)) return '山洞';
  if (isCity(xlsType)) return '城市';
  if (isSchool(xlsType)) return '门派';
  if (isShili(xlsType)) return '势力';
  if (isCun(xlsType)) return '村庄';
  
  return '未知';
}


export async function getScenesArea(area: number) {
  const scenes = await getScenes();
  return Object.values(scenes).filter(x => x.SceneArea === area || x.Id === area || x.Belong === area);
}