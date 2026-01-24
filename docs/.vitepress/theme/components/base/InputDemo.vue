<template>
  <div class="input-demo">
    <div class="input-demo__input">
      <label>{{ label }}:</label>
      <input
        type="text"
        v-model="inputValue"
        @input="handleInput"
        :placeholder="placeholder"
      />
    </div>
    <p v-if="tips" class="input-demo__tips">{{ tips }}</p>
    <div v-if="showSelection" class="input-demo__selection">
      <ul>
        <li v-for="item in results" :key="item.id" @click="selectItem(item.id)">
          {{ item.display }}
        </li>
      </ul>
    </div>
    <slot :id="currentId" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  label: string
  placeholder: string
  defaultId?: number
  storageKey: string
  searchFn?: (name: string) => Promise<{id: number, display: string}[]>
}>()

const emit = defineEmits<{
  select: [id: number]
}>()

const inputValue = ref('')
const currentId = ref(props.defaultId || 0)
const results = ref<{id: number, display: string}[]>([])
const showSelection = ref(false)
const tips = ref('')

onMounted(() => {
  const saved = localStorage.getItem(props.storageKey)
  if (saved) {
    const parsed = parseInt(saved, 10)
    if (parsed > 0) {
      inputValue.value = parsed.toString()
      currentId.value = parsed
      emit('select', parsed)
    }
  } else if (props.defaultId) {
    inputValue.value = props.defaultId.toString()
    currentId.value = props.defaultId
    emit('select', props.defaultId)
  }
})

const handleInput = async () => {
  const value = inputValue.value.trim()
  const num = parseInt(value, 10)
  if (!isNaN(num) && num > 0 && value === num.toString()) {
    currentId.value = num
    localStorage.setItem(props.storageKey, num.toString())
    emit('select', num)
    showSelection.value = false
    results.value = []
    tips.value = ''
  } else if (props.searchFn && value) {
    const found = await props.searchFn(value)
    if (found.length === 1) {
      const id = found[0].id
      currentId.value = id
      inputValue.value = id.toString()
      localStorage.setItem(props.storageKey, id.toString())
      emit('select', id)
      showSelection.value = false
      results.value = []
      tips.value = ''
    } else if (found.length > 1) {
      results.value = found
      showSelection.value = true
      tips.value = ''
    } else {
      showSelection.value = false
      results.value = []
      tips.value = '没有找到'
    }
  } else {
    tips.value = ''
  }
}

const selectItem = (id: number) => {
  currentId.value = id
  inputValue.value = id.toString()
  localStorage.setItem(props.storageKey, id.toString())
  emit('select', id)
  showSelection.value = false
  results.value = []
}
</script>

<style scoped>
.input-demo {
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
}

.input-demo__input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-demo__input label {
  font-size: 14px;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

.input-demo__input input {
  width: 120px;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.input-demo__input input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.input-demo__tips {
  color: var(--vp-c-text-2);
  font-size: 12px;
  margin: 4px 0;
}

.input-demo__selection {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
}

.input-demo__selection ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.input-demo__selection li {
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid var(--vp-c-divider);
}

.input-demo__selection li:hover {
  background: var(--vp-c-bg-soft);
}

.input-demo__selection li:last-child {
  border-bottom: none;
}
</style>