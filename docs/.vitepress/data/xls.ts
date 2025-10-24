// .vitepress/data/fetchXls.ts
export interface XlsBase {
  Id: number
  Name: string
  Desc?: string
  Icon: number
  Tags?: string | string[]
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
  if (fetching[name]) return fetching[name]

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
    }
  })()

  // 暂存这个 Promise，防止重复加载
  fetching[name] = p
  return p
}
