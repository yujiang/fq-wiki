<!-- TaskList.vue 
 传入一个tasks: number[]
 使用v-for遍历tasks，每个生成一个TaskItem组件
-->

<template>
  <div class="task-list">
    <TaskItem 
      v-for="taskId in tasks" 
      :key="taskId" 
      :taskId="taskId" 
    />
  </div>
</template>

<script setup lang="ts">
import TaskItem from './TaskItem.vue'

const props = defineProps<{
  tasks: number[]
}>()
</script>

<style scoped>
.task-list {
  width: 640px;
  margin: 0 auto;
}
</style>