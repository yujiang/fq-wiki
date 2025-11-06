<template>
  <div class="world-map" ref="wrapEl">
    <!-- 背景：简单 contain，浏览器负责 letterbox -->
    <img class="world-map__bg" :src="mapBg" alt="world" />

<!-- 放在 stage 外层，避免缩放影响 -->
<div
  class="wm-dev-probe"
  @click="(e) => {
    const rect = wrapEl!.getBoundingClientRect()
    const x = e.clientX - rect.left, y = e.clientY - rect.top
    const ox = draw.ox, oy = draw.oy, s = draw.s
    const sx = Math.round((x - ox) / s)  // ← 原图坐标
    const sy = Math.round((y - oy) / s)
    console.log('coord:', sx, sy)
  }">   

    <!-- 舞台：对 items 统一 left/top + scale(s) -->
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

  </div>
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

// contain 的缩放与偏移（与背景的 letterbox 对齐）
const draw = computed(() => {
  const W = Math.max(1, box.value.w)
  const H = Math.max(1, box.value.h)
  const s = Math.min(W / imgw, H / imgh)
  const dw = imgw * s, dh = imgh * s
  const ox = (W - dw) / 2, oy = (H - dh) / 2
  return { s, ox, oy }
})
</script>

<style scoped>
.world-map {
  position: relative;
  width: 100%;
  /* 给容器一个可见高度或用纵横比： */
  aspect-ratio: 1794 / 1214;
  min-height: 360px;
  overflow: hidden;
}
.world-map__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; /* 背景保持最简单：让浏览器完成 contain */
  display: block;
  pointer-events: none;
}
.world-map__stage {
  position: absolute; /* 我们用 draw.ox/oy 定位到 letterbox 内容区，再整体 scale(s) */
}

.wm-dev-probe { 
    position:absolute; inset:0; cursor: crosshair; 
  width: 100%;
  height: 100%;

}

</style>
