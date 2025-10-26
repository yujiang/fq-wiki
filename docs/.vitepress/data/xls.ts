// .vitepress/data/fetchXls.ts
export interface XlsBase {
  Id: number
  Name: string
  Desc?: string
  Detail?: string
  Icon?: number
  Tags?: string | string[]
  Rank?: number
}

export interface XlsSceneObj extends XlsBase {
  Scene: number;
  x: number;
  y: number;
};



export type Bases = Record<number, XlsBase>

// 全局缓存
const xlsCache: Record<string, Bases> = {}

// 记录每个 name 是否正在加载（防止重复 fetch）
const fetching: Record<string, Promise<Bases>> = {}

/**
 * 动态加载 .vitepress/json/{name}_xls.json
 * 带缓存与防重入
 */
export async function fetchXls(name: string): Promise<Bases> {
  // 已有缓存 → 直接返回
  if (xlsCache[name]) return xlsCache[name]

  // 已有正在加载的 Promise → 等待并返回
  if (fetching[name] !== undefined) {
    return fetching[name];
  }

  // 启动新请求
  const p = (async () => {
    const url = `/json/${name}_xls.json`
    const res = await fetch(url)

    if (!res.ok) throw new Error(`fetchXls failed: ${url} (${res.status})`)
    try {
      const data = (await res.json()) as Bases

      xlsCache[name] = data
      delete fetching[name]
      return data
    }
    catch (e) {
      console.error(`fetchXls exception: ${url} `,e);
      throw e
    } finally{
      delete fetching[name]
    }
  })()

  // 暂存这个 Promise，防止重复加载
  fetching[name] = p
  return p
}


export function getRankBgStyle(rank: number|undefined){
  if (rank === undefined) rank = -1;
  let bgImage = `url("/images/ui/tile/bag/img_skill_bar_${(rank||0) + 2}.png")`;
  // console.log('生成的背景图路径：', rank, bgImage); // 检查路径是否正确
  return {
    backgroundImage: bgImage,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  };
}