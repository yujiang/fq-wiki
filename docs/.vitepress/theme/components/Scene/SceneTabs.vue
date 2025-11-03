<template>
  <div class="scene-tabs-container">
    <!-- 动态渲染所有分类标签组 -->
    <div class="scene-area-tabs-wrapper">
      <div
        class="section-label"
      >
        🗺️ 选择地图
      </div>
    <div 
      class="scene-tab-group" 
      v-for="(sceneIds, categoryName, index) in props.scenes" 
      :key="categoryName"
    >
      <h3 class="tab-group-title">{{ categoryName }}</h3>
      <div class="tab-list">
        <button
          v-for="id in sceneIds"
          :key="id"
          :class="['scene-tab', { active: activeSceneId === id }]"
          @click="handleTabClick(id)"
        >
          {{ getSceneName(id) }}
        </button>
      </div>
    </div>
    </div>

    <!-- 选中场景的详情页 -->
    <div class="scene-content" v-if="activeSceneId">
      <Scene :sceneId="activeSceneId" />
    </div>
    <div class="empty-tip" v-else>请选择一个场景查看详情</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted, defineEmits } from "vue";
import { getScenes, type Scenes, type XlsScene } from "../../../data/scene";
import Scene from "./Scene.vue";

// 接收参数：分类场景映射（键为分类名，值为场景ID数组）+ 默认选中ID
const props = defineProps<{
  scenes: Record<string, number[]>; // 灵活的分类场景，如 { "门派": [201,202], "城市": [101,102] }
  defaultSceneId?: number; // 默认激活的场景ID
}>();

// 事件：通知父组件场景切换
const emit = defineEmits<{
  (e: "scene-change", sceneId: number): void;
}>();

// 当前激活的场景ID（优先默认值，否则取第一个有数据的分类中的第一个场景）
const activeSceneId = ref<number | undefined>(
  props.defaultSceneId || getFirstValidSceneId()
);

// 获取第一个有效场景ID（用于默认选中）
function getFirstValidSceneId() {
  const categoryNames = Object.keys(props.scenes);
  for (const name of categoryNames) {
    if (props.scenes[name].length > 0) {
      return props.scenes[name][0];
    }
  }
  return undefined;
}

// 点击标签切换场景
const handleTabClick = (sceneId: number) => {
  activeSceneId.value = sceneId;
  emit("scene-change", sceneId); // 通知父组件
};

// 场景数据缓存
const scenesData = ref<Scenes>({});

// 加载场景数据
async function loadScenes() {
  try {
    scenesData.value = await getScenes();
  } catch (err) {
    console.error("加载场景数据失败：", err);
  }
}

// 初始化时加载数据
onMounted(loadScenes);

// 缓存场景名称映射（优化性能）
const sceneNameMap = computed<Record<number, string>>(() => {
  return Object.entries(scenesData.value).reduce((map, [id, item]) => {
    const sceneId = Number(id);
    map[sceneId] = item.Name || `未知场景(${sceneId})`;
    return map;
  }, {} as Record<number, string>);
});

// 通过ID获取场景名称
const getSceneName = (id: number) => {
  return sceneNameMap.value[id] || `未知场景(${id})`;
};
</script>

<style scoped>
/* 样式保持不变，省略重复代码 */
.scene-tabs-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0px;
}

.tab-group-title {
  margin: 0 0 12px;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
  padding-left: 8px;
  border-left: 3px solid #3498db;
}

.scene-tab-group {
  margin-bottom: 20px;
}

.tab-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.scene-tab {
  padding: 0;
  min-width: 80px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
  color: #34495e;
  transition: all 0.2s ease;
  text-align: center;
}

.scene-tab:hover:not(.active) {
  border-color: #3498db;
  color: #3498db;
  background: #f1f7fd;
}

.scene-tab.active {
  background: #3498db;
  border-color: #3498db;
  color: #fff;
}

.scene-content {
  margin-top: 20px;
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
}

.empty-tip {
  margin-top: 20px;
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.scene-area-tabs-wrapper {
  border: 2px solid #ccc;
  border-radius: 10px;
  background: #fafafa;
  padding: 12px 14px 0px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.section-label {
  font-weight: bold;
  font-size: 1.05rem;
  color: #555;
  margin: 4px 0 6px;
  border-left: 4px solid #0078d4;
  padding-left: 8px;
  background: #f3f3f3;
  border-radius: 4px;
}

</style>