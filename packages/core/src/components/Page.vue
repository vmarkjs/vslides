<template>
  <div :class="$style['vslides-page-content']">
    <component :is="props.layout">
      <component :is="props.page"></component>
    </component>
  </div>
</template>

<script setup lang="ts">
import { ComponentOptions } from 'vue'

const props = defineProps<{
  page: ComponentOptions
  layout: ComponentOptions
}>()
</script>

<style module>
.vslides-page-content {
  height: 100%;
}
</style>
