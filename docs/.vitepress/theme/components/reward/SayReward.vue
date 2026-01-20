<!-- SayReward.vue 
  遍历say.ts的GetSays(), 如果reward非空
  显示Name, Say, reward(用RewardCard.vue)
  用tab页，id按照万位单位分组 1w，2w ...
  如果tab下的say数目 <5， 统一归入组other
  不用传入参数。
-->
<template>
  <div class="say-reward">
    <div class="say-reward__tabs">
      <button
        v-for="w in groupKeys"
        :key="w"
        :class="['tab-btn', { active: currentGroup === w }]"
        @click="currentGroup = w"
      >
        {{ w }}
      </button>
    </div>
    <div class="say-reward__list">
      <div
        v-for="say in currentSays"
        :key="say.Id"
        class="say-reward__item"
      >
        <div class="say-reward__header">
          <span class="say-reward__name">{{ say.Id }}</span>
        </div>
        <div class="say-reward__say">{{ say.Say }}</div>
        <div class="say-reward__reward" v-if="say.Reward">
          <RewardCard :rewardId="say.Reward" title="no" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getSays, XlsSay } from '../../../data/say'
import RewardCard from './RewardCard.vue'

const isDev = import.meta.env.DEV

const says = ref<Record<number, XlsSay>>({})
const groups = ref<Record<string, XlsSay[]>>({})
const currentGroup = ref<string>('')

const groupKeys = computed(() => {
  const keys = Object.keys(groups.value)
  return keys.sort((a, b) => {
    if (a === 'other') return 1
    if (b === 'other') return -1
    const numA = parseInt(a.replace('w', ''))
    const numB = parseInt(b.replace('w', ''))
    return numA - numB
  })
})

const key2scene:Record<number,string> = {
    1: '杏花村',
    2: '芦苇荡',
    5: '临安',
    6: '汴京',
    8: '武昌',
}

const currentSays = computed(() => {
  if (!currentGroup.value) return []
  return groups.value[currentGroup.value] || []
})

onMounted(async () => {
  const all = await getSays()
  says.value = all

  const grouped: Record<string, XlsSay[]> = {}
  for (const id in all) {
    const say = all[id]
    if (say.Reward) {
      const w = Math.floor(say.Id / 10000)
      const key = `${w}w` + (key2scene[w] || '')
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(say)
    }
  }

  const other: XlsSay[] = []
  for (const key in grouped) {
    if (grouped[key].length < 5) {
      other.push(...grouped[key])
      delete grouped[key]
    }
  }

  if (other.length > 0) {
    grouped['other'] = other
  }

  groups.value = grouped
  if (groupKeys.value.length > 0) {
    currentGroup.value = groupKeys.value[0]
  }
})
</script>

<style scoped>
.say-reward {
  max-width: 800px;
  margin: 0 auto;
}

.say-reward__tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 6px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: var(--vp-c-brand);
}

.tab-btn.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: white;
}

.say-reward__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.say-reward__item {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 16px;
  background: var(--vp-c-bg);
}

.say-reward__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.say-reward__name {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text);
}

.say-reward__id {
  font-size: 12px;
  color: var(--vp-c-text-tertiary);
}

.say-reward__say {
  font-size: 14px;
  color: var(--vp-c-text-secondary);
  margin-bottom: 12px;
  line-height: 1.5;
}

.say-reward__reward {
  margin-top: 8px;
}
</style>
