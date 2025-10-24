//直接显示
export function server2ClientPos(x: number, y: number){
    const x2 = Math.floor(x / 20);
    const y2 = Math.floor(y / 20);
    return [x2,y2]
}

export function formatClientPos(x: number, y: number){
    if (!x || !y) return '不详'
    const [x2,y2] = server2ClientPos(x,y)
    return `${x2},${y2}`
}