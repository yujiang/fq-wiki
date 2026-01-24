<!-- TalentList.vue 一排talent
<TalentList :talents="[201021,201022]" />
-->

<template>
  <div class="base-list talent-list">
    <Talent
      v-for="(talentId, index) in props.talents"
      :key="talentId || index"
      :id="talentId"
    />
  </div>
</template>

<script setup lang="ts">
import Talent from "./Talent.vue";

const props = defineProps<{ talents: number[] }>();
</script>

<style scoped>
.talent-list {
}
</style>
