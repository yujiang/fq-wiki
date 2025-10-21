// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { watch } from 'vue'
import type { Router } from 'vitepress'
import './style.css'
import "./jianghu.css"
import "./poem.css"
import "./person.css"

export default {
  ...DefaultTheme,
  enhanceApp({ router }: { router: Router }) {
    // SSR 守卫
    if (typeof window === 'undefined') return

    const apply = () => {
      const fm = router.route.data?.frontmatter as { h2Style?: string } | undefined
      const v = fm?.h2Style
      const el = document.documentElement
      if (v) el.setAttribute('data-h2', v)
      else el.removeAttribute('data-h2')
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
