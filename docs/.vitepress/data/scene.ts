import { formatClientPos } from "./public";
import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsScene extends XlsBase {
  Type: string;
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