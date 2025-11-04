<!-- TaoluSkillGrid.vue 套路下所有技能 
<TaoluSkillGrid :taolu="60050"  /> 
-->

<template>
    <!-- 直接调用 SkillGrid 展示技能（依赖接口异步返回） -->
    <SkillGrid
      :skills="taoluSkills"
      :rows="props.rows"
      :cols="props.cols"
      :gap="props.gap"
    />
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue";
import SkillGrid from "../SkillGrid.vue";
import { SkillIdLevel } from "../../../data/skill";
import { getTaoluSkills } from "../../../data/taolu";

// 仅保留核心属性
const props = defineProps<{
  taolu: number; // 套路ID（必传）
  rows?: number; // 透传网格行数
  cols?: number; // 透传网格列数（不传则单行）
  gap?: number; // 透传间距（默认8px）
}>();

// 套路技能数据（初始为空数组）
const taoluSkills = ref<SkillIdLevel[]>([]);

// 加载套路技能（简化版：无加载状态，直接请求）
const loadTaoluSkills = async () => {
  try {
    const skills = await getTaoluSkills(props.taolu);
    taoluSkills.value = skills || []; // 接口返回空则置空
  } catch (err) {
    console.error(`套路[${props.taolu}]技能加载失败`, err);
    taoluSkills.value = []; // 失败时也置空，避免渲染异常
  }
};

// 初始化加载
onMounted(loadTaoluSkills);

// 套路ID变化时重新加载
watch(() => props.taolu, loadTaoluSkills);
</script>

<style scoped>
</style>