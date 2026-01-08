// src/ui/tipsDirective.ts
// 使用属性 v-tips 自动获得tips

type TipsValue = string | (() => string)

type TipsEl = HTMLElement & {
  __tippy__?: any
  __tipsValue__?: TipsValue
}

function resolve(v: TipsValue | undefined) {
  if (!v) return ''
  const t = typeof v === 'function' ? v() : v
  return (t ?? '').trim()
}

export const tipsDirective = {
  async mounted(el: TipsEl, binding: { value: TipsValue }) {
    if (typeof window === 'undefined') return
    const { default: tippy } = await import('tippy.js')

    el.__tipsValue__ = binding.value
    const text = resolve(el.__tipsValue__)

    el.__tippy__ = tippy(el, {
      content: text,
      disabled: !text,

      placement: 'top',
      delay: [250, 80],
      maxWidth: 260,
      appendTo: () => document.body,
      theme: 'game-dark',
      interactive: false,

      // ✅ 关键：空内容直接阻止 show（彻底杜绝黑点）
      onShow(instance: any) {
        const t = resolve(el.__tipsValue__)
        if (!t) {
          instance.disable()
          return false
        }
        instance.enable()
        instance.setContent(t)
        // 若内容变化导致尺寸变了，顺手更新定位
        instance.popperInstance?.update?.()
        return true
      },
    })
  },

  updated(el: TipsEl, binding: { value: TipsValue }) {
    el.__tipsValue__ = binding.value
    const inst = el.__tippy__
    if (!inst) return

    const t = resolve(el.__tipsValue__)
    if (!t) {
      inst.disable()
      // 如果当前正显示，立刻关掉，避免残影
      inst.hide?.()
      return
    }

    inst.enable()
    inst.setContent(t)
    inst.popperInstance?.update?.()
  },

  unmounted(el: TipsEl) {
    el.__tippy__?.destroy?.()
    delete el.__tippy__
    delete el.__tipsValue__
  },
}
