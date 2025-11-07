<!-- TaskMainTabs.vue 主线剧情
<TaskMainTabs :taskIds="[10001,20001,30001]"/>  
自动分成第一章,第二章,第三章... 调用TaskCard.vue
-->

<template>
    <div class="task-main-tabs">
        <!-- 顶部 Tabs -->
        <div class="tabs">
            <template v-if="groups.length">
                <button v-for="g in groups" :key="g.chapterNo" class="tab" :class="{ active: g.chapterNo === active }"
                    @click="onSwitch(g.chapterNo)">
                    <span class="label">{{ g.label }}</span>
                </button>
            </template>
            <div v-else class="empty">暂无任务</div>
        </div>

        <!-- 任务列表区域 -->
        <div class="panel" v-if="activeGroup">
            <TaskCard :taskId="activeGroup.id" 
            :end="activeGroup.end"
            :offHeader="activeGroup.offHeader" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import TaskCard from './TaskCard.vue'
import { getChapterName } from '../../../Utils/text'

/**
 * 约定：taskId 的万位表示章：
 *   10001 -> 第一章
 *   20023 -> 第二章
 *   300xx -> 第三章
 * 计算方式：Math.floor(taskId / 10000)
 */
const props = defineProps<{
    taskIds: number[],
    /** 可选：外部控制默认激活章（1=第一章，2=第二章...） */
}>()

// 分组：{ chapterNo: number, label: string, id: number, end: number }[]
const groups = computed(() => {
    return props.taskIds.map((taskId, index) => {
        return {
            chapterNo: index + 1,
            label: getChapterName(index + 1),
            id: taskId,
            end: props.taskIds[index + 1] ?? 0,
            offHeader: true,
        }
    }
    )
})

// 当前激活章
const active = ref<number | null>(null)

watchEffect(() => {
    // 优先用 v-model 值；否则用第一个分组；没有则 null
    active.value = groups.value[0]?.chapterNo ?? null
})

function onSwitch(chapterNo: number) {
    if (active.value === chapterNo) return
    active.value = chapterNo
}

const activeGroup = computed(() =>
    groups.value.find(g => g.chapterNo === active.value)
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
