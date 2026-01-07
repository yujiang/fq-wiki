import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsChapter extends XlsBase {
    Scene: string;
    Grade: string;   
    TaskHead: number[]; 
    TaskStart: number;
    TaskEnd: number;
};


export type Chapters = Record<number, XlsChapter>;

let chapters: Chapters;
export async function getChapters() {
  if (!chapters) {
    chapters = (await fetchXls('chapter')) as Chapters 
  }
  return chapters;
}

export async function getChapter(id: number) {
  return (await getChapters())[id]
}

export async function getChapterLabel(id: number) {
  const xls = await getChapter(id);
  return `${xls.Name} - ${xls.Scene}(${xls.Grade})`;
}
