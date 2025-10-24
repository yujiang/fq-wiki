<!-- 显示reward -->

<template>
  <div class="reward-card" v-if="currentReward">
    <div class="header">
        <strong>{{ currentReward.Name }}</strong>
    </div>


    <!-- 显示该商店的所有商品 -->

    <div class="grid">
        <ItemList :items="rewardMoneys" />
        <ItemList :items="rewardItems" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ItemIdCount } from '../../data/item';
import { getReward, getRewardItems, getRewardMoneys, XlsReward } from '../../data/reward';

// 接收父组件传递的 shopId
const props = defineProps<{ rewardId: number }>()
let rewardItems = ref< ItemIdCount[] >([]);
let rewardMoneys = ref< ItemIdCount[] >([]);

// 使用响应式数据来存储当前商店数据
const currentReward = ref<XlsReward | null>(null)

// 当 shopId 改变时获取新商店数据
watch(() => props.rewardId, async (newShopId) => {
  const shop = await getReward(newShopId)
  currentReward.value = shop;
  const items = await getRewardItems(newShopId)
  const moneys = await getRewardMoneys(newShopId);
  rewardItems.value = items;
  rewardMoneys.value = moneys;
  console.log("rewardItems.value", props.rewardId, items, moneys)
}, { immediate: true })

</script>


<style scoped>
.reward-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 14px;
  background: var(--vp-c-bg);
}
.grid {
  display: flex;
  gap: 10px;
}
</style>
