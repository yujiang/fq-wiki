# Button 组件测试

Button 组件提供多种样式变体、尺寸和状态选项。

## 基础用法

最简单的按钮使用：

<Button>默认按钮</Button>

## 变体 (Variants)

提供 6 种颜色变体：

### Primary
<Button variant="primary">主要按钮</Button>

### Secondary
<Button variant="secondary">次要按钮</Button>

### Success
<Button variant="success">成功</Button>

### Warning
<Button variant="warning">警告</Button>

### Danger
<Button variant="danger">危险</Button>

### Ghost
<Button variant="ghost">幽灵按钮</Button>

## 尺寸 (Sizes)

提供 3 种尺寸选项：

### Small
<Button variant="primary" size="sm">小按钮</Button>

### Medium (默认)
<Button variant="primary" size="md">中按钮</Button>

### Large
<Button variant="primary" size="lg">大按钮</Button>

## 状态 (States)

### 禁用状态
<Button disabled>禁用按钮</Button>
<Button variant="primary" disabled>禁用主要按钮</Button>

### 块级按钮 (Block)
<Button variant="primary" block>块级按钮（占满宽度）</Button>

### 圆角按钮 (Rounded)
<Button variant="primary" rounded>圆角按钮</Button>

## 组合使用

可以组合使用不同的属性：

### 小尺寸 + 圆角
<Button variant="success" size="sm" rounded>小圆角按钮</Button>

### 大尺寸 + 块级
<Button variant="warning" size="lg" block>大块级警告按钮</Button>

### 圆角 + 幽灵
<Button variant="ghost" rounded>圆角幽灵按钮</Button>

## 事件处理

点击事件：

<script setup lang="ts">
import { ref } from 'vue'
import Button from '../../.vitepress/theme/components/ui/Button.vue'

const count = ref(0)
const handleClick = (e: MouseEvent) => {
  console.log('Button clicked!', e)
  count.value++
}
</script>

<Button variant="primary" @click="handleClick">
  点击了 {{ count }} 次
</Button>

## 实际应用示例

### 表单按钮组
<div style="display: flex; gap: 12px;">
  <Button variant="secondary">取消</Button>
  <Button variant="primary">确认</Button>
</div>

### 操作按钮组
<div style="display: flex; gap: 8px;">
  <Button variant="ghost" size="sm">编辑</Button>
  <Button variant="ghost" size="sm">删除</Button>
  <Button variant="danger" size="sm" block>永久删除</Button>
</div>

## 插槽内容

按钮内容支持任意内容：

<Button variant="primary">
  <span style="font-size: 18px;">🚀</span>
  发送
</Button>

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|------|
| variant | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'ghost'` | `'primary'` | 按钮样式变体 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 按钮尺寸 |
| disabled | `boolean` | `false` | 是否禁用 |
| block | `boolean` | `false` | 是否占满宽度 |
| rounded | `boolean` | `false` | 是否圆角 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| click | `MouseEvent` | 点击事件（禁用时不触发）|

### Slots

| 名称 | 说明 |
|------|------|
| default | 按钮内容 |
