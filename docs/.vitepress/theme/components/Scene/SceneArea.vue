<!-- SceneArea.vue 区域，
 复用SceneTabs.vue 
 包含一系列SceneTabs.vue
 <SceneArea :sceneArea="1023"/>
 -->

<template>
  <div class="scene-area-container">
    <!-- 数据有了才创建 SceneTabs -->
    <SceneTabs
      v-if="hasScenes"
      :scenes="classifiedScenes"
      :sceneAreas="props.sceneArea"
      :defaultSceneId="defaultSceneId ?? undefined"
    />
    <div v-else class="loading">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import SceneTabs from './SceneTabs.vue'
import { getScenesArea, isSceneTypeArea, XlsScene } from '../../../data/scene'

const props = defineProps<{ sceneArea: number }>()

// 原始场景列表
const sceneList = ref<XlsScene[]>([])

async function loadScenes(area: number) {
  try {
    const response = await getScenesArea(area)
    console.log('加载场景区域：', area, response);
    sceneList.value = response || []
  } catch (err) {
    console.error('获取场景区域列表失败：', err)
    sceneList.value = []
  }
}

// 首次加载
onMounted(() => loadScenes(props.sceneArea))

// 监听父组件 sceneArea 改变时重新加载
watch(
  () => props.sceneArea,
  (newVal, oldVal) => {
    if (newVal !== oldVal) loadScenes(newVal)
  }
)

const CATEGORY_KEYS = ['城市', '野外', '山洞', '室内'] as const
type Category = typeof CATEGORY_KEYS[number]

// 分类计算
const classifiedScenes = computed<Record<Category, number[]>>(() => {
  const categories: Record<Category, number[]> = {
    城市: [],
    野外: [],
    山洞: [],
    室内: []
  }
  for (const category of CATEGORY_KEYS) {
    categories[category] = sceneList.value
      .filter(xls => isSceneTypeArea(xls.Type, category))
      .map(xls => xls.Id)
  }
  return categories
})

// 有至少一个非空分类 → 才创建 SceneTabs
const hasScenes = computed(() => {
  return CATEGORY_KEYS.some(cat => classifiedScenes.value[cat].length > 0)
})

// 默认场景ID
const defaultSceneId = computed<number | undefined>(() => {
  for (const cat of CATEGORY_KEYS) {
    const list = classifiedScenes.value[cat]
    if (list.length > 0) return list[0]
  }
  return undefined
})
</script>

<style scoped>
.loading {
  text-align: center;
  color: #999;
  padding: 1em;
}
</style>
