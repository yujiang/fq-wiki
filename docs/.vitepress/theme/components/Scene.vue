<template>
  <div class="scene-page">
    <!-- 场景头部：标题+小地图 -->
    <div class="scene-header">
      <div class="header-content">
        <h1 class="scene-title">{{ xls?.Name || '未知场景' }}</h1>
        <p class="scene-desc">{{ xls?.Desc || '暂无场景描述' }}</p>
      </div>
      <!-- 小地图 -->
      <div class="mini-map">
        <img 
          :src="urlSmap" 
          :alt="`${xls?.Name}小地图`" 
          class="map-img"
          loading="lazy"
        >
        <p class="map-tip">点击查看全屏地图</p>
      </div>
    </div>

    <!-- 传送点 -->
    <div class="scene-section" id="teleports">
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
    <div class="scene-section" id="collects">
      <h2 class="section-title">采集点</h2>
      <div class="section-content">
        <SceneCollect :sceneId="props.sceneId" />
      </div>
    </div>

    <!-- 商店信息 -->
    <div class="scene-section" id="shops">
      <h2 class="section-title">商店信息</h2>
      <div class="section-content">
        <ShopTabs :name="xls?.ShopName || 'shop_xinshoucun'" />
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
import { getScene, getSceneSmap, XlsScene } from "../../data/scene"; // 场景数据接口
import SceneTele from "./SceneTele.vue";
import SceneNpc from "./SceneNpc.vue";
import SceneCollect from "./SceneCollect.vue";
import SceneTask from "./SceneTask.vue";
import ShopTabs from "./ShopTabs.vue";

// 接收场景ID（核心参数）
const props = defineProps<{
  sceneId: number; // 场景唯一标识（如杏花村=101）
}>();

// 场景完整数据
const xls = ref< XlsScene | null>(null);
const urlSmap = ref('');

async function updateContent(){
  const data = await getScene(props.sceneId);
  xls.value = data;
  const smap = getSceneSmap(data);
  urlSmap.value = smap;
}
// 加载场景数据

watchEffect(updateContent);

</script>

<style scoped>
.scene-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
  min-width: 300px;
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
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.map-img:hover {
  transform: scale(1.05);
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
  padding: 20px;
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