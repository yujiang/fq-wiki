export interface Item {
  Id: number;
  Name: string;
  Icon: number;
  Desc?: string;
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

export type Items = Record<number, Item>;

// 使用 fetch 动态加载 item.json 数据
export const fetchXls = async (name: string): Promise<any> => {
  const response = await fetch('/.vitepress/json/'+name+'_xls.json')
  if (!response.ok) {
    throw new Error('Failed to load items')
  }
  return response.json()  // 返回 JSON 数据
}

let items : Items;
export async function getAllItems(){
  if (!items){
    const names = [
      'item','equip','material','drug','book','food',
    ]
    let i = {};
    for (const n of names){
      const item = await fetchXls(n) as Items;
      i = {...i, ...item};
    }
    items = i;
  }
  return items;
}

export function getItemIcon(icon: number){
  //return `/images/icon/char/268x249/1013.png`;
  return `/images/icon/item/100x100/${icon}.png`;
}