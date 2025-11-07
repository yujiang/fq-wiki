const DIGITS = ['零','一','二','三','四','五','六','七','八','九'];

function numberToChinese(n: number): string {
  if (n <= 0) return '';
  if (n < 10) return DIGITS[n];
  if (n < 20) return '十' + (n === 10 ? '' : DIGITS[n % 10]);
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return DIGITS[tens] + '十' + (ones ? DIGITS[ones] : '');
  }
  return String(n); // 超过99章直接返回数字
}

export function getChapterName(num: number): string {
  return `第${numberToChinese(num)}章`;
}
