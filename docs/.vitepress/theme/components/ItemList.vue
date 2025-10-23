<template>
  <div class="item-list">
    <!-- v-for 渲染每个 ItemGrid 组件 -->
    <ItemGrid 
      v-for="(item, index) in items" 
      :key="index" 
      :id="item.id" 
      :count="item.count" 
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import ItemGrid from "./ItemGrid.vue"; // 引入 ItemGrid 组件

// 接收从父组件传入的 items 数据
const props = defineProps<{
  items: { id: number; count: number }[]; // 物品列表数据
}>();
</script>

<style scoped>
.item-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 2px;
  padding: 10px;
}
</style>
