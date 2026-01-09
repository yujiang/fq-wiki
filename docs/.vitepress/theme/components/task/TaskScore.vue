<template>
  <div class=task-score>
    <div v-if=!loaded>加载中</div>
    <div v-else>
      <div v-for="(tasks, scene) in groupedTasks" :key=scene class=scene-group>
        <h3 class=scene-title>{{ getSceneName(Number(scene)) }}</h3>
        <TaskList :tasks=tasks />
      </div>
      <div v-if="Object.keys(groupedTasks).length === 0">未发现有场景积分的任务。</div>
    </div>
  </div>
</template>

<script setup lang=ts>
import { ref, computed, onMounted } from 'vue'
import TaskTabs from './TaskTabs.vue'
import { getTasks, XlsTask } from '../../../data/task'
import { getReward } from '../../../data/reward'
import { getScene, getSceneName, getScenes } from '../../../data/scene'
import TaskList from './TaskList.vue'

const loaded = ref(false)
const sceneTasks = ref<Record<number, number[]>>({})

const groupedTasks = computed(() => sceneTasks.value)

onMounted(async () => {
  const ss = await getScenes();
  const tasks = await getTasks()
  const groups: Record<number, number[]> = {}
  
  for (const [taskId, xls] of Object.entries(tasks)) {
    if (!xls || !xls.Reward) continue
    
    const r = xls.Reward == 1 ? xls.Id : xls.Reward;
    const reward = await getReward(r);
    if (!reward || !reward.Scene || !reward.SceneScore) continue
    
    const sceneId = reward.Scene
    if (!groups[sceneId]) {
      groups[sceneId] = []
    }
    groups[sceneId].push(Number(taskId))
  }
  
  sceneTasks.value = groups
  loaded.value = true
})
</script>

<style scoped>
.task-score {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.scene-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.scene-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text);
  margin: 0;
}
</style>


<!-- TaskScore.vue 
 遍历 xls of getTasks()
 找到 xls.Reward 找到 t = getReward(xls.Reward)
 如果 t.Scene t.SceneScore 存在, 
 那么 Scenes[t.Scene].push(task);
 以 Scenes的 key为分组(tab)显示
    TaskTabs
-->
