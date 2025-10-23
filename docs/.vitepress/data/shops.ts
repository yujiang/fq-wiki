import { fetchXls, XlsBase } from "./xls";

export interface XlsShopItem extends XlsBase {
  ItemId: number;
  Price: number;
  Count: number;
  Tag: string;
}

// 临时数据,非表格
export interface XlsShop extends XlsBase{
  // keeper: string;
  // note?: string;  // 商店的备注
  Npc: number;
  Tag: string;
  goods: XlsShopItem[]; // 商品列表
}

export type Shops = Record<number, XlsShop>;

type ShopItems = Record<number, XlsShopItem>;

interface XlsShoptype extends XlsBase{
  DataName: string;
  Tag: string;
  Npc: number;
}

export type ShopTypes = Record<number, XlsShoptype>;

// 使用 fetch 动态加载 shop.json 数据
let shoptypes: ShopTypes;
export async function getShopTypes() {
  if (!shoptypes) {
    shoptypes = (await fetchXls('shoptype')) as ShopTypes 
  }
  return shoptypes;
}

const shops: Shops = {};

// 获取某个商店的数据
export async function getShopById(shopId: number): Promise<XlsShop | null> {
  if (shops[shopId]) {
    return shops[shopId];    // 返回指定 ID 的商店，如果没有则返回 null
  }
  const ss = await getShopTypes();  // 获取所有商店数据
  const xls = ss[shopId];
  if (!xls) {
    return null;
  }
  const data = await fetchXls(xls.DataName) as ShopItems;
  if (!data) {
    return null;
  }

  const s: XlsShop = {
    Id: xls.Id,
    Name: xls.Name,
    Tag: xls.Tag,
    Npc: xls.Npc,
    goods: []
  };

  for (const good of Object.values(data)) {
    // console.log(good.Tag, xls.Tag)
    if (good.Tag === xls.Tag) {
      s.goods.push(good);
    }
  }
  shops[shopId] = s;
  console.log('getShopById', shopId, Object.values(data).length, s.goods.length, xls.Tag);
  return s;
}

export async function getShopsByIds(ids: number[]): Promise<Shops> {
  // 并行请求所有指定 id 的商店
  await Promise.all(ids.map(id => getShopById(id)));
  // getShopById 内部应该已经把结果填进全局 shops 缓存
  return shops;
}


export async function getShopsByName(name: string): Promise<[number[], Shops]> {
  const ss = await getShopTypes();  // 获取所有商店数据
  const ids: number[] = [];
  for (const [id, xls] of Object.entries(ss)) {
    if (xls.DataName === name) {
      ids.push(Number(id));
    }
  }

  console.log('getShopsByName', name, ids);

  return [ids,await getShopsByIds(ids)];
}

export function getShops(){
  return shops;
}

// export const shops: Record<number, Shop> = {
//   1001: {
//     id: 1001,
//     name: '杂货铺',
//     keeper: '黄四娘',
//     note: '江湖在外，先把命保住。',
//     goods: [
//       { itemId: 20001, price: 30, stock: 2 },  // 商品 ID 和价格
//       { itemId: 20002, price: 120, stock: 3 },
//       { itemId: 21001, price: 80, stock: 4 },
//       { itemId: 22001, price: 150, stock: 5 },
//     ],
//   },
//   1002: {
//     id: 1002,
//     name: '裁缝铺',
//     keeper: '苏真真',
//     goods: [
//       { itemId: 21001, price: 80, stock: 4 },
//       { itemId: 22001, price: 150, stock: 5 },
//     ],
//   },
//   1003: {
//     id: 1003,
//     name: '铁匠铺',
//     keeper: '卢铁匠',
//     goods: [
//       { itemId: 22001, price: 150, stock: 5 },
//     ],
//   },
// }


