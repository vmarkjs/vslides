<script lang="ts">
import { VNode, defineComponent, h, provide, onUnmounted } from 'vue'
import {
  createRouter,
  createWebHashHistory,
  Router,
  RouteRecordRaw,
  RouterView,
} from 'vue-router'

import PageView from './PageView.vue'

import { providePages } from '..'

function getCurrentPage(router: Router) {
  const page: string = router.currentRoute.value.params.page as never
  return parseInt(page)
}

export default defineComponent({
  props: { pages: Array<VNode> },
  setup(props) {
    // provide pages for the whole app
    providePages(props.pages || [])

    // setup router
    const routes: RouteRecordRaw[] = [
      {
        path: '/',
        redirect: '/1',
      },
      {
        path: '/:page',
        component: PageView,
        props: true,
      },
    ]
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    })

    // register router on current component
    const fakeApp = {
      provide,
      component: () => {},
      unmount: () => {},
      config: {
        globalProperties: {},
      },
    }
    router.install(fakeApp as never)
    onUnmounted(fakeApp.unmount)

    // render app
    return () => h(RouterView)
  },
})
</script>
