import { getScene, getScenePositionClient } from "./scene";
import { fetchXls, XlsSceneObj } from "./xls";

export interface XlsTeleport extends XlsSceneObj {
    ScenePrototype: number;

	tgtScene: number;
	// client pos
	tgtX: number;
	tgtY: number;
};


export type Teles = Record<number, XlsTeleport>;

let teles: Teles;
export async function getTeles() {
  if (!teles) {
    teles = (await fetchXls('teleport')) as Teles 
  }
  return teles;
}

export async function getTele(id: number) {
  return (await getTeles())[id]
}

export async function getTelesTypeByScene(type: string, scene: number): Promise<XlsTeleport[]> {
    const teles = await getTeles();
    const rts = [];
    for (const tele of Object.values(teles)) {
        if (tele.ScenePrototype == scene) {
            const xls = await getScene(tele.tgtScene);
            if (xls && type === '室内' === xls.Type?.indexOf('室内') >= 0){
                rts.push(tele);
            }
        }
    }
    return rts;
}