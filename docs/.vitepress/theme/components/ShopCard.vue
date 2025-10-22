<template>
  <div class="shop-card" v-if="currentShop">
    <div class="header">
      <div class="title">
        <strong>{{ currentShop.name }}</strong>
        <small class="keeper">掌柜：{{ currentShop.keeper }}</small>
      </div>
      <p v-if="currentShop.note" class="note">{{ currentShop.note }}</p>
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
import { ref, watchEffect } from 'vue'
import { Shop, shops } from '../../data/shops'
import ItemCard from './ItemCard.vue'

// 接收父组件传递的 shopId
const props = defineProps<{ shopId: number }>()

// 使用响应式数据来存储当前商店数据
const currentShop = ref<Shop | null>(null)

watchEffect(() => {
  const shop = shops[props.shopId]
  currentShop.value = shop || null
})

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
