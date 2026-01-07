<!-- TaskMainTabs.vue 主线剧情
<TaskMainTabs :taskIds="[10001,20001,30001]"/>  
自动分成第一章,第二章,第三章... 调用TaskCard.vue
-->

<template>
    <div class="task-main-tabs">
        <!-- 顶部 Tabs -->
        <div class="tabs">
            <template v-if="chapters.length">
                <button v-for="g in chapters" :key="g.Id" class="tab" :class="{ active: g.Id === active }"
                    @click="onSwitch(g.Id)">
                    <span class="label">{{ getChapterName(g.Id) }}</span>
                </button>
            </template>
            <div v-else class="empty">暂无任务</div>
        </div>

        <!-- 任务列表区域 -->
        <div class="panel" v-if="activeGroup">
            <TaskCard :taskId="activeGroup.Id" 
            :chapter="true" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect, onMounted } from 'vue'
import TaskCard from './TaskCard.vue'
import { getChapterName } from '../../../Utils/text'
import { getChapter, getChapters, XlsChapter } from '../../../data/chapter';

let chapters = ref<XlsChapter[]>([]);

onMounted(updateChapters);

async function updateChapters(){
    const datas = await getChapters();
    const rt = [];
    for (const data of Object.values(datas)) {
        rt[data.Id - 1] = data;
    }
    chapters.value = rt;
}

// 当前激活章
const active = ref<number | null>(null)

watchEffect(() => {
    // 优先用 v-model 值；否则用第一个分组；没有则 null
    active.value = chapters.value[0]?.Id ?? null
})

function onSwitch(chapterNo: number) {
    if (active.value === chapterNo) return
    active.value = chapterNo
}

const activeGroup = computed(() =>
    chapters.value.find(g => g.Id === active.value)
)
</script>

<style scoped>
.task-main-tabs {
    display: grid;
    gap: 12px;
}

.tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tab {
    border: 1px solid var(--vp-c-divider, #ddd);
    background: var(--vp-c-bg-soft, #f8f8f8);
    padding: 6px 10px;
    border-radius: 10px;
    cursor: pointer;
    line-height: 1.2;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    user-select: none;
}

.tab.active {
    border-color: var(--vp-c-brand, #3e63dd);
    background: var(--vp-c-brand-soft, #eef2ff);
    color: var(--vp-c-brand, #3e63dd);
}

.label {
    font-weight: 600;
}

.count {
    opacity: 0.7;
    font-size: 12px;
}

.panel {
    display: grid;
    gap: 10px;
}

.empty {
    color: #888;
    font-size: 14px;
}
</style>
