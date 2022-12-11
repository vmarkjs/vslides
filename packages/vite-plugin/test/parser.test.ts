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
    let lines = await parser.parse(
      'page 1\n\n---\n\npage 2\n\n---\n\ntest page',
    )
    expect(lines).toHaveLength(3)

    lines = await parser.parse('page 1\n\n---\n\npage 2\n---')
    expect(lines).toHaveLength(2)

    lines = await parser.parse('page 1\n\n---\n\npage 2\n\n---\n')
    expect(lines).toHaveLength(3)
  })

  it('should split on frontmatter', async () => {
    let lines = await parser.parse(
      '---\nlayout: cover\n---\n\n# Page 1\n\n---\n\n#Page 2\n',
    )
    expect(lines).toHaveLength(2)

    lines = await parser.parse(
      '---\nlayout: cover\n---\n\n# Page 1\n\n---\nlayout: two-cols\n---\n\n#Page 2\n',
    )
    expect(lines).toHaveLength(2)

    lines = await parser.parse(
      '---\nlayout: cover\n---\n\n# Page 1\n\n---\nlayout: two-cols\n---\n',
    )
    expect(lines).toHaveLength(2)
  })
})
