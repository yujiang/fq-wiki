<!-- CollectTabs.vue 
 复用SceneCollect.vue，
 场景scene下的所有collect的类型分组 
示例：<CollectTabs :sceneId="1023" />
 -->

<template>
  <div class="collect-tabs">
    <!-- 加载态 -->
    <div class="loading" v-if="isLoading">加载中...</div>

    <!-- 有数据 -->
    <div v-else-if="totalCount > 0">
      <!-- Tabs（显示数量 & 空分类置灰） -->
      <div class="tabs">
        <button
          v-for="(type, i) in typeNames"
          :key="type"
          :class="['tab', { active: i === active }]"
          @click="active = i"
          :disabled="counts[type] === 0"
          :title="counts[type] === 0 ? '空' : ''"
        >
          {{ tabs[i] }} ({{ counts[type] ?? 0 }})
        </button>
      </div>

      <!-- Active Tab Content -->
      <div class="panel" v-if="current">
        <SceneCollect
          :sceneId="props.sceneId"
          :collectType="current"
          :key="current"
        />
      </div>
    </div>

    <!-- 无任何数据 -->
    <div v-else class="no-data">无</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
// 按你的实际路径修改：
import SceneCollect from './SceneCollect.vue'
// import { getCollectCounts } from '../../../data/collect' 
import { CollectsType, getCollectsTypeByScene, XlsCollect } from "../../../data/collect";
// 期望 getCollectCounts(sceneId) => Promise<{ collect: number; box: number; say: number }>

const props = defineProps<{ sceneId: number }>()

// tabs 配置
const tabs = ['采集', '宝箱', '探索'] as const
const typeNames = ['collect', 'box', 'say'] as const
type CollectType = typeof typeNames[number]

// 激活 tab
const active = ref(0)

// 计数 & 加载
const counts = ref<Record<CollectType, number>>({
  collect: 0,
  box: 0,
  say: 0,
})
const isLoading = ref(true)

// 总数
const totalCount = computed(
  () => (counts.value.collect || 0) + (counts.value.box || 0) + (counts.value.say || 0)
)

// 当前类型
const current = computed<CollectType | ''>(() => typeNames[active.value] ?? '')

// 防并发：请求 token
let reqToken = 0

async function refreshCounts(sceneId: number) {
  const token = ++reqToken
  isLoading.value = true
  try {
    const datas = {
      collect: 0,
      box:  0,
      say:  0,
    }
    for (const key of ['box' , 'collect' , 'say']){
      const data = await getCollectsTypeByScene(key as CollectsType, sceneId)
      // if (token !== reqToken) return
      datas[key as CollectType] = data ? data.length : 0
    }
    counts.value = datas;

    // 如果当前激活为空，则跳到第一个非空分类
    active.value = 0;
    const curType = typeNames[active.value]
    if ((counts.value[curType] ?? 0) === 0) {
      const idx = typeNames.findIndex(t => (counts.value[t] ?? 0) > 0)
      if (idx !== -1) active.value = idx
    }
  } catch (e) {
    console.error('获取收集计数失败:', e)
    counts.value = { collect: 0, box: 0, say: 0 }
  } finally {
    if (token === reqToken) isLoading.value = false
  }
}

onMounted(() => refreshCounts(props.sceneId))
watch(() => props.sceneId, (id) => refreshCounts(id))
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
.tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.tab.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand-1);
}
.panel {
  padding: 4px 0;
}
.loading,
.no-data {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
</style>
