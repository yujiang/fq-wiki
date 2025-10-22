<template>
  <div class="item-card" v-if="cur">
    <img v-if="cur.icon" :src="cur.icon" alt="" class="icon" />
    <div class="meta">
      <div class="title">
        <strong>{{ cur.item.name }}</strong>
         <div class="stock">库存：{{ cur.good.stock }}</div>
      </div>
        <span class="price">￥{{ cur.good.price }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, watchEffect } from 'vue'
import { items, getItemIcon } from '../../data/items'
import { ShopItem } from '../../data/shops';

const props = defineProps<{
  good: ShopItem,   // 商品数据
}>()

// 使用 reactive 来创建响应式对象
const cur = reactive({
  good: props.good,
  item: items[props.good.itemId],
  icon: getItemIcon(items[props.good.itemId]?.icon)
})

// 使用 watchEffect 来确保每次 good 变化时，自动更新相关数据
watchEffect(() => {
  cur.good = props.good
  cur.item = items[cur.good.itemId]
  cur.icon = getItemIcon(cur.item.icon)
})
</script>

<style scoped>
.item-card {
  width: 300px; /* 设置固定宽度 */
  display: flex;
  gap: 12px;
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-elv);
  transition: transform 0.08s;
}
.item-card:hover {
  transform: translateY(-1px);
}
.icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
}
.meta {
  flex: 1;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-size: 1.1em;
  color: var(--vp-c-brand);
}
.stock {
  margin-bottom: 0.5em;
  color: var(--vp-c-text-2);
}
</style>
