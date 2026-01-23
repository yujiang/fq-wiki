<!-- SoldierList.vue 一排SoldierIcon.vue
<SoldierList :soldiers=[1,2]  />
-->

<template>
  <div class="base-list soldier-list">
    <SoldierIcon
      v-for="soldierId in props.soldiers"
      :key="soldierId"
      :soldierId="soldierId"
      :isSelected="soldierId === props.selectedId"
      @click="$emit('select', soldierId)"
    />
  </div>
</template>

<script setup lang="ts">
import SoldierIcon from "./SoldierIcon.vue";

// 只接收列表和选中ID，触发选择事件
const props = defineProps<{ soldiers?: number[]; selectedId?: number | null }>();
const emit = defineEmits<{ (e: "select", id: number): void }>();
</script>

<style scoped>/* 样式不变 */</style>