<template>
  <div class="item-like">
    <div class="tabs">
      <div v-for="(items, category) in groupedTabs" :key="category" class="tab-group">
        <div class="tab-group-title">{{ category }}</div>
        <div class="tab-group-items">
          <button
            v-for="tag in items"
            :key="tag"
            :class="{ active: activeTag === tag }"
            @click="activeTag = tag"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>
    <div class="item-list">
      <ItemList :items="filteredItems" />
      <div class="npc-like" v-if="npcList.length">
        <div class="npc-like-title">喜欢的人</div>
        <NpcList :npcs="npcList" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ItemList from '../ItemList.vue'
import NpcList from '../NpcList.vue'
import { getAllItems, ItemIdCount, Items, XlsItem } from '../../../data/item'
import { getObserves, Observes, XlsObserve } from '../../../data/observe'

const tags = ref<string[]>([])
const activeTag = ref<string>('')
const allItems = ref<Items>({})
const allObserves = ref<Observes>({})

// 定义 tag 分类
const tagCategories = {
  琴棋书画: ['乐谱', '围棋', '棋具', '棋谱', '书法', '绘画', '文房四宝', '话本', '字画', '诗词', '书籍', '画'],
  材料: ['矿石', '蔬菜', '肉类', '鱼类', '香料', '水果', '皮毛', '花', '奇虫', '草药', '木材', '金属', '宝石', '药材', '皮革', '布料', ],
  食物: ['零食', '素菜', '荤菜', '酒水', '食物'],   
  // 秘籍: ['刀法', '棍法', '拳法', '剑法', '武学秘籍', '经脉秘籍', '内功', '轻功'],
  生活技能: ['玩具', '木器', '药品', '伤药', '武器', '防具','服装','首饰'],
}

// 计算分组后的 tabs
const groupedTabs = computed(() => {
  const groups: Record<string, string[]> = {}
  
  // 初始化分类
  Object.entries(tagCategories).forEach(([category, items]) => {
    groups[category] = []
  })
  groups['其他'] = []
  
  // 对每个 tag 进行分类
  tags.value.forEach(tag => {
    let found = false
    for (const [category, items] of Object.entries(tagCategories)) {
      if (items.includes(tag)) {
        groups[category].push(tag)
        found = true
        break
      }
    }
    if (!found) {
      groups['其他'].push(tag)
    }
  })
  
  return groups
})

onMounted(async () => {
  allItems.value = await getAllItems()
  allObserves.value = await getObserves()
  // 遍历所有items，收集所有LikeTags
  const tagSet = new Set<string>()
  Object.values(allItems.value).forEach((item: any) => {
    if (item.LikeTags && Array.isArray(item.LikeTags)) {
      item.LikeTags.forEach((tag: string) => {
        tagSet.add(tag)
      })
    }
  })
  
  // 过滤：只保留至少有一个NPC喜欢的tags
  const tagsWithNpc = Array.from(tagSet).filter(tag => {
    const hasNpc = Object.values(allObserves.value).some((obs: XlsObserve) => {
      const like = obs?.Like?.tags
      if (!like) return false
      if (typeof like === 'string') {
        return like === tag
      } else if (Array.isArray(like)) {
        return like.includes(tag)
      }
      return false
    })
    return hasNpc
  })
  
  tags.value = tagsWithNpc.sort()
  if (tags.value.length > 0) {
    activeTag.value = tags.value[0]
  }
})

const filteredItems = computed<ItemIdCount[]>(() => {
  return Object.values(allItems.value)
    .filter((item: XlsItem) => {
      return item.LikeTags && item.LikeTags.includes(activeTag.value)
    })
    .map((xls: XlsItem) => {
      return { id: xls.Id, count: 1 }
    })
})

const npcList = computed<number[]>(() => {
  const tag = activeTag.value
  if (!tag) return []
  const set = new Set<number>()
  Object.values(allObserves.value).forEach((obs: XlsObserve) => {
    const like = obs?.Like?.tags
    if (!like) return
    const npc = obs.Npc || obs.Id;
    if (typeof like === 'string') {
      if (like === tag) set.add(npc)
    } else if (Array.isArray(like)) {
      if (like.includes(tag)) set.add(npc)
    }
  })
  return Array.from(set)
})
</script>

<style scoped>
.item-like {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tabs {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  max-height: 12rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.tab-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tab-group-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tab-group-items {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tabs button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s;
}

.tabs button:hover {
  background: var(--vp-c-bg-mute);
}

.tabs button.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.item-list {
  margin-top: 1rem;
}

.npc-like {
  margin-top: 0.75rem;
}

.npc-like-title {
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: var(--vp-c-text);
}
</style>


<!-- ItemLike.vue 
1. item.ts getAllItem
2. 遍历LikeTags得到所有tags
    参考5, 如果npclist为空,删除该tag
3. 每个tag做成一个tab
4. 点tab显示ItemList
5. ItemList下用NpcList显示喜欢的人 
    npclist如何得到, 遍历getObserves(), 其Like的tags包含当前tag, 取出Npc放入npclist
6. 希望tabs有明确的分类
    琴棋书画 -- 乐谱,围棋,书法,绘画,文房四宝,话本
    材料 -- 矿石,蔬菜,肉类,鱼类,香料,
    食物 -- 零食,素菜,荤菜,酒水,
    生活技能 -- 玩具,木器,药品,武器,防具
    其他 -- 之外的
-->
