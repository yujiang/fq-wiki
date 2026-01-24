<!-- NpcIcon.vue 显示npc的icon
<NpcIcon :npcId="10002"  /> 
-->

<template>
  <!-- 点击时触发选中事件，添加选中状态的样式类 -->
  <div 
    class="base-item-game npcicon-game" 
    :class="{ 'npcicon-game--selected': isSelected }"
  >
    <div class="icon-wrap" :style="backgroundStyle">
      <img v-if="npcicon" :src="npcicon" alt="" class="icon" />
      <!-- 动态绑定友好度的样式 -->
      <span class="friend" v-if="friend" :style="friendStyle">
        {{ friend > 0 ? '+' + friend : friend }} <!-- 正数加+号更直观 -->
      </span>      <!-- 选中时显示的标记（可选，比如勾选图标） -->
      <div class="select-marker" v-if="isSelected">✓</div>
    </div>
    <div class="base-item-name npc-name" v-if="npc?.Name">
      {{ npc.Name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import {
  XlsNpc,
  getNpc,
  getNpcIcon,
} from "../../../data/npc";
import { getRankBgStyle } from "../../../data/rank";

// 1. 接收 props：新增 isSelected 控制选中状态
const props = defineProps<{
  npcId: number;
  friend?: number; // 友好度
  isSelected?: boolean; // 外部传入的选中状态（默认 false）
}>();

// 原有逻辑保持不变
let npc = ref<XlsNpc | null>(null);
let npcicon = ref("");

onMounted(async () => {
  updateCurrentNpc(props.npcId);
});

watch(
  () => props.npcId,
  (newId) => {
    updateCurrentNpc(newId);
  }
);

const updateCurrentNpc = async (id: number) => {
  const xls = await getNpc(id);
  npc.value = xls;
  npcicon.value = getNpcIcon(xls?.Display?.icon);
  // console.log("updateCurrentNpc", id, xls?.Display?.icon, npcicon.value);
};

const backgroundStyle = computed(() => getRankBgStyle(npc.value?.Rank));

const friendStyle = computed(() => ({
  color: props.friend! > 0 ? '#4CAF50' : '#F44336', // 绿色/红色
}));

</script>

<style scoped>
.npc-name {
  /* 原有样式不变 */
}

/* 4. 选中状态的样式反馈 */
.npcicon-game--selected {
  /* 选中时整体容器的样式（比如高亮边框） */
  outline: 1px solid #42b983; /* 绿色边框标识选中 */
  border-radius: 1px;
}

/* 选中标记的样式（可选） */
.select-marker {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: #42b983;
  color: white;
  font-size: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 确保图标容器是相对定位，让选中标记能绝对定位 */
.icon-wrap {
  position: relative;
}


.friend {
  position: absolute;
  bottom: -2px;
  right: 4px;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* 添加阴影使其更清晰 */
}
</style>