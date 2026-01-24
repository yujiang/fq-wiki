 <template>
  <InputDemo
    label="reward id"
    placeholder="输入 id"
    :defaultId="50221"
    storageKey="reward-demo-id"
    @select="currentId = $event"
  >
    <RewardCard :rewardId="currentId" />
  </InputDemo>
 </template>

 <script setup lang="ts">
import { ref } from 'vue'
import InputDemo from '../base/InputDemo.vue'

const currentId = ref(50221)
</script>


