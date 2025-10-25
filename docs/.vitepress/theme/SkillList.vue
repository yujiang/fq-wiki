<!-- 一排skill -->

<template>
  <div class="base-list skill-list">
    <!-- 渲染每个 SkillGrid -->
    <Skill
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
import Skill from "./Skill.vue";
import { SkillIdLevel } from "../../data/skill";


// 接收从父组件传入的 skills 数据
const props = defineProps<{
  skills?: SkillIdLevel[];
}>();

// 建立一个本地副本（确保 watch 能触发内部动画或更新）
const localSkills = ref<SkillIdLevel[]>([]);

// 初次同步
localSkills.value = props.skills || [];

// 监听 props.skill 的变化
watch(
  () => props.skills,
  (newSkill) => {
    // console.log("SkillList: skill changed", newSkill);
    localSkills.value = newSkill || [];
  },
  { deep: true } // 如果 skill 是对象数组，deep 可以检测内部变化
);

</script>

<style scoped>
.skill-list {
}
</style>
