<!-- TaskCard.vue 包括 领取 步骤 奖励 
<TaskCard :taskId="11022"/> 
-->

<template>
  <div class="task-card">
    <!-- 任务标题栏 -->
    <div class="task-card__header">
      <span class="task-title">{{ label }}</span>
      <span class="task-difficulty" :class="`difficulty-${task?.Diff || '普通'}`" v-if="!chapter">
        难度：{{ task?.Diff || '普通' }}
      </span>
      <span class="wiil-grade" v-if="chapter">
        {{ willGrade() }}
      </span>
    </div>

    <!-- 领取条件 -->
    <div class="task-section领取条件" v-if="!chapter && !nonext">
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
            <p>
              <RichText :text="step.Desc"></RichText>
            </p>
          </div>
          <div class="step-reward" v-if="step.Reward > 0">
            <RewardCard title="no" :rewardId="getTaskReward(step)" />
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { XlsTask, getDesDesc, getTaskNext, getTask, getTasks, getTaskReward } from "../../../data/task";
import RewardCard from "../reward/RewardCard.vue";
import RichText from "../ui/RichText.vue";
import { getChapter, getChapterLabel } from "../../../data/chapter";
import { MoneyTypeEnum, RewardAll, sumRewards, XlsReward } from "../../../data/reward";
import { getMoney, getMoneyIcon } from "../../../data/money";
import { heroWillLevelup, willLevelup } from "../../../data/formula";

// 接收 props 数据
// end 结束任务, 用于分段
// chapter 是否主线?
const props = defineProps<{ taskId: number, end?: number, chapter?: boolean; nonext?: boolean }>();

// 异步加载所有 tasks
let task = ref<XlsTask | null>(null);
let taskSteps = ref<XlsTask[]>([]);
let last = ref<XlsTask | null>(null);
let taskStepDescs = ref<string[]>([]);
let label = ref<string | null>(null);

// let sumReward = ref<RewardAll | null>(null);
let allexp = ref<number>(0);
let upgrade = ref<number>(0);

const isDev = import.meta.env.DEV;

function getTaskLabel() {
  if (!props.chapter) return task.value?.Name + (isDev ? `(${task.value?.Id})` : '');
  // const xls = getChapter(props.taskId);
  return getChapterLabel(props.taskId);
}

function willGrade() {
  return `经验总计:${allexp.value} 升至等级:${upgrade.value}`;
}

function getAcceptDesc(desc: string | undefined) {
  if (!desc) return "（无）";
  return desc === '...' ? '需探索' : desc;
}

// 初始化并加载数据
onMounted(async () => {
  await updateCurrentTask(props.taskId);
  label.value = await getTaskLabel();
});

// 监听 good 变化
watch(
  () => props.taskId,
  async (newGood) => {
    await updateCurrentTask(newGood);
    label.value = await getTaskLabel();
  }
);

// const getReward = computed((xls: XlsTask) => {
//   if (xls.Reward === 1) {
//     return xls.Id;
//   }
//   return xls.Reward || 0;
// });

function updateCurrentTask(task: number) {
  if (!props.chapter) {
    return updateTask([], task, props.end);
  }
  return updateChapter(task);
}

async function updateChapter(id: number) {
  const xls = await getChapter(id);
  if (!xls) return;
  return updateTask(xls.TaskHead, xls.TaskStart, xls.TaskEnd)
}

const updateTask = async (heads: number[], id: number, end?: number) => {
  const datas = await getTasks();
  const xls = datas[id];
  if (!xls) return;

  const all = [];
  const alldesc = [];
  if (heads) {
    for (const h of heads) {
      const nxls = datas[h];
      all.push(nxls);
      const desc = await getDesDesc(nxls.Des);
      alldesc.push(desc);
    }
  }

  all.push(xls);
  const desc = await getDesDesc(xls.Des);
  alldesc.push(desc);

  let next: number = getTaskNext(xls);
  let l = xls;
  while (next && next !== end && !props.nonext) {
    const nxls = datas[next];
    if (!nxls) break;
    all.push(nxls);
    const desc = await getDesDesc(nxls.Des);
    alldesc.push(desc);
    l = nxls;
    if (next === nxls.NextTask) {
      break;
    }
    next = getTaskNext(nxls)
  }
  // console.log("updateCurrentTask", id, all.length, l.Id);
  task.value = xls;
  taskSteps.value = all;
  taskStepDescs.value = alldesc;
  last.value = l;
  const sum = await sumRewards(
    all.map((t) => {
      const rw = getTaskReward(t);
      return rw > 0 ? rw : 0;
    })
  );

  const mxls = await getMoney(MoneyTypeEnum.exp);
  allexp.value = 0;
  if (sum) {
    const find = sum.moneys.find(m => m.id === mxls?.ItemId);
    if (find) {
      allexp.value = Number(find.count || 0);
    }
    // console.log("exp", sum?.moneys, mxls?.ItemId, find, allexp.value);
  }

    if (props.chapter) {
      // if (!allexp.value) return '';
      const chapter = await getChapter(props.taskId);
      // if(!task.value) return 0;
      if (!chapter) return '';
      const start = parseInt(chapter.Grade) || 0;

      const grade = await heroWillLevelup(start, allexp.value);
      upgrade.value = grade;
    }

};

</script>


<style scoped>
.task-card {
  width: 640px;
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

.npc-info,
.npc-location,
.level-require {
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
  margin-bottom: 2px;
  padding-bottom: 2px;
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
  max-width: 200px;
}

.step-content p {
  margin: 0 0 1px;
  color: #333;
}

.step-target {
  font-size: 13px;
  color: #666;
  padding-left: 4px;
  border-left: 2px solid #eee;
}

.step-reward {
  margin-left: auto;
}

/* 操作按钮 */
.task-actions {
  display: flex;
  justify-content: center;
  margin-top: 2px;
}

.btn-accept,
.btn-complete,
.btn-continue {
  padding: 8px 2px;
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

.btn-accept:hover,
.btn-complete:hover,
.btn-continue:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
