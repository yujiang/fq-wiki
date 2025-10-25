import { withMermaid } from 'vitepress-plugin-mermaid'
import { setupContainers } from './jianghu';
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
      noExternal: ['mermaid', 'naive-ui', 'date-fns', 'vueuc'],
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
