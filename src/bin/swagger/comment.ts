import { useWriter } from './context'
import { EOL } from 'node:os'

export function writeComment (...comments: Array<string | string[]>) {
  const writer = useWriter()

  writer.write('/**')

  for (const comment of comments.flat()) {
    for (const line of comment.split(EOL))
      writer.write(' * ', line.replaceAll('\t', '  '))
  }

  writer.write(' */')
}
