import { VNode, defineComponent, h } from 'vue'

export default defineComponent({
  props: { pages: Array<VNode> },
  setup(props) {
    return () =>
      h(
        'div',
        {
          style: {
            display: 'grid',
            'grid-template-columns': 'repeat(3, minmax(0, 1fr))',
          },
        },
        props.pages,
      )
  },
})
