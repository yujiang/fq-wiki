<template>
  <section class="discuss-card">
    <header class="discuss-header">
      <div>
        <strong>讨论区</strong>
        <span class="discuss-count" v-if="ready">
          {{ comments.length }} 条讨论
        </span>
      </div>
      <button
        class="discuss-refresh"
        type="button"
        :disabled="loading || !ready"
        @click="refresh"
      >
        刷新
      </button>
    </header>

    <p v-if="configError" class="discuss-tip">
      {{ configError }}
    </p>

    <div v-else>
      <div v-if="loading && !comments.length" class="discuss-empty">
        正在加载评论……
      </div>

      <div v-else-if="!comments.length" class="discuss-empty">
        还没有侠客发言，做第一个记录心得的人吧！
      </div>

      <ul v-else class="discuss-list">
        <li v-for="item in comments" :key="item.id" class="discuss-item">
          <div class="discuss-meta">
            <span class="discuss-author">
              {{ item.author || '无名侠客' }}
            </span>
            <time>{{ formatDate(item.created_at) }}</time>
          </div>
          <p class="discuss-content">
            {{ item.content }}
          </p>
        </li>
      </ul>

      <form class="discuss-form" @submit.prevent="handleSubmit">
        <label class="discuss-label">
          角色名（可选）
          <input
            v-model="form.nickname"
            type="text"
            autocomplete="off"
            maxlength="24"
            placeholder="默认以“无名侠客”发布"
          />
        </label>

        <label class="discuss-label">
          想说的话
          <textarea
            v-model="form.content"
            rows="4"
            maxlength="500"
            placeholder="带上攻略、体验或吐槽，让更多人看到！"
            required
          ></textarea>
        </label>

        <div class="discuss-actions">
          <span v-if="errorMessage" class="discuss-error">
            {{ errorMessage }}
          </span>
          <span v-else-if="statusMessage" class="discuss-status">
            {{ statusMessage }}
          </span>
          <button
            class="discuss-submit"
            type="submit"
            :disabled="submitting || !ready"
          >
            {{ submitting ? '发送中…' : '发布' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import type { SupabaseClient } from '@supabase/supabase-js'

import { getSupabaseClient } from '../../Utils/supabase'

interface DiscussRecord {
  id: number
  page_path: string
  page_title?: string | null
  author?: string | null
  content: string
  created_at: string
}

const props = defineProps<{
  /**
   * 自定义讨论 ID。默认使用当前页面 path。
   */
  pageId?: string
}>()

const route = useRoute()
const { page } = useData()

const comments = ref<DiscussRecord[]>([])
const loading = ref(false)
const submitting = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')
const configError = ref<string | null>(null)
const supabaseClient = ref<SupabaseClient | null>(null)

const form = reactive({
  nickname: '',
  content: ''
})

const pageKey = computed(() => props.pageId || route.path || '/')
const pageTitle = computed(() => page.value?.title || '')
const ready = computed(() => !!supabaseClient.value && !configError.value)

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

async function bootstrap() {
  const client = getSupabaseClient()
  if (!client) {
    configError.value =
      '尚未配置 Supabase 环境变量，讨论功能暂不可用。'
    return
  }
  supabaseClient.value = client
  await fetchComments()
}

async function fetchComments() {
  if (!supabaseClient.value) return
  loading.value = true
  errorMessage.value = ''
  statusMessage.value = ''

  const { data, error } = await supabaseClient.value
    .from<DiscussRecord>('discussions')
    .select('id,page_path,page_title,author,content,created_at')
    .eq('page_path', pageKey.value)
    .order('created_at', { ascending: true })

  if (error) {
    errorMessage.value = `加载失败：${error.message}`
    console.error('[Discuss] fetchComments error', error)
  } else {
    comments.value = data ?? []
  }
  loading.value = false
}

async function handleSubmit() {
  if (!supabaseClient.value) return
  const content = form.content.trim()
  if (!content) {
    errorMessage.value = '请先写点内容～'
    return
  }

  submitting.value = true
  errorMessage.value = ''

  const payload = {
    page_path: pageKey.value,
    page_title: pageTitle.value,
    author: form.nickname.trim() || '无名侠客',
    content
  }

  const { data, error } = await supabaseClient.value
    .from<DiscussRecord>('discussions')
    .insert(payload)
    .select('*')
    .limit(1)
    .single()

  if (error) {
    errorMessage.value = `发送失败：${error.message}`
    console.error('[Discuss] insert error', error)
  } else if (data) {
    comments.value = [...comments.value, data]
    form.content = ''
    statusMessage.value = '发布成功'
    setTimeout(() => (statusMessage.value = ''), 2500)
  }

  submitting.value = false
}

function refresh() {
  if (!ready.value || loading.value) return
  fetchComments()
}

onMounted(() => {
  bootstrap()
})

watch(pageKey, () => {
  if (!supabaseClient.value) return
  fetchComments()
})
</script>

<style scoped>
.discuss-card {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 5px 30px rgba(15, 23, 42, 0.08);
}

.discuss-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.discuss-header strong {
  font-size: 1.1rem;
}

.discuss-count {
  margin-left: 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.discuss-refresh {
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: transparent;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
}

.discuss-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.discuss-tip {
  margin: 0;
  color: #f59e0b;
}

.discuss-list {
  list-style: none;
  margin: 0 0 1rem;
  padding: 0;
}

.discuss-item {
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.discuss-item:last-child {
  border-bottom: none;
}

.discuss-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.discuss-author {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.discuss-content {
  margin: 0.35rem 0 0;
  line-height: 1.6;
  white-space: pre-wrap;
}

.discuss-empty {
  padding: 1rem 0;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.discuss-form {
  border-top: 1px dashed var(--vp-c-divider);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.discuss-label {
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  gap: 0.35rem;
}

.discuss-label input,
.discuss-label textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  padding: 0.5rem 0.75rem;
  background: var(--vp-c-bg);
  font: inherit;
  resize: vertical;
}

.discuss-label textarea {
  min-height: 100px;
}

.discuss-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.discuss-error {
  color: #f87171;
  font-size: 0.9rem;
}

.discuss-status {
  color: #10b981;
  font-size: 0.9rem;
}

.discuss-submit {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1.5rem;
  font-size: 0.95rem;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  cursor: pointer;
}

.discuss-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
