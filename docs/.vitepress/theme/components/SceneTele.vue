<template>
  <div class="tele-list">
    <table>
      <thead>
        <tr>
          <th>位置</th>
          <th>目的</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tele in teles" :key="tele.Id">
          <!-- <td>{{ tele.Id + ' ' + tele.Name }}</td> -->
          <td>{{ formatClientPos(tele.x, tele.y) }}</td>
          <td>{{ tgtPos[tele.Id] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue";
import { formatClientPos } from "../../data/public";
import { getScenePositionClient } from "../../data/scene";
import { XlsTeleport } from "../../data/tele";
import { getTelesTypeByScene } from "../../data/tele";

const props = defineProps<{
  scene: number;
  teleType: string;
}>();


// --- 状态 ---
const teles = ref<XlsTeleport[]>([]);
const tgtPos = ref<Record<number, string>>({});

// --- 数据加载函数 ---
async function loadData() {
  // 1. 加载 tele
  const cs = (await getTelesTypeByScene(props.teleType, props.scene)) || [];
  teles.value = cs;

  const itemsMap: Record<number, string> = {};
  for (const tele of cs) {
    itemsMap[tele.Id] = await getScenePositionClient(tele.tgtScene, tele.tgtX, tele.tgtY);
  }
  tgtPos.value = itemsMap;

  console.log("Tele data reloaded:", props.teleType, cs.length);
}

// --- 初次加载 ---
onMounted(loadData);

// --- 监听 teleType / scene 变化 ---
watch(
  () => [props.teleType, props.scene],
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
