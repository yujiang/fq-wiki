<template>
  <div class="secret-school-tabs">
    <!-- 标题 -->
    <!-- <h3 class="tabs-title">门派隐秘技能</h3> -->

    <!-- 门派标签页导航 -->
    <div class="tabs-nav">
      <button
        v-for="school in schools"
        :key="school"
        class="tab-btn"
        :class="{ active: activeSchool === school }"
        @click="activeSchool = school"
      >
        {{ school }}
      </button>
    </div>

    <!-- 技能网格内容区：调用 SkillGridType，传入当前门派和隐秘技能类型 -->
    <div class="tabs-content">
      <SkillGridType
        file="secretskill"
        :school="activeSchool"
        :cols="cols" 
        :gap="4"
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
import SkillGridType from "../SkillGridType.vue";

// 接收门派列表 props
const props = defineProps<{
  schools: string[]; // 门派数组，如 ['少林', '天山', '武当']
  cols: number;
}>();

// 当前激活的门派
const activeSchool = ref<string | null>(null);

// 初始化：默认激活第一个门派
const initActiveSchool = () => {
  if (props.schools.length > 0) {
    activeSchool.value = props.schools[0];
  }
};

// 监听 schools 变化，重新初始化激活门派
watch(
  () => props.schools,
  () => {
    initActiveSchool();
  },
  { immediate: true } // 初始化时执行一次
);
</script>

<style scoped>
.secret-school-tabs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.tabs-title {
  margin: 0 0 16px;
  color: #333;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

/* 标签导航样式 */
.tabs-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  overflow-x: auto; /* 门派过多时横向滚动 */
  scrollbar-width: none;
}

.tabs-nav::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  padding: 6px 12px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #e9e9e9;
  color: #333;
}

.tab-btn.active {
  background: #3498db;
  color: white;
  font-weight: 500;
}

/* 内容区样式 */
.tabs-content {
  padding: 8px 0;
}

/* 空状态样式 */
.empty {
  text-align: center;
  padding: 40px 0;
  color: #999;
  background: #fafafa;
  border-radius: 4px;
}
</style>