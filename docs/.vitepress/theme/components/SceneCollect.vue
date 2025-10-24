<template>
  <div class="collect-list">
    <!-- 资源点制表 -->
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
        <!-- 使用 v-for 循环渲染每个资源点 -->
        <tr v-for="collect in collects" :key="collect.Id">
          <td>{{ collect.Name }}</td>
          <td>{{ formatClientPos(collect.x, collect.y) }}</td>
          <td>{{ collect.TopLimit }}</td>

          <!-- 设置宽度并确保 ItemList 水平排列 -->
          <td style="display: flex; justify-content: flex-start; flex-wrap: wrap;">
            <!-- 直接指定 ItemList 宽度 -->
               <ItemList :items="rewardItemsMap[collect.Id]||[]" />
          </td>          

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import { getCollectsByScene, XlsCollect } from "../../data/collect";
import { formatClientPos } from "../../data/public";
import { getRewardItems } from "../../data/reward";
import { ItemIdCount } from "../../data/item";

// 接收 props 数据
const props = defineProps<{
  scene: number; // 场景ID
}>();

// 存储所有采集点
let collects = ref<XlsCollect[]>([]);
// 存储每个采集点的奖励项
let rewardItemsMap = ref<{ [key: number]: ItemIdCount[] }>({});

// 初始化并加载数据
onMounted(async () => {
  await updateCurrentScene(props.scene);
  // 获取所有采集点的奖励项
  await loadRewardItems();
});

// 获取采集点数据
const updateCurrentScene = async (id: number) => {
  const cs = (await getCollectsByScene(id)) || [];
  collects.value = cs;
};

// 加载奖励项数据
const loadRewardItems = async () => {
  const itemsMap: { [key: number]: ItemIdCount[] } = {};
  
  for (let collect of collects.value) {
    // 获取每个采集点的奖励数据
    const rewards = await getRewardItems(collect.Rewards);
    itemsMap[collect.Id] = rewards;
  }
  
  rewardItemsMap.value = itemsMap;
  console.log("itemsMap", collects.value, itemsMap);
};
</script>

<style scoped>
/* 表格样式 */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
