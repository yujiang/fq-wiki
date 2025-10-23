<template>
  <div>
    <!-- 使用 el-tooltip 包裹按钮 -->
    <el-tooltip :content="'这是一个 el-Tooltip'" placement="top" effect="dark">
      <el-button>Hover me to see Tooltip</el-button>
    </el-tooltip>
  </div>

  <div>
    <el-tooltip placement="top" effect="dark" >
       <template #content> 1111<br>2222<br>3333 </template> 
      <el-button>鼠标悬停查看</el-button>
    </el-tooltip>
  </div>

  <div>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button> Duck </n-button>
    </template>
    If it looks like a duck, walks like a duck, and quacks like a duck...it must
    be a duck.
  </n-tooltip>
  </div>

    <n-tooltip :style="{ maxWidth: '200px' }" trigger="click">
      <template #trigger>
        <n-button> California Girls </n-button>
      </template> 
      <div> I wish they all could be California girls. I wish they all could be
      California girls. I wish they all could be California girls. </div>
    </n-tooltip>

    <n-tooltip :style="{ maxWidth: '400px' }" trigger="click">
      <template #trigger>
        <n-button> California Girls </n-button>
      </template>
      I wish ...
    </n-tooltip>

</template>

<script setup lang="ts">

</script>

<style scoped>
/* 如果你需要额外的样式，可以在这里调整 */
</style>
