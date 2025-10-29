<!-- 显示reward -->

<template>
  <div class="reward-card" v-if="currentReward">
    <div class="header">
      <strong>{{ currentReward.Name }}</strong>
    </div>

    <!-- 显示该商店的所有商品 -->

    <div class="grid">
      <ItemList :items="rewardMoneys" v-if="rewardMoneys.length>0"/>
      <ItemList :items="rewardItems" v-if="rewardItems.length>0"/>
      <SkillList :skills="rewardSkills" v-if="rewardSkills.length>0"/>
      <NpcFriendList :npcs="rewardFriends" v-if="rewardFriends.length>0"/>
      <div class="声望" v-if="sceneScore"> 
        <span class="scene">{{ sceneName }}</span>
        <span class="score">{{ "声望: "+sceneScore }}</span>
      </div>        

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ItemIdCount } from "../../data/item";
import {
  getReward,
  getRewardFriends,
  getRewardItems,
  getRewardMoneys,
  getRewardSkills,
  XlsReward,
} from "../../data/reward";
import { SkillIdLevel } from "../../data/skill";
import NpcList from "./NpcList.vue";
import { NpcFriend } from "../../data/npc";
import { getScene } from "../../data/scene";

// 接收父组件传递的 shopId
const props = defineProps<{ rewardId: number }>();
let rewardItems = ref<ItemIdCount[]>([]);
let rewardMoneys = ref<ItemIdCount[]>([]);
let rewardSkills = ref<SkillIdLevel[]>([]);
let rewardFriends = ref<NpcFriend[]>([]);
let sceneScore = ref(0);
let sceneName = ref("");

// 使用响应式数据来存储当前商店数据
const currentReward = ref<XlsReward | null>(null);
onMounted(() => {
  updateReward(props.rewardId);
});
// 当 shopId 改变时获取新商店数据
watch(
  () => props.rewardId,
  (newId) => {
    updateReward(newId);
  }
);

  const updateReward = async (newId: number) => {
    const xls = await getReward(newId);
    currentReward.value = xls;
    const items = await getRewardItems(newId);
    const moneys = await getRewardMoneys(newId);
    const lifeskills = getRewardSkills(xls);
    const friend = getRewardFriends(xls);
    if (xls.Scene && xls.SceneScore){
      const info = await getScene(xls.Scene);
      if (info){
        sceneName.value = info.Name;
        sceneScore.value = xls.SceneScore;
      }
    }
    rewardItems.value = items;
    rewardMoneys.value = moneys;
    rewardSkills.value = lifeskills;
    rewardFriends.value = friend;
    console.log("rewardItems.value", props.rewardId, items, moneys, lifeskills, friend);
  };
</script>

<style scoped>
.reward-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 14px;
  background: var(--vp-c-bg);
}
.grid {
  display: flex;
  gap: 10px;
}

.声望{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: center; 
 }

.scene {
  font-size: 14px;
  color: var(--vp-c-text-secondary);
}

.score {
  font-size: 15px;
  font-weight: 500;
  color: var(--vp-c-text);
  margin-top: 4px;
}

</style>
