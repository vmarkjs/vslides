<template>
  <PageDisplay
    :pages="pages"
    :theme="theme"
    :page-no="pageNo"
    @touchend="onTouch"
  />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { onKeyStroke, useWindowSize } from '@vueuse/core'

import PageDisplay from '../PageDisplay.vue'

import { usePages, useTheme } from '../..'

const props = defineProps<{ page: string }>()
const router = useRouter()
const pages = usePages()
const theme = useTheme()
const pageNo = computed(() => parseInt(props.page || '1'))

// normalize page
watch(
  pageNo,
  (n) => {
    if (isNaN(n) || n < 1) {
      router.replace('/1')
    } else if (n > pages.length + 1) {
      router.replace(`/${pages.length + 1}`)
    }
  },
  { immediate: true },
)

// setup prev/next page
async function prevPage() {
  await router.replace(`/${pageNo.value - 1}`)
}
async function nextPage() {
  await router.replace(`/${pageNo.value + 1}`)
}
onKeyStroke('ArrowLeft', prevPage)
onKeyStroke('ArrowRight', nextPage)

const { width } = useWindowSize()
function onTouch(e: TouchEvent) {
  console.log(e)
  const target = e.target as HTMLElement | undefined
  if (
    !target ||
    target.tagName === 'A' ||
    target.tagName === 'BUTTON' ||
    target.onclick !== null
  ) {
    return
  }
  if (e.changedTouches.length !== 1) {
    return
  }
  const pageX = e.changedTouches[0].pageX
  if (pageX / width.value < 0.3) {
    prevPage()
  } else if (pageX / width.value > 0.7) {
    nextPage()
  }
}
</script>

<style module>
.vslides-page-view {
  background-color: black;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
</style>
