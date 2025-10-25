<template>
  <div class="item-grid-container" :style="containerStyle">
    <!-- 循环生成每行的 ItemList，外层包裹带边框的行容器 -->
    <div 
      v-for="(row, rowIndex) in gridItems" 
      :key="rowIndex" 
      class="grid-row"
      :style="rowContainerStyle"
    >
      <ItemList 
        :items="row" 
        :style="rowStyle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { CSSProperties } from "vue"; // 引入CSS类型定义
import ItemList from "./ItemList.vue";
import { ItemIdCount } from "../../data/item";

const defaultGap = 2; // 默认网格间距
function getGap() {
    return props.gap || defaultGap;
}
// 定义传入的属性
const props = defineProps<{
  items: ItemIdCount[]; // 所有物品数据
  rows: number; // 行数（如4）
  cols: number; // 列数（如3）
  gap?: number; // 网格间距，默认4px
}>();

// 计算网格容器样式（显式声明CSS类型）
const containerStyle = computed<CSSProperties>(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${props.gap || defaultGap}px`, // 行与行之间的间距
  width: 'fit-content', // 容器宽度自适应内容
  padding: '4px',
  boxSizing: 'border-box' // 修复为驼峰式命名
}));

// 计算行容器样式（带边框，显式声明CSS类型）
const rowContainerStyle = computed<CSSProperties>(() => ({
  // border: `1px solid ${props.rowBorderColor || '#e5e7eb'}`, // 行边框
  border: '1px solid #333333',
  borderRadius: '4px', // 圆角优化
  backgroundColor: '#ffffff', // 行背景
  padding: `${getGap() + 2}px`, // 行内边距，与间距呼应
  boxSizing: 'border-box' // 修复为驼峰式命名
}));

// 计算每行内部 ItemList 的样式
const rowStyle = computed<CSSProperties>(() => ({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: `repeat(${props.cols}, 1fr)`, // 平均分配列宽
  gap: `${getGap()}px` // 列与列之间的间距
}));

// 将一维数组转换为二维网格数组（自动用空对象补齐每行）
const gridItems = computed<ItemIdCount[][]>(() => {
  const result: ItemIdCount[][] = [];
  const totalCells = props.rows * props.cols; // 总单元格数量
  // 复制原始数据并填充空对象至总单元格数量
  const filledItems = [...props.items];
  while (filledItems.length < totalCells) {
    filledItems.push({} as ItemIdCount); // 用空对象补齐
  }
  
  // 按列数拆分数据为行（确保每行都有 cols 个元素）
  for (let i = 0; i < props.rows; i++) {
    const start = i * props.cols;
    const end = start + props.cols;
    result.push(filledItems.slice(start, end));
  }
  
  return result;
});
</script>

<style scoped>
/* 网格整体容器样式 */
.item-grid-container {
  /* 可根据需求添加容器阴影，增强层次感 */
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); */
}

/* 行容器基础样式（与计算属性样式互补） */
.grid-row {
  transition: all 0.2s ease; /* hover 过渡效果 */
}

/* 行 hover 交互效果（可选，增强体验） */
.grid-row:hover {
  border-color: #000000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
</style>