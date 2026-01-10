# Toast 组件测试

Toast 通知组件提供多种类型的消息提示。

## 安装

```bash
pnpm add vue3-toastify
```

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const showDefault = () => toast('默认提示')
const showSuccess = () => toast.success('操作成功！')
const showError = () => toast.error('操作失败！')
const showWarning = () => toast.warn('警告信息')
const showInfo = () => toast.info('提示信息')
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
const showTopRight = () => {
  toast('右上角提示', {
    position: toast.POSITION.TOP_RIGHT
  })
}
const showLongToast = () => {
  toast('5秒后关闭', {
    autoClose: 5000
  })
}
const showNoAutoClose = () => {
  toast('需要手动关闭', {
    autoClose: false,
    closeOnClick: true
  })
}
const showPauseOnHover = () => {
  toast('鼠标悬停时暂停', {
    pauseOnHover: true
  })
}
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
const removeToast = () => {
  toast.clearAll()
}
</script>

## 基础用法

 <div style="display: flex; gap: 8px;">
  <Button @click="showDefault">显示默认提示</Button>

  <Button variant="success" @click="showSuccess">成功</Button>

  <Button variant="danger" @click="showError">错误</Button>

  <Button variant="warning" @click="showWarning">警告</Button>

  <Button variant="secondary" @click="showInfo">信息</Button>

  <Button @click="showLoading">加载中...</Button>
 </div>

## 自定义配置

<div style="display: flex; gap: 8px;">

  <Button @click="showTopRight">右上角提示</Button>
  <Button @click="showLongToast">5秒后关闭</Button>
  <Button @click="showNoAutoClose">需要手动关闭</Button>
  <Button @click="showPauseOnHover">鼠标悬停时暂停</Button>
</div>


## 高级用法

<div style="display: flex; gap: 8px;">
  <Button variant="primary" @click="updateToast">更新 Toast</Button>
  <Button variant="danger" @click="removeToast">关闭所有</Button>
</div>
