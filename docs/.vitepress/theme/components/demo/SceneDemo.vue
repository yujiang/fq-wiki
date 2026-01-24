 <template>
  <InputDemo
    label="scene id"
    placeholder="输入 id"
    :defaultId="1023"
    :searchFn="searchItems"
    storageKey="scene-demo-id"
    @select="currentId = $event"
  >
    <Scene :sceneId="currentId" />
  </InputDemo>
 </template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Scene from '../Scene/Scene.vue'
import InputDemo from '../base/InputDemo.vue'
import { findScenesByName } from '../../../data/scene'
const currentId = ref(1023)

const searchItems = async (name: string) => {
  const found = await findScenesByName(name)
  return found.map(item => ({
    id: item.Id,
    display: `${item.Id}: ${item.Name} - ${item.Desc || item.Detail}`
  }))
}
</script>

