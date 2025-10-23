<template>
  <div class="item-card" v-if="cur">
    <div class="icon-wrap" :class="['rank-' + (cur.item.Rank || 1)]">
      <img v-if="cur.icon" :src="cur.icon" alt="" class="icon" />
    </div>
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
import { XlsItem, Items, getAllItems, getItemIcon } from "../../data/items";
import { XlsShopItem } from "../../data/shops";

// 接收 props 数据
const props = defineProps<{
  good: XlsShopItem; // 商品数据
}>();

// 使用 ref 来存储 item 数据和 icon
const cur = ref({
  good: props.good,
  item: {} as XlsItem,
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

const updateCurrentItem = (good: XlsShopItem) => {
  const item = items.value[good.ItemId];
  const icon = getItemIcon(item?.Icon);
  cur.value = { good, item, icon };
  // console.log("updateCurrentItem", cur.value);
};
</script>

<style scoped>
.item-card {
  width: 250px; /* 设置固定宽度 */
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 260px;
  height: 90px;
  padding: 10px 14px;
  box-sizing: border-box;

  /* 九宫格背景 */
  border: 6px solid transparent;
  border-image: url("/images/ui/frame_11.png") 24 fill stretch;

  /* 纸质底色 */
  background:
    linear-gradient(180deg, rgba(255,255,255,.8), rgba(245,245,245,.8)),
    url("/images/ui/frame_11.png");
  background-blend-mode: multiply;

  border-radius: 6px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.35),
    inset 0 -1px 0 rgba(0,0,0,.08);
}

.icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #333;
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,.2), transparent 60%),
    linear-gradient(180deg, #76d28d, #4caf7a);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.3);
}

.icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

/* 品质色 */
/* 不同品质的背景样式 */
.rank-0 {
  background: radial-gradient(circle at center, #ddd 0%, #999 100%);
  border-color: #ccc;
}
.rank-1 {
  background: radial-gradient(circle at center, #c8f7c5 0%, #27ae60 100%);
  border-color: #2ecc71;
}
.rank-2 {
  background: radial-gradient(circle at center, #a0c4ff 0%, #3498db 100%);
  border-color: #3498db;
}
.rank-3 {
  background: radial-gradient(circle at center, #e1bee7 0%, #9b59b6 100%);
  border-color: #9b59b6;
}
.rank-4 {
  background: radial-gradient(circle at center, #ffeaa7 0%, #f39c12 100%);
  border-color: #f1c40f;
}
.rank-5 {
  background: radial-gradient(circle at center, #ffb6c1 0%, #e74c3c 100%);
  border-color: #e74c3c;
}
.meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.name {
  font-weight: 700;
  font-size: 18px;
  font-family: "Ma Shan Zheng", "LXGW WenKai", "KaiTi", sans-serif;
  text-shadow: 0 1px 0 #fff, 0 0 1px rgba(0,0,0,.25);
}

.stock {
  color: #5b5b5b;
  font-size: 14px;
}

.price-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.price {
  color: #1556c9;
  font-weight: 700;
}

</style>
