// .vitepress/generateSidebarRemoveNumber.ts
import { generateSidebar } from 'vitepress-sidebar'

export function generateSidebarRemoveNumber() {
  const gens = generateSidebar({
    documentRootPath: 'docs',
    collapseDepth: 2,
    useTitleFromFileHeading: true,
    includeFolderIndexFile: true,
  })

  // 仅去掉 text 的数字前缀，不动 link
  const stripNumbersInText = (items: any[]) => {
    for (const item of items) {
      if (item.text) item.text = String(item.text).replace(/^\d+\s*[-_ ]\s*|^\d+\s*/, '')
      if (item.items) stripNumbersInText(item.items)
    }
  }

 stripNumbersInText(gens as any[])
 
  return gens
}
