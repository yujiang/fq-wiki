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
  '一般','普通','稀有','史诗','传说','英雄'
]

export function getRankDesc(rank: number | undefined) {
  const r = rank || 0;
  return rankDesc[r];
}

const rankColor = [
  '#ffffff', // 一般
  '#01c52e', // 普通
  '#27b4ff', // 稀有
  '#cb3cff', // 史诗
  '#ef7a3e', // 传说  
  '#fd4071', // 英雄
]

export function getRankTextcolor(rank: number | undefined) {
  const r = rank || 0;
  return rankColor[r];
}

export function getRankTextcolor2(rank: number | undefined) {
  const r = rank || 0;
  if (r === 0) return '#000000';
  return rankColor[r];
}
