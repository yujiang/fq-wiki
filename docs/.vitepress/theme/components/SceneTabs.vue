<template>
  <div class="scene-tabs-container">
    <!-- 1. 门派标签组 -->
    <div class="scene-tab-group" v-if="sects.length">
      <h3 class="tab-group-title">门派</h3>
      <div class="tab-list">
        <button
          v-for="id in sects"
          :key="id"
          :class="['scene-tab', { active: activeSceneId === id }]"
          @click="handleTabClick(id)"
        >
          {{ getSceneName(id) }}
        </button>
      </div>
    </div>

    <!-- 2. 城市标签组 -->
    <div class="scene-tab-group" v-if="citys.length">
      <h3 class="tab-group-title">城市</h3>
      <div class="tab-list">
        <button
          v-for="id in citys"
          :key="id"
          :class="['scene-tab', { active: activeSceneId === id }]"
          @click="handleTabClick(id)"
        >
          {{ getSceneName(id) }}
        </button>
      </div>
    </div>

    <!-- 3. 野外标签组 -->
    <div class="scene-tab-group" v-if="wilds.length">
      <h3 class="tab-group-title">野外</h3>
      <div class="tab-list">
        <button
          v-for="id in wilds"
          :key="id"
          :class="['scene-tab', { active: activeSceneId === id }]"
          @click="handleTabClick(id)"
        >
          {{ getSceneName(id) }}
        </button>
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
import { defineProps, ref, computed, watchEffect } from "vue";
import { getScenes, Scenes } from "../../data/scene"; // 通过ID获取场景名称
import Scene from "./Scene.vue";

// 接收三个分类的场景ID数组
const props = defineProps<{
  sects: number[]; // 门派场景ID列表（如 [201, 202]）
  citys: number[]; // 城市场景ID列表（如 [101, 102]）
  wilds: number[]; // 野外场景ID列表（如 [301, 302]）
  defaultSceneId?: number; // 默认激活的场景ID
}>();

// 当前激活的场景ID（优先用默认值，否则取第一个有数据的ID）
const activeSceneId = ref<number>(
  props.defaultSceneId ||
  props.sects[0] ||
  props.citys[0] ||
  props.wilds[0] ||
  0
);

// 点击标签切换场景
const handleTabClick = (sceneId: number) => {
  activeSceneId.value = sceneId;
  // 可选：触发父组件更新（如同步路由）
  // emit('scene-change', sceneId);
};


// 通过ID获取场景名称（封装成计算属性，避免重复调用）
const getSceneName = (id: number) => {
  return scenes.value[id]?.Name || `未知场景(${id})`;
};

const scenes = ref<Scenes>({});


async function updateContent(){
    const xlss = await getScenes();
    scenes.value = xlss;
}

watchEffect(updateContent);

</script>

<style scoped>
.scene-tabs-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* 标签组标题 */
.tab-group-title {
  margin: 0 0 12px;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
  padding-left: 8px;
  border-left: 3px solid #3498db;
}

/* 标签组容器（无数据时不显示） */
.scene-tab-group {
  margin-bottom: 20px;
}

/* 标签列表 */
.tab-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 单个标签样式 */
.scene-tab {
  padding: 6px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
  color: #34495e;
  transition: all 0.2s ease;
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

/* 场景内容区 */
.scene-content {
  margin-top: 20px;
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
}

/* 空状态提示 */
.empty-tip {
  margin-top: 20px;
  text-align: center;
  color: #999;
  padding: 40px 0;
}
</style>