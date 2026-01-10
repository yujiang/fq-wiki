// 公式计算

import { getCostUpgrade } from "./cost";

export async function heroWillLevelup(startin: number, expin: number) {
    let start = startin;
    let exp = expin
    const cost = await getCostUpgrade(false);
    const e = cost.Costs[start+1];
    while (e && exp >= e) {
        exp -= e;
        start += 1;
    }
    // console.log('heroWillLevelup', startin, expin, start);
    return start;
}