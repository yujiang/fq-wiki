export interface Item {
  id: number;
  name: string;
  icon: number;
  desc?: string;
}

export const items: Record<number, Item> = {
  20001: { id: 20001, name: '木剑', icon: 1001, },
  20002: { id: 20002, name: '七弦琴', icon: 1002, },
  20003: { id: 20003, name: '绑手带', icon: 1003, },
  20004: { id: 20004, name: '烧火棍', icon: 1004, },
  20005: { id: 20005, name: '镰铁刀', icon: 1005, },
  21001: { id: 21001, name: '布衣', icon: 1008, desc: '基础防具' },
  22001: { id: 22001, name: '铁剑', icon: 1007, desc: '入门兵器' },
}

export function getItemIcon(icon: number){
  return `/images/icon/char/268x249/${icon}.png`;
}