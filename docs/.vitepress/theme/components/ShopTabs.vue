<template>
  <div class="shop-tabs">
    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="(sid, i) in ids"
        :key="sid"
        :class="['tab', { active: i === active }]"
        @click="active = i"
      >
        {{ shopMap[sid]?.name ?? sid }}
      </button>
    </div>
 
    <!-- Active Tab Content -->
    <div class="panel" v-if="current">
      <ShopCard :shopId="current.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { shops as shopMap } from '../../data/shops'
import ShopCard from './ShopCard.vue'

const props = defineProps<{ ids: number[] }>()

// Active tab index
const active = ref(0)

// Computed to get the current shop data based on active tab index
const current = computed(() => {
  const id = props.ids[active.value]
  return shopMap[id]
})
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
  background: #f0f0f0; /* 设置背景色 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  /* 添加阴影 */  
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
