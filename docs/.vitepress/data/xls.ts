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

export interface DisplayStruct {
  shape: number, 
  icon: number,
  // name?: string;
};

export type Bases = Record<number, XlsBase>

// 全局缓存
const xlsCache: Record<string, Bases> = {}

// 记录每个 name 是否正在加载（防止重复 fetch）
const fetching: Record<string, Promise<Bases>> = {}

/**
 * 动态加载单个 xls 文件的内容
 */
async function loadXls(name: string): Promise<Bases> {
  const url = `/json/${name}_xls.json`
  const res = await fetch(url)

  if (!res.ok ) {
    // 这里当做文件不存在或服务端异常处理
    throw new Error(`fetchXls failed: ${url} status:${res.status} `)
  }
  const ct = res.headers.get('Content-Type') || ''
  if (!ct.includes('application/json')) {
    // 找不到，dev会返回html
    console.error(`fetchXls failed: ${url} not json Content-Type:${ct} status:${res.status}`)
    throw new Error(`fetchXls failed: ${url} not json`)
  }

  try {
    const data = (await res.json()) as Bases

    xlsCache[name] = data
    delete fetching[name]
    return data
  }
  catch (e) {
    console.error(`fetchXls exception: ${url} `, e, {status: res.status, "Content-Type":ct}, );
    throw e
  } finally {
    delete fetching[name]
  }
}

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
  const p = loadXls(name)
  fetching[name] = p
  return p
}


export function getRankBgStyle(rank: number | undefined) {
  if (rank === undefined) rank = -1;
  let bgImage = `url("/images/ui/tile/bag/img_skill_bar_${(rank || 0) + 2}.png")`;
  // console.log('生成的背景图路径：', rank, bgImage); // 检查路径是否正确
  return {
    backgroundImage: bgImage,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  };
}

const rankDesc = [
  '一般','普通','优秀','稀有','史诗','传说'
]

export function getRankDesc(rank: number | undefined) {
  const r = rank || 0;
  return rankDesc[r];
}

export function findNameEqual(name: string, datas: Bases) {
  const finds = [];
  for (const data of Object.values(datas)) {
    if (data.Name === name) finds.push(data);
  }
  return finds;
}

export function findNameInclude(name: string, datas: Bases) {
  const finds = [];
  for (const data of Object.values(datas)) {
    if (data.Name?.includes(name)) finds.push(data);
  }
  return finds;
}

export function findXlsesByName(name: string, datas: Bases) {
  const finds = findNameEqual(name, datas);
  if (finds.length > 0) return finds;
  return findNameInclude(name, datas);
}

export async function fetchItemsByName(name: string, xls: string): Promise<XlsBase[]> {
  const datas = await fetchXls(xls);
  return findXlsesByName(name, datas);
}
