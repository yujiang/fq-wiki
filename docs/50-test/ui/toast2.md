
## 使用 useToast Hook

### 基础用法

<script setup lang="ts">
import { useToast } from '../../.vitepress/theme/composables/useToast'

const { success, error, warn, info, loading } = useToast()

const handleSuccess = () => success('操作成功！')
const handleError = () => error('操作失败，请重试')
const handleWarn = () => warn('这是一个警告信息')
const handleInfo = () => info('这是一个提示信息')
const handleLoading = () => loading('正在处理请求...')
</script>

  <div style="display: flex; gap: 8px;">
    <Button variant="success" @click="handleSuccess">成功</Button>
    <Button variant="danger" @click="handleError">错误</Button>
    <Button variant="warning" @click="handleWarn">警告</Button>
    <Button variant="secondary" @click="handleInfo">信息</Button>
    <Button @click="handleLoading">显示加载</Button>
  </div>


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
