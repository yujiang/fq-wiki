<!-- Talent.vue 天赋技能,没有icon和level,显示Xls.Name, 文字加边框, Xls.Rank用于文字颜色
 <Talent :id="8889" />
 tooltip: v-tips="xls.desc"
 xls = getSkillInfo(props.id)
 textcolor = getRankColor(xls.rank)
 -->

<template>
  <div class="talent" :style="talentStyle" v-tips="()=>tips">
    <span class="talent__name">{{ skill?.Name || '未知天赋' }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { getSkillById, XlsSkill } from "../../../data/skill";
import { getRankTextcolor } from "../../../data/rank";

const props = defineProps<{ id: number }>();

const skill = ref<XlsSkill | null>(null);

const loadSkill = async (id: number) => {
  try {
    skill.value = await getSkillById(id);
  } catch (e) {
    console.error('Talent.vue loadSkill failed', e);
    skill.value = null;
  }
};

onMounted(() => {
  loadSkill(props.id);
});

watch(
  () => props.id,
  (newId) => {
    loadSkill(newId);
  }
);

const tips = computed(() => {
    const xls = skill.value;
    if (!xls) return '';
    return xls.Detail || xls.Desc || xls.Name;
});

const talentStyle = computed(() => ({
  color: getRankTextcolor(skill.value?.Rank),
}));
</script>

<style scoped>
.talent {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border: 1px solid currentColor;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  background: rgba(255, 255, 255, 0.02);
}

.talent__name {
  white-space: nowrap;
}
</style>
