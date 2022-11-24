<script lang="ts">
import { VNode, defineComponent, h } from 'vue'

export default defineComponent({
  props: { pages: Array<VNode> },
  setup(props) {
    return () => h('div', { class: 'container' }, props.pages)
  },
})
</script>

<style>
.container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
</style>
