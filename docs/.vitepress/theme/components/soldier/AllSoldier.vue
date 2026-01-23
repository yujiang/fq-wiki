<!-- AllSoldier.vue
遍历getSoldiers, 把他们按weapon来分组作为tab
每个组都是一个SoldierCards组件
-->

<template>
  <div class="all-soldier">
    <div class="all-soldier__loading" v-if="isLoading">加载中...</div>

    <div class="all-soldier__content" v-else>
      <!-- Tabs 导航 -->
      <div class="tabs" v-if="weaponTabs.length > 1">
        <button
          v-for="weapon in weaponTabs"
          :key="weapon.key"
          :class="['tab-button', { active: activeWeapon === weapon.key }]"
          @click="activeWeapon = weapon.key"
        >
          {{ weapon.label }} ({{ weapon.count }})
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="tabs-content">
        <SoldierCards
          v-if="activeSoldiers.length > 0"
          :soldierIds="activeSoldiers"
          :selectedId="activeSoldiers[0]"
        />
        <div class="empty-state" v-else>该武器类型暂无士兵</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getSoldiers, XlsSoldier } from "../../../data/soldier";
import SoldierCards from "./SoldierCards.vue";

interface WeaponGroup {
  key: string;
  label: string;
  soldiers: XlsSoldier[];
  count: number;
}

const isLoading = ref(true);
const soldiers = ref<XlsSoldier[]>([]);
const activeWeapon = ref<string>("");

// 按武器分组的士兵数据
const groupedSoldiers = computed(() => {
  const groups: Record<string, XlsSoldier[]> = {
    "刀":[],
    "剑":[],
    "拳":[],
    "棍":[],
    "暗器":[],
    "其他":[],
  };

  soldiers.value.forEach((soldier) => {
    const weapon = soldier.weapon;
    if (weapon) {
      (groups[weapon]||groups['其他']).push(soldier);
    }
  });

  return groups;
});

// 武器标签页数据
const weaponTabs = computed(() => {
  const tabs: WeaponGroup[] = [];

  Object.entries(groupedSoldiers.value).forEach(([weapon, soldierList]) => {
    if (!weapon) return;
    tabs.push({
      key: weapon,
      label: weapon,
      soldiers: soldierList,
      count: soldierList.length,
    });
  });

  // 按士兵数量降序排序
  // tabs.sort((a, b) => b.count - a.count);

  return tabs;
});

// 当前激活的士兵ID列表
const activeSoldiers = computed(() => {
  const activeGroup = weaponTabs.value.find(
    (tab) => tab.key === activeWeapon.value,
  );
  return activeGroup ? activeGroup.soldiers.map((s) => s.Id) : [];
});

// 加载士兵数据
onMounted(async () => {
  try {
    const allSoldiers = await getSoldiers();
    soldiers.value = Object.values(allSoldiers);
    // 设置默认激活的武器类型（第一个有士兵的）
    if (weaponTabs.value.length > 0) {
      activeWeapon.value = weaponTabs.value[0].key;
    }
  } catch (error) {
    console.error("Failed to load soldiers:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.all-soldier {
  width: 100%;
}

.all-soldier__loading {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-2);
}

.all-soldier__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.tab-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-button:hover:not(.active) {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.tab-button.active {
  background: var(--vp-c-brand-1);
  color: white;
  font-weight: 500;
}

.tabs-content {
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }

  .tab-button {
    text-align: left;
    justify-content: flex-start;
  }
}
</style>
