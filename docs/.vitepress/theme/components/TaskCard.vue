<!-- task包括 领取 步骤 奖励 -->

<template>
  <div class="task-card">
    <!-- 任务标题栏 -->
    <div class="task-card__header">
      <span class="task-title">{{ task?.Name }}</span>
      <span class="task-difficulty" :class="`difficulty-${task?.Diff  || '普通'}`">
        难度：{{ task?.Diff || '普通' }}
      </span>
    </div>

    <!-- 领取条件 -->
    <div class="task-section领取条件">
      <span class="section-title">领取条件：</span>
      <span class="label"> {{ getAcceptDesc(task?.AcceptDesc) }} </span>
    </div>

    <!-- 任务步骤 -->
    <div class="task-section任务步骤">
      <h4 class="section-title">任务步骤</h4>
      <ul class="task-steps">
        <li v-for="(step, index) in taskSteps" :key="index" class="step-item">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <!-- 步骤涉及的NPC/目标 -->
            <div class="step-target">
              → {{ taskStepDescs[index] }} 
            </div>
            <p>{{ step.Desc }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 任务奖励 -->
    <div class="task-section任务奖励">
      <RewardCard :rewardId="last?.Reward || 0" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, watch, computed } from "vue";
import { XlsTask,getDesDesc,getTask  } from "../../data/task";

// 接收 props 数据
const props = defineProps<{taskId:number}>();

// 异步加载所有 tasks
let task = ref<XlsTask | null>(null);
let taskSteps= ref<XlsTask[]>([]);
let last = ref<XlsTask | null>(null);
let taskStepDescs= ref<string[]>([]);

function getAcceptDesc(desc: string | undefined) {
  if (!desc) return "（无）";
  return desc === '...' ? '需探索' : desc;
}

// 初始化并加载数据
onMounted(async () => {
  updateCurrentTask(props.taskId);
});

// 监听 good 变化
watch(
  () => props.taskId,
  (newGood) => {
    updateCurrentTask(newGood);
  }
);

const updateCurrentTask = async (id: number) => {
  const xls  = await getTask(id);
  if (xls){
    const all = [xls];
    const desc = await getDesDesc(xls.Des);
    const alldesc = [desc];
    let next = xls.NextTask
    let l = xls;
    while(next){
        const nxls = await getTask(next);
        all.push(nxls);
        const desc = await getDesDesc(nxls.Des);
        alldesc.push(desc);
        l = nxls;;
        next = nxls.NextTask;
    }
    console.log("updateCurrentTask", id, all.length, l.Id);
    task.value = xls;
    taskSteps.value = all;
    taskStepDescs.value = alldesc;
    last.value = l;
  }
};

</script>


<style scoped>
.task-card {
  max-width: 600px;
  margin: 16px auto;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

/* 标题栏 */
.task-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
}

.task-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.task-difficulty {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.difficulty-容易 {
  background: #e6f7ee;
  color: #00b42a;
}

.difficulty-普通 {
  background: #fff4e5;
  color: #ff7d00;
}

.difficulty-困难 {
  background: #ffe5e5;
  color: #f53f3f;
}

.difficulty-危险 {
  background: #f0e6ff;
  color: #722ed1;
}

/* 通用区块样式 */
.task-section {
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 12px;
  font-size: 15px;
  color: #666;
  padding-left: 4px;
  border-left: 3px solid #409eff;
  font-weight: 800;
}

/* 领取条件 */
.task-accept {
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
}

.npc-info, .npc-location, .level-require {
  margin-bottom: 8px;
  font-size: 14px;
}

.label {
  color: #999;
  margin-right: 4px;
}

.value {
  color: #333;
}

/* 任务步骤 */
.task-steps {
  list-style: none;
  padding: 0;
  margin: 0;
}

.step-item {
  display: flex;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f5f5;
}

.step-item:last-child {
  border-bottom: none;
}

.step-number {
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  background: #409eff;
  color: white;
  font-size: 12px;
  margin-right: 12px;
  flex-shrink: 0;
}

.step-content {
  flex-grow: 1;
}

.step-content p {
  margin: 0 0 4px;
  color: #333;
}

.step-target {
  font-size: 13px;
  color: #666;
  padding-left: 4px;
  border-left: 2px solid #eee;
}

/* 操作按钮 */
.task-actions {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.btn-accept, .btn-complete, .btn-continue {
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-accept {
  background: #409eff;
  color: white;
}

.btn-complete {
  background: #00b42a;
  color: white;
}

.btn-continue {
  background: #ff7d00;
  color: white;
}

.btn-accept:hover, .btn-complete:hover, .btn-continue:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
