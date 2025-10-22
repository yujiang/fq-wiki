export interface ShopItem { 
  itemId: number; 
  price: number; 
  stock: number;
}

export interface Shop {
  id: number;
  name: string;
  keeper: string;
  note?: string;  // 商店的备注
  goods: ShopItem[]; // 商品列表
}

export const shops: Record<number, Shop> = {
  1001: {
    id: 1001,
    name: '杂货铺',
    keeper: '黄四娘',
    note: '江湖在外，先把命保住。',
    goods: [
      { itemId: 20001, price: 30, stock: 2 },  // 商品 ID 和价格
      { itemId: 20002, price: 120, stock: 3 },
      { itemId: 21001, price: 80, stock: 4 },
      { itemId: 22001, price: 150, stock: 5 },
    ],
  },
  1002: {
    id: 1002,
    name: '裁缝铺',
    keeper: '苏真真',
    goods: [
      { itemId: 21001, price: 80, stock: 4 },
      { itemId: 22001, price: 150, stock: 5 },
    ],
  },
  1003: {
    id: 1003,
    name: '铁匠铺',
    keeper: '卢铁匠',
    goods: [
      { itemId: 22001, price: 150, stock: 5 },
    ],
  },
}


