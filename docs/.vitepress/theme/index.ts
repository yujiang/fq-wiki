// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { watch } from 'vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import '../style/style.css'
// import "../style/base.css"
import "../style/jianghu.css"
import "../style/poem.css"
import "../style/person.css"
import "../style/grid_shared.css"


// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css'; // 引入 Element Plus 的样式
// import NaiveUI from 'naive-ui/'
import { registerGameComponents } from './gameComponents'

// import { defineComponent, h, inject } from 'vue'
// import { NConfigProvider } from 'naive-ui'
// import { setup } from '@css-render/vue3-ssr'
// import { useRoute } from 'vitepress'
import { tipsDirective } from '../ui/tipsDirective'
// import { getVuetify } from './vuetify'
import { getToastify } from './toast'

export default {
  ...DefaultTheme,

  // Layout: NaiveUIProvider,

  enhanceApp({ app, router }: any) {

    // SSR 守卫
    if (typeof window === 'undefined') return;

    // app.use(getVuetify());
    app.use(getToastify());

    enhanceAppWithTabs(app)
    registerGameComponents(app);

    app.directive('tips', tipsDirective);

    // enableTips(app);
    // app.use(ElementPlus);
    // app.use(NaiveUI);

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
