 <template>
  <InputDemo
    label="soldier id"
    placeholder="输入 soldier id"
    :defaultId="10002"
  :searchFn="searchItems"
    storageKey="soldier-demo-id"
    @select="currentId = $event"
  >
    <SoldierCard :soldierId="currentId" />
  </InputDemo>
 </template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SoldierCard from '../soldier/SoldierCard.vue'
import InputDemo from '../base/InputDemo.vue'
import { findSoldiersByName } from '../../../data/soldier'

const currentId = ref(10002)

const searchItems = async (name: string) => {
  const found = await findSoldiersByName(name)
  return found.map(item => ({
    id: item.Id,
    display: `${item.Id}: ${item.Name} - ${item.Desc || item.Detail}`
  }))
}

</script>

