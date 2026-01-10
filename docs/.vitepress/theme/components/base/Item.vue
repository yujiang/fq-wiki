<!-- Item.vue 道具 
 <Item :id="8889" :count='2' :rand='30' />
 -->

<template>
  <div class="base-item-game item-game">
        <div class="icon-wrap" :style="backgroundStyle" v-tips="getTips">
          <img v-if="itemicon" :src="itemicon" alt="" class="icon" />
          <span class="item-count" v-if="itemDisplay" :style="{ color: itemColor }">{{ itemCount }}</span>
          <span class="item-chance" v-if="itemRand < 100 && itemRand > 0">{{ itemRand + "%" }}</span>
          <span class="fLevel" v-if="fLevel">{{ getFLevelDesc }}</span>
        </div>

    <div class="base-item-name item-name" v-if="item?.Name">
      {{ item.Name }}
    </div>
    <!-- 物品名字 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import {
  XlsItem,
  getItemIcon,
  getItemById,
  ItemIdCount,
} from "../../../data/item";
import { getRankBgStyle } from "../../../data/xls";
import { getFriendLevelDesc } from "../../../data/npc";
// import { getRankBgStyle } from "../../data/xls";
const isDev = import.meta.env.DEV;

// 接收 props 数据
const props = defineProps<ItemIdCount>();

// 异步加载所有 items
let item = ref<XlsItem | null>(null);

function getTips(){
  const xls = item.value;
  if (!xls) return '';
  return (isDev ? xls.Id+' ' : '') + xls.Detail
} 

let itemicon = ref("");

let getFLevelDesc = computed(() => {
  return props.fLevel ? getFriendLevelDesc(props.fLevel) : "";
});

// 现在：存储在 ref 中
// itemcount.value = props.count || 1;
// itemrand.value = props.rand || 0;

// 优化：用 computed 直接映射
const itemCount = computed(() => props.count || 1);
const itemRand = computed(() => props.rand || 0);

// 计算是否显示数量
const itemDisplay = computed(() => {
  const count = itemCount.value;
  return typeof count === 'string' || count > 1 || count < 0;
});

// 计算数量显示的颜色
const itemColor = computed(() => {
  const count = itemCount.value;
  return typeof count === 'string' || count > 1 ? 'white' : 'red';
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
  // showPopover.value = !! xls?.Detail
  // randdesc.value = getRandDesc();
};

// 根据 rank 动态计算背景图片
const backgroundStyle = computed(() => {
  return getRankBgStyle(item.value?.Rank);
});
</script>

<style scoped>
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

/* 优化：英文类名 */
.item-count {
  position: absolute;
  bottom: -2px;
  right: 4px;
  font-size: 12px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  /* 添加阴影使其更清晰 */
}

.item-chance {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 10px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  /* 添加阴影使其更清晰 */
  background: rgba(0, 0, 0, 0.5);
}

.item-level {
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
