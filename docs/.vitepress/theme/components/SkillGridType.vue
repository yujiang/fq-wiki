<template>
  <!-- 复用 SkillGrid 组件，传入计算后的技能数组和布局参数 -->
  <SkillGrid
    :skills="filteredSkills"
    :rows="rows"
    :cols="cols"
    :gap="gap"
    v-if="!isLoading"
  />

  <!-- 加载状态 -->
  <div class="loading" v-if="isLoading">加载技能中...</div>

  <!-- 空状态 -->
  <div class="empty" v-if="!isLoading && filteredSkills.length === 0">
    暂无 {{ type || school }} 类型的技能
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue";
import SkillGrid from "./SkillGrid.vue";
import { getSkillsFileSchool, getSkillsFileType, SkillIdLevel, Skills } from "../../data/skill";

// 接收类型和布局参数
const props = defineProps<{
  file: string; // 技能类型（如 'lifeskill'、'combat' 等）

  type?: string; // 子类
  school?: string; // 门派

  rows?: number; // 传递给 SkillGrid 的行数
  cols?: number; // 传递给 SkillGrid 的列数
  gap?: number; // 传递给 SkillGrid 的间距
}>();

// 状态管理
const isLoading = ref(true); // 加载状态
const allSkills = ref<Skills>([]); // 所有技能数据
const filteredSkills = ref<SkillIdLevel[]>([]); // 当前类型的技能

// 获取类型的中文名称（如 'lifeskill' → '生活技能'）

async function updateContent() {
  const skills = props.type
    ? await getSkillsFileType(props.file, props.type)
    : await getSkillsFileSchool(props.file, props.school);
  filteredSkills.value = Object.values(skills).map((skill) => ({
    id: skill.Id,
  }));
}

// 加载所有技能数据
const loadSkills = async () => {
  isLoading.value = true;
  try {
    // 从数据源获取所有技能
    updateContent();
  } catch (error) {
    console.error(`加载技能数据失败:`, error);
    allSkills.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 初始化加载
onMounted(loadSkills);

// 监听类型变化，重新筛选技能
watch(() => [props.file, props.type, props.school], updateContent);
</script>

<style scoped>
/* 加载状态样式 */
.loading {
  padding: 40px 0;
  text-align: center;
  color: #666;
  font-size: 14px;
}

/* 空状态样式 */
.empty {
  padding: 40px 0;
  text-align: center;
  color: #999;
  background: #fafafa;
  border-radius: 4px;
  font-size: 14px;
}
</style>
