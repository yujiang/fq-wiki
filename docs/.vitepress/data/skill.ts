import { fetchXls, findXlsesByName, XlsBase } from "./xls";

export interface XlsSkill extends XlsBase {
  Rank: number;
  School?: string;
  Type: string;
};


export type Skills = Record<number, XlsSkill>;

// type Kind = "activeskill" | "passiveskill" | "lifeskill";

let skillsCache: Skills | null = null;
// 正在加载时的单例 Promise（并发共享这一个）
let skillsPromise: Promise<Skills> | null = null;

export async function getAllSkills(): Promise<Skills> {
  if (skillsCache) return skillsCache;         // 已有结果
  if (skillsPromise) return skillsPromise;     // 正在加载：复用同一个 Promise

  skillsPromise = (async () => {
    const kinds: string[] = ["activeskill", "passiveskill", "lifeskill", "taolu", "secretskill"];
    // 并行抓取
    const chunks = await Promise.all(kinds.map(k => fetchXls(k) as Promise<Skills>));

    // 合并（如果担心覆盖，可加告警）
    const merged = Object.assign({}, ...chunks) as Skills;

    // ✅ 缓存最终结果
    skillsCache = merged;
    console.log("skills", Object.keys(merged).length);
    return merged;
  })();

  try {
    return await skillsPromise;
  } catch (err) {
    // 失败时允许后续重试
    skillsPromise = null;
    throw err;
  } finally {
    // 成功后保留 skillsPromise 也无妨；若想节省内存可清空：
    skillsPromise = null;
  }
}

export function getSkillById(id: number | undefined) {
  if (!id) return null;
  return getAllSkills().then(items => items[id]);
}

export function getSkillIcon(icon: number|undefined) {
  //return `/images/icon/char/268x249/1013.png`;
  if (!icon) return "";
  return `/images/icon/skill/80x80/${icon}.png`;
}

export interface SkillIdLevel{
  id: number;
  level?: number|string; // 右下角
  // unlock,exp,flevel 只有其一！
  unlock?: number; // for taolu 右上角
  exp?: number; // for reward -1 new skill 左下角
  fLevel?: number; // 友好级别 for observe 右上角
}

//lifeskill和secretSkill有type

export async function getSkillsFileType(file: string, type?: string): Promise<Skills> {
  const skills = await fetchXls(file) as Skills;
  if (!type || type === "all") return skills;
  return Object.values(skills).filter(item => item.Type === type);

}

export async function getSkillsFileSchool(file: string, school?: string): Promise<Skills> {
  const skills = await fetchXls(file) as Skills;
  if (!school || school === "all") return skills;
  return Object.values(skills).filter(item => item.School === school);
}

export async function findSkillsByName(name: string): Promise<XlsSkill[]> {
  const datas = await getAllSkills();
  return findXlsesByName(name, datas) as XlsSkill[];
}
