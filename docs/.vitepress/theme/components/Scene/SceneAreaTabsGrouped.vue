<template>
    <div class="scene-area-tabs-wrapper">
        <div class="scene-area-tabs-container">
            <!-- 在第一个分组前插入“选择区域” -->
            <div class="section-label">
                🧭 选择区域
            </div>

            <template v-for="(areas, category, index) in sceneAreas" :key="category">
                <!-- 每个分组 -->
                <div class="category-block" :style="{ '--group-color': getCategoryColor(category) }">
                    <h3 class="category-title">
                        <span class="color-bar" />
                        <span class="title-text">{{ category }}</span>
                    </h3>

                    <div class="area-tab-bar">
                        <button v-for="areaId in areas" :key="areaId"
                            :class="['area-tab', { active: areaId === activeAreaId }]" @click="activeAreaId = areaId">
                            {{ getAreaName(areaId) }}
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </div>

    <!-- 当前区域显示 -->
    <div class="area-content-box" v-if="activeAreaId !== null && hasSceneNames">
        <SceneArea :key="activeAreaId" :sceneArea="activeAreaId" class="area-content" />
    </div>
    <div v-else class="loading">加载中...</div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import SceneArea from './SceneArea.vue'
import { getScenes, type Scenes } from '../../../data/scene'

// 传入示例：{ 主城:[1023,1003], 门派:[1007,1008], 势力:[1025,1026] }
const props = defineProps<{
    sceneAreas: Record<string, number[]>
}>()

const activeAreaId = ref<number | null>(null)
const scenesNames = ref<Scenes>({})

onMounted(async () => {
    scenesNames.value = await getScenes()
    const firstCategory = Object.keys(props.sceneAreas)[0]
    activeAreaId.value = props.sceneAreas[firstCategory]?.[0] ?? null
})

const hasSceneNames = computed(() => Object.keys(scenesNames.value).length > 0)

watch(
    () => props.sceneAreas,
    (newVal) => {
        if (!newVal) return
        const allIds = Object.values(newVal).flat()
        if (!allIds.includes(activeAreaId.value!)) {
            const firstCat = Object.keys(newVal)[0]
            activeAreaId.value = newVal[firstCat]?.[0] ?? null
        }
    },
    { deep: true }
)

function getAreaName(id: number) {
    const xls = scenesNames.value[id]
    return xls?.Name ?? `区域 ${id}`
}

/* ---- 分组配色 ---- */
const fixedColors: Record<string, string> = {
    主城: '#0078d4', // 蓝
    门派: '#2E8B57', // 绿
    势力: '#A52A2A', // 红棕
}
const palette = ['#0078d4', '#2E8B57', '#A52A2A', '#8B4513', '#9932CC', '#FF8C00']
const dynamicColors = new Map<string, string>()
function getCategoryColor(category: string): string {
    if (fixedColors[category]) return fixedColors[category]
    if (dynamicColors.has(category)) return dynamicColors.get(category)!
    const color = palette[dynamicColors.size % palette.length]
    dynamicColors.set(category, color)
    return color
}
</script>

<style scoped>
/* 整体外框 */
.scene-area-tabs-wrapper {
    border: 2px solid #ccc;
    border-radius: 10px;
    background: #fafafa;
    padding: 12px 14px 0px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

/* 分组容器 */
.scene-area-tabs-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 10px;
}

/* 每个分组块 */
.category-block {
    padding-bottom: 8px;
    border-bottom: 1px dashed #ddd;
}

/* 分组标题 */
.category-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 4px 0;
    color: var(--group-color, #0078d4);
}

.color-bar {
    width: 6px;
    height: 18px;
    border-radius: 3px;
    background: var(--group-color, #0078d4);
}

.title-text {
    line-height: 1;
}

/* 区域按钮 */
.area-tab-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.area-tab {
    padding: 6px 12px;
    border: 1px solid var(--group-color, #0078d4);
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    color: #333;
    transition: 0.2s;
}

.area-tab:hover {
    background: var(--group-color, #0078d4);
    color: #fff;
}

.area-tab.active {
    background: var(--group-color, #0078d4);
    color: #fff;
    border-color: var(--group-color, #0078d4);
}

/* 区域内容显示 */
.area-content-box {
    border-top: 2px solid #ddd;
    padding-top: 8px;
    background: #fff;
    border-radius: 6px;
}

.loading {
    text-align: center;
    color: #888;
    padding: 8px 0;
}

.section-label {
    font-weight: bold;
    font-size: 1.05rem;
    color: #555;
    margin: 4px 0 6px;
    border-left: 4px solid #0078d4;
    padding-left: 8px;
    background: #f3f3f3;
    border-radius: 4px;
}
</style>
