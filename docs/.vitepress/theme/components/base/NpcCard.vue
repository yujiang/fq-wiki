<!-- NpcCard.vue 显示xlsObserve表格 
<NpcCard :npcId="10002"  /> 
-->

<template>
  <div class="npc-card">
    <!-- 左中合并列：左侧（姓名+立绘）在上，中间（信息）在下 -->
    <div class="npc-card__left-middle">
      <!-- 原左侧内容 -->
      <div class="npc-card__left">
        <h4 class="npc-card__name">{{ npcName }}</h4>
        <div class="npc-card__avatar-container">
          <img
            :src="npcicon"
            class="npc-card__avatar"
            @error="npcicon = '/images/default-avatar.png'"
            :alt="npcName"
          />
        </div>
      </div>


      <!-- 原中间内容（放在左侧下方） -->
      <div class="npc-card__middle">
        <div class="npc-card__info-item">
          <span class="npc-card__info-label">出生：</span>
          <span class="npc-card__info-value">{{ observe?.School || '未知' }}</span>
        </div>
        <div class="npc-card__info-item">
          <span class="npc-card__info-label">地点：</span>
          <span class="npc-card__info-value">{{ posdesc }}</span>
        </div>
        <div class="npc-card__info-item">
          <span class="npc-card__info-label">喜好：</span>
          <span class="npc-card__info-value">{{ likedesc }}</span>
        </div>
        <div class="npc-card__info-item">
          <span class="npc-card__info-label">武功：</span>
          <span class="npc-card__info-value">{{ observe?.Power }}</span>
        </div>
        <div class="npc-card__info-item npc-card__info-story">
          <div class="npc-card__info-label">背景故事：</div>
          <span class="npc-card__info-value">{{ observe?.Desc || '暂无背景故事' }}</span>
        </div>
        <div class="npc-card__info-item npc-card__info-story" v-if="rewards.length>0">
          <div class="npc-card__info-label">好感相关：</div>
          <div class="npc-card__rewards">
            <div v-for="reward in rewards" :key="reward" class="npc-card__reward-item">
              {{ reward }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧保持不变 -->
    <div class="npc-card__right">
      <div class="npc-card__grid-section">
        <h4 class="npc-card__grid-title">持有道具</h4>
        <ItemGrid :items="items" :cols="3" :rows="2" />
      </div>
      <div class="npc-card__grid-section">
        <h4 class="npc-card__grid-title">掌握技能</h4>
        <SkillGrid :skills="skills" :cols="3" :rows="1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 脚本逻辑完全不变，省略重复代码
import { ref, watch, computed, onMounted } from "vue";
import ItemGrid from "./ItemGrid.vue";
import SkillGrid from "./SkillGrid.vue";
import { getObserve, observe2Asks, observe2Items, observe2Like, observe2Skills, XlsObserve } from "../../../data/observe";
import { getNpc, getNpcAvater, getNpcPosition } from "../../../data/npc";
import { ItemIdCount } from "../../../data/item";
import { SkillIdLevel } from "../../../data/skill";
import { getFriendRewards } from "../../../data/reward";

const props = defineProps<{ npcId: number }>();
const loading = ref(true);
const observe = ref<XlsObserve | null>(null);
const npcicon = ref<string>('');
const likedesc = ref<string>('');
const posdesc = ref<string>('');
const items = ref<ItemIdCount[]>([]);
const skills = ref<SkillIdLevel[]>([]);

const rewards = ref<string[]>([]);

const isDev = import.meta.env.DEV;
const npcName = ref("");

// 初始化并加载数据
onMounted(async () => {
  updateCurrentObserve(props.npcId);
});

watch(
  () => props.npcId,
  (newId) => {
    updateCurrentObserve(newId);
  }
);

const updateCurrentObserve = async (id: number) => {
  loading.value = true;
  try {
    const xls = await getObserve(id);
    observe.value = xls;
    if (xls) {
      npcName.value = isDev ? `${xls.Name}(${xls.Id})` : xls.Name
      const info = await getNpc(xls.Npc || id);
      npcicon.value = getNpcAvater(info?.Display?.icon) ;
      likedesc.value = observe2Like(xls.Like);
      posdesc.value = info ? await getNpcPosition(info.Id) : '';
      
      const items2 = observe2Items(xls.Items)
      const len2 = items2.length;
      const ask2 = observe2Asks(xls.AskItems); 
      if (items2.length > 0 && items2.length < 3 && ask2.length > 0) {
        for (let i = 0; i < 3 - len2; i++) {
          items2.push({id:0,count:0});
        }
      }
      items2.push(...ask2);

      const skills2 = await observe2Skills(xls.Skills);
      // console.log('NpcCard.vue',id,items2,skills2);
      items.value = items2;
      skills.value = skills2;
      const rs = await getFriendRewards(xls.Id);
      rewards.value = rs;

    } else {
      npcicon.value = '/images/default-avatar.png';
      likedesc.value = '';
      items.value = [];
      skills.value = [];
      rewards.value = [];
    }
  } catch (e) {
    console.error('加载NPC数据失败', e);
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>
/* 整体卡片布局改为两栏 */
.npc-card {
  display: flex;
  gap: 4px; /* 左右两列的间距 */
  padding: 0px;
  /* 其他原有样式不变 */
}

/* 左中合并列：垂直排列，占据左侧空间 */
.npc-card__left-middle {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 左侧（立绘）与中间（信息）的间距 */
  flex: 1; /* 占据左侧剩余空间 */
}

/* 左侧（姓名+立绘）保持居中，宽度自适应 */
.npc-card__left {
  width: 100%; /* 适应合并列宽度 */
  max-width: 340px; /* 限制最大宽度，避免立绘过宽 */
  margin: 0 auto; /* 居中显示 */
  /* 其他原有样式不变 */
}

/* 中间信息区域：宽度自适应合并列 */
.npc-card__middle {
    gap: 20px;
  width: 100%; /* 占满合并列宽度 */
  /* 其他原有样式不变（如gap、line-height等） */
}

/* 右侧保持固定宽度，与合并列形成两栏 */
.npc-card__right {
  width: 260px; /* 可根据需要调整 */
  flex-shrink: 0;
  /* 其他原有样式不变 */
}

.npc-card__info-label {
  font-weight: bold;
}

/* 响应式适配：小屏幕下仍垂直堆叠 */
@media (max-width: 992px) {
  .npc-card {
    flex-direction: column;
  }
  .npc-card__right {
    width: 100%;
    max-width: none;
  }
}
</style>