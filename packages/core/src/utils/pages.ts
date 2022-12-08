import { inject, InjectionKey, provide, VNode } from 'vue'

const pagesSymbol = Symbol('pages') as InjectionKey<VNode[]>

export function providePages(pages: VNode[]) {
  provide(pagesSymbol, pages)
}

export function usePages() {
  const pages = inject(pagesSymbol)
  if (pages === undefined) {
    throw new Error('must call providePages first')
  }
  return pages
}
