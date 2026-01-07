<!-- TaskTabs.vue Tabs wrap TaskCard
<TaskTabs :taskIds="[11022,11059]"/>
-->

<template>
  <div v-if="taskIds.length === 0" class="empty">暂无任务</div>
  <div v-else class="task-tabs">
    <!-- 标签栏：仅根据taskIds生成切换按钮 -->
    <div class="task-tabs__header">
      <button
        v-for="taskId in taskIds"
        :key="taskId"
        :class="['tab-btn', { active: currentTaskId === taskId }]"
        @click="handleTabClick(taskId)"
        :disabled="!taskId"
      >
        <!-- 任务名称占位（实际由父组件传入的taskNameMap匹配） -->
        {{ taskNames[taskId] || `任务${taskId}` }}
      </button>
    </div>

    <!-- 内容区：渲染当前选中的TaskCard -->
    <div class="task-tabs__content">
      <!-- 空状态：无任务ID时显示 -->
      <!-- 任务卡片：仅传递当前选中的taskId -->
      <TaskCard :taskId="currentTaskId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, watch, onMounted } from "vue";
import TaskCard from "./TaskCard.vue";
import { getTasks } from "../../../data/task";

// 仅接收核心参数：任务ID列表 + 可选的任务名称映射（优化显示）
const props = defineProps<{
  taskIds: number[], // 传入的任务ID数组，用于生成标签
  defaultTaskId?: number, // 可选：默认选中的任务ID
}>();

const taskNames = ref<Record<number, string>>({});

async function updateContent() {
  const names: Record<number, string> = {};
  const tasks = await getTasks();
  props.taskIds.forEach((id) => {
    if (tasks[id]) {
      // 避免 tasks[id] 不存在导致的错误
      names[id] = tasks[id].Name;
    }
  });
  // console.log("TaskTabs.updateContent", props.taskIds, names);
  taskNames.value = names;
  const tid = props.defaultTaskId || props.taskIds[0] || 0;
  currentTaskId.value = tid;
}

onMounted(updateContent);

watch(
  () => props.taskIds,
  (newIds, oldIds) => {
    console.log("TaskIds 变化:", oldIds, "→", newIds); // 切换等级组时应打印此日志
    updateContent();
  },
  { deep: true }
);

// 当前选中的任务ID（优先用默认值，无默认则选第一个任务）
const tid = props.defaultTaskId || props.taskIds[0] || 0;
const currentTaskId = ref<number>(tid);

// 标签点击事件：更新当前选中任务ID
const handleTabClick = (taskId: number) => {
  currentTaskId.value = taskId;
};
</script>

<style scoped>
.task-tabs {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* 标签栏：横向滚动适配多任务 */
.task-tabs__header {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  padding: 4px 0;
  overflow-x: auto;
  scrollbar-width: thin;
  border-bottom: 1px solid #eee;
}

.task-tabs__header::-webkit-scrollbar {
  height: 4px;
}

.task-tabs__header::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

/* 标签按钮样式 */
.tab-btn {
  padding: 8px 16px;
  white-space: nowrap;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #409eff;
  border-bottom-color: #409eff;
  font-weight: 500;
}

.tab-btn:hover:not(.active):not(:disabled) {
  color: #409eff;
}

.tab-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

/* 内容区：承载TaskCard */
.task-tabs__content {
  padding: 16px;
  border-radius: 8px;
  background: #fafafa;
}

/* 空状态 */
.empty {
  color: #666;
  font-size: 14px;
}
</style>
