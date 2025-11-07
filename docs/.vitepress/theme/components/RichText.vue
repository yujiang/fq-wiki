<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text: string
}>()

// 颜色/样式代码表：#R/#G/#B/#Y/#W，#n = 重置
const STYLE_MAP: Record<string, Partial<CSSStyleDeclaration>> = {
  R: { color: '#e53935' }, // red
  G: { color: '#43a047' }, // green
  B: { color: '#1e88e5' }, // blue
  Y: { color: '#fdd835' }, // yellow
  W: { color: '#ffffff' }, // white（按需）
  n: {},                   // reset/normal
  // 也可以扩展粗体/下划线：
  // b: { fontWeight: '700' },
  // u: { textDecoration: 'underline' },
}

type Seg = { text: string; style?: Partial<CSSStyleDeclaration> }

// 解析状态机：支持 “##” 作为字面量“#”
const segments = computed<Seg[]>(() => {
  const s = props.text ?? ''
  const segs: Seg[] = []
  let i = 0
  let buf = ''
  let currentStyle: Partial<CSSStyleDeclaration> | undefined = undefined

  const flush = () => {
    if (buf) {
      segs.push({ text: buf, style: currentStyle })
      buf = ''
    }
  }

  while (i < s.length) {
    const ch = s[i]

    // 处理转义 “##” -> 字面量 '#'
    if (ch === '#' && s[i + 1] === '#') {
      buf += '#'
      i += 2
      continue
    }

    if (ch === '#') {
      const code = s[i + 1] // 单字符指令，如 #R / #n
      if (code && /[A-Za-z]/.test(code)) {
        // 遇到样式切换，先把前面的文本 flush
        flush()
        const style = STYLE_MAP[code] ?? undefined
        // 重置或切换样式
        currentStyle = style && Object.keys(style).length ? style : undefined
        i += 2
        continue
      }

      // 可选扩展：#cRRGGBB 直接指定颜色（7 个字符）
      if (s.slice(i, i + 8).match(/^#c[0-9a-fA-F]{6}/)) {
        flush()
        const hex = s.slice(i + 2, i + 8)
        currentStyle = { color: `#${hex}` }
        i += 8
        continue
      }
    }

    // 普通字符
    buf += ch
    i++
  }

  flush()
  return segs
})
</script>

<template>
  <span class="rich-desc">
    <span
      v-for="(seg, idx) in segments"
      :key="idx"
      :style="seg.style"
    >{{ seg.text }}</span>
  </span>
</template>

<style scoped>
.rich-desc {
  white-space: pre-wrap; /* 保留换行/空格 */
}
</style>
