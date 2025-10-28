<!-- SkillGrid.vue skill网格 / 单行布局封装，负责 “多行列布局” 逻辑 -->

<template>
  <div class="grid-container" :style="containerStyle">
    <div 
      v-for="(row, rowIndex) in gridSkills" 
      :key="rowIndex" 
      class="grid-row"
      :style="rowContainerStyle"
    >
      <SkillList 
        :skills="row" 
        class="row-inner"
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

// 定义传入的属性：cols 变为可选（不传入则单行展示）
const props = defineProps<{
  skills: SkillIdLevel[];
  rows?: number; // 行数：不传入时默认1行
  cols?: number; // 列数：不传入时自动单行（不拆分）
  gap?: number; // 网格间距，默认8px
}>();

// 计算实际使用的行列数（核心逻辑）
const actualRows = computed(() => {
  // 不传入 cols 时强制为1行
  if (props.cols === undefined) return 1;
  // 传入 cols 时，行数默认1行（或使用传入的rows）
  // return props.rows || 1;
  // 传入 cols 时，根据总技能数和列数自动计算行数（向上取整）
  const totalSkills = props.skills.length;
  const cols = actualCols.value;
  
  // 计算逻辑：总技能数 ÷ 列数，不足1行按1行算
  return Math.ceil(totalSkills / cols);  
});

const actualCols = computed(() => {
  // 不传入 cols 时，列数等于技能总数（单行展示）
  if (props.cols === undefined) return props.skills.length;
  // 传入 cols 时使用指定列数
  return props.cols;
});

const defaultGap = 2; // 默认网格间距
function getGap() {
    return props.gap || defaultGap;
}

// 网格容器样式
const containerStyle = computed<CSSProperties>(() => ({
  gap: `${getGap()}px`,
  // 其他继承自 ItemGrid 的基础样式（通过共享CSS实现）
}));

// 行容器样式（继承边框等样式）
const rowContainerStyle = computed<CSSProperties>(() => ({
  padding: `${(getGap()) + 2}px`,
  // 边框等样式通过共享CSS定义
}));

// 行内布局样式
const rowStyle = computed<CSSProperties>(() => ({
  gridTemplateColumns: `repeat(${actualCols.value}, 1fr)`,
  gap: `${getGap()}px`,
}));

// 生成网格数据（不传入cols时自动转为单行）
const gridSkills = computed<SkillIdLevel[][]>(() => {
  const result: SkillIdLevel[][] = [];
  const totalCells = actualRows.value * actualCols.value;
  const filledSkills = [...props.skills];

  // 补齐空数据（仅在传入cols时需要，单行时不补齐）
  if (props.cols !== undefined) {
    while (filledSkills.length < totalCells) {
      filledSkills.push({id: 0});
    }
  }

  // 拆分数据为行（单行时直接返回整个数组）
  for (let i = 0; i < actualRows.value; i++) {
    const start = i * actualCols.value;
    const end = start + actualCols.value;
    result.push(filledSkills.slice(start, end));
  }

  return result;
});
</script>

<style scoped>

</style>