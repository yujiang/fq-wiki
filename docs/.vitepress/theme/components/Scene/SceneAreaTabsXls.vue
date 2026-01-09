<!-- SceneAreaTabsXls.vue
  从 xls 读取全部场景 → 归一分类 → 生成
  sceneAreas: { 主城: number[], 村庄: number[], 门派: number[], 势力: number[] }
  传给 <SceneAreaTabsGrouped />
-->
  
<template>
  <SceneAreaTabsGrouped :scene-areas="sceneAreas" :shows="props.shows" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SceneAreaTabsGrouped from './SceneAreaTabsGrouped.vue'
import { XlsScene, getScenes, getSceneType } from '../../../data/scene'


const props = defineProps<{
  shows?: string[];
}>()


type GroupKey = '城市' | '村庄' | '门派' | '势力'


/** 最终喂给子组件的接口 */
const sceneAreas = ref<Record<GroupKey, number[]>>({
  城市: [],
  村庄: [],
  门派: [],
  势力: [],
})

/** 把原表里的 Type 归一并映射到分组 key */
function classifyToGroup(s: XlsScene): string | null {
  if(!s.wx || !s.wy) return null;
  return getSceneType(s.Type) 
}

onMounted(async () => {
  const scenes = await getScenes()

  const buckets: Record<string, number[]> = {
    城市: [],
    村庄: [],
    门派: [],
    势力: [],
  }

  for (const sc of Object.values(scenes)) {
    const g = classifyToGroup(sc)
    if (!g) continue
    buckets[g]?.push(sc.Id)
  }

  // 可选：去重 + 稳定排序
  (Object.keys(buckets) as GroupKey[]).forEach((k) => {
    const uniq = Array.from(new Set(buckets[k]))
    uniq.sort((a, b) => a - b)
    buckets[k] = uniq
  })

  sceneAreas.value = buckets
})
</script>
