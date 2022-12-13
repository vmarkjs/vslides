<script lang="ts">
import { defineComponent, h, provide, onUnmounted, PropType } from 'vue'
import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouterView,
} from 'vue-router'

import PageView from './views/PageView.vue'

import { Page, providePages, Theme, provideTheme } from '..'

export default defineComponent({
  props: {
    pages: {
      type: Array<Page>,
      required: true,
    },
    theme: Object as PropType<Theme>,
  },
  setup(props) {
    // provide data for the whole app
    providePages(props.pages)
    provideTheme(props.theme)

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
