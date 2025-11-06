<!-- WorldMapItem.vue 世界地图 的 item 
 包括一个底图(三种:城市,野外,势力)
 其上的竖排文字, 如果school为金色
 <WorldMapItem :sceneId="3126" />
 -->

<template>
  <div class="wm-item_wrapper">
  <div class="wm-item">
    <img class="wm-item__bg" :src="mapUrl" alt="map" />
    <div
      class="wm-text"
      :class="['type-' + item.type]"
    >
      {{ item.text }}
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import {  getScene, getSceneType } from '../../../data/scene';

type itemType = { type: string; text: string }

const props = defineProps<{
  sceneId: number;
}>()


const item = ref<itemType>({} as any);
const mapUrl = ref<string>('')

const uiMapDir = '/images/ui/ui_map'
const MapUrls : any= 
  {
    城市: 'img_bg_town_name_maincity.png',
    野外: 'img_bg_town_name_normal.png',
    村庄: 'img_bg_town_name_normal.png',
    势力: 'img_bg_town_name_school.png',
    门派: 'img_bg_town_name_school.png'    
  }

watchEffect(async () => {
  const xls = await getScene(props.sceneId)
  if (xls) {
    let type = getSceneType(xls.Type)
    // console.log("WorldMapItem.vue", props.sceneId, type)
    if (!MapUrls[type]) {
      type = '野外';
    }
    item.value = {
      type,
      text: xls.Name
    }
    mapUrl.value = uiMapDir + '/' + MapUrls[type] 
  }
})



</script>

<style scoped>
.wm-item_wrapper {
  display: inline-block;
  transform-origin: top left;
}

.wm-item {
  position: relative;
  width: 36px;
  height: 141px;
  overflow: hidden;
  transform: scale(1.6);        /* ✅ 放到这里 */
  transform-origin: top left;   /* 以左上为缩放锚点 */  
}
.wm-item__bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.wm-text {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-weight: bold;
  color: #fff;
  letter-spacing: 2px; /* ↑↑ 字距加大 */
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
}

/* 不同类型字号与配色 */
.wm-text.type-城市 {
  font-size: 20px;
  top: 45%;
}

.wm-text.type-野外 {
  font-size: 16px;
}

.wm-text.type-村庄 {
  font-size: 16px;
  color: #90d76b;
}

.wm-text.type-门派 {
  font-size: 18px;
  color: #ffd76b; /* 金色 */
  text-shadow: 0 0 6px rgba(255, 215, 107, 0.6);
}

.wm-text.type-势力 {
  font-size: 18px;
  color: yellow; /* 金色 */
  text-shadow: 0 0 6px rgba(255, 215, 107, 0.6);
}

</style>
