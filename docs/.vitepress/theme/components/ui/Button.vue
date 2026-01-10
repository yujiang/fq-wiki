<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    block?: boolean
    rounded?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    block: false,
    rounded: false,
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (e: MouseEvent) => {
  if (!props.disabled) {
    emit('click', e)
  }
}

const classes = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`,
  {
    'btn--disabled': props.disabled,
    'btn--block': props.block,
    'btn--rounded': props.rounded,
  },
])
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  white-space: nowrap;
}

.btn:hover:not(.btn--disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:active:not(.btn--disabled) {
  transform: translateY(0);
}

.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--block {
  display: flex;
  width: 100%;
}

.btn--rounded {
  border-radius: 20px;
}

/* Sizes */
.btn--sm {
  padding: 4px 12px;
  font-size: 12px;
}

.btn--md {
  padding: 8px 16px;
  font-size: 14px;
}

.btn--lg {
  padding: 12px 24px;
  font-size: 16px;
}

/* Variants */
.btn--primary {
  background-color: var(--vp-c-brand, #3e63dd);
  color: #fff;
}

.btn--primary:hover:not(.btn--disabled) {
  background-color: var(--vp-c-brand-dark, #2e4cc9);
}

.btn--secondary {
  background-color: var(--vp-c-default-bg, #fff);
  color: var(--vp-c-text-1, #2c3e50);
  border: 1px solid var(--vp-c-default-border, #e2e8f0);
}

.btn--secondary:hover:not(.btn--disabled) {
  background-color: var(--vp-c-bg-soft, #f8f9fa);
}

.btn--success {
  background-color: #10b981;
  color: #fff;
}

.btn--success:hover:not(.btn--disabled) {
  background-color: #059669;
}

.btn--warning {
  background-color: #f59e0b;
  color: #fff;
}

.btn--warning:hover:not(.btn--disabled) {
  background-color: #d97706;
}

.btn--danger {
  background-color: #ef4444;
  color: #fff;
}

.btn--danger:hover:not(.btn--disabled) {
  background-color: #dc2626;
}

.btn--ghost {
  background-color: transparent;
  color: var(--vp-c-text-1, #2c3e50);
}

.btn--ghost:hover:not(.btn--disabled) {
  background-color: var(--vp-c-bg-soft, #f8f9fa);
}
</style>
