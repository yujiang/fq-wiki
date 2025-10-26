<template>
  <div class="scene-npc-container">
    <!-- 加载状态 -->
    <div class="loading" v-if="isLoading">加载场景NPC中...</div>

    <div v-else>
      <!-- 标签页 -->
      <div class="scene-npc__tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.type"
          :class="{ 'active': currentTab === tab.type }"
          @click="currentTab = tab.type"
          :disabled="filteredNpcs(tab.type).length === 0"
        >
          {{ tab.label }} ({{ filteredNpcs(tab.type).length }})
        </button>
      </div>

      <!-- 直接传当前分类的「选中ID」和「列表」，不用v-model -->
      <NpcCards 
        :npcIds="filteredNpcs(currentTab)" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, watch, computed } from "vue";
import NpcCards from "./NpcCards.vue";
import { fillterNpcByScene } from "../../data/npc";
import { getObserves } from "../../data/observe";
import { getSoldiers } from "../../data/soldier";

type NpcType = "soldier" | "skill" | "other";
const tabs = [
  { type: "soldier" as NpcType, label: "伙伴" },
  { type: "skill" as NpcType, label: "师长" },
  { type: "other" as NpcType, label: "其他" },
];

const props = defineProps<{ sceneId: number }>();

const allNpcs = ref<Record<NpcType, number[]>>({ soldier: [], skill: [], other: [] });
const currentTab = ref<NpcType>("soldier");
const isLoading = ref(true);

// 过滤当前分类的NPC列表
const filteredNpcs = (type: NpcType) => {return allNpcs.value[type] || []};

// 加载数据 + 初始化「未手动选择分类」的默认选中（第一个）
async function updateSceneNpcs(sceneId: number) {
  isLoading.value = true;
  try {
    const npcs = await fillterNpcByScene(sceneId);
    const obs = await getObserves();
    const soldiers = await getSoldiers();
    const soldierSet = new Set<number>();
    const skillSet = new Set<number>();
    const otherSet = new Set<number>();

    for (const npc of npcs) {
      const oid = npc.Observe || npc.Id;
      const xls = obs[oid];
      if (xls) {
        const sid = xls.Soldier || npc.Id;
        if (soldiers[sid]) soldierSet.add(xls.Id);
        else if (xls.Skills) skillSet.add(xls.Id);
        else if (xls.Items) otherSet.add(xls.Id);
      }
    }

    soldierSet.forEach(a => {
        skillSet.delete(a);
        otherSet.delete(a);
    });

    skillSet.forEach(a => {
        otherSet.delete(a);
    })

    // 存分类列表
    allNpcs.value = {
      soldier: [...soldierSet],
      skill: [...skillSet],
      other: [...otherSet]
    };


  } catch (e) {
    console.error("加载失败:", e);
  } finally {
    isLoading.value = false;
  }
}

// 初始化 + 监听场景变化
onMounted(() => updateSceneNpcs(props.sceneId));
watch(() => props.sceneId, (newId) => updateSceneNpcs(newId));
</script>

<style scoped>
.scene-npc-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 加载状态 */
.loading {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

/* 标签页样式 */
.scene-npc__tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.scene-npc__tabs button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-radius: 4px 4px 0 0;
  transition: all 0.2s;
}

.scene-npc__tabs button.active {
  color: #333;
  font-weight: 500;
  border-bottom: 2px solid #42b983;
}

.scene-npc__tabs button:hover:not(.active):not(:disabled) {
  color: #333;
  background: #f5f5f5;
}

/* 空分类标签样式 */
.scene-npc__tabs button:disabled {
  color: #ccc;
  cursor: not-allowed;
}
</style>