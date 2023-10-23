<template>
  <component :is="layout">
    <component :is="page"></component>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Page, Theme } from '../..'
import DefaultLayout from './DefaultLayout.vue'

const props = defineProps<{
  page: Page
  theme?: Theme
}>()

const layout = computed(() =>
  props.page.config?.layout && props.theme?.layouts
    ? props.theme.layouts[props.page.config.layout] ?? DefaultLayout
    : DefaultLayout,
)
const page = computed(() => props.page.component)
</script>
