<template>
  <div class="shop-card" v-if="currentShop">
    <div class="header">
      <div class="title">
        <strong>{{ currentShop.Name }}</strong>
        <small class="keeper">掌柜：{{ npcname }}</small>
      </div>
    </div>

    <!-- 显示该商店的所有商品 -->
    <div class="grid">
      <ItemCard
        v-for="g in currentShop.goods"
        :good="g"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { XlsShop, getShopById } from '../../data/shop'
import ItemCard from './ItemCard.vue'
import { getNpc, getNpcPosition } from '../../data/npc';

// 接收父组件传递的 shopId
const props = defineProps<{ shopId: number }>()

// 使用响应式数据来存储当前商店数据
const currentShop = ref<XlsShop | null>(null)

let npcname = ref('(无)');

async function getNpcName(npcid: number){
  let value = '(无)';
  if (npcid){
    const npc = await getNpc(npcid)
    if (npc) {
      value = npc.Name;
      value += await getNpcPosition(npcid);
    }
  }
  return value;

}

// 当 shopId 改变时获取新商店数据
watch(() => props.shopId, async (newShopId) => {
  const shop = await getShopById(newShopId)
  npcname.value = await getNpcName(shop?.Npc || 0);
  currentShop.value = shop;
  // console.log("currentShop.value", shop?.goods, npcname.value)
}, { immediate: true })

</script>


<style scoped>
.shop-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 14px;
  background: var(--vp-c-bg);
}
.header .title {
  display: flex;
  gap: 12px;
  align-items: baseline;
}
.keeper {
  color: var(--vp-c-text-2);
}
.note {
  margin: 0.25em 0 0.5em;
  color: var(--vp-c-text-2);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}
</style>
