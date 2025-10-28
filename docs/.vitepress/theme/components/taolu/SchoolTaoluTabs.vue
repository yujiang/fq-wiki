<template>
  <div class="school-taolu-tabs">
    <!-- 门派标题 -->
    <!-- <h1 class="main-title">{{ school }} 武学总览</h1> -->

    <!-- 加载状态（获取武功类型时） -->
    <div class="loading" v-if="isLoadingTypes">加载门派武学类型中...</div>

    <!-- 标签页导航 -->
    <div class="tabs-nav" v-if="!isLoadingTypes && tabTypes.length > 0">
      <button
        v-for="type in tabTypes"
        :key="type.value"
        class="tab-btn"
        :class="{ active: activeType === type.value }"
        @click="activeType = type.value"
      >
        {{ type.label }}
      </button>
    </div>

    <!-- 标签页内容：展示对应类型的 SchoolTaolu -->
    <div class="tabs-content" v-if="!isLoadingTypes && tabTypes.length > 0">
      <SchoolTaolu
        :school="school"
        :type="activeType"
        v-if="activeType"
      />
    </div>

    <!-- 空状态（无武学类型） -->
    <div class="empty" v-if="!isLoadingTypes && tabTypes.length === 0">
      暂无 {{ school }} 门派的武学数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue";
import SchoolTaolu from "./SchoolTaolu.vue";
import {
  getSchoolTaoluTypes, // 假设存在：获取门派支持的武功类型（如 ['棍','内功']）
  TaoluClassType,
} from "../../../data/taolu";

// 接收门派名称（如 '少林'）
const props = defineProps<{
  school: string; // 门派名称，如 '少林'、'天山'
}>();

// 状态定义
const isLoadingTypes = ref(true); // 加载武功类型的状态
const tabTypes = ref<Array<{ label: string; value: TaoluClassType }>>([]); // 动态生成的标签类型（带label和value）
const activeType = ref<TaoluClassType | null>(null); // 当前激活的标签类型

// 核心：获取门派支持的武功类型并初始化标签
const loadSchoolTypes = async () => {
  isLoadingTypes.value = true;
  try {
    // 1. 获取该门派支持的武功类型值（如 ['gun', 'neigong', 'qinggong']）
    const typeValues: TaoluClassType[] = await getSchoolTaoluTypes(props.school);

    // 2. 转换为带label的格式（结合映射表，如 { value: 'gun', label: '棍' }）
    tabTypes.value = typeValues.map((value) => ({
      label: value, // 从映射表取中文名称，默认用value
      value,
    }));

    // 3. 默认激活第一个标签
    if (tabTypes.value.length > 0) {
      activeType.value = tabTypes.value[0].value;
    }
  } catch (error) {
    console.error(`加载 ${props.school} 武学类型失败:`, error);
    tabTypes.value = [];
  } finally {
    isLoadingTypes.value = false;
  }
};

// 初始化加载
onMounted(loadSchoolTypes);

// 监听门派变化（如果父组件动态修改school），重新加载类型
watch(
  () => props.school,
  () => {
    loadSchoolTypes();
  }
);
</script>

<style scoped>
.school-taolu-tabs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.main-title {
  margin: 0 0 24px;
  color: #2c3e50;
  font-size: 28px;
  text-align: center;
}

/* 标签导航 */
.tabs-nav {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 20px;
  overflow-x: auto; /* 类型过多时横向滚动 */
  scrollbar-width: none; /* 隐藏滚动条（可选） */
}

.tabs-nav::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  white-space: nowrap; /* 避免标签文字换行 */
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #e9e9e9;
  color: #333;
}

.tab-btn.active {
  background: #fff;
  color: #3498db;
  font-weight: bold;
  border-top: 2px solid #3498db;
  margin-top: -2px; /* 抵消上边框高度，避免整体上移 */
}

/* 内容区域 */
.tabs-content {
  padding: 8px 0;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 60px 0;
  color: #666;
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 60px 0;
  color: #999;
  background: #fafafa;
  border-radius: 8px;
}
</style>