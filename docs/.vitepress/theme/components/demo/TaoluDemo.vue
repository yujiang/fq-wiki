<template>
  <div class="taolu-demo">
    <InputDemo
      label="套路 id or name"
      placeholder="输入 taolu id 或名称"
      :defaultId="defaultId"
      storageKey="taolu-demo-id"
      :searchFn="searchTaolus"
      @select="currentId = $event"
    >
      <TaoluCard :taolu="currentId" />
    </InputDemo>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputDemo from '../base/InputDemo.vue'
import TaoluCard from '../taolu/TaoluCard.vue'
import { searchTaolus } from '../../../data/taolu'

const props = defineProps<{ defaultId?: number }>()
const currentId = ref(props.defaultId || 60001) // Default to 太祖长拳
</script>

<style scoped>
.taolu-demo {
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
}
</style>