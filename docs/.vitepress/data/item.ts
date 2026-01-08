import { fetchXls, XlsBase } from "./xls";

export interface XlsItem extends  XlsBase {
  // Desc?: string;
  Rank: number; // 决定bg?
  Detail: string;
  LikeTags: string[];
}

// export const items: Record<number, Item> = {
//   20001: { id: 20001, name: '木剑', icon: 1001, },
//   20002: { id: 20002, name: '七弦琴', icon: 1002, },
//   20003: { id: 20003, name: '绑手带', icon: 1003, },
//   20004: { id: 20004, name: '烧火棍', icon: 1004, },
//   20005: { id: 20005, name: '镰铁刀', icon: 1005, },
//   21001: { id: 21001, name: '布衣', icon: 1008, desc: '基础防具' },
//   22001: { id: 22001, name: '铁剑', icon: 1007, desc: '入门兵器' },
// }

export type Items = Record<number, XlsItem>;



// type Kind = "item" | "equip" | "material" | "drug" | "book" | "food";

let itemsCache: Items | null = null;
// 正在加载时的单例 Promise（并发共享这一个）
let itemsPromise: Promise<Items> | null = null;

export async function getAllItems(): Promise<Items> {
  if (itemsCache) return itemsCache;         // 已有结果
  if (itemsPromise) return itemsPromise;     // 正在加载：复用同一个 Promise

  itemsPromise = (async () => {
    const kinds: string[] = ["item", "equip", "material", "drug", "book", "food","itemClass"];
    // 并行抓取
    const chunks = await Promise.all(kinds.map(k => fetchXls(k) as Promise<Items>));

    // 合并（如果担心覆盖，可加告警）
    const merged = Object.assign({}, ...chunks) as Items;

    // ✅ 缓存最终结果
    itemsCache = merged;
    console.log("items", Object.keys(merged).length);
    return merged;
  })();

  try {
    return await itemsPromise;
  } catch (err) {
    // 失败时允许后续重试
    itemsPromise = null;
    throw err;
  } finally {
    // 成功后保留 itemsPromise 也无妨；若想节省内存可清空：
    itemsPromise = null;
  }
}

export function getItemById(id: number | undefined) {
  if (!id) return null;
  return getAllItems().then(items => items[id]);
}

export function getItemIcon(icon: number | undefined) {
  //return `/images/icon/char/268x249/1013.png`;
  if (!icon) return "";
  return `/images/icon/item/100x100/${icon}.png`;
}


export interface ItemIdCount{
  id: number;
  count?: number|string; // 数目 右下角 5.2万?
  rand?: number; // 掉落几率 for reward 右上角
  fLevel?: number; // 友好级别 for observe 右上角
}
