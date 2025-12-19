<script setup lang="ts">
import { computed, ref } from "vue";

type SizePreset = "xs" | "sm" | "md" | "lg" | "xl";

const props = withDefaults(
  defineProps<{
    id: number | string;
    alt?: string;
    caption?: string;
    // 你可以只用 size，也可以直接传 width/height 覆盖
    size?: SizePreset;
    width?: number | string;
    height?: number | string;
    // 默认路径规则：/images/char/{id}.jpg
    base?: string;
    ext?: string; // jpg/png/webp
    // 失败时用的兜底图
    fallback?: string;
    // 是否点击打开原图（新标签页）
    clickable?: boolean;
    // 是否懒加载
    lazy?: boolean;
    // 是否居中
    center?: boolean;
    // 圆角
    rounded?: boolean;
  }>(),
  {
    base: "/images/char",
    ext: "jpg",
    fallback: "/images/char/_missing.jpg",
    clickable: true,
    lazy: true,
    center: false,
    rounded: true,
  }
);

const failed = ref(false);

const sizeMap = {
    xs: [120, 160],
    sm: [180, 240],
    md: [240, 320],
    lg: [320, 420],
    xl: [420, 560],    
}

const presetWidth = (size?: SizePreset) => {
  if (!size) return undefined;
  const find = sizeMap[size];
  if (!find) return undefined;
  return find[0];
};

const src = computed(() => `${props.base}/${props.id}.${props.ext}`);

const displaySrc = computed(() => (failed.value ? props.fallback : src.value));

const styleObj = computed(() => {
  const w = props.width ?? presetWidth(props.size);
  const h = props.height;
  return {
    width: w != null ? (typeof w === "number" ? `${w}px` : w) : undefined,
    height: h != null ? (typeof h === "number" ? `${h}px` : h) : undefined,
    borderRadius: props.rounded ? "12px" : undefined,
    display: "block",
    maxWidth: "100%",
  } as Record<string, string | undefined>;
});

function onError() {
  // 避免 fallback 也 404 时无限循环
  if (!failed.value) failed.value = true;
}
</script>

<template>
  <figure :style="{ margin: 0, textAlign: center ? 'center' : 'left' }">
    <a v-if="clickable" :href="src" target="_blank" rel="noopener noreferrer">
      <img
        :src="displaySrc"
        :alt="alt || `角色图片 ${id}`"
        :style="styleObj"
        :loading="lazy ? 'lazy' : 'eager'"
        @error="onError"
      />
    </a>
    <img
      v-else
      :src="displaySrc"
      :alt="alt || `角色图片 ${id}`"
      :style="styleObj"
      :loading="lazy ? 'lazy' : 'eager'"
      @error="onError"
    />

    <figcaption
      v-if="caption"
      :style="{ marginTop: '6px', color: 'var(--vp-c-text-2)', fontSize: '13px' }"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
