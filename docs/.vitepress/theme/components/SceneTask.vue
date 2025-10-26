<template>
  <div class="scene-task-library">
    <!-- 场景&任务类型标题栏 -->
    <div class="scene-task-header">
      <h1 class="scene-title"> 支线任务</h1>
      <div class="task-meta">
        <span class="total-count">共 {{ totalTaskCount }} 个支线任务</span>
        <span class="tip-text">按最低接取等级分组，点击等级标签切换查看</span>
      </div>
    </div>

    <!-- 等级分组标签（核心分类导航） -->
    <div class="level-group-tabs">
      <button
        v-for="group in levelGroups"
        :key="group.levelKey"
        :class="['group-tab', { active: activeLevelKey === group.levelKey }]"
        @click="activeLevelKey = group.levelKey"
      >
        <span class="group-label">{{ group.levelLabel }}</span>
        <span class="task-count-badge">{{ group.taskIds.length }}</span>
      </button>
    </div>

    <!-- 当前等级组的任务详情（复用TaskTabs展示任务卡片） -->
    <div class="task-content">
      <!-- 空状态：当前等级组无任务 -->
      <div v-if="currentGroupTaskIds.length === 0 && levelGroups.length > 0" class="group-empty">
        {{ activeLevelLabel }} 暂无支线任务
      </div>

      <!-- 任务切换容器 -->
      <TaskTabs
        v-else
        :taskIds="currentGroupTaskIds"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted } from "vue";
import TaskTabs from "./TaskTabs.vue";
import { getSceneBranchTasks, XlsTask } from "../../data/task";

// 接收父组件传入的场景ID（资料库核心参数）
const props = defineProps<{
  sceneId: number; // 场景唯一标识（如杏花村=101，长安城=102）
}>();

// 核心状态
const allBranchTasks = ref<XlsTask[]>([]); // 当前场景所有支线任务
const levelGroups = ref<Array<{
  levelKey: number; // 等级组标识（0,10,20...，用于逻辑判断）
  levelLabel: string; // 等级组显示文本（如“0-9级”“10-19级”）
  taskIds: number[]; // 该组下的任务ID列表
}>>([]);
const activeLevelKey = ref<number>(0); // 当前激活的等级组标识

// 初始化加载资料库数据
onMounted(async () => {
  // 2. 加载该场景下所有支线任务（资料库需全量加载，方便分类）
  const branchTasks = await getSceneBranchTasks(props.sceneId);
  allBranchTasks.value = branchTasks;

  // 3. 按“最低接取等级”分组（核心分类逻辑）
  levelGroups.value = groupTasksByLevel(branchTasks);

  // 4. 默认激活第一个等级组（若有）
  if (levelGroups.value.length > 0) {
    activeLevelKey.value = levelGroups.value[0].levelKey;
  }
});

// 核心逻辑：按等级区间分组（资料库友好的分组规则）
const groupTasksByLevel = (tasks: XlsTask[]): typeof levelGroups.value => {
  const groupMap = new Map<number, number[]>();

  tasks.forEach(task => {
    // 计算等级组标识：0-9级→0，10-19级→10，以此类推
    const levelKey = Math.floor((task.GradeSuggest||0) / 10) * 10;
    // 按标识分组收集任务ID
    if (!groupMap.has(levelKey)) {
      groupMap.set(levelKey, []);
    }
    groupMap.get(levelKey)!.push(task.Id);
  });

  // 转换为数组并按等级升序排列（符合资料库查询习惯）
  return Array.from(groupMap.entries())
    .map(([key, taskIds]) => ({
      levelKey: key,
      // 显示文本优化：0→“0-9级”，10→“10-19级”，更直观
      levelLabel: `${key}-${key + 9}级`,
      taskIds
    }))
    .sort((a, b) => a.levelKey - b.levelKey);
};

// 计算当前激活等级组的任务ID列表
const currentGroupTaskIds = computed<number[]>(() => {
  const targetGroup = levelGroups.value.find(group => group.levelKey === activeLevelKey.value);
  return targetGroup?.taskIds || [];
});

// 计算当前激活等级组的显示文本（用于空状态提示）
const activeLevelLabel = computed<string>(() => {
  const targetGroup = levelGroups.value.find(group => group.levelKey === activeLevelKey.value);
  return targetGroup?.levelLabel || "当前等级组";
});

// 计算总任务数
const totalTaskCount = computed<number>(() => {
  return allBranchTasks.value.length;
});
</script>

<style scoped>
.scene-task-library {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* 标题栏：突出场景和任务类型 */
.scene-task-header {
  margin-bottom: 32px;
  text-align: center;
}

.scene-title {
  margin: 0 0 12px;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
}

.task-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: #7f8c8d;
}

.tip-text {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tip-text::before {
  content: "ℹ️";
  font-size: 16px;
}

/* 等级分组标签：资料库风格的分类导航 */
.level-group-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
  padding: 8px 0;
  border-bottom: 1px solid #ecf0f1;
}

.group-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  border: 1px solid #bdc3c7;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #34495e;
  transition: all 0.2s ease;
}

.group-tab:hover:not(.active) {
  border-color: #3498db;
  color: #3498db;
}

.group-tab.active {
  border-color: #3498db;
  background: #3498db;
  color: #fff;
}

/* 任务数量徽章：突出数量信息 */
.task-count-badge {
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 50%;
  background: #ecf0f1;
  color: #34495e;
  font-size: 12px;
  font-weight: 500;
}

.group-tab.active .task-count-badge {
  background: #fff;
  color: #3498db;
}

/* 内容区：适配资料库的展示风格 */
.task-content {
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
}

/* 空状态：资料库友好的提示 */
.group-empty {
  padding: 80px 0;
  text-align: center;
  color: #7f8c8d;
  font-size: 16px;
}
</style>