
<!-- 场景scene下的所有传送点 -->

<template>
  <div class="tele-tabs">
     <!-- Tabs -->
    <!-- Active Tab Content -->
    <div class="panel">
      <TeleList :sceneId="sceneId" :teleType="''" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TeleList from './TeleList.vue';
// 按需引入你的组件路径
// import SceneCollect from './SceneCollect.vue'

const props = defineProps<{ sceneId: number }>()

// 当前激活的 tab 下标
const active = ref(0)

const tabs = ['室内', '野外']

// 根据 active 计算当前类型
const current = computed(() => tabs[active.value] ?? '')
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
  background: #f0f0f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.tab {
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
}
.tab.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand-1);
}
.panel {
  padding: 4px 0;
}
</style>
