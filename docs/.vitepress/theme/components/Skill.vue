<!-- Skill.vue 技能 
<Skill :id="50001" :level='99' /> 
-->
 
 <template>
  <div class="base-item-game skill-game"
    @mouseover="showPopover = !!skilldesc"
    @mouseleave="showPopover = false"
  >
    <!-- 使用 NTooltip 包裹触发元素 -->
    <n-tooltip :style="{ maxWidth: '200px' }" :show="showPopover" trigger="manual">
      <!-- 触发元素放在 #trigger 插槽中 -->
      <template #trigger>
        <div class="icon-wrap" :style="backgroundStyle">
          <img v-if="skillicon" :src="skillicon" alt="" class="icon"  />
          <span class="等级" v-if="level">{{ level }}</span>
          <span class="exp" v-if="exp">{{ exp<0?'新':exp }}</span>
          <span class="unlock" v-if="unlock">{{ unlock / 4 + 1 }}</span>
          <span class="fLevel" v-if="fLevel">{{ getFLevelDesc }}</span>
        </div>
      </template>
      <!-- Tooltip 内容通过插槽传递，动态绑定 skill.desc -->
      <div>{{ skilldesc }}</div>
    </n-tooltip>
      <div class="base-item-name skill-name" v-if="skill?.Name">{{ skill.Name }}</div> <!-- 物品名字 -->
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, watch, computed } from "vue";
import { SkillIdLevel, XlsSkill, getSkillById, getSkillIcon } from "../../data/skill";
import { getRankBgStyle } from "../../data/xls";
import { getFriendLevelDesc } from "../../data/npc";

// 接收 props 数据
const props = defineProps<SkillIdLevel>();

// 异步加载所有 skills
let skill = ref<XlsSkill | null>(null);
let skillicon = ref('');
let showPopover = ref(false)
let skilldesc = ref('');

let getFLevelDesc = computed(() => {
  return props.fLevel ? getFriendLevelDesc(props.fLevel) : '';
});
// let randdesc = ref(props.unlock ? props.unlock : props.fLevel ? getFriendLevelDesc(props.fLevel) : "");

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
  const xls = await getSkillById(id);
  skill.value = await getSkillById(id);
  skillicon.value = getSkillIcon(xls?.Icon);
  skilldesc.value = xls?.Desc || xls?.Detail || '';
};

// 根据 rank 动态计算背景图片
const backgroundStyle = computed(() => getRankBgStyle(skill.value?.Rank));
</script>

<style scoped>


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
  top: -2px;
  right: 2px;
  font-size: 12px;
  color: orange;
  font-weight: bold;
}

.exp {
  position: absolute;
  bottom: -2px;
  left: 2px;
  font-size: 14px;
  color: greenyellow;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* 添加阴影使其更清晰 */
}


.fLevel {
  position: absolute;
  top: 0px;
  right: 2px;
  font-size: 10px;
  color: orange;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* 添加阴影使其更清晰 */
  background: rgba(0, 0, 0, 0.5);
}

.skill-name {}

</style>
