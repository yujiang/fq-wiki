# Toast 组件测试

Toast 通知组件提供多种类型的消息提示。

## 安装

```bash
pnpm add vue3-toastify
```

## 基础用法

### 默认 Toast
<button @click="showDefault">显示默认提示</button>

### 成功提示
<Button variant="success" @click="showSuccess">成功</Button>

### 错误提示
<Button variant="danger" @click="showError">错误</Button>

### 警告提示
<Button variant="warning" @click="showWarning">警告</Button>

### 信息提示
<Button variant="secondary" @click="showInfo">信息</Button>

## 加载状态

<button @click="showLoading">加载中...</button>

## 自定义配置

### 自定义位置
<button @click="showTopRight">右上角提示</button>

### 自定义时间
<button @click="showLongToast">5秒后关闭</button>

### 不自动关闭
<button @click="showNoAutoClose">需要手动关闭</button>

### 暂停悬停
<button @click="showPauseOnHover">鼠标悬停时暂停</button>

## 高级用法

### 更新 Toast
<Button variant="primary" @click="updateToast">更新 Toast</Button>

### 关闭 Toast
<Button @click="removeToast">关闭所有</Button>

## 使用 useToast Hook

<script setup lang="ts">
import { useToast } from '../../.vitepress/theme/composables/useToast'

const { success, error, warn, info } = useToast()

const handleSuccess = () => {
  success('操作成功！')
}

const handleError = () => {
  error('操作失败，请重试')
}
</script>

<template>
  <Button variant="success" @click="handleSuccess">成功</Button>
  <Button variant="danger" @click="handleError">错误</Button>
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

### 位置常量

- `toast.POSITION.TOP_LEFT`
- `toast.POSITION.TOP_CENTER`
- `toast.POSITION.TOP_RIGHT`
- `toast.POSITION.BOTTOM_LEFT`
- `toast.POSITION.BOTTOM_CENTER`
- `toast.POSITION.BOTTOM_RIGHT`
