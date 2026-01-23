// setting

import { fetchXls, XlsBase, } from "./xls";

export interface XlsSetting extends XlsBase {
    Value: any;
}

export type Settings = Record<number|string, XlsSetting>;

let settings: Settings;
export async function getSettings() {
  if (!settings) {
    settings = (await fetchXls("setting")) as Settings;
  }
  return settings;
}

export async function getSetting(id: number|string) {
  return (await getSettings())[id];
}

export async function getSettingValue(id: number|string) {
  return (await getSettings())[id].Value;
}

