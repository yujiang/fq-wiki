import { getScenePositionClient } from "./scene";
import { fetchXls, XlsBase, XlsSceneObj } from "./xls";

export interface XlsSkill extends XlsBase {
  Rank: number;
};


export type Skills = Record<number, XlsSkill>;

type Kind = "activeskill" | "passiveskill" | "lifeskill";

let skillsCache: Skills | null = null;
// 正在加载时的单例 Promise（并发共享这一个）
let skillsPromise: Promise<Skills> | null = null;

export async function getAllSkills(): Promise<Skills> {
  if (skillsCache) return skillsCache;         // 已有结果
  if (skillsPromise) return skillsPromise;     // 正在加载：复用同一个 Promise

  skillsPromise = (async () => {
    const kinds: Kind[] = ["activeskill", "passiveskill", "lifeskill"];
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

export function getSkillById(id: number) {
  return getAllSkills().then(items => items[id]);
}

export function getSkillIcon(icon: number) {
  //return `/images/icon/char/268x249/1013.png`;
  if (!icon) return "";
  return `/images/icon/skill/80x80/${icon}.png`;
}

export interface SkillIdLevel{
  id: number;
  level?: number;
  unlock?: number;
}
