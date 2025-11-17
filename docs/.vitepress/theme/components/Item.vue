<!-- Item.vue 道具 
 <Item :id="8889" :count='2' :rand='30' />
 -->

<template>
  <div
    class="base-item-game item-game"
    @mouseover="showPopover = !!item?.Detail"
    @mouseleave="showPopover = false"
  >
    <!-- 使用 NTooltip 包裹触发元素 -->
    <n-tooltip
      :style="{ maxWidth: '200px' }"
      :show="showPopover"
      trigger="manual"
    >
      <!-- 触发元素放在 #trigger 插槽中 -->
      <template #trigger>
        <div class="icon-wrap" :style="backgroundStyle">
          <img v-if="itemicon" :src="itemicon" alt="" class="icon" />
          <span
            class="数目"
            v-if="itemcount > 1 || itemcount < 0"
            :style="{ color: itemcount < 0 ? 'red' : 'white' }"
            >{{ itemcount }}</span
          >
          <span class="几率" v-if="itemrand < 100 && itemrand > 0">{{
            itemrand + "%"
          }}</span>
          <span class="fLevel" v-if="fLevel">{{ getFLevelDesc }}</span>
        </div>
      </template>
      <!-- Tooltip 内容通过插槽传递，动态绑定 item.desc -->
      <div>{{ item?.Detail }}</div>
    </n-tooltip>

    <div class="base-item-name item-name" v-if="item?.Name">
      {{ item.Name }}
    </div>
    <!-- 物品名字 -->
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, watch, computed } from "vue";
import {
  XlsItem,
  getItemIcon,
  getItemById,
  ItemIdCount,
} from "../../data/item";
import { getRankBgStyle } from "../../data/xls";
import { getFriendLevelDesc } from "../../data/npc";
// import { getRankBgStyle } from "../../data/xls";

// 接收 props 数据
const props = defineProps<ItemIdCount>();

// 异步加载所有 items
let item = ref<XlsItem | null>(null);
let itemicon = ref("");
let itemcount = ref<number>(0);
let showPopover = ref(false);
let itemrand = ref(0);

let getFLevelDesc = computed(() => {
  return props.fLevel ? getFriendLevelDesc(props.fLevel) : "";
});

// let randdesc = ref(getRandDesc());
// console.log("randdesc", props, randdesc.value);

// 初始化并加载数据
onMounted(async () => {
  updateCurrentItem(props.id);
});

// 监听 good 变化
watch(
  () => props.id,
  (newGood) => {
    updateCurrentItem(newGood);
  }
);

const updateCurrentItem = async (itemId: number) => {
  const id = Math.abs(itemId);
  const xls = await getItemById(id);
  item.value = xls;
  itemicon.value = getItemIcon(xls?.Icon);
  itemcount.value = props.count || 1;
  itemrand.value = props.rand || 0;
  if (itemId < 0) {
    if (itemcount.value > 0) {
      itemcount.value = -itemcount.value;
    }
  }
  // showPopover.value = !! xls?.Detail
  // randdesc.value = getRandDesc();
};

// 根据 rank 动态计算背景图片
const backgroundStyle = computed(() => {
  return getRankBgStyle(item.value?.Rank);
});
</script>

<style scoped>
.数目 {
  position: absolute;
  bottom: -2px;
  right: 4px;
  font-size: 14px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* 添加阴影使其更清晰 */
}

.几率 {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 10px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* 添加阴影使其更清晰 */
  background: rgba(0, 0, 0, 0.5);
}

.fLevel {
  position: absolute;
  top: 0px;
  right: 2px;
  font-size: 10px;
  color: orange;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* 添加阴影使其更清晰 */
  background: rgba(0, 0, 0, 0.5);
}
</style>
