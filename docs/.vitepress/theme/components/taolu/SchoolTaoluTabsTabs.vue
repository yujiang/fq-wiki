<template>
  <div class="school-taolu-tabs-tabs">
    <!-- 页面标题 -->
    <!-- <h1 class="page-title">武学总览</h1> -->

    <!-- 外层标签：门派切换 -->
    <div class="school-tabs-nav">
      <button
        v-for="school in schools"
        :key="school"
        class="school-tab-btn"
        :class="{ active: activeSchool === school }"
        @click="handleSchoolChange(school)"
      >
        {{ school }}
      </button>
    </div>

    <!-- 内层标签：当前门派的武功类型（复用之前的 SchoolTaoluTabs） -->
    <div class="inner-tabs-container">
      <SchoolTaoluTabs
        :school="activeSchool"
        v-if="activeSchool"
      />
    </div>

    <!-- 空状态（无门派数据） -->
    <div class="empty" v-if="schools.length === 0">
      暂无门派数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import SchoolTaoluTabs from "./SchoolTaoluTabs.vue";

// 接收门派列表（如 ['少林', '天山', '武当']）
const props = defineProps<{
  schools: string[]; // 门派数组
}>();

// 状态：当前激活的门派
const activeSchool = ref<string | null>(null);

// 初始化：默认激活第一个门派
const initActiveSchool = () => {
  if (props.schools.length > 0) {
    activeSchool.value = props.schools[0];
  }
};

// 切换门派时重置状态（确保重新加载该门派的类型数据）
const handleSchoolChange = (school: string) => {
  activeSchool.value = school;
};

// 初始化
initActiveSchool();

// 监听 schools 变化（如果父组件动态修改门派列表）
watch(
  () => props.schools,
  () => {
    initActiveSchool(); // 重新初始化激活的门派
  }
);
</script>

<style scoped>
.school-taolu-tabs-tabs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  color: #2c3e50;
  font-size: 32px;
  margin: 0 0 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #3498db;
}

/* 外层门派标签样式 */
.school-tabs-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow-x: auto; /* 门派过多时横向滚动 */
  scrollbar-width: none;
}

.school-tabs-nav::-webkit-scrollbar {
  display: none;
}

.school-tab-btn {
  padding: 10px 20px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  white-space: nowrap;
  transition: all 0.2s;
}

.school-tab-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.school-tab-btn.active {
  background: #3498db;
  color: white;
  font-weight: bold;
}

/* 内层标签容器 */
.inner-tabs-container {
  margin-top: 16px;
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 80px 0;
  color: #999;
  background: #fafafa;
  border-radius: 8px;
}
</style>