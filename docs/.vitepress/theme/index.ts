// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { watch } from 'vue'
import type { Router } from 'vitepress'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import './style.css'
import "./jianghu.css"
import "./poem.css"
import "./person.css"

export default {
  ...DefaultTheme,
  enhanceApp({ app, router }: any) {
    // SSR 守卫
    if (typeof window === 'undefined') return;

    enhanceAppWithTabs(app)

    const apply = () => {
      const fm = router.route.data?.frontmatter as any; 
      if(!fm) return;
      const el = document.documentElement
      const keys ={
        "h2Style": "data-h2",
        "h3Style": "data-h3"
      }
      for (const [key,v] of Object.entries(keys)) {
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
  }
}


// import DefaultTheme from 'vitepress/theme'
// import { useData } from 'vitepress'
// import { watch } from 'vue'
// import type { Router } from 'vitepress'
// import './style.css' // 别忘了全局样式

// export default {
//   ...DefaultTheme,
//   enhanceApp({ router }: { router: Router }) {
//     const { frontmatter } = useData()
//     watch(
//       () => router.route.data.relativePath,
//       () => {
//         const v = (frontmatter.value as any).h2Style as string | undefined
//         const el = document.documentElement // <html>
//         if (v) el.setAttribute('data-h2', v)
//         else el.removeAttribute('data-h2')
//       },
//       { immediate: true }
//     )
//   }
// }
