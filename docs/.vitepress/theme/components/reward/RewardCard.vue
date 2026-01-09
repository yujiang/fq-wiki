<!-- RewardCard.vue 显示奖励reward 
 示例：<RewardCard :rewardId="1119" />
 -->

<template>
  <!--   <div class="header"> {{ title }} </div> -->
  <div class="reward-card" v-if="currentReward && haveReward">
    <div class="header" v-if="curtitle && curtitle !== 'no'">
      <strong>{{ curtitle }}</strong>
    </div>
    <div class="header" v-if="isDev">
      <strong>{{ currentReward.Id }}</strong>
    </div>
    <!-- 显示该商店的所有商品 -->

    <div class="grid">
      <ItemList
        :items="allReward.moneys"
        v-if="allReward?.moneys && allReward.moneys.length > 0"
      />
      <ItemList :items="allReward?.items" v-if="allReward?.items && allReward.items?.length > 0" />
      <SkillList
        :skills="allReward.lifeskills"
        v-if="allReward?.lifeskills && allReward.lifeskills.length > 0"
      />
      <NpcFriendList
        :npcs="allReward.friend"
        v-if="allReward?.friend && allReward.friend.length > 0"
      />
      <!--       <div class="声望" v-if="allReward?.sceneScore">
        <span class="scene">{{ allReward.sceneScore.Name }}</span>
        <span class="score">{{ "声望: " + allReward.sceneScore.Score }}</span>
      </div>
 -->
      <MoneyCard
        v-if="allReward?.sceneScore"
        :name="allReward.sceneScore.Name"
        :type="14"
        :amount="allReward.sceneScore.Score"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ItemIdCount } from "../../../data/item";
import {
  getReward,
  getRewardAll,
  RewardAll,
  XlsReward,
} from "../../../data/reward";
import ItemList from "../ItemList.vue";
import SkillList from "../SkillList.vue";
import MoneyCard from "../MoneyCard.vue";
import NpcFriendList from "./NpcFriendList.vue";

const isDev = import.meta.env.DEV;
// 接收父组件传递的 shopId
const props = defineProps<{ rewardId: number; title?: string }>();
let allReward = ref<RewardAll | null>(null);
// let rewardItems = ref<ItemIdCount[]>([]);
// let rewardMoneys = ref<ItemIdCount[]>([]);
// let rewardSkills = ref<SkillIdLevel[]>([]);
// let rewardFriends = ref<NpcFriend[]>([]);
// let sceneScore = ref(0);
// let sceneName = ref("");
let curtitle = ref("");
let haveReward = ref(false);

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
  currentReward.value = null;
  curtitle.value = props.title || "";
  haveReward.value = false;
  allReward.value = null;

  const xls = await getReward(newId);
  if (!xls) return;
  currentReward.value = xls;
  if (props.title !== "no") curtitle.value = props.title || xls.Name;
  const all = await getRewardAll(newId);
  // 加载奖励内容
  if (all) {
    const have =
      all.sceneScore?.Score ||
      all.items.length ||
      all.moneys.length ||
      all.lifeskills.length ||
      all.friend.length;
    haveReward.value = have > 0;
  }
  // console.log("rewardItems.value", props.rewardId, xls.Name, all);
  allReward.value = all;
};
</script>

<style scoped>
.reward-card {
  display: inline-block;
  border: 1px solid var(--vp-c-divider);
  border-radius: 2px;
  padding: 4px;
  background: var(--vp-c-bg);
}

.grid {
  display: flex;
  gap: 10px;
}

.声望 {
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
