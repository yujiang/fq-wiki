<!-- SoldierCards.vue 一排SoldierCard.vue
<SoldierCards :soldierIds="[1,2]"/>
-->

<template>
  <div class="soldier-cards-container">
    <!-- 传选中ID + 点击事件 -->
    <SoldierList
      :soldiers="soldierIds"
      :selectedId="mySelectedId"
      @select="handleSelect"
      class="soldier-cards__list"
    />

    <!-- 详情区域 -->
    <div class="soldier-cards__content">
      <SoldierCard :soldierId="mySelectedId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import SoldierList from "./SoldierList.vue";
import SoldierCard from "./SoldierCard.vue";

// 只接收「选中ID」和「列表」，触发更新事件
const props = defineProps<{
  soldierIds: number[];
  selectedId?: number | null;
}>();

const sid = props.selectedId || props.soldierIds[0] || 0;
const mySelectedId = ref(sid);

// 选中ID变化时加载详情
watchEffect(
  ()=>{
  const sid = props.selectedId || props.soldierIds[0] || 0;
  mySelectedId.value = sid;
  },
);

// 接收SoldierList的点击事件，传给SoldierCard
const handleSelect = (id: number) => {
    mySelectedId.value = id;
};
</script>

<style scoped>/* 样式不变 */</style>