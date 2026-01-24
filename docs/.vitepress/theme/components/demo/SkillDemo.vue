 <template>
  <InputDemo
    label="skill id or name"
    placeholder="输入 skill id 或名称"
    :defaultId="1"
    storageKey="skill-demo-id"
    :searchFn="searchSkills"
    @select="currentId = $event"
  >
    <Skill :id="currentId" :level="1" />
  </InputDemo>
 </template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Skill from '../base/Skill.vue'
import { findSkillsByName } from '../../../data/skill'
import InputDemo from '../base/InputDemo.vue'

const currentId = ref(1)

const searchSkills = async (name: string) => {
  const found = await findSkillsByName(name)
  return found.map(skill => ({
    id: skill.Id,
    display: `${skill.Id}: ${skill.Name}`
  }))
}
</script>

