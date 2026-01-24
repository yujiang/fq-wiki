 <template>
  <InputDemo
    label="item id or name"
    placeholder="输入 item id 或名称"
    :defaultId="1"
    storageKey="item-demo-id"
    :searchFn="searchItems"
    @select="currentId = $event"
  >
    <Item :id="currentId" :count="1" />
  </InputDemo>
 </template>

 <script setup lang="ts">
import { ref, onMounted } from 'vue'
import Item from '../base/Item.vue'
import InputDemo from '../base/InputDemo.vue'
import { findItemsByName, XlsItem } from '../../../data/item'

const props = defineProps<{ defaultId?: number }>()

const currentId = ref(1)

const searchItems = async (name: string) => {
  const found = await findItemsByName(name)
  return found.map(item => ({
    id: item.Id,
    display: `${item.Id}: ${item.Name} - ${item.Desc || item.Detail}`
  }))
}
</script>

