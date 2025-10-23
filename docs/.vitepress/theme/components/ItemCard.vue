<template>
  <div class="item-card" v-if="cur">
    <img v-if="cur.icon" :src="cur.icon" alt="" class="icon" />
    <div class="meta">
      <div class="title">
        <strong>{{ cur.item?.Name }}</strong>
        <div class="stock">库存：{{ cur.good.Count }}</div>
      </div>
      <span class="price">￥{{ cur.good.Price }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue";
import { Item, Items, getAllItems, getItemIcon } from "../../data/items";
import { ShopItem } from "../../data/shops";

// 接收 props 数据
const props = defineProps<{
  good: ShopItem; // 商品数据
}>();

// 使用 ref 来存储 item 数据和 icon
const cur = ref({
  good: props.good,
  item: {} as Item,
  icon: "",
});

// 异步加载所有 items
let items = ref<Items>({});

// 初始化并加载数据
onMounted(async () => {
  items.value = await getAllItems();
  updateCurrentItem(props.good);
});

// 监听 good 变化
watch(
  () => props.good,
  (newGood) => {
    updateCurrentItem(newGood);
  }
);

const updateCurrentItem = (good: ShopItem) => {
  const item = items.value[good.ItemId];
  const icon = getItemIcon(item?.Icon);
  cur.value = { good, item, icon };
  console.log("updateCurrentItem", cur.value);
};
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
