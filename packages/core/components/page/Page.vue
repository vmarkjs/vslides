<template>
  <component :is="layout">
    <component :is="page"></component>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Page, useTheme } from '../..'
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
