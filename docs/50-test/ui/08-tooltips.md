## tips测试

  <div style="padding: 60px">
    <Button ref="btn" @click="count++" >
      点击我
    </Button>
    <p>
      已点击：{{ count }} 次（tooltip 内容会变化）
    </p>
  </div>

  <div >
    <Button v-tips="'hello world!'" >
      Button(hello world)
    </Button>
</div>

  <div >
    <Button v-tips="() => `次数 ${count}`">
    函数 tooltip
    </Button>
</div>


<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)

// tooltip 内容是动态的（computed / 函数都行）
</script>
