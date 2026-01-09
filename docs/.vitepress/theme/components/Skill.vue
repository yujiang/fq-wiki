<!-- Skill.vue 技能 
<Skill :id="50001" :level='99' /> 
-->

<template>
  <div class="base-item-game skill-game">
    <div class="icon-wrap" :style="backgroundStyle" v-tips="() => state.desc">
      <img v-if="state.icon" :src="state.icon" alt="" class="icon" />
      <span class="level" v-if="level !== 1">{{ level }}</span>
      <span class="exp" v-if="exp">{{ exp < 0 ? '新' : exp }}</span>
          <span class="unlock" v-if="unlock">{{ unlock / 4 + 1 }}</span>
          <span class="fLevel" v-if="fLevel">{{ getFLevelDesc }}</span>
    </div>
    <div class="base-item-name skill-name" v-if="state.skill?.Name">{{ state.skill.Name }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, reactive } from "vue";
import { SkillIdLevel, XlsSkill, getSkillById, getSkillIcon } from "../../data/skill";
import { getRankBgStyle } from "../../data/xls";
import { getFriendLevelDesc } from "../../data/npc";
const isDev = import.meta.env.DEV;

// 接收 props 数据
const props = defineProps<SkillIdLevel>();

// 内部状态：合并 skill、icon、desc
const state = reactive({
  skill: null as XlsSkill | null,
  icon: '' as string,
  desc: '' as string,
});

const showPopover = ref(false);

const getFLevelDesc = computed(() => props.fLevel ? getFriendLevelDesc(props.fLevel) : '');
// let randdesc = ref(props.unlock ? props.unlock : props.fLevel ? getFriendLevelDesc(props.fLevel) : "");

// 初始化并加载数据（保留 onMounted + watch，避免时序问题）
onMounted(() => {
  // 不 await 在 onMounted 中直接调用，确保页面挂载时触发加载
  updateCurrentSkill(props.id);
});

// 监听 id 变化
watch(
  () => props.id,
  (newId) => {
    updateCurrentSkill(newId);
  }
);

function getTips(xls: XlsSkill) {
  if (!xls) return '';
  return (isDev ? xls.Id+' ' : '') + (xls.Detail || xls.Desc || '');
}

const updateCurrentSkill = async (id: number) => {
  try {
    const xls = await getSkillById(id);
    state.skill = xls;
    state.icon = getSkillIcon(xls?.Icon);
    state.desc = getTips(xls)
  } catch (e) {
    console.error('updateCurrentSkill failed', e);
    state.skill = null;
    state.icon = '';
    state.desc = '';
  }
};

// 根据 rank 动态计算背景图片
const backgroundStyle = computed(() => getRankBgStyle(state.skill?.Rank));
</script>

<style scoped>
.level {
  position: absolute;
  bottom: -2px;
  right: 4px;
  font-size: 14px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  /* 添加阴影使其更清晰 */
}

.unlock {
  position: absolute;
  top: -2px;
  right: 2px;
  font-size: 12px;
  color: orange;
  font-weight: bold;
}

.exp {
  position: absolute;
  bottom: -2px;
  left: 2px;
  font-size: 14px;
  color: greenyellow;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  /* 添加阴影使其更清晰 */
}


.fLevel {
  position: absolute;
  top: 0px;
  right: 2px;
  font-size: 10px;
  color: orange;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  /* 添加阴影使其更清晰 */
  background: rgba(0, 0, 0, 0.5);
}
</style>
