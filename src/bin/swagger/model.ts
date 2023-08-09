import { type OpenAPIV2 } from 'openapi-types'
import { useWriter } from './context'
import { getRefType, resolveType } from './types'
import { writeComment } from './comment'

export function writeField (properties: Record<string, OpenAPIV2.SchemaObject>) {
  const writer = useWriter()

  for (const [field, schema] of Object.entries(properties)) {
    const comments = [] as string[]

    if (schema.description)
      comments.push(schema.description)

    if (schema.example) {
      const example: string = schema.type === 'string'
        ? `'${schema.example as string}'`
        : schema.example

      comments.push(`@example ${example}`)
    }

    if (comments.length > 0)
      writeComment(comments)

    writer.write(`${field}:`)

    if (schema.type === 'object' && schema.properties) {
      writer.append(' {')
      writer.tab()
      writeField(schema.properties)
      writer.tab(-1)
      writer.write('},')
    } else
      writer.append(` ${resolveType(schema)},`)
  }
}

export function writeModel (name: string, schema: OpenAPIV2.SchemaObject) {
  const writer = useWriter()

  writer.line()
  writer.write(`export interface ${getRefType(name)} {`)
  writer.tab(1)

  if (schema.additionalProperties)
    writer.write('[key: string]: ', resolveType(schema.additionalProperties as OpenAPIV2.SchemaObject))
  else if (schema.properties)
    writeField(schema.properties)

  writer.tab(-1)
  writer.write('}')
}
