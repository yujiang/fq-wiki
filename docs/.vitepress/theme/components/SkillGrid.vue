<template>
  <div class="skill-grid" v-if="skill">
    <!-- 使用 NTooltip 包裹触发元素 -->
    <n-tooltip :style="{ maxWidth: '200px' }" trigger="hover">
      <!-- 触发元素放在 #trigger 插槽中 -->
      <template #trigger>
        <div class="icon-wrap" :style="backgroundStyle">
          <img v-if="skillicon" :src="skillicon" alt="" class="icon"  />
          <span class="等级" v-if="level">{{ level }}</span>
          <span class="unlock" v-if="unlock">{{ unlock }}</span>
        </div>
      </template>
      <!-- Tooltip 内容通过插槽传递，动态绑定 skill.desc -->
      <div>{{ skill.Desc }}</div>
    </n-tooltip>
      <div class="skill-name" v-if="skill?.Name">{{ skill.Name }}</div> <!-- 物品名字 -->
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, watch, computed } from "vue";
import { SkillIdLevel, XlsSkill, getSkillById, getSkillIcon } from "../../data/skill";

// 接收 props 数据
const props = defineProps<SkillIdLevel>();

// 异步加载所有 skills
let skill = ref<XlsSkill | null>(null);
let skillicon = ref('');

// 初始化并加载数据
onMounted(async () => {
  updateCurrentSkill(props.id);
});

// 监听 good 变化
watch(
  () => props.id,
  (newGood) => {
    updateCurrentSkill(newGood);
  }
);

const updateCurrentSkill = async (id: number) => {
  skill.value = await getSkillById(id);
  skillicon.value = getSkillIcon(skill?.value?.Icon || 0);
};

// 根据 rank 动态计算背景图片
const backgroundStyle = computed(() => {
  const rank = skill.value?.Rank || 1;
  let bgImage = `url("/images/ui/tile/bag/img_skill_bar_${rank + 2}.png")`;
  return {
    backgroundImage: bgImage,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  };
});
</script>

<style scoped>
.skill-grid {
  width: 70px;
  display: flex;
  flex-direction: column; /* 竖直排列 */
  align-items: center;
  gap: 8px;
  height: 70px;
  padding: 0px 0px;
  box-sizing: border-box;
  border-radius: 6px;
  min-width: 0;
  position: relative; /* 添加相对定位以支持绝对定位的子元素 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 平滑过渡 */
}

.skill-grid:hover {
  transform: scale(1.05); /* 鼠标 hover 时放大 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 增加阴影 */
}

.icon-wrap {
  position: relative; /* 使得子元素可以相对定位 */
  transition: transform 0.3s ease; /* 图标放大效果 */
}

.icon-wrap:hover {
  transform: scale(1.1); /* 鼠标 hover 时图标放大 */
}

.等级 {
  position: absolute;
  bottom: -2px;
  right: 4px;
  font-size: 14px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* 添加阴影使其更清晰 */
}

.unlock {
  position: absolute;
  top: 0px;
  right: 2px;
  font-size: 10px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* 添加阴影使其更清晰 */
  background: rgba(0, 0, 0, 0.5);
}

.skill-name {
  position: absolute;
  bottom: -15px; /* 物品名字距离卡片的底部 */
  font-weight: 700;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  text-align: center;
  font-family: "Ma Shan Zheng", "LXGW WenKai", "KaiTi", sans-serif;
}

</style>
