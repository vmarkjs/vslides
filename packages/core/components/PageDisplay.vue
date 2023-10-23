<template>
  <div :class="$style['vslides-page-display']">
    <PageContainer>
      <NormalPage
        v-if="pageNo >= 1 && pageNo <= pages.length"
        :page="pages[pageNo - 1]"
        :theme="theme"
      />
      <EndPage v-else />
    </PageContainer>
  </div>
</template>

<script setup lang="ts">
import PageContainer from './page/PageContainer.vue'
import NormalPage from './page/NormalPage.vue'
import EndPage from './page/EndPage.vue'

import type { Page, Theme } from '..'

defineProps<{
  pages: Page[]
  theme?: Theme
  pageNo: number
}>()
</script>

<style module>
.vslides-page-display {
  background-color: black;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
</style>
