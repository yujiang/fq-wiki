<!-- TaskCard.vue 包括 领取 步骤 奖励 
<TaskCard :taskId="11022"/> 
-->

<template>
  <div class="task-card">
      <div class="task-info">
          <span class="task-title">{{ label }}</span>
          <span class="task-id" v-if="isDev">({{ task?.Id }})</span>
      </div>
      <RewardCard title="no" :rewardId="getTaskReward(task)" class="reward-card"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { XlsTask, getTask, getTaskReward } from "../../../data/task";
import RewardCard from "../reward/RewardCard.vue";

// 接收 props 数据
// end 结束任务, 用于分段
// chapter 是否主线?
const props = defineProps<{ taskId: number}>();

// 异步加载所有 tasks
let task = ref<XlsTask | null>(null);
let label = ref<string | null>(null);
let rid = ref<number | null>(null);
  
const isDev = import.meta.env.DEV;

function getTaskLabel() {
  return task.value?.Name || '';
}


// 初始化并加载数据
onMounted(async () => {
  await updateCurrentTask(props.taskId);
  label.value = getTaskLabel() ;
});

// 监听 good 变化
watch(
  () => props.taskId,
  async (newGood) => {
    await updateCurrentTask(newGood);
  }
);

// const getReward = computed((xls: XlsTask) => {
//   if (xls.Reward === 1) {
//     return xls.Id;
//   }
//   return xls.Reward || 0;
// });

async function updateCurrentTask(taskid: number) {
  task.value = await getTask(taskid);
};

</script>


<style scoped>
.task-card {
  display: flex;
  align-items:center;

  width: 640px;
  margin: 16px auto;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.task-info {
  display: flex;
  flex-direction: column;
}

.task-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.task-id {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.reward-card {
  margin-left: auto;
}

</style>
