<template>
  <div class="reward-demo">
    <div class="reward-demo__input">
      <label>reward id:</label>
      <input
        type="number"
        v-model="inputId"
        @input="updateId"
        placeholder="输入 id"
      />
    </div>
    <RewardCard :rewardId="currentId" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ defaultId?: number }>()

const inputId = ref(props.defaultId || 50221)
const currentId = ref(inputId.value)

onMounted(() => {
  const saved = localStorage.getItem('reward-demo-id')
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
    localStorage.setItem('reward-demo-id', inputId.value.toString())
  }
}
</script>

<style scoped>
.reward-demo {
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
}

.reward-demo__input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reward-demo__input label {
  font-size: 14px;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

.reward-demo__input input {
  width: 120px;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.reward-demo__input input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
</style>
