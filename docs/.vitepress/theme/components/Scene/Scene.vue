<!-- Scene.vue 场景
 示例：<Scene :sceneId="1023"/>
 -->

<template>
  <div class="scene-page">
    <!-- 场景头部：标题+小地图 -->
    <div class="scene-header">
      <div class="header-content">
        <h1 class="scene-title">{{ (xls?.Name || "未知场景") + (isDev?`(${xls?.Id})`:'') }}</h1>
        <p class="scene-desc">{{ xls?.Desc || "暂无场景描述" }}</p>
      </div>
      <!-- 小地图 -->
      <a class="mini-map" v-if="urlSmap" :href="urlSmap" target="_blank">
        <img
          :src="urlSmap"
          :alt="`${xls?.Name}小地图`"
          class="map-img"
          loading="lazy"
        />
      </a>
    </div>

    <!-- 传送点 -->
    <div class="scene-section" id="teleports" v-if="!indoor">
      <h2 class="section-title">传送点</h2>
      <div class="section-content">
        <SceneTele :sceneId="props.sceneId" />
      </div>
    </div>

    <!-- 主要人物 -->
    <div class="scene-section" id="npcs">
      <h2 class="section-title">主要人物</h2>
      <div class="section-content">
        <SceneNpc :sceneId="props.sceneId" />
      </div>
    </div>

    <!-- 采集点 -->
    <div class="scene-section" id="collects" v-if="!indoor">
      <h2 class="section-title">采集点</h2>
      <div class="section-content">
        <CollectTabs :sceneId="props.sceneId" />
      </div>
    </div>

    <!-- 商店信息 -->
    <div class="scene-section" id="shops" v-if="!indoor && xls?.Shop">
      <h2 class="section-title">商店信息</h2>
      <div class="section-content">
        <ShopTabs :name="xls?.Shop" />
      </div>
    </div>

    <!-- 任务信息 -->
    <div class="scene-section" id="tasks">
      <h2 class="section-title">支线任务</h2>
      <div class="section-content">
        <SceneTask :sceneId="props.sceneId" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watchEffect } from "vue";
import {
  getScene,
  getSceneSmap,
  XlsScene,
  isIndoor,
} from "../../../data/scene"; // 场景数据接口
import SceneTele from "./SceneTele.vue";
import SceneNpc from "./SceneNpc.vue";
import CollectTabs from "./CollectTabs.vue";
import SceneTask from "./SceneTask.vue";
import ShopTabs from "../shop/ShopTabs.vue";

// 接收场景ID（核心参数）
const props = defineProps<{
  sceneId: number; // 场景唯一标识（如杏花村=101）
}>();

// 场景完整数据
const xls = ref<XlsScene | null>(null);
const urlSmap = ref("");
const indoor = ref(false);

async function updateContent() {
  const data = await getScene(props.sceneId);
  xls.value = data;
  const url = getSceneSmap(data);
  urlSmap.value = url;
  indoor.value = data ? isIndoor(data.Type) : false;
}
// 加载场景数据

watchEffect(updateContent);

const isDev = import.meta.env.DEV;

</script>

<style scoped>
.scene-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px;
}

/* 头部：标题+小地图 */
.scene-header {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 32px;
  align-items: center;
}

.header-content {
  flex: 1;
  min-width: 200px;
}

.scene-title {
  margin: 0 0 12px;
  font-size: 28px;
  color: #2c3e50;
}

.scene-desc {
  margin: 0;
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

.mini-map {
  width: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex; /* 居中图像 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  background: #f5f7fa; /* 留白底色（letterbox）*/
}

.map-img {
  width: 100%;
  object-fit: contain; /* 关键：显示完整原图（等比）*/
  object-position: center; /* 居中摆放 */
  display: block;
}

.map-img:hover {
  transform: none; /* contain 模式下建议去掉放大，否则会被裁 */
}

.map-tip {
  margin: 8px 0 0;
  text-align: center;
  font-size: 14px;
  color: #3498db;
  cursor: pointer;
}

/* 通用区块样式 */
.scene-section {
  margin-bottom: 40px;
  padding: 0px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #3498db;
  font-size: 20px;
  color: #2c3e50;
}

.section-content {
  color: #333;
}

/* 地理连接列表 */
.connection-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.connection-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.connection-link:hover {
  text-decoration: underline;
}

.connection-type {
  color: #7f8c8d;
  font-size: 14px;
}

/* NPC网格布局 */
.npc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .scene-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .mini-map {
    width: 100%;
    height: 200px;
  }

  .npc-grid {
    grid-template-columns: 1fr;
  }
}
</style>
