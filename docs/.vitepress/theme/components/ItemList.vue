<!-- 一排item -->

<template>
  <div class="item-list">
    <!-- 渲染每个 ItemGrid -->
    <ItemGrid
      v-for="(item, index) in localItems"
      :key="item.id || index"
      :id="item.id"
      :count="item.count"
      :rand="item.rand"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import ItemGrid from "./ItemGrid.vue";
import { ItemIdCount } from "../../data/item";

// 接收从父组件传入的 items 数据
const props = defineProps<{
  items: ItemIdCount[];
}>();

// 建立一个本地副本（确保 watch 能触发内部动画或更新）
const localItems = ref<ItemIdCount[]>([]);

// 初次同步
localItems.value = props.items || [];

// 监听 props.items 的变化
watch(
  () => props.items,
  (newItems) => {
    console.log("ItemList: items changed", newItems);
    localItems.value = newItems || [];
  },
  { deep: true } // 如果 items 是对象数组，deep 可以检测内部变化
);
</script>

<style scoped>
.item-list {
  display: flex;
  flex-wrap: wrap; /* 允许自动换行 */
  gap: 4px;
  padding: 6px;
}
</style>
