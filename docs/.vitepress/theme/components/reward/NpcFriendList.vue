<!-- NpcFriendList.vue 一排npcIcon.vue 显示npc的好感度 -->

<template>
  <div class="base-list npc-list">
    <NpcIcon
      v-for="npc in props.npcs"
      :key="npc.npcId"
      :npcId="npc.npcId"
      :friend="npc.friend"
      :isSelected="npc.npcId === props.selectedId" 
      @click="$emit('select', npc.npcId)"  
    />
  </div>
</template>

<script setup lang="ts">
import NpcIcon from "../NpcIcon.vue";
import { NpcFriend } from "../../../data/npc";

// 只接收列表和选中ID，触发选择事件
const props = defineProps<{ npcs?: NpcFriend[]; selectedId?: number | null }>();
const emit = defineEmits<{ (e: "select", id: number): void }>();
// 统治NpcCard，list点中了！
</script>

<style scoped>/* 样式不变 */</style>