<template>
  <div class="world-map-scenes">
    <WorldMap :points="points" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WorldMap from './WorldMap.vue'
// 动态拿场景列表，兼容不同导出命名
import { getScenes } from '../../../data/scene';

// 数据结构约定：
// xls 场景包含：{ Id, Name, Type, sx, sy }
// getSceneType(Type) => '城市' | '野外' | '门派'（或其它，默认归一到 '野外'）

interface MapPoint { sceneId: number; x: number; y: number }

const points = ref<MapPoint[]>([])

async function fetchScenesAndBuildPoints() {
  // 兼容 getAllScenes / getScenes 两种命名
  const scenes = await getScenes()
  const out: MapPoint[] = []
  for (const sc of Object.values(scenes)) {
    const { wx, wy } = sc
    if (!wx || !wy) continue
    out.push({
      sceneId: sc.Id as number,
      x: wx + 10,
      y: wy + 50,
    })
  }
  points.value = out
}

onMounted(() => { fetchScenesAndBuildPoints() })
</script>

<style scoped>
.world-map-scenes { position: relative; width: 100%; height: 100%; }
</style>
