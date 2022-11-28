<template>
  <div ref="container" class="vslides-page-container">
    <div
      class="vslides-page"
      :style="{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }"
    >
      <div class="vslides-page-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'

const canvasWidth = 960
const canvasHeight = 540
const aspect = canvasWidth / canvasHeight

const container = ref(null)
const { width, height } = useElementSize(container)

const scale = computed(() => {
  if (width.value / height.value > aspect) {
    return height.value / canvasHeight
  }
  return width.value / canvasWidth
})
</script>

<style scoped>
/* only positioning-related styles */
.vslides-page-container {
  height: 100%;
  position: relative;
}
.vslides-page {
  position: absolute;
  left: 50%;
  top: 50%;
}
.vslides-page-content {
  height: 100%;
}
</style>
