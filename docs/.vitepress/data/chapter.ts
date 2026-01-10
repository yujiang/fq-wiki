import { getRewardMoney, MoneyTypeEnum } from "./reward";
import { getTaskNext, getTasks } from "./task";
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

// export async function chapterExp(xls: XlsChapter) {
//   const tasks = await getTasks();
//   const grade = parseInt(xls.Grade);
//   let task = xls.TaskStart;
//   let exp = 0;
//   while (task && task !== xls.TaskEnd) {
//     const tb = tasks[task];
//     const rw = tb.Reward || tb.WillReward || 0;
//     exp += getRewardMoney(rw, MoneyTypeEnum.exp);
//     task = getTaskNext(tb);
//   }
//   return exp;
// }