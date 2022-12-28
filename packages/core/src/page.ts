import { ComponentOptions, inject, InjectionKey, provide } from 'vue'

export interface Page {
  component: ComponentOptions
  config?: Record<string, string>
}

const pagesSymbol = Symbol('pages') as InjectionKey<Page[]>

export function providePages(pages: Page[]) {
  provide(pagesSymbol, pages)
}

export function usePages() {
  const pages = inject(pagesSymbol)
  if (pages === undefined) {
    throw new Error('must call providePages first')
  }
  return pages
}
