import { Plugin } from 'vite'
import hash from 'hash-sum'
import VMarkRenderer from '@vmark/core'

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
  })
  return {
    name: 'vslides/transform',
    async transform(src, id) {
      if (!vslidesIdRegex.test(id)) {
        return
      }
      let code = `\n\nimport { h, reactive } from "vue";`
      code += `\nimport PageView from "@vslides/core/components/PageView.vue";`
      code += '\nimport "@vslides/core/style/base.css"'
      code += `\nexport const pages = reactive([]);`
      await Promise.all(
        src.split('---').map(async (s) => {
          const { text } = await renderer.render(s)
          code += `\npages.push(${text});`
        }),
      )

      // handle hmr
      code += `\nconst _default = { setup() { return () => h(PageView, { pages }) } };`
      code += `\n_default.__hmrId = '${hash(id)}';`
      code += `\n_default.__file = '${id}';`
      code += `\n__VUE_HMR_RUNTIME__.createRecord(_default.__hmrId, _default);`
      code += `\nimport.meta.hot.accept(({ default: _default }) => { __VUE_HMR_RUNTIME__.reload(_default.__hmrId, _default) });`
      code += `\nexport default _default;\n\n`
      return code
    },
  }
}
