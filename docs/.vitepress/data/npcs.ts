import { fetchXls, XlsBase } from "./xls";

export interface XlsNpc extends XlsBase {
  	Scene: number;
	x: number;
	y: number;
};


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