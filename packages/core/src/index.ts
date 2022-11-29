import { useRoute } from 'vue-router'

export function useCurrentPage() {
  const route = useRoute()
  const page: string = route.params.page as never
  return parseInt(page)
}
