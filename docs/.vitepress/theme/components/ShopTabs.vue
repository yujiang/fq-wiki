<template>
  <div class="shop-tabs">
    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="(sid, i) in localIds"
        :key="sid"
        :class="['tab', { active: i === active }]"
        @click="active = i"
      >
        {{ shopMap[sid]?.Name ?? sid }}
      </button>
    </div>
 
    <!-- Active Tab Content -->
    <div class="panel" v-if="current">
      <ShopCard :shopId="current.Id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, } from 'vue'
import { XlsShop, Shops, getShopById,getShopsByIds,getShops, getShopsByName } from '../../data/shop'
import ShopCard from './ShopCard.vue'

const props = defineProps<{ ids?: number[], name?: string }>()
// console.log("ShopTabs props", props)

// Active tab index
const active = ref(0)

// Computed to get the current shop data based on active tab index
const current = ref<XlsShop|null> (null);

const shopMap = ref<Shops>({})

const localIds = ref<number[]>([])

onMounted(async () => {
  if (props.ids) {
    shopMap.value = await getShopsByIds(props.ids);
    localIds.value = props.ids // Directly use the prop ids if they exist
  }
  else if (props.name){
    const [ids,shops] = await getShopsByName(props.name);
    shopMap.value = shops;
    localIds.value = ids // Set ids dynamically based on the name search
  }
  const id = localIds.value[active.value]
  current.value = await getShopById(id)
})

// 监听 active 的变化，每次切换时更新当前商店
watch(
  () => active.value,
  () => {
  const shopId = localIds.value[active.value]
  current.value = shopMap.value[shopId] || null  // 更新当前商店
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
