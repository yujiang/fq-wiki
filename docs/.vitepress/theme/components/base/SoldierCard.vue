<!-- SoldierCard.vue 显示士兵信息
<SoldierCard :soldierId="1" />
-->

<template>
  <div class="soldier-card">
    <!-- 左中合并列：左侧（姓名+立绘）在上，中间（信息）在下 -->
    <div class="soldier-card__left-middle">
      <!-- 原左侧内容 -->
      <div class="soldier-card__left">
        <h4 class="soldier-card__name">{{ soldier?.Name }}</h4>
        <div class="soldier-card__avatar-container">
          <img
            :src="soldierIcon"
            class="soldier-card__avatar"
            @error="soldierIcon = '/images/default-avatar.png'"
            :alt="soldier?.Name"
          />
        </div>
      </div>

      <!-- 原中间内容（放在左侧下方） -->
      <div class="soldier-card__middle">
        <div class="soldier-card__info-item">
          <span class="soldier-card__info-label">品质：</span>
          <span class="soldier-card__info-value">{{ getRankDesc(soldier?.Rank) }}</span>
        </div>
        <div class="soldier-card__info-item">
          <span class="soldier-card__info-label">类型：</span>
          <span class="soldier-card__info-value">{{ soldier?.weapon || '未知' }}</span>
        </div>
        <div class="soldier-card__info-item">
          <span class="soldier-card__info-label">定位：</span>
          <span class="soldier-card__info-value">{{ soldier?.Desc || '未知' }}</span>
        </div>
        <div class="soldier-card__info-item soldier-card__info-desc" v-if="soldier?.biography">
          <div class="soldier-card__info-label">传记：</div>
          <span class="soldier-card__info-value">{{ soldier.biography }}</span>
        </div>
      </div>
    </div>

    <!-- 右侧：装备和技能网格 -->
    <div class="soldier-card__right">
      <div class="soldier-card__grid-section">
        <h4 class="soldier-card__grid-title">初始装备</h4>
        <ItemGrid :items="equipItems" :cols="3" :rows="2" />
      </div>
      <div class="soldier-card__grid-section">
        <h4 class="soldier-card__grid-title">武学</h4>
        <SkillGrid :skills="taoluSkills" :cols="3" :rows="1" />
      </div>
      <div class="soldier-card__grid-section">
        <h4 class="soldier-card__grid-title">天赋</h4>
        <SkillGrid :skills="talentSkills" :cols="3" :rows="1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import ItemGrid from "./ItemGrid.vue";
import SkillGrid from "./SkillGrid.vue";
import {
  getSoldier,
  XlsSoldier,
  soldier2EquipItems,
  soldier2TaoluSkills,
  soldier2TalentSkills,
  getSoldierAvater
} from "../../../data/soldier";
import { getRankDesc } from "../../../data/xls";

const props = defineProps<{ soldierId: number }>();
const soldier = ref<XlsSoldier | undefined>(undefined);
const soldierIcon = ref<string>('');
const equipItems = ref<any[]>([]);
const taoluSkills = ref<any[]>([]);
const talentSkills = ref<any[]>([]);

// 初始化并加载数据
onMounted(async () => {
  updateCurrentSoldier(props.soldierId);
});

watch(
  () => props.soldierId,
  (newId) => {
    updateCurrentSoldier(newId);
  }
);

const updateCurrentSoldier = async (id: number) => {
  try {
    const xls = await getSoldier(id);
    soldier.value = xls;
    if (xls) {
      soldierIcon.value = getSoldierAvater(xls.display?.icon);
      equipItems.value = soldier2EquipItems(xls.equip || []);
      taoluSkills.value = soldier2TaoluSkills(xls.Taolu);
      talentSkills.value = await soldier2TalentSkills(xls.talentdata);
    } else {
      soldierIcon.value = '/images/default-avatar.png';
      equipItems.value = [];
      taoluSkills.value = [];
      talentSkills.value = [];
    }
  } catch (e) {
    console.error('加载士兵数据失败', e);
    soldier.value = undefined;
    equipItems.value = [];
    taoluSkills.value = [];
    talentSkills.value = [];
  }
};
</script>

<style scoped>
/* 整体卡片布局改为两栏 */
.soldier-card {
  display: flex;
  gap: 4px; /* 左右两列的间距 */
  padding: 0px;
  /* 其他原有样式不变 */
}

/* 左中合并列：垂直排列，占据左侧空间 */
.soldier-card__left-middle {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 左侧（立绘）与中间（信息）的间距 */
  flex: 1; /* 占据左侧剩余空间 */
}

/* 左侧（姓名+立绘）保持居中，宽度自适应 */
.soldier-card__left {
  width: 100%; /* 适应合并列宽度 */
  max-width: 340px; /* 限制最大宽度，避免立绘过宽 */
  margin: 0 auto; /* 居中显示 */
  /* 其他原有样式不变 */
}

/* 中间信息区域：宽度自适应合并列 */
.soldier-card__middle {
    gap: 20px;
  width: 100%; /* 占满合并列宽度 */
  /* 其他原有样式不变（如gap、line-height等） */
}

/* 右侧保持固定宽度，与合并列形成两栏 */
.soldier-card__right {
  width: 260px; /* 可根据需要调整 */
  flex-shrink: 0;
  /* 其他原有样式不变 */
}

.soldier-card__info-label {
  font-weight: bold;
}

.soldier-card__info-desc .soldier-card__info-value {
  max-width: 220px;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.soldier-card__avatar-container {
  width: 100%;
  max-width: 240px;
  margin: 0 auto;
}

.soldier-card__avatar {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.soldier-card__grid-section {
  margin-bottom: 10px;
}

.soldier-card__grid-title {
  margin: 0 0 0px 0;
  font-size: 16px;
  font-weight: bold;
}

/* 响应式适配：小屏幕下仍垂直堆叠 */
@media (max-width: 992px) {
  .soldier-card {
    flex-direction: column;
  }
  .soldier-card__right {
    width: 100%;
    max-width: none;
  }
}
</style>