<template>
  <div class="base-item-game taolu-game">
    <!-- 使用 NTooltip 包裹触发元素 -->
    <n-tooltip :style="{ maxWidth: '200px' }" trigger="hover">
      <!-- 触发元素放在 #trigger 插槽中 -->
      <template #trigger>
        <div class="icon-wrap" :style="backgroundStyle">
          <img v-if="taoluicon" :src="taoluicon" alt="" class="icon"  />
        </div>
      </template>
      <!-- Tooltip 内容通过插槽传递，动态绑定 taolu.desc -->
      <div>{{ taolu?.Detail }}</div>
    </n-tooltip>
      <div class="base-item-name taolu-name" v-if="taolu?.Name">{{ taolu.Name }}</div> <!-- 物品名字 -->
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, watch, computed } from "vue";
import { XlsTaolu,getTaolu  } from "../../data/taolu";
import { getSkillIcon } from "../../data/skill";
import { getRankBgStyle } from "../../data/xls";

// 接收 props 数据
const props = defineProps<{id:number}>();

// 异步加载所有 taolus
let taolu = ref<XlsTaolu | null>(null);
let taoluicon = ref('');

// 初始化并加载数据
onMounted(async () => {
  updateCurrentTaolu(props.id);
});

// 监听 good 变化
watch(
  () => props.id,
  (newGood) => {
    updateCurrentTaolu(newGood);
  }
);

const updateCurrentTaolu = async (id: number) => {
  taolu.value = await getTaolu(id);
  taoluicon.value = getSkillIcon(taolu.value?.Icon);
};

// 根据 rank 动态计算背景图片
const backgroundStyle = computed(() => getRankBgStyle(taolu.value?.Rank));
</script>

<style scoped>

.taolu-name {}

</style>
