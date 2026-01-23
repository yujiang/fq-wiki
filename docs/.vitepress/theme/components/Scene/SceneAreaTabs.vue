<!-- SceneAreaTabs.vue 场景， 用tabs wrap SceneArea.vue
 <SceneAreaTabs :sceneAreas="[1023,1003,1004]"/>
 -->

<template>
  <div class="scene-area-tabs-container">
    <!-- 区域切换标签栏 -->
    <div class="scene-area-tabs-wrapper">
      <div class="area-tab-bar">
        <button v-for="areaId in realSceneAreas" :key="areaId" :class="['area-tab', { active: areaId === activeAreaId }]"
          @click="activeAreaId = areaId">
          {{ getAreaName(areaId) }}
        </button>
      </div>
    </div>

    <!-- 对应的 SceneArea 视图 -->
    <SceneArea :key="activeAreaId" v-if="activeAreaId !== null" :sceneArea="activeAreaId" :shows="props.shows" class="area-content" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import SceneArea from './SceneArea.vue'
import { getScenes, Scenes, XlsScene } from '../../../data/scene';
import { getSettingValue } from '../../../data/setting';

// 接收父组件传入的区域 ID 列表
const props = defineProps<{
  sceneAreas: number[]|string;
  shows?: string[];
}>()

const realSceneAreas = ref<number[]>([]);

// 当前激活的区域
const activeAreaId = ref<number | null>(null)

const scenesNames = ref<Scenes>({})
// 初始化默认区域
onMounted(async () => {
  const v = props.sceneAreas;
  const names = typeof v === 'string' ? (await getSettingValue(v)) : v;
  const scenes = await getScenes();
  scenesNames.value = scenes;
  realSceneAreas.value = names;
  // 如果父组件没有传入 sceneAreas，则默认选择第一个区域
  if (names.length > 0) {
    activeAreaId.value = names[0]
  }
})

// 如果父组件更新 sceneAreas，重置当前区域
watch(
  () => props.sceneAreas,
  async (newVal) => {
    const v = props.sceneAreas;
    const names = typeof v === 'string' ? (await getSettingValue(v)) : v;
    realSceneAreas.value = names;
    if (names.length > 0 && !names.includes(activeAreaId.value!)) {
      activeAreaId.value = names[0]
    }
  },
  { deep: true }
)

// 可选：根据区域 ID 返回显示名
function getAreaName(id: number) {
  const xls = scenesNames.value[id];
  return xls?.Name || `区域 ${id}`  // fallback 名称
}
</script>

<style scoped>
.scene-area-tabs-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.area-tab-bar {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #ccc;
  flex-wrap: wrap;
}

.area-tab {
  padding: 6px 12px;
  border: 1px solid #999;
  border-radius: 6px;
  background: #f4f4f4;
  cursor: pointer;
  transition: 0.2s;
}

.area-tab:hover {
  background: #e8e8e8;
}

.area-tab.active {
  background: #0078d4;
  color: white;
  border-color: #0078d4;
}

.area-content {
  padding: 0px;
}

.scene-area-tabs-wrapper {
  border: 2px solid #ccc;
  border-radius: 10px;
  background: #fafafa;
  padding: 12px 14px 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}
</style>
