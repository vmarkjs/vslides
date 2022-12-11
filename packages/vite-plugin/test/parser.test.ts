import { describe, it, expect } from 'vitest'
import VMarkRenderer from '@vmark/core'
import MarkdownParser from '../src/utils/parser'

describe('test markdown parser', () => {
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

  it('should split normal pages', async () => {
    let nodes = await parser.parse(
      'page 1\n\n---\n\npage 2\n\n---\n\ntest page',
    )
    expect(nodes).toHaveLength(3)

    nodes = await parser.parse('page 1\n\n---\n\npage 2\n---')
    expect(nodes).toHaveLength(2)

    nodes = await parser.parse('---\n\npage 1\n\n---\n\npage 2\n\n---\n')
    expect(nodes).toHaveLength(4)
  })

  it('should split on frontmatter', async () => {
    let nodes = await parser.parse(
      '---\nlayout: cover\n---\n\n# Page 1\n\n---\n\n#Page 2\n',
    )
    expect(nodes).toHaveLength(2)

    nodes = await parser.parse(
      '---\nlayout: cover\n---\n\n# Page 1\n\n---\nlayout: two-cols\n---\n\n#Page 2\n',
    )
    expect(nodes).toHaveLength(2)
    expect(nodes[0].frontmatter).toStrictEqual({ layout: 'cover' })

    nodes = await parser.parse(
      '---\nlayout: cover\n---\n\n# Page 1\n\n---\nlayout: two-cols\n---\n',
    )
    expect(nodes).toHaveLength(2)
    expect(nodes[1].frontmatter).toStrictEqual({ layout: 'two-cols' })
  })
})
