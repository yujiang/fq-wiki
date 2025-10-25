// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { watch } from 'vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import './style.css'
import "./jianghu.css"
import "./poem.css"
import "./person.css"


import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // 引入 Element Plus 的样式
import NaiveUI from 'naive-ui/'
import { registerGameComponents } from './gameComponents'

import { defineComponent, h, inject } from 'vue'
import { NConfigProvider } from 'naive-ui'
import { setup } from '@css-render/vue3-ssr'
import { useRoute } from 'vitepress'

const { Layout } = DefaultTheme

const CssRenderStyle = defineComponent({
  setup() {
    const collect = inject('css-render-collect')
    return {
      style: collect()
    }
  },
  render() {
    return h('css-render-style', {
      innerHTML: this.style
    })
  }
})

const VitepressPath = defineComponent({
  setup() {
    const route = useRoute()
    return () => {
      return h('vitepress-path', null, [route.path])
    }
  }
})

const NaiveUIProvider = defineComponent({
  render() {
    return h(
      NConfigProvider,
      { abstract: true, inlineThemeDisabled: true },
      {
        default: () => [
          h(Layout, null, { default: this.$slots.default?.() }),
          import.meta.env.SSR ? [h(CssRenderStyle), h(VitepressPath)] : null
        ]
      }
    )
  }
})


export default {
  ...DefaultTheme,

  Layout: NaiveUIProvider,

  enhanceApp({ app, router }: any) {
    if (import.meta.env.SSR) {
      const { collect } = setup(app)
      app.provide('css-render-collect', collect)
    }    
    // SSR 守卫
    if (typeof window === 'undefined') return;

    enhanceAppWithTabs(app)
    registerGameComponents(app);

    // enableTips(app);
    app.use(ElementPlus);
    app.use(NaiveUI);

    const apply = () => {
      const fm = router.route.data?.frontmatter as any;
      if (!fm) return;
      const el = document.documentElement
      const keys = {
        "h2Style": "data-h2",
        "h3Style": "data-h3"
      }
      for (const [key, v] of Object.entries(keys)) {
        const v2 = fm[key];
        if (v2) el.setAttribute(v, v2)
        else el.removeAttribute(v)
      }
    }

    // 首屏
    apply()

    // 监听路由变化（path 更稳定；也可用 route.data）
    watch(() => router.route.path, apply, { immediate: false })
    // 如果你更喜欢监听数据对象：
    // watch(() => router.route.data, apply, { immediate: false })
  },

}
