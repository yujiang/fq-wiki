<template>
  <div class="scene-tabs-container">
    <!-- 动态渲染所有分类标签组 -->
    <div class="scene-area-tabs-wrapper">
      <div
        class="section-label"
      >
        🗺️ 选择<span class="area_name">[{{getAreaName}}]</span>的地图
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
  sceneAreas: number;
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

const getAreaName = computed<string>(() => {
  const xls = scenesData.value[props.sceneAreas];
  return xls?.Name || `${props.sceneAreas}`;  // fallback 名称
});

const isDev = import.meta.env.DEV;

// 通过ID获取场景名称
const getSceneName = (id: number) => {
  if (isDev) {
    return `${sceneNameMap.value[id] || '未知场景'}(${id})`;  
  }
  return sceneNameMap.value[id] || `未知场景(${id})`;
};
</script>

<style scoped>
.scene-tabs-container {
  max-width: 1400px;
  padding: 0 8px;
}

/* 外层卡片感 */
.scene-area-tabs-wrapper {
  border: 1px solid #e5e8ec;
  border-radius: 10px;
  background: #fff;
  padding: 16px 18px 0px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;
}
.scene-area-tabs-wrapper:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

/* 区块标题条 */
.section-label {
  display: block;                      /* ✅ 变成整行块 */
  width: 100%;                         /* 铺满容器宽度 */
  font-weight: 600;
  font-size: 1.05rem;
  color: #2c3e50;
  margin: -6px -18px 16px -18px;       /* 拉通边距，贴合外层卡片边界 */
  padding: 10px 20px;
  background: linear-gradient(to right, #f3f8ff, #ffffff);
  border-bottom: 1px solid #dce6f2;    /* 增加下边界线 */
  border-radius: 8px 8px 0 0;          /* 上边圆角，下边直角，像标题栏 */
  box-shadow: inset 0 -1px 3px rgba(0,0,0,0.03);
  border-left: 5px solid #0078d4;      /* 左侧强调色条 */
}


/* 分类标题 */
.tab-group-title {
  font-size: 17px;
  color: #34495e;
  font-weight: 600;
  padding-left: 8px;
  border-left: 3px solid #3498db;
  letter-spacing: 0.5px;
  margin: 0 0 4px 0;

}

/* 分类标签组：减小组之间的上下间距 */
.scene-tab-group {
  padding: 8px 0; /* 原0px，增加内边距避免内容贴边，同时控制整体高度 */
  margin: 0;
}

/* 按钮容器 */
.tab-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 单个按钮 */
.scene-tab {
  min-width: 84px;
  padding: 2px 14px;
  background: #f8fafc;
  border: 1px solid #dfe3e8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #34495e;
  transition: all 0.2s ease;
  text-align: center;
}

.scene-tab:hover:not(.active) {
  border-color: #3498db;
  background: #ecf5ff;
  color: #0366d6;
}

.scene-tab.active {
  background: #3498db;
  border-color: #3498db;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

/* 内容区分隔 */
.scene-content {
  margin-top: 24px;
  border-top: 1px dashed #dcdfe6;
  padding-top: 20px;
}

.empty-tip {
  margin-top: 20px;
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 14px;
  background: #f9f9f9;
  border-radius: 8px;
}

/* 与上个模块的衔接感 */
.scene-tabs-container + .scene-tabs-container {
  margin-top: 32px; /* 两块之间留空 */
}

.area_name{
  font-weight: 700;
  color: red;
}

@media (max-width: 768px) {
  .scene-tab {
    flex: 1 1 45%;
    min-width: 0;
  }
}

</style>