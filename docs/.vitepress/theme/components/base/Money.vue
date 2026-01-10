<!-- Money.vue 用item.vue来显示金钱 
<Money name="元宝" :type="2" :amount="1200" /> 
-->

 <template>
    <Item :id="item.id" :count='item.count' />
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { getMoneyGrid, MoneyNum } from "../../../data/money";
import { ItemIdCount } from "../../../data/item";
import Item from "./Item.vue";

// 接收 props 数据
const props = defineProps<MoneyNum>();
const item = ref<ItemIdCount>({id:0, count:0});

const updateCurrentMoney = async () => {
  const xls = await getMoneyGrid(props.type, props.amount, props.compact);
  item.value = xls; 
};
// 初始化并加载数据
watchEffect(updateCurrentMoney);

</script>

