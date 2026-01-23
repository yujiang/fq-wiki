<template>
  <div class="npc-demo">
    <div class="npc-demo__input">
      <label>npc id:</label>
      <input
        type="number"
        v-model="inputId"
        @input="updateId"
        placeholder="输入 npc id"
      />
    </div>
    <NpcCard :npcId="currentId" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NpcCard from '../base/NpcCard.vue'

const props = defineProps<{ defaultId?: number }>()

const inputId = ref(props.defaultId || 10002)
const currentId = ref(inputId.value)

onMounted(() => {
  const saved = localStorage.getItem('npc-demo-id')
  if (saved) {
    const parsed = parseInt(saved, 10)
    if (parsed > 0) {
      inputId.value = parsed
      currentId.value = parsed
    }
  }
})

const updateId = () => {
  if (inputId.value > 0) {
    currentId.value = inputId.value
    localStorage.setItem('npc-demo-id', inputId.value.toString())
  }
}
</script>

<style scoped>
.npc-demo {
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
}

.npc-demo__input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.npc-demo__input label {
  font-size: 14px;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

.npc-demo__input input {
  width: 120px;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.npc-demo__input input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
</style>