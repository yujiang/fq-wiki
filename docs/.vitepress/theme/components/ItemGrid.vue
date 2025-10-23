<template>
  <div class="item-grid" v-if="item">
    <div class="icon-wrap" :class="['rank-' + (item.Rank || 1)]">
      <img v-if="itemicon" :src="itemicon" alt="" class="icon" />
    </div>
    <div class="meta">
      <span class="数目" v-if="count">{{ count }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue";
import { XlsItem, getItemIcon, getItemById } from "../../data/items";

// 接收 props 数据
const props = defineProps<{
  id: number; // 商品数据
  count?: number; // 商品数量
}>();

// 异步加载所有 items
let item = ref<XlsItem|null>(null);
let itemicon = ref('');

// 初始化并加载数据
onMounted(async () => {
  updateCurrentItem(props.id);
});

// 监听 good 变化
watch(
  () => props.id,
  (newGood) => {
    updateCurrentItem(newGood);
  }
);

const updateCurrentItem = async (id: number) => {
  item.value = await getItemById(id);
  itemicon.value = getItemIcon(item?.value?.Icon||0);
};
</script>

<style scoped>
.item-grid {
  width: 90px;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 90px;
  padding: 0px 0px;
  box-sizing: border-box;
  border-radius: 6px;

  /* 🔹背景层叠顺序（从下到上）：
     1. 九宫格底图 frame_11.png
     2. 纸纹噪点
     3. 淡色渐变 */
  background: url("/images/ui/frame_11.png") no-repeat center / 100% 100%;
  border: 1px solid black;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.4),
    inset 0 -1px 0 rgba(0,0,0,0.08);
}

.icon-wrap {
  width: 90px;
  height: 90px;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #333;
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,0.2), transparent 60%),
    linear-gradient(180deg, #76d28d, #4caf7a);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
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
