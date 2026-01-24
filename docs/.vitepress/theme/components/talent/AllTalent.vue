<!-- AllTalent.vue 
遍历 getTalentSkills() ,按照xls.Kind形成tab页
每个kind下 再次按照xls.Type分组
每组用 一行 TalentList.vue 显示
-->

<template>
  <div class="all-talent">
    <div class="all-talent__loading" v-if="isLoading">加载中...</div>

    <div class="all-talent__content" v-else>
      <div class="tabs" v-if="kindTabs.length > 1">
        <button
          v-for="kind in kindTabs"
          :key="kind.key"
          :class="['tab-button', { active: activeKind === kind.key }]"
          @click="activeKind = kind.key"
        >
          {{ kind.label }} ({{ kind.count }})
        </button>
      </div>

      <div class="tabs-content">
        <div v-if="activeTypes.length > 0" class="all-talent__types">
          <div
            v-for="group in activeTypes"
            :key="group.key"
            class="all-talent__type"
          >
            <div class="all-talent__type-title">
              {{ group.label }} ({{ group.count }})
            </div>
            <TalentList :talents="group.skills" />
          </div>
        </div>
        <div class="empty-state" v-else>该类型暂无天赋</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getTalentSkills, XlsTalentSkill } from "../../../data/talentSkill";
import TalentList from "../talent/TalentList.vue";

interface TalentGroup {
  key: string;
  label: string;
  skills: number[];
  count: number;
}

const isLoading = ref(true);
const talentSkills = ref<XlsTalentSkill[]>([]);
const activeKind = ref<string>("");

const groupedTalents = computed(() => {
  const groups: Record<string, Record<string, number[]>> = {};
  talentSkills.value.forEach((skill) => {
    const kind = skill.Kind || "其他";
    const type = skill.Type || "其他";
    if (!groups[kind]) groups[kind] = {};
    if (!groups[kind][type]) groups[kind][type] = [];
    groups[kind][type].push(skill.Id);
  });
  return groups;
});

const kindTabs = computed(() => {
  return Object.entries(groupedTalents.value).map(([kind, typeMap]) => ({
    key: kind,
    label: kind,
    count: Object.values(typeMap).reduce((sum, list) => sum + list.length, 0),
  }));
});

const activeTypes = computed(() => {
  const types = groupedTalents.value[activeKind.value] || {};
  return Object.entries(types).map(([type, skills]) => ({
    key: type,
    label: type,
    skills,
    count: skills.length,
  }));
});

onMounted(async () => {
  try {
    const allSkills = await getTalentSkills();
    talentSkills.value = Object.values(allSkills);
    if (kindTabs.value.length > 0) {
      activeKind.value = kindTabs.value[0].key;
    }
  } catch (error) {
    console.error("Failed to load talent skills:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.all-talent {
  width: 100%;
  padding-top: 12px;
}

.all-talent__loading {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-2);
}

.all-talent__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.tab-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-button:hover:not(.active) {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.tab-button.active {
  background: var(--vp-c-brand-1);
  color: white;
  font-weight: 500;
}

.tabs-content {
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.all-talent__types {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.all-talent__type-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
  font-style: italic;
}

@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }

  .tab-button {
    text-align: left;
    justify-content: flex-start;
  }
}
</style>
