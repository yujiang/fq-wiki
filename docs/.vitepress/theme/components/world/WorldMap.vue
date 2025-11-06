<template>
  <div class="world-map" ref="wrapEl" :class="{ 'dev-mode': isDev }">
    <img class="world-map__bg" :src="mapBg" alt="world" />

    <!-- 舞台：统一 scale -->
    <div
      class="world-map__stage"
      :style="{
        left: draw.ox + 'px',
        top: draw.oy + 'px',
        width: imgw + 'px',
        height: imgh + 'px',
        transform: `scale(${draw.s})`,
        transformOrigin: 'top left'
      }"
    >
      <WorldMapItem
        v-for="(p, i) in points"
        :key="p.sceneId || i"
        :sceneId="p.sceneId"
        :style="{
          position: 'absolute',
          left: p.x + 'px',
          top: p.y + 'px',
          transform: 'translate(-50%, -50%)'
        }"
      />
    </div>

    <!-- ✅ 探针放在 stage 外层，作为兄弟节点；仅 dev 可见 -->
    <div v-if="isDev" class="wm-dev-probe" @click="onProbeClick" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import WorldMapItem from './WorldMapItem.vue'

const uiMapDir = '/images/ui/ui_map'
const mapBg = uiMapDir + '/bg_mainmap.jpg'
const imgw = 1794
const imgh = 1214

interface MapPoint { sceneId: number; x: number; y: number }
const props = defineProps<{ points: MapPoint[] }>()

const wrapEl = ref<HTMLDivElement | null>(null)
const box = ref({ w: 0, h: 0 })

let ro: ResizeObserver | null = null
onMounted(() => {
  if (!wrapEl.value) return
  ro = new ResizeObserver(([entry]) => {
    const cr = entry.contentRect
    box.value = { w: cr.width, h: cr.height }
  })
  ro.observe(wrapEl.value)
})
onBeforeUnmount(() => { ro?.disconnect(); ro = null })

const draw = computed(() => {
  const W = Math.max(1, box.value.w)
  const H = Math.max(1, box.value.h)
  const s = Math.min(W / imgw, H / imgh)
  const dw = imgw * s, dh = imgh * s
  const ox = (W - dw) / 2, oy = (H - dh) / 2
  return { s, ox, oy }
})

const isDev = import.meta.env.DEV

function onProbeClick(e: MouseEvent) {
  if (!wrapEl.value) return
  const rect = wrapEl.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const { ox, oy, s } = draw.value
  const sx = Math.round((x - ox) / s)
  const sy = Math.round((y - oy) / s)
  console.log('coord:', sx, sy)
}
</script>

<style scoped>
.world-map {
  position: relative;
  width: 100%;
  aspect-ratio: 1794 / 1214;
  min-height: 360px;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}
.world-map.dev-mode {
  pointer-events: auto;
  user-select: auto;
}

.world-map__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  pointer-events: none;
}
.world-map__stage {
  position: absolute;
}

/* ✅ 探针浮在最上层，独立捕获点击，不受 stage scale 影响 */
.wm-dev-probe {
  position: absolute;
  inset: 0;
  z-index: 10;
  cursor: crosshair;
  background: transparent;
}
</style>
