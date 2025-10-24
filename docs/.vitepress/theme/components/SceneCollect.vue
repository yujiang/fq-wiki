<template>
  <div class="collect-list">
    <table>
      <thead>
        <tr>
          <th>名字</th>
          <th>位置</th>
          <th>数目</th>
          <th>产出</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="collect in collects" :key="collect.Id">
          <!-- <td>{{ collect.Id + ' ' + collect.Name }}</td> -->
          <td>{{ collect.Name }}</td>
          <td>{{ formatClientPos(collect.x, collect.y) }}</td>
          <td>{{ collect.TopLimit }}</td>

          <td class="reward-cell">
            <ItemList :items="rewardItemsMap[collect.Id] || []" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue";
import { getCollectsTypeByScene, XlsCollect } from "../../data/collect";
import { formatClientPos } from "../../data/public";
import { getRewardAll, getRewardItems } from "../../data/reward";
import { ItemIdCount } from "../../data/item";

const props = defineProps<{
  scene: number;
  collectType: string;
}>();

// --- 状态 ---
const collects = ref<XlsCollect[]>([]);
const rewardItemsMap = ref<Record<number, ItemIdCount[]>>({});

// --- 数据加载函数 ---
async function loadData() {
  // 1. 加载 collect
  const cs = (await getCollectsTypeByScene(props.collectType, props.scene)) || [];
  collects.value = cs;

  // 2. 加载对应奖励
  const itemsMap: Record<number, ItemIdCount[]> = {};
  for (const collect of cs) {
    itemsMap[collect.Id] = await getRewardAll(collect.Rewards);
  }
  rewardItemsMap.value = itemsMap;

  console.log("Collect data reloaded:", props.collectType, cs.length, cs, itemsMap);
}

// --- 初次加载 ---
onMounted(loadData);

// --- 监听 collectType / scene 变化 ---
watch(
  () => [props.collectType, props.scene],
  () => {
    loadData();
  }
);
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
.reward-cell {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
</style>
