<template>
  <div class="life-skill">
    <div v-if="!loaded">加载中…</div>
    <div v-else>
      <div v-for="(entry0, scene) in sortedEntries" :key="scene" class="area-row">
        <div class="scene">
          <span>{{ getSceneName(Number(scene)) }}</span>
        </div>
        <div class="npcskill">
        <div v-for="(entry, id) in entry0" :key="id" class="skill-row">
            <div class="npc">
                <NpcIcon :npcId="Number(id)" />
            </div>
            <div class="skills">
            <ItemGrid :items="entry" :cols="3" :rows="entry.length > 3 ? 2 : 1" />
            </div>
        </div>
        </div>
      </div>
      <div v-if="entriesCount===0">未发现生活技能观察点。</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import NpcIcon from '../NpcIcon.vue'
import { getObserves, observe2Asks, observe2Items, XlsObserve } from '../../../data/observe'
import { getNpcArea } from '../../../data/npc'
import { getSceneName } from '../../../data/scene'
import { ItemIdCount } from '../../../data/item'
import ItemGrid from '../ItemGrid.vue'

// 接收场景ID（核心参数）
const props = defineProps<{
  ask?: boolean; // 场景唯一标识（如杏花村=101）
}>();

type SkillEntry = Record<number, ItemIdCount[]>;

const loaded = ref(false)
const map = ref<Record<number, SkillEntry>>({})

const entriesCount = computed(() => Object.keys(map.value).length)

const sortedEntries = computed(() => {
  const arr = Object.entries(map.value)
    .map(([k, v]) => [Number(k), v] as [number, SkillEntry])
    .sort((a, b) => a[0] - b[0])
  const obj: Record<number, SkillEntry> = {}
  arr.forEach(([k, v]) => (obj[k] = v))
  return obj
})

onMounted(async () => {
  const observes = await getObserves()
  for (const o of Object.values(observes) as XlsObserve[]) {
    const outs = props.ask ? observe2Asks(o.AskItems) : observe2Items(o.Items) 
    if (!outs ||outs.length === 0) continue;
    const area = await getNpcArea(o.Id);
    const areaMap = map.value[area] || {};
    areaMap[o.Id] = outs;
    map.value[area] = areaMap;
  }
  // console.log('loaded.value = true')
  loaded.value = true
})
</script>

<style scoped>

.area-row {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
  background: var(--vp-c-bg-soft);
}
    
.life-skill { display:flex;  gap:1rem }

.npcskill {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem; /* 行列间距，自行调 */
}

.npc-row { display:flex; gap:0.2rem; flex-wrap:wrap }
.skill-row { display:flex; gap:0.2rem; align-items:center }

</style>


<!-- LifeSkill.vue 
1. observe.ts all = getObserves()
2. 遍历all, 遍历for s of Skills
    skillid = s[0] 
    lifeskill.ts getLifeskill(skillid)存在
    列出npc + skills
        npc用NpcIcon.vue
        skills用SkillList.vue
-->
