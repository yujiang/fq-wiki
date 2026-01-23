<template>
  <div class="skill-demo">
    <div class="skill-demo__input">
      <label>skill id:</label>
      <input
        type="number"
        v-model="inputId"
        @input="updateId"
        placeholder="输入 skill id"
      />
    </div>
    <Skill :id="currentId" :level="1" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Skill from '../base/Skill.vue'

const props = defineProps<{ defaultId?: number }>()

const inputId = ref(props.defaultId || 1)
const currentId = ref(inputId.value)

onMounted(() => {
  const saved = localStorage.getItem('skill-demo-id')
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
    localStorage.setItem('skill-demo-id', inputId.value.toString())
  }
}
</script>

<style scoped>
.skill-demo {
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
}

.skill-demo__input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-demo__input label {
  font-size: 14px;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

.skill-demo__input input {
  width: 120px;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.skill-demo__input input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
</style>