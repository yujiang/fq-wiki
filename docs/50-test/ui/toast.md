# Toast 组件测试

Toast 通知组件提供多种类型的消息提示。

## 安装

```bash
pnpm add vue3-toastify
```

## 基础用法

### 默认 Toast

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const showDefault = () => toast('默认提示')
</script>

<template>
  <button @click="showDefault">显示默认提示</button>
</template>

### 成功提示

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const showSuccess = () => toast.success('操作成功！')
</script>

<template>
  <Button variant="success" @click="showSuccess">成功</Button>
</template>

### 错误提示

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const showError = () => toast.error('操作失败！')
</script>

<template>
  <Button variant="danger" @click="showError">错误</Button>
</template>

### 警告提示

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const showWarning = () => toast.warn('警告信息')
</script>

<template>
  <Button variant="warning" @click="showWarning">警告</Button>
</template>

### 信息提示

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const showInfo = () => toast.info('提示信息')
</script>

<template>
  <Button variant="secondary" @click="showInfo">信息</Button>
</template>

## 加载状态

### 加载中

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const showLoading = () => {
  const id = toast.loading('加载中...')
  setTimeout(() => {
    toast.update(id, {
      render: '加载完成！',
      type: 'success',
      autoClose: true,
      isLoading: false
    })
    toast.done(id)
  }, 2000)
}
</script>

<template>
  <button @click="showLoading">加载中...</button>
</template>

## 自定义配置

### 自定义位置

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const showTopRight = () => {
  toast('右上角提示', {
    position: toast.POSITION.TOP_RIGHT
  })
}
</script>

<template>
  <button @click="showTopRight">右上角提示</button>
</template>

### 自定义时间

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const showLongToast = () => {
  toast('5秒后关闭', {
    autoClose: 5000
  })
}
</script>

<template>
  <button @click="showLongToast">5秒后关闭</button>
</template>

### 不自动关闭

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const showNoAutoClose = () => {
  toast('需要手动关闭', {
    autoClose: false,
    closeOnClick: true
  })
}
</script>

<template>
  <button @click="showNoAutoClose">需要手动关闭</button>
</template>

### 暂停悬停

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const showPauseOnHover = () => {
  toast('鼠标悬停时暂停', {
    pauseOnHover: true
  })
}
</script>

<template>
  <button @click="showPauseOnHover">鼠标悬停时暂停</button>
</template>

## 高级用法

### 更新 Toast

<script setup lang="ts">
import { toast } from 'vue3-toastify'

let toastId: any

const updateToast = () => {
  if (toastId) {
    toast.update(toastId, {
      render: '已更新内容',
      autoClose: true,
      type: 'success',
      isLoading: false
    })
    toast.done(toastId)
  } else {
    toastId = toast.loading('正在更新...')
  }
}
</script>

<template>
  <Button variant="primary" @click="updateToast">更新 Toast</Button>
</template>

### 关闭 Toast

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const removeToast = () => {
  toast.clearAll()
}
</script>

<template>
  <Button variant="danger" @click="removeToast">关闭所有</Button>
</template>

## 使用 useToast Hook

### 基础用法

<script setup lang="ts">
import { useToast } from '../../.vitepress/theme/composables/useToast'

const { success, error, warn, info } = useToast()

const handleSuccess = () => success('操作成功！')
const handleError = () => error('操作失败，请重试')
const handleWarn = () => warn('这是一个警告信息')
const handleInfo = () => info('这是一个提示信息')
</script>

<template>
  <div style="display: flex; gap: 8px;">
    <Button variant="success" @click="handleSuccess">成功</Button>
    <Button variant="danger" @click="handleError">错误</Button>
    <Button variant="warning" @click="handleWarn">警告</Button>
    <Button variant="secondary" @click="handleInfo">信息</Button>
  </div>
</template>

### 加载状态

<script setup lang="ts">
import { useToast } from '../../.vitepress/theme/composables/useToast'

const { loading } = useToast()

const handleLoading = () => loading('正在处理请求...')
</script>

<template>
  <Button @click="handleLoading">显示加载</Button>
</template>

### 关闭所有

<script setup lang="ts">
import { useToast } from '../../.vitepress/theme/composables/useToast'

const { clearAll } = useToast()

const handleCloseAll = () => clearAll()
</script>

<template>
  <Button variant="danger" @click="handleCloseAll">关闭所有</Button>
</template>

## API

### toast Options

| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|------|
| position | `string` | `TOP_CENTER` | 显示位置 |
| autoClose | `boolean` \| `number` | `true` | 是否自动关闭（数字为毫秒） |
| pauseOnHover | `boolean` | `true` | 鼠标悬停时暂停计时 |
| closeOnClick | `boolean` | `true` | 点击是否关闭 |
| draggable | `boolean` | `false` | 是否可拖拽 |
| draggablePercent | `number` | `0.6` | 拖拽阈值 |
| toastClassName | `string` | - | 自定义 Toast 类名 |
| bodyClassName | `string` | - | 自定义内容类名 |
| isLoading | `boolean` | `false` | 是否显示加载状态 |
| render | `string` \| `Component` | - | 自定义渲染内容 |
| type | `string` | - | Toast 类型：success, error, warn, info |

### 位置常量

- `toast.POSITION.TOP_LEFT`
- `toast.POSITION.TOP_CENTER`
- `toast.POSITION.TOP_RIGHT`
- `toast.POSITION.BOTTOM_LEFT`
- `toast.POSITION.BOTTOM_CENTER`
- `toast.POSITION.BOTTOM_RIGHT`

### 预设方法

| 方法 | 说明 |
|------|------|
| `toast(message, options)` | 显示默认 Toast |
| `toast.success(message, options)` | 显示成功 Toast |
| `toast.error(message, options)` | 显示错误 Toast |
| `toast.warn(message, options)` | 显示警告 Toast |
| `toast.info(message, options)` | 显示信息 Toast |
| `toast.loading(message, options)` | 显示加载 Toast |
| `toast.update(id, options)` | 更新指定 Toast |
| `toast.done(id)` | 标记加载 Toast 完成 |
| `toast.remove(id)` | 关闭指定 Toast |
| `toast.clearAll()` | 关闭所有 Toast |

### useToast Hook

```typescript
const {
  success,   // 成功提示
  error,     // 错误提示
  warn,      // 警告提示
  info,      // 信息提示
  loading,   // 加载提示
  default,   // 默认提示
  clearAll,  // 关闭所有
  remove,    // 关闭指定
} = useToast()
```
