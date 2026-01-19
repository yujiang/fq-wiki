# AGENTS.md - Coding Guidelines for fq-wiki

This guide provides essential information for agentic coding agents working on this VitePress-based documentation site for a Chinese martial arts game.

## 作者的说明

1. 你是一位武侠小说家，兼有金庸的文笔和金庸的武学功底，擅长用武侠小说的形式来描述游戏中的角色和故事。但是角色对话有古龙的风格，口语化又比较风趣。
2. 世界观在 docs/00-世界观
3. 写作的成果放在 docs/09-剧情/对应的AI下，以便我相互比较AI的效果
4. 用中文交互

## Build Commands

```bash
# Development
npm run dev              # Start VitePress dev server (localhost:5173)
npm run host             # Start dev server with network access (port 5173)

# Build & Preview
npm run build            # Build static site to docs/.vitepress/dist
npm run preview          # Preview production build

# Dependency Management
pnpm i                  # Install dependencies (preferred over npm)
```

**Note:** No test framework is currently configured. When adding tests, follow the Vue 3 testing patterns and set up Vitest or similar.

## Project Structure

```
docs/
├── .vitepress/
│   ├── theme/          # Vue components and theme customization
│   │   ├── components/  # Reusable UI components
│   │   └── index.ts     # Theme entry point
│   ├── data/           # TypeScript data access layers
│   ├── Utils/          # Utility functions
│   └── sidebar.ts      # Sidebar generation
├── public/json/        # Game data JSON files (*_xls.json)
└── *.md               # Markdown content pages
```

## Code Style Guidelines

### TypeScript

```typescript
// Use type imports for better tree-shaking
import type { Ref } from 'vue'
import { ref } from 'vue'

// Define interfaces without "I" prefix
export interface XlsTask extends XlsBase {
  Id: number
  Name: string
  Desc: string
  NextTask?: number
}

// Use camelCase for functions and variables
export async function getTask(id: number): Promise<XlsTask | undefined> {
  const tasks = await getTasks()
  return tasks[id]
}

// Use PascalCase for type definitions
export type Tasks = Record<number, XlsTask>
```

### Vue Components (Composition API)

```vue
<script setup lang="ts">
// Use script setup with TypeScript
import { ref, computed, onMounted, watch } from 'vue'
import type { XlsItem } from '../../data/item'

// Define props with TypeScript interface
const props = defineProps<{ id: number, count?: number }>()

// Use ref for reactive state
const item = ref<XlsItem | null>(null)

// Use computed for derived values
const itemCount = computed(() => props.count || 1)

// Use onMounted for initialization
onMounted(async () => {
  item.value = await getItemById(props.id)
})

// Use watch for prop changes
watch(() => props.id, (newId) => {
  updateItem(newId)
})
</script>

<!-- Use descriptive class names with kebab-case -->
<template>
  <div class="task-card">
    <div class="task-card__header">{{ item?.Name }}</div>
  </div>
</template>

<style scoped>
/* Use BEM-like naming: block__element--modifier */
.task-card {
  padding: 20px;
}
.task-card__header {
  font-size: 18px;
}
</style>
```

### Imports & Exports

```typescript
// Third-party imports first
import { createClient } from '@supabase/supabase-js'
import { defineComponent } from 'vue'

// Then relative imports
import { XlsBase, fetchXls } from './xls'
import { getNpc } from './npc'

// Default exports for main theme file
export default {
  enhanceApp({ app }) {
    app.use(ElementPlus)
  }
}

// Named exports for utilities
export async function getTasks(): Promise<Tasks> {
  // ...
}
```

### Naming Conventions

- **Files**: `TaskCard.vue` (PascalCase for components), `task.ts` (camelCase for data/utils)
- **Components**: `<TaskCard />`, `<SkillList />` (PascalCase, descriptive)
- **Functions**: `getTask()`, `updateCurrentItem()`, `getScenePosition()` (camelCase, action-oriented)
- **Variables**: `item.value`, `taskSteps.value` (camelCase)
- **Constants**: `DIGITS`, `fLevelDesc` (UPPER_SNAKE_CASE)
- **Interfaces/Types**: `XlsTask`, `XlsNpc`, `Tasks`, `Npcs` (PascalCase, no "I" prefix)

### Data Access Pattern

```typescript
// Cache-first pattern with async/await
let tasks: Tasks | undefined

export async function getTasks(): Promise<Tasks> {
  if (!tasks) {
    tasks = await fetchXls('task') as Tasks
  }
  return tasks
}

export async function getTask(id: number): Promise<XlsTask | undefined> {
  return (await getTasks())[id]
}
```

### Error Handling

```typescript
// Use try/catch for async operations
async function loadXls(name: string): Promise<Bases> {
  try {
    const res = await fetch(`/json/${name}_xls.json`)
    if (!res.ok) {
      throw new Error(`fetchXls failed: ${res.status}`)
    }
    return await res.json() as Bases
  } catch (e) {
    console.error(`fetchXls exception: ${name}`, e)
    throw e
  }
}

// Use console.warn for expected failures
if (!url && import.meta.env.DEV) {
  console.warn('[Discuss] Missing Supabase configuration')
}
```

### Environment Checks

```typescript
// Use import.meta.env for environment checks
const isDev = import.meta.env.DEV
if (isDev) {
  console.log('Development mode:', task?.Id)
}

// SSR guard
if (typeof window === 'undefined') {
  return // Skip browser-only code
}
```

### Component Registration

All global components are registered in `docs/.vitepress/theme/gameComponents.ts`. Add new components there following the pattern:

```typescript
import NewComponent from './components/NewComponent.vue'

export function registerGameComponents(app: any) {
  app.component('NewComponent', NewComponent)
}
```

### Comments

- Use Chinese comments for business logic explanations
- Keep comments concise and focused on "why" not "what"
- Add descriptive comments for complex data transformations

```typescript
// 获得场景下的所有支线任务
export async function getSceneBranchTasks(scene: number): Promise<XlsTask[]> {
  // ...
}
```

## Styling Conventions

- Use scoped styles in Vue components
- Use BEM-like naming: `.block__element--modifier`
- Use kebab-case for CSS classes
- Prefer inline styles only for dynamic values

## File Organization

- **Components**: Group by feature (task/, scene/, shop/, etc.)
- **Data**: Each data type has its own file (task.ts, npc.ts, item.ts)
- **Utils**: Shared utilities in `docs/.vitepress/Utils/`
- **Theme**: Global theme setup in `docs/.vitepress/theme/index.ts`

## Additional Notes

- This is a Chinese martial arts (jianghu) game documentation site
- Most content is in Chinese, maintain language consistency
- Game data is loaded from JSON files in `docs/public/json/`
- VitePress uses markdown files in `docs/` directory
- The sidebar is auto-generated from markdown files using `vitepress-sidebar`
