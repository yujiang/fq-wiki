// .vitepress/generateSidebarRemoveNumber.ts
import { generateSidebar } from 'vitepress-sidebar'
import fs from 'node:fs'
import path from 'node:path'

const GENERATED_FILE = path.resolve(__dirname, './sidebar.generated.ts')

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

export function writeSidebarFile(): boolean {
  const data = generateSidebarRemoveNumber()
  const next = 'export default ' + JSON.stringify(data, null, 2) + '\n'
  const prev = fs.existsSync(GENERATED_FILE) ? fs.readFileSync(GENERATED_FILE, 'utf8') : ''
  if ((prev) === (next)) {
    // 内容没变，不写盘 → 不触发重启/HMR
    return false
  }
  fs.writeFileSync(GENERATED_FILE, next, 'utf8')
  return true
}


/** 单进程方案：导出一个 Vite 插件，交给 VitePress 使用 */
export function SidebarAutoPlugin() {
  let timer: NodeJS.Timeout | null = null
  let pending = false

  const regen = (server?: any) => {
    if (pending) return
    pending = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      writeSidebarFile()
      pending = false
      // dev 模式触发全量刷新，立刻更新侧栏
      server?.ws?.send?.({ type: 'full-reload' })
    }, 60)
  }

  return {
    name: 'sidebar-auto-generate',
    apply: 'serve', // 只在 dev 生效；build 用 buildStart 再生成一次
    configureServer(server: any) {
      // 启动时先生成一次，避免首次为空
      regen(server)
      const onMdChange = (op: string, p: string) => { 
        if (p.endsWith('.md')) {
          console.log('onChangeMd:',op, p);
          regen(server) 
        }
      }
  server.watcher.on('add', (path: string) => onMdChange('add', path))
  server.watcher.on('unlink', (path: string) => onMdChange('unlink', path))
  server.watcher.on('change', (path: string) => onMdChange('change', path))
    },
    // 打包时也写一份，确保 build 产物正确
    buildStart() {
      console.log('SidebarAutoPlugin buildStart: generating sidebar...')
      writeSidebarFile()
    }
  }
}

// writeSidebarFile();
