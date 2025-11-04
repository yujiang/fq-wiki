<!--ItemList.vue 一行item 用于RewardCard, SceneCollect
<ItemList :items="[{id:8889, count:10}, {id:2022, count:1}, {id:8005, count:1}, {}]"/>
-->

<template>
  <div class="base-list item-list">
    <!-- 渲染每个 Item -->
    <Item
      v-for="(item, index) in localItems"
      :key="item.id || index"
      :id="item.id"
      :count="item.count"
      :rand="item.rand"
      :fLevel="item.fLevel"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, watchEffect } from "vue";
import Item from "./Item.vue";
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
watchEffect(
  () => {
    // console.log("ItemList: items changed", newItems);
    localItems.value = props.items || [];
  },
);
</script>

<style scoped>
.item-list {
  
}
</style>
