<script lang="ts">
import { VNode, defineComponent, h, provide, onUnmounted } from 'vue'
import {
  createRouter,
  createWebHashHistory,
  RouterView,
  RouterLink,
} from 'vue-router'

export default defineComponent({
  props: { pages: Array<VNode> },
  setup(props) {
    const fakeApp = {
      provide,
      component: () => {},
      unmount: () => {},
      config: {
        globalProperties: {},
      },
    }
    const routes = [
      {
        path: '/',
        component: defineComponent({
          render() {
            return h('div', [
              'hello',
              h(RouterLink, { to: '/about' }, () => 'link'),
            ])
          },
        }),
      },
      {
        path: '/about',
        component: defineComponent({
          render() {
            return h('div', ['world'])
          },
        }),
      },
    ]
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    })
    router.install(fakeApp as never)
    onUnmounted(fakeApp.unmount)
    return () =>
      h('div', [h(RouterView), h('div', { class: 'container' }, props.pages)])
  },
})
</script>

<style>
.container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
</style>
