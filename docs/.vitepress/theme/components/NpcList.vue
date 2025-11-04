<!-- NpcList.vue 一排NpcIcon.vue
<NpcList :npcs=[10002,10004]  /> 
-->
 
 <template>
  <div class="base-list npc-list">
    <NpcIcon
      v-for="npcId in props.npcs"
      :key="npcId"
      :npcId="npcId"
      :isSelected="npcId === props.selectedId" 
      @click="$emit('select', npcId)"  
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import NpcIcon from "./NpcIcon.vue";

// 只接收列表和选中ID，触发选择事件
const props = defineProps<{ npcs?: number[]; selectedId?: number | null }>();
const emit = defineEmits<{ (e: "select", id: number): void }>();
// 统治NpcCard，list点中了！
</script>

<style scoped>/* 样式不变 */</style>