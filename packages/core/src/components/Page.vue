<template>
  <component :is="props.layout" :class="$style['vslides-page-content']">
    <component :is="props.page"></component>
  </component>
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
