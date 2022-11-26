<script lang="ts">
import { VNode, defineComponent, h, provide, onUnmounted } from 'vue'
import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import { onKeyStroke } from '@vueuse/core'

import Page from './Page.vue'

export default defineComponent({
  props: { pages: Array<VNode> },
  setup(props) {
    const routes = [
      {
        path: '/:page',
        component: defineComponent({
          render() {
            const pages = props.pages
            if (!pages) return

            const page: string = router.currentRoute.value.params.page as never
            const pageNo = parseInt(page) - 1

            if (pageNo >= 0 && pageNo < pages.length) {
              return h(Page, () => pages[pageNo])
            }

            if (pageNo >= pages.length) {
              router.replace(`/${pages.length}`)
            } else {
              router.replace('/1')
            }
          },
        }),
      },
    ]

    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    })

    async function prevPage() {
      const page: string = router.currentRoute.value.params.page as never
      const pageNo = parseInt(page) - 1
      await router.replace(`/${pageNo}`)
    }
    onKeyStroke('ArrowLeft', prevPage)
    async function nextPage() {
      const page: string = router.currentRoute.value.params.page as never
      const pageNo = parseInt(page) - 1
      await router.replace(`/${pageNo + 2}`)
    }
    onKeyStroke('ArrowRight', nextPage)

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
    return () => h('div', { class: 'vslides-page-view' }, [h(RouterView)])
  },
})
</script>

<style>
.vslides-page-view {
  position: fixed;
  height: 100%;
  width: 100%;
  overflow: hidden;

  background-color: black;
}
</style>
