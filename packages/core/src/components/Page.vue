<template>
  <component :is="layout" :class="$style['vslides-page-content']">
    <component :is="page"></component>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Page, useTheme } from '..'
import DefaultLayout from './DefaultLayout.vue'

const props = defineProps<{
  page: Page
}>()
const theme = useTheme()

const layout = computed(() =>
  props.page.config?.layout && theme?.layouts
    ? theme.layouts[props.page.config.layout] ?? DefaultLayout
    : DefaultLayout,
)
const page = computed(() => props.page.component)
</script>

<style module>
.vslides-page-content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
