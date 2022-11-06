import { defineComponent, h } from 'vue'
export default defineComponent({
  setup(_, { slots }) {
    return () =>
      h(
        'div',
        {
          style: {
            display: 'grid',
            'grid-template-columns': 'repeat(3, minmax(0, 1fr))',
          },
        },
        slots.default ? slots.default() : [],
      )
  },
})
