<!-- TaoluCardList.vue 多行 TaoluCard.vue
<TaoluCardList :taolus="[60056,60050]"  :title="'太祖'"/> 
-->
 
 <template>
  <div class="taolu-card-list">
    <!-- 列表标题（可选，根据需求决定是否保留） -->
    <h3 class="list-title" v-if="title">{{ props.title }}</h3>

    <!-- 空状态提示：当 taolus 为空或无数据时显示 -->
    <div class="empty-tip" v-if="props.taolus.length === 0">
      暂无套路数据
    </div>

    <!-- 批量渲染套路卡片 -->
    <TaoluCard 
    v-for="taoluId in props.taolus" 
      :key="taoluId" 
      :taolu="taoluId" 
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import TaoluCard from "./TaoluCard.vue"; // 引入单个套路卡片组件

// 接收参数：套路ID数组 + 可选标题
const props = defineProps<{
  taolus: number[]; // 核心参数：套路ID列表（如 [1001, 1002, 1003]）
  title?: string; // 可选：列表标题（如“门派基础套路”）
}>();
</script>

<style scoped>
.taolu-card-list {
  /* 容器样式：根据页面布局调整内边距 */
  padding: 4px;
}

/* 列表标题样式（可选） */
.list-title {
  margin: 0 0 16px;
  font-size: 18px;
  color: #2c3e50;
  padding-left: 8px;
  border-left: 3px solid #3498db;
}

/* 空状态提示样式 */
.empty-tip {
  padding: 40px 0;
  text-align: center;
  color: #999;
  background-color: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
}

/* 卡片之间的间距（通过父容器控制，避免卡片自身样式冲突） */
:deep(.taolu-card) {
  margin-bottom: 12px; /* 卡片下方间距 */
}

/* 最后一个卡片移除底部间距 */
:deep(.taolu-card:last-child) {
  margin-bottom: 0;
}
</style>