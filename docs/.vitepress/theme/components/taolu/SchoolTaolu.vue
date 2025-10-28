<template>
  <div class="school-taolu">
    <!-- 门派标题 -->
    <!-- <h2 class="school-title">{{ school }} {{ type }} 总览</h2> -->

    <!-- 加载状态 -->
    <div class="loading" v-if="isLoading">加载中...</div>

    <!-- 分组展示：基础/进阶/上乘/镇派 -->
    <div class="taolu-groups">
      <!-- 1. 基础套路 -->
      <div class="taolu-group" v-if="groups.basic.length > 0">
        <h3 class="group-title">基础功法</h3>
        <TaoluCardList :taolus="groups.basic" />
      </div>

      <!-- 2. 进阶套路 -->
      <div class="taolu-group" v-if="groups.advanced.length > 0">
        <h3 class="group-title">进阶功法</h3>
        <TaoluCardList :taolus="groups.advanced" />
      </div>

      <!-- 3. 上乘套路 -->
      <div class="taolu-group" v-if="groups.superior.length > 0">
        <h3 class="group-title">上乘功法</h3>
        <TaoluCardList :taolus="groups.superior" />
      </div>

      <!-- 4. 镇派套路 -->
      <div class="taolu-group" v-if="groups.supreme.length > 0">
        <h3 class="group-title">镇派功法</h3>
        <TaoluCardList :taolus="groups.supreme" />
      </div>
    </div>

    <!-- 空状态（无数据且加载完成） -->
    <div class="empty" v-if="!isLoading && isAllGroupsEmpty">
      暂无 {{ school }} 门派的套路数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, computed, watch } from "vue";
import TaoluCardList from "./TaoluCardList.vue";
import { getTaolusBySchool, TaoluClassType, TaoluType, XlsTaolu } from "../../../data/taolu";

// 接收门派名称（如 '少林'）
const props = defineProps<{
  school: string; // 门派名称，如 '少林'、'武当'
  type: TaoluClassType;
}>();

// 状态定义
const isLoading = ref(true); // 加载状态
const allTaolus = ref<XlsTaolu[]>([]); // 该门派所有套路

// 按品级分组的套路ID数组
const groups = ref({
  basic: [] as number[], // 基础
  advanced: [] as number[], // 进阶
  superior: [] as number[], // 上乘
  supreme: [] as number[] // 镇派
});

// 检查所有分组是否都为空（用于空状态判断）
const isAllGroupsEmpty = computed(() => {
  return Object.values(groups.value).every(group => group.length === 0);
});

// 核心：加载门派套路并分组
const loadSchoolTaolus = async () => {
  isLoading.value = true;
  try {
    // 1. 加载该门派所有套路（假设返回的XlsTaolu包含品级字段 'grade'）
    const xls = await getTaolusBySchool(props.school, props.type);
    allTaolus.value = xls;

    // 2. 按品级分组（根据实际数据结构调整判断逻辑）
    const basic: number[] = [];
    const advanced: number[] = [];
    const superior: number[] = [];
    const supreme: number[] = [];

    xls.forEach(taolu => {
      // 假设 taolu.grade 是品级标识，如 1=基础，2=进阶，3=上乘，4=镇派
      switch (taolu.Rank) {
        case 1:
          basic.push(taolu.Id);
          break;
        case 2:
          advanced.push(taolu.Id);
          break;
        case 3:
          superior.push(taolu.Id);
          break;
        case 4:
          supreme.push(taolu.Id);
          break;
        default:
          // 未知品级可忽略或归类到基础
          break;
      }
    });

    // 3. 更新分组数据
    groups.value = { basic, advanced, superior, supreme };
  } catch (error) {
    console.error(`加载 ${props.school} 套路失败:`, error);
  } finally {
    isLoading.value = false;
  }
};

// 初始化加载
onMounted(loadSchoolTaolus);
watch(
  () => [props.school, props.type], // 监听这两个 props 的变化
  loadSchoolTaolus
);
</script>

<style scoped>
.school-taolu {
  padding: 20px 0; /* 只保留上下间距，左右顶格 */
  max-width: 1200px;
  margin: 0 auto;
}

.school-title {
  margin: 0 0 24px;
  color: #2c3e50;
  font-size: 24px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
}

.taolu-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.taolu-group {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 0; /* 去除分组容器的内边距，让卡片顶格 */
}

.group-title {
  margin: 0 0 16px;
  font-size: 18px;
  color: #34495e;
  padding-left: 8px;
  border-left: 3px solid #e74c3c;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 60px 0;
  color: #999;
  background: #fafafa;
  border-radius: 8px;
  margin-top: 20px;
}
</style>