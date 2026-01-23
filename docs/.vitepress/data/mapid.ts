// mapid

import { fetchXls, XlsBase, } from "./xls";

export type Mapids = Record<string, string>;

let mapids: Mapids;
export async function getMapids() {
  if (!mapids) {
    mapids = (await fetchXls("mapid")) as any as Mapids;
  }
  return mapids;
}

//id 10000,2w...
export function getMapidName(id: number) {
    // const data = mapids;
    const w = String(id);
    const name = w.length == 1 ? `0${w}` : w;
    const v = mapids[name];
    return v ? (name+v) : name;
}

