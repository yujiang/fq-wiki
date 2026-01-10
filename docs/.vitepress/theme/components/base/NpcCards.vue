<!-- NpcCards.vue 一排NpcCard.vue 
<NpcCards :npcIds="[10002,10004]"/> 
-->
 
 <template>
  <div class="npc-cards-container">
    <!-- 传选中ID + 点击事件 -->
    <NpcList 
      :npcs="npcIds" 
      :selectedId="mySelectedId" 
      @select="handleSelect"
      class="npc-cards__list"
    />

    <!-- 详情区域 -->
    <div class="npc-cards__content">
      <NpcCard :npcId="mySelectedId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import NpcList from "./NpcList.vue";
import NpcCard from "./NpcCard.vue";

// 只接收「选中ID」和「列表」，触发更新事件
const props = defineProps<{
  npcIds: number[];
  selectedId?: number | null;
}>();
// const emit = defineEmits<{ (e: "update:selectedId", id: number | null): void }>();

const sid = props.selectedId || props.npcIds[0] || 0;
const mySelectedId = ref(sid);

// 选中ID变化时加载详情
watchEffect(
  ()=>{
  const sid = props.selectedId || props.npcIds[0] || 0;
  mySelectedId.value = sid;
  },
);

// 接收NpcList的点击事件，传给NpcCard
const handleSelect = (id: number) => {
    mySelectedId.value = id;
    // 不往上传递了~~
    // emit("update:selectedId", id);
};
</script>

<style scoped>/* 样式不变 */</style>