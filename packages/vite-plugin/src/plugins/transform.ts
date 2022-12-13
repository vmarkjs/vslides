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
        text: `h("${name}",${JSON.stringify(attr)},[${
          children ? children.map((c) => c.text || JSON.stringify(c)) : ''
        }])`,
      }
    },
    sanitize: false,
  })
  const parser = new MarkdownParser(renderer)
  const cg = new CodeGen()

  return {
    name: 'vslides:transform',
    async transform(src, id) {
      if (!vslidesIdRegex.test(id)) {
        return
      }

      cg.import(['h', 'reactive'], 'vue')
      cg.import('App', '@vslides/core/components/App.vue')
      cg.import('@vslides/core/style/base.css')

      cg.blank()

      cg.stmt('export const pages = [];')
      cg.stmt('export const settings = [];')

      const nodes = await parser.parse(src)
      nodes.forEach((node) => {
        cg.stmt(`pages.push(${node.text});`)
        cg.stmt(`settings.push(${JSON.stringify(node.frontmatter)});`)
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
