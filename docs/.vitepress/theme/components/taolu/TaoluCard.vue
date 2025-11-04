<!-- TaoluCard.vue 套路icon + 其技能TaoluSkillGrid.vue 
<TaoluCard :taolu="60056"  /> 
-->

<template>
  <div class="taolu-card">
    <!-- 容器：icon、desc、skills 横向并列且垂直居中 -->
    <div class="taolu-content">
      <!-- 1. 图标区域 -->
      <div class="taolu-icon">
        <Taolu :id="props.taolu" :level="0" />
      </div>

      <!-- 2. 描述区域（固定宽度300px，自动换行） -->
      <div class="taolu-desc">
        {{ taolu?.Detail }}
      </div>

      <!-- 3. 技能区域（占剩余宽度） -->
      <div class="taolu-skills">
        <TaoluSkillGrid :taolu="props.taolu" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 数据逻辑不变
import { ref, defineProps, onMounted, watch } from "vue";
import { XlsTaolu, getTaolu } from "../../../data/taolu";
import Taolu from "./Taolu.vue";
import TaoluSkillGrid from "./TaoluSkillGrid.vue";

const props = defineProps<{ taolu: number }>();
let taolu = ref<XlsTaolu | null>(null);

onMounted(async () => {
  updateCurrentTaolu(props.taolu);
});

watch(
  () => props.taolu,
  (newTaoluId) => {
    updateCurrentTaolu(newTaoluId);
  }
);

const updateCurrentTaolu = async (id: number) => {
  taolu.value = await getTaolu(id);
};
</script>

<style scoped>
.taolu-card {
  width: 680px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
  margin: 8px 0;
  box-sizing: border-box;
}

/* 核心容器：横向并列 + 垂直居中对齐 */
.taolu-content {
  display: flex;
  align-items: center; /* 关键：垂直居中所有子元素 */
  gap: 16px;
  min-height: 60px; /* 最小高度，确保单行时也有足够空间居中 */
}

/* 1. 图标区域：固定宽度，居中显示 */
.taolu-icon {
  width: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center; /* 图标自身在容器内居中 */
  justify-content: center;
}

/* 2. 描述区域：固定宽度300px，自动换行且垂直居中 */
.taolu-desc {
  width: 240px;
  flex-shrink: 0;
  font-size: 14px;
  color: #666666;
  line-height: 1.5;
  margin: 0;
  /* 自动换行 */
  word-wrap: break-word;
  word-break: break-all;
  /* 关键：通过对齐方式确保文本块在父容器中居中 */
  align-self: center;
}

/* 3. 技能区域：占剩余宽度，垂直居中 */
.taolu-skills {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center; /* 技能网格在自身容器内居中 */
}

/* 技能网格样式 */
:deep(.taolu-skill-grid) {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 5px 0;
}

:deep(.taolu-skill-grid)::-webkit-scrollbar {
  display: none;
}
</style>