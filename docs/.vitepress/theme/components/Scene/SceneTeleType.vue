<!-- TeleList.vue 场景下某个类型tele列表
 <TeleList :sceneId="1023" teleType="室内" />
 -->

<template>
    <TeleList :teles="teles" :hideType="hideType"/>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { SceneTypeString } from "../../../data/scene";
import { XlsTeleport } from "../../../data/tele";
import { getTelesTypeByScene } from "../../../data/tele";

const props = defineProps<{
  sceneId: number,
  teleType: SceneTypeString,
  hideType?: boolean,
}>();

// --- 状态 ---
const teles = ref<XlsTeleport[]>([]);

// --- 数据加载函数 ---
async function loadData() {
  // 1. 加载 tele
  const cs = (await getTelesTypeByScene(props.teleType, props.sceneId)) || [];
  teles.value = cs;
}

// --- 初次加载 ---
// onMounted(loadData);

// --- 监听 teleType / scene 变化 ---
watchEffect(loadData);

</script>

