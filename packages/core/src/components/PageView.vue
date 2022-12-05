<script lang="ts">
import { VNode, defineComponent, h, provide, onUnmounted } from 'vue'
import {
  createRouter,
  createWebHashHistory,
  Router,
  RouteRecordRaw,
  RouterView,
} from 'vue-router'
import { onKeyStroke } from '@vueuse/core'

import Page from './Page.vue'
import EndPage from './EndPage.vue'

function getCurrentPage(router: Router) {
  const page: string = router.currentRoute.value.params.page as never
  return parseInt(page)
}

export default defineComponent({
  props: { pages: Array<VNode> },
  setup(props) {
    // dynamic routing for page view
    const PageRouter = defineComponent({
      name: 'PageRouter',
      render() {
        const pages = props.pages
        if (!pages) return

        const pageNo = getCurrentPage(router)

        // render normal pages
        if (pageNo >= 1 && pageNo <= pages.length) {
          return h(Page, () => pages[pageNo - 1])
        }

        // render end page
        if (pageNo === pages.length + 1) {
          return h(Page, () => h(EndPage))
        }

        // normalize other values
        if (pageNo > pages.length + 1) {
          router.replace(`/${pages.length + 1}`)
        } else {
          router.replace('/1')
        }
      },
    })

    // setup router
    const routes: RouteRecordRaw[] = [
      {
        path: '/',
        redirect: '/1',
      },
      {
        path: '/:page',
        component: PageRouter,
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

    // setup prev/next page
    async function prevPage() {
      const pageNo = getCurrentPage(router)
      await router.replace(`/${pageNo - 1}`)
    }
    async function nextPage() {
      const pageNo = getCurrentPage(router)
      await router.replace(`/${pageNo + 1}`)
    }
    onKeyStroke('ArrowLeft', prevPage)
    onKeyStroke('ArrowRight', nextPage)

    // render router-view
    return () => h('div', { class: 'vslides-page-view' }, [h(RouterView)])
  },
})
</script>

<style scoped>
/* only positioning-related styles */
.vslides-page-view {
  position: fixed;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
