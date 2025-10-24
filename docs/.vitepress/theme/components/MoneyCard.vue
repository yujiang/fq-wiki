<template>
  <div class="money-card">
    <div class="icon-wrap">
      <img v-if="moneyicon" :src="moneyicon" alt="" class="icon" />
    </div>
    <div class="info">
      <span class="amount">{{ formatAmount(amount) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, watch, computed } from "vue";
import { getMoney, getMoneyIcon, XlsMoney } from "../../data/money";

// 单个货币数据
const props = defineProps<{
  /** 货币名称，例如 “元宝” */
  type: number;
  /** 货币数量 */
  amount: number;
  /** 是否紧凑显示（如 1.2k） */
  compact?: boolean;
}>();

let money = ref<XlsMoney | null>(null);
let moneyicon = ref('');

// 初始化并加载数据
onMounted(async () => {
  updateCurrentItem(props.type);
});

// 监听 good 变化
watch(
  () => props.type,
  (newGood) => {
    updateCurrentItem(newGood);
  }
);

const updateCurrentItem = async (id: number) => {
  money.value = await getMoney(id);
  moneyicon.value = await getMoneyIcon(id);
  // console.log("moneyicon", moneyicon.value);
};


// 数量格式化
const formatAmount = (n: number) => {
  if (props.compact) {
    const abs = Math.abs(n);
    if (abs >= 1_000_000_00) return (n / 1_000_000_00).toFixed(1) + "亿";
    if (abs >= 1_000_0) return (n / 1_000_0).toFixed(1) + "万";
  }
  return n;
};
</script>

<style scoped>
.money-card {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
  white-space: nowrap;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  line-height: 1.1;
}

.amount {
  font-size: 14px;
  color: #222;
  font-variant-numeric: tabular-nums;
}
</style>
