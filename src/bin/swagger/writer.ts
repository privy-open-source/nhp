import { EOL } from 'node:os'

export default class TextWriter {
  public lines: string[]
  public tabs: number
  public index: number

  constructor () {
    this.lines = []
    this.index = 0
    this.tabs  = 0
  }

  tab (tab = 1) {
    this.tabs = Math.max(this.tabs + tab, 0)

    return this
  }

  goto (index: number) {
    this.index = Math.max(index - 1, 0)

    return this
  }

  home () {
    this.index = 0

    return this
  }

  end () {
    this.index = this.lines.length

    return this
  }

  write (...texts: string[]) {
    const content = Array.from({ length: this.tabs })
      .fill('  ')
      .concat(texts) // eslint-disable-line unicorn/prefer-spread
      .join('')
      .trimEnd()

    this.lines.splice(this.index++, 0, content)

    return this
  }

  append (...texts: string[]) {
    const oldContent = this.lines[this.index - 1]
    const newContent = texts.join('').trimEnd()

    this.lines[this.index - 1] = `${oldContent}${newContent}`

    return this
  }

  line (line = 1) {
    for (let u = 0; u < line; u++)
      this.lines.splice(this.index++, 0, '')

    return this
  }

  toString () {
    return `${this.lines.join(EOL)}${EOL}`
  }
}
