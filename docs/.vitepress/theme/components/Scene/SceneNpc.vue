<!-- SceneNpc.vue 场景npc分类显示, tabs wrap NpcCards.vue
 <SceneNpc :sceneId="1023"/>
 -->

<template>
  <div class="scene-npc-container">
    <!-- 加载状态 -->
    <div class="loading" v-if="isLoading">加载场景NPC中...</div>

    <!-- 如果没有任何 NPC，则整个模块不显示 -->
    <div v-else-if="totalCount > 0">
      <!-- 标签页 -->
      <!-- <div> {{ currentTab }}</div> -->
      
      <div class="scene-npc__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.type"
          :class="{ active: currentTab === tab.type }"
          @click="currentTab = tab.type"
          :disabled="counts[tab.type] === 0"
        >
          {{ tab.label }} ({{ counts[tab.type] }})
        </button>
      </div>

      <!-- 当前分类列表 -->
      <NpcCards :npcIds="currentList" :key="currentTab" />
    </div> <!-- totalCount === 0 时什么都不渲染（满足 #1） -->
    <!-- 没有 NPC 时显示“无” -->
    <div v-else class="no-npc">无</div>    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import NpcCards from "../base/NpcCards.vue";
import { fillterNpcByScene, getNpcs } from "../../../data/npc";
import { getObserves } from "../../../data/observe";
import { getSoldiers } from "../../../data/soldier";

type NpcType = "soldier" | "skill" | "other";
const tabs: Array<{ type: NpcType; label: string }> = [
  { type: "soldier", label: "益友" },
  { type: "skill", label: "良师" },
  { type: "other", label: "其他" },
];

const props = defineProps<{ sceneId: number }>();

const allNpcs = ref<Record<NpcType, number[]>>({
  soldier: [],
  skill: [],
  other: [],
});
const currentTab = ref<NpcType>("soldier");
const isLoading = ref(true);

// 计数 & 总数（满足 #2）
const counts = computed(() => ({
  soldier: allNpcs.value.soldier.length,
  skill: allNpcs.value.skill.length,
  other: allNpcs.value.other.length,
}));
const totalCount = computed(
  () => counts.value.soldier + counts.value.skill + counts.value.other
);

// 当前 tab 的列表
const currentList = computed(() => allNpcs.value[currentTab.value] ?? []);

// 防并发
let reqToken = 0;

async function updateSceneNpcs(sceneId: number) {
  const token = ++reqToken;
  isLoading.value = true;
  try {
    const [sceneNpcs, allnpcs, obs, soldiers] = await Promise.all([
      fillterNpcByScene(sceneId),
      getNpcs(),
      getObserves(),
      getSoldiers(),
    ]);
    if (token !== reqToken) return;

    const soldierSet = new Set<number>();
    const skillSet = new Set<number>();
    const otherSet = new Set<number>();

    for (const npc of sceneNpcs) {
      const oid = npc.Observe || npc.Id;
      const ox = obs[oid];
      if (!ox) continue;

      const id = ox.Id;
      const sid = ox.Soldier || id;

      if (sid && soldiers[sid]) {
        soldierSet.add(id);
      } else if (ox.Skills && ox.Skills.length) {
        skillSet.add(id);
      } else if (ox.Items && ox.Items.length) {
        otherSet.add(id);
      } else if (allnpcs[npc.Id]) {
        otherSet.add(id);
      }
    }

    allNpcs.value = {
      soldier: [...soldierSet],
      skill: [...skillSet],
      other: [...otherSet],
    };

    currentTab.value = "soldier";

    // 满足 #3：若当前（默认“益友”）为 0，则自动选中下一个非空
    if ((allNpcs.value[currentTab.value] ?? []).length === 0) {
      const next = (["soldier", "skill", "other"] as NpcType[]).find(
        (t) => allNpcs.value[t].length > 0
      );
      if (next) currentTab.value = next;
    }
  } catch (e) {
    console.error("加载失败:", e);
  } finally {
    if (token === reqToken) isLoading.value = false;
  }
}

// 初始化 + 监听
onMounted(() => updateSceneNpcs(props.sceneId));
watch(() => props.sceneId, (id) => updateSceneNpcs(id));
</script>

<style scoped>
.scene-npc-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 0px;
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