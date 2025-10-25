<template>
    <ItemGrid :id="item.id" :count='item.count' />
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, watch, computed } from "vue";
import { getMoneyGrid, MoneyNum } from "../../data/money";
import { ItemIdCount } from "../../data/item";

// 接收 props 数据
const props = defineProps<MoneyNum>();
const item = ref<ItemIdCount>({id:0, count:0});

// 初始化并加载数据
onMounted(async () => {
  updateCurrentMoney();
});

// 监听 good 变化
watch(
  () => [props.type, props.amount],
  () => {
    updateCurrentMoney();
  }
);

const updateCurrentMoney = async () => {
  const xls = await getMoneyGrid(props.type, props.amount, props.compact);
  item.value = xls; 
};
</script>

