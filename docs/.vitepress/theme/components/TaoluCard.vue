<!-- 套路下一排skill -->

<template>
  <div class="skill-list">
    <!-- 渲染每个 SkillGrid -->
    <SkillGrid
      v-for="(skill, index) in localSkills"
      :key="skill.id || index"
      :id="skill.id"
      :level="skill.level"
      :unlock="skill.unlock"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, onMounted } from "vue";
import SkillGrid from "./SkillGrid.vue";
import { SkillIdLevel } from "../../data/skill";
import { getTaoluSkills } from "../../data/taolu";

// 接收从父组件传入的 skills 数据
const props = defineProps<{
  taolu?: number;
  skills?: SkillIdLevel[];
}>();

// 建立一个本地副本（确保 watch 能触发内部动画或更新）
const localSkills = ref<SkillIdLevel[]>([]);

// 初次同步
localSkills.value = props.skills || [];

onMounted(async () => {
  if (props.taolu) {
    const skills = await getTaoluSkills(props.taolu);
    localSkills.value = skills;
  }
});

// 监听 props.skills 的变化
watch(
  () => props.skills,
  (newSkills) => {
    // console.log("SkillList: skills changed", newSkills);
    localSkills.value = newSkills || [];
  },
  { deep: true } // 如果 skills 是对象数组，deep 可以检测内部变化
);
</script>

<style scoped>
.skill-list {
  display: flex;
  flex-wrap: wrap; /* 允许自动换行 */
  gap: 4px;
  padding: 6px;
}
</style>
