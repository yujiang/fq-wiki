import { defineConfig } from 'vitepress'
import {withMermaid, MermaidPlugin, MermaidMarkdown} from 'vitepress-plugin-mermaid'
import { setupContainers } from './jianghu';
// import { generateSidebar } from 'vitepress-sidebar'
import { generateSidebarRemoveNumber } from './sidebar';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

const fileAndStyles: Record<string, string> = {}

export default withMermaid({
  lang: 'zh-CN',
  title: '风起江湖 · Wiki',
  description: '游戏世界观 / 人物 / 门派 / 剧情资料',
  lastUpdated: false,              // 页面右上角显示最近更新
  // base: '/<repo>/',            // 若部署到 GitHub Pages 子路径，取消注释并填写

  vite: {
    // 必需，否则 vitepress-plugin-mermaid 无法正常工作
    // plugins: [MermaidPlugin()],
    optimizeDeps: {
        include: ['mermaid'],
    },
    ssr: {
        noExternal: ['mermaid','naive-ui', 'date-fns', 'vueuc'],
    },
  }, 

    postRender(context) {
    const styleRegex = /<css-render-style>((.|\s)+)<\/css-render-style>/
    const vitepressPathRegex = /<vitepress-path>(.+)<\/vitepress-path>/
    const style = styleRegex.exec(context.content)?.[1]
    const vitepressPath = vitepressPathRegex.exec(context.content)?.[1]
    if (vitepressPath && style) {
      fileAndStyles[vitepressPath] = style
    }
    context.content = context.content.replace(styleRegex, '')
    context.content = context.content.replace(vitepressPathRegex, '')
  },
  transformHtml(code, id) {
    const html = id.split('/').pop()
    if (!html) return
    const style = fileAndStyles[`/${html}`]
    if (style) {
      return code.replace(/<\/head>/, style + '</head>')
    }
  },

  markdown: {
    config: (md) => {
      // md.use(MermaidMarkdown);
      md.use(tabsMarkdownPlugin)
      setupContainers(md);
    }
  },  

  themeConfig: {
    logo: '/logo.png',            // 可选：放 docs/public/logo.png
    nav: [
      { text: '首页', link: '/' },
    ],
    // 需要配置,才有上一章和下一章
    // sidebar: {
    //   // 默认分组（其他路径）
    //   '/': [
    //     {
    //       text: '总览',
    //       items: [
    //         { text: '快速开始', link: '/' },
    //         { text: '世界观', link: '/世界观/index' },
    //         { text: '地图', link: '/地图/index' },
    //         { text: '伙伴', link: '/伙伴/index' },
    //         { text: '武学', link: '/武学/index' },
    //         { text: '技艺', link: '/技艺/index' },
    //         { text: '任务', link: '/任务/index' },
    //         { text: '其他', link: '/其他/index' },
    //       ]
    //     }
    //   ]
    // },

    sidebar: generateSidebarRemoveNumber(),    

    // 顶部搜索（内置本地搜索，开箱即用）
    search: {
      provider: 'local'
    },

    socialLinks: [
      // { icon: 'github', link: 'https://github.com/your/repo' }
    ],

    // 页脚（可选）
    footer: {
      message: '风起江湖 · 资料站',
      copyright: '© 2025'
    }
  }
})
