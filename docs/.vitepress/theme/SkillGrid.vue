<!-- 技能网格 / 单行布局封装，负责 “多行列布局” 逻辑 -->
 
<template>
  <div class="grid-container" :style="containerStyle">
    <!-- 循环生成每行的 SkillList -->
    <div 
      v-for="(row, rowIndex) in gridSkills" 
      :key="rowIndex" 
      class="grid-row"
      :style="rowContainerStyle"
    >
      <SkillList 
        :skills="row" 
        :style="rowStyle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { CSSProperties } from "vue";
import SkillList from "./SkillList.vue";
import { SkillIdLevel } from "../../data/skill";

// 定义传入的属性：技能数据、行数、列数（核心：仅依赖skills，不涉及taolu）
const props = defineProps<{
  skills: SkillIdLevel[]; // 必传技能数据
  rows: number; // 网格行数（如3行）
  cols: number; // 网格列数（如4列）
  gap?: number; // 网格间距，默认8px
}>();

// 计算网格容器样式
const containerStyle = computed<CSSProperties>(() => ({
  gap: `${props.gap || 8}px`, // 行与行之间的间距
}));

// 计算行容器样式（带边框）
const rowContainerStyle = computed<CSSProperties>(() => ({
  padding: `${(props.gap || 8) + 2}px`,
}));

// 计算每行内部 SkillList 的样式
const rowStyle = computed<CSSProperties>(() => ({
  gridTemplateColumns: `repeat(${props.cols}, 1fr)`, // 按列数平均分配宽度
  gap: `${props.gap || 8}px` // 列之间的间距
}));

// 将一维技能数组转换为二维网格数组（自动用空对象补齐每行）
const gridSkills = computed<SkillIdLevel[][]>(() => {
  const result: SkillIdLevel[][] = [];
  const totalCells = props.rows * props.cols; // 总单元格数量
  // 复制原始数据并填充空对象至总单元格数量
  const filledSkills = [...props.skills];
  while (filledSkills.length < totalCells) {
    filledSkills.push({} as SkillIdLevel); // 空对象占位
  }
  // 按列数拆分数据为行
  for (let i = 0; i < props.rows; i++) {
    const start = i * props.cols;
    const end = start + props.cols;
    result.push(filledSkills.slice(start, end));
  }
  return result;
});
</script>

<style scoped>
</style>