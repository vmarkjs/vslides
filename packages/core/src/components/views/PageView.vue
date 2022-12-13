<template>
  <div :class="$style['vslides-page-view']">
    <PageContainer>
      <Page
        v-if="pageNo >= 1 && pageNo <= pages.length"
        :page="pages[pageNo - 1]"
      />
      <EndPage v-else />
    </PageContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { onKeyStroke } from '@vueuse/core'

import PageContainer from '../common/PageContainer.vue'
import Page from '../common/Page.vue'
import EndPage from '../common/EndPage.vue'

import { usePages } from '../..'

const props = defineProps<{ page: string }>()
const router = useRouter()
const pages = usePages()
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
</script>

<style module>
.vslides-page-view {
  background-color: black;
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
</style>
