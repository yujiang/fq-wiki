 <template>
  <InputDemo
    label="npc id"
    placeholder="输入 npc id"
    :defaultId="10002"
    storageKey="npc-demo-id"
    :searchFn="searchItems"
    @select="currentId = $event"
  >
    <NpcCard :npcId="currentId" />
  </InputDemo>
 </template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NpcCard from '../base/NpcCard.vue'
import InputDemo from '../base/InputDemo.vue'
import { findObservesByName } from '../../../data/observe'

const currentId = ref(10002)
const searchItems = async (name: string) => {
  const found = await findObservesByName(name)
  return found.map(item => ({
    id: item.Id,
    display: `${item.Id}: ${item.Name} - ${item.Desc || item.Detail}`
  }))
}

</script>

