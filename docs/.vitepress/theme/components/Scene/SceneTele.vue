<template>
  <div class="collect-tabs">
    <!-- 动态生成 tabs（只显示数量 > 0 的） -->
    <div class="tabs" v-if="filteredTabs.length > 0">
      <button v-for="(item, i) in filteredTabs" :key="`${i}-${item.type}`" :class="['tab', { active: i === active }]"
        @click="active = i">
        {{ item.type }} ({{ item.cs?.length }}) <!-- 显示数量 -->
      </button>
    </div>

    <!-- 当没有可用 tab 时显示提示 -->
    <div class="empty" v-else>
      暂无传送点数据
    </div>

    <!-- 显示当前激活 tab 的内容 -->
    <div class="panel" v-if="currentTab">
      <TeleList :teles="filteredTabs[active].cs" :hideType="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import TeleList from './TeleList.vue';
import { getTelesTypeByScene, XlsTeleport } from '../../../data/tele';
import { SceneTypeString } from '../../../data/scene';

// 定义传送点类型接口（包含类型名称和数量）
interface TabItem {
  type: SceneTypeString;
  cs: XlsTeleport[];
  // count: number;
}

// 接收父组件传入的场景ID
const props = defineProps<{ sceneId: number }>()

// 原始 tabs 配置（包含所有可能的类型，可根据实际需求扩展）
const allTabs: TabItem[] = [
  { type: '室内', cs: [] },
  { type: '野外', cs: [] },
  { type: '城市', cs: [] },
]

// 过滤后的 tabs（只保留数量 > 0 的）
const filteredTabs = ref<TabItem[]>([])

// 当前激活的 tab 索引
const active = ref(0)

// 当前激活的 tab 信息
const currentTab = computed(() => {
  return filteredTabs.value[active.value]
})

// 获取每个类型的数量（实际项目中替换为接口请求）
const fetchTeleCount = async () => {
  // 模拟接口请求：根据 sceneId 获取每个类型的数量
  // 实际使用时替换为真实接口，例如：

  for (const tab of allTabs) {
    const cs = (await getTelesTypeByScene(tab.type, props.sceneId)) || [];
    tab.cs = cs;

  }
  // 更新数量
  const a = allTabs.filter(tab => tab.cs?.length > 0) // 过滤数量为0的tab
  console.log("fetchTeleCount", props.sceneId, a);

  // 重置激活索引（避免过滤后索引越界）
  if (a.length > 0 && active.value >= a.length) {
    active.value = 0
  }
  filteredTabs.value = a
}

// 初始化时获取数据
onMounted(() => {
  fetchTeleCount()
})

watchEffect(fetchTeleCount);

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
  transition: all 0.2s ease;
}

.tab.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand-1);
}

.panel {
  padding: 4px 0;
  animation: fadeIn 0.3s ease;
}

.empty {
  padding: 16px;
  color: #999;
  text-align: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>