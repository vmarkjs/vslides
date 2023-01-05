<template>
  <div ref="container" :class="$style['vslides-page-container']">
    <div
      :class="$style['vslides-page']"
      :style="{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'

const canvasWidth = 1280
const canvasHeight = 720
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

<style module>
.vslides-page-container {
  height: 100%;
  position: relative;
}
.vslides-page {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
