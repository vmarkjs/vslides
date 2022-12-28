import { ComponentOptions, inject, InjectionKey, provide } from 'vue'

export interface Theme {
  name: string
  layouts?: Record<string, ComponentOptions>
}

const themeSymbol = Symbol('theme') as InjectionKey<Theme>

export function provideTheme(theme: Theme | undefined) {
  provide(themeSymbol, theme)
}

export function useTheme() {
  const theme = inject(themeSymbol)
  return theme
}
