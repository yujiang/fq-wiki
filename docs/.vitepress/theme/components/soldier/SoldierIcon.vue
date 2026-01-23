<!-- SoldierIcon.vue 显示soldier的icon
<SoldierIcon :soldierId="1" />
-->

<template>
  <!-- 点击时触发选中事件，添加选中状态的样式类 -->
  <div
    class="base-item-game soldiericon-game"
    :class="{ 'soldiericon-game--selected': isSelected }"
  >
    <div class="icon-wrap" :style="backgroundStyle">
      <img v-if="soldiericon" :src="soldiericon" alt="" class="icon" />
      <!-- 选中时显示的标记 -->
      <div class="select-marker" v-if="isSelected">✓</div>
    </div>
    <div class="base-item-name soldier-name" v-if="soldier?.Name">
      {{ soldier.Name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import {
  XlsSoldier,
  getSoldier,
  getSoldierIcon
} from "../../../data/soldier";
import { getRankBgStyle } from "../../../data/xls";

// 接收 props：新增 isSelected 控制选中状态
const props = defineProps<{
  soldierId: number;
  isSelected?: boolean; // 外部传入的选中状态（默认 false）
}>();

let soldier = ref<XlsSoldier | undefined>(undefined);
let soldiericon = ref("");

onMounted(async () => {
  updateCurrentSoldier(props.soldierId);
});

watch(
  () => props.soldierId,
  (newId) => {
    updateCurrentSoldier(newId);
  }
);

const updateCurrentSoldier = async (id: number) => {
  const xls = await getSoldier(id);
  soldier.value = xls;
  soldiericon.value = getSoldierIcon(xls?.display?.icon);
};

const backgroundStyle = computed(() => getRankBgStyle(soldier.value?.Rank));
</script>

<style scoped>
.soldier-name {
  /* 样式与npc-name类似 */
}

.soldiericon-game--selected {
  outline: 1px solid #42b983;
  border-radius: 1px;
}

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

.icon-wrap {
  position: relative;
}
</style>