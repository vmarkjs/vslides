import { Plugin } from 'vite'
import hash from 'hash-sum'
import VMarkRenderer from '@vmark/core'
import MarkdownParser from '../utils/parser'
import CodeGen from '../utils/codegen'

const vslidesIdRegex = /\.md\?vslides$/

export default function transform(): Plugin {
  const renderer = new VMarkRenderer({
    h(name, attr, children) {
      return {
        text: `h("${name}", ${JSON.stringify(attr)}, [${children?.map(
          (c) => c.text || JSON.stringify(c),
        )}])`,
      }
    },
    sanitize: false,
  })
  return {
    name: 'vslides:transform',
    async transform(src, id) {
      if (!vslidesIdRegex.test(id)) {
        return
      }

      const parser = new MarkdownParser(renderer, src)
      const cg = new CodeGen()

      cg.import(['h', 'reactive'], 'vue')
      cg.import('App', '@vslides/core/components/App.vue')
      cg.import('@vslides/core/style/base.css')

      cg.blank()

      cg.stmt('export const pages = reactive([]);')

      const nodes = await parser.parse()
      nodes.forEach((node) => {
        cg.stmt(`pages.push(${node});`)
      })

      cg.blank()

      // handle hmr
      cg.stmt(
        'const _default = { setup() { return () => h(App, { pages }) } };',
      )
      cg.stmt(`_default.__hmrId = "${hash(id)}";`)
      cg.stmt(`_default.__file = "${id}";`)
      cg.stmt('__VUE_HMR_RUNTIME__.createRecord(_default.__hmrId, _default);')
      cg.stmt(
        'import.meta.hot.accept(({ default: _default }) => { __VUE_HMR_RUNTIME__.reload(_default.__hmrId, _default) });',
      )

      cg.blank()

      cg.stmt('export default _default;')

      return cg.generate()
    },
  }
}
