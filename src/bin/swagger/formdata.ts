/* eslint-disable unicorn/prefer-spread */
/* eslint-disable no-template-curly-in-string */
import { set } from 'lodash-es'
import { type OpenAPIV2 } from 'openapi-types'
import { useWriter } from './context'
import { writeComment } from './comment'
import {
  isParamBody,
  isParamFormData,
  resolveType,
} from './types'

const SchemaSymbol = Symbol('SchemaSymbol')

type WrappedSchema = Record<symbol, OpenAPIV2.InBodyParameterObject>

interface FormDataSchema {
  [name: string]: WrappedSchema | FormDataSchema | FormDataSchema[],
}

function isSchema (value: unknown): value is WrappedSchema {
  return unWrap(value as WrappedSchema) !== undefined
}

function unWrap (value: WrappedSchema): OpenAPIV2.InBodyParameterObject {
  return (value)[SchemaSymbol]
}

function joinName (names: string[]): string {
  return names
    .map((value, index) => index > 0 ? `[${value}]` : value)
    .join('')
}

export function normalizeName (rawName: string): string {
  const match = rawName.match(/\w+/g)

  return match ? joinName(match) : rawName
}

export function parseParams (parameters: OpenAPIV2.Parameters): FormDataSchema {
  const result: FormDataSchema = {}

  for (const param of parameters) {
    if (isParamFormData(param) || isParamBody(param)) {
      const name  = normalizeName(param.name)
      const value = param

      set(result, name, { [SchemaSymbol]: value })
    }
  }

  return result
}

function writeField (schema: FormDataSchema): void {
  const writer = useWriter()

  for (const [field, value] of Object.entries(schema)) {
    const note = unWrap(value as WrappedSchema)?.description
    if (note)
      writeComment(note)

    writer.write(`${field}:`)

    if (isSchema(value)) {
      const item = unWrap(value)
      writer.append(` ${resolveType(item.schema ?? item)},`)
    } else if (Array.isArray(value)) {
      writer.append(' Array<{')
      writer.tab()
      writeField(value[0])
      writer.tab(-1)
      writer.write('}>,')
    } else if (typeof value === 'object') {
      writer.append(' {')
      writer.tab()
      writeField(value)
      writer.tab(-1)
      writer.write('},')
    }
  }
}

function writeBodyFormData (schema: FormDataSchema, prefixName: string[] = [], prefixData = 'body.'): void {
  const writer = useWriter()

  for (const [field, value] of Object.entries(schema)) {
    if (isSchema(value)) {
      const item = unWrap(value)
      const data = isParamBody(item)
        ? `JSON.stringify(${prefixData}${field})`
        : `${prefixData}${field}`

      writer.write(`form.append(\`${joinName(prefixName.concat(field))}\`, ${data})`)
    } else if (Array.isArray(value)) {
      writer.write(`for (let i = 0; i < ${prefixData}${field}.length; i++) {`)
      writer.tab(1)
      writer.write(`const item = ${prefixData}${field}[i]`)
      writer.line()
      writeBodyFormData(value[0], prefixName.concat(field, '${i}'), 'item.')
      writer.tab(-1)
      writer.write('}')
    } else if (typeof value === 'object')
      writeBodyFormData(value, prefixName.concat(field), `${prefixData}.${field}.`)
  }
}

export function writeModel (schema: FormDataSchema, name: string): void {
  const writer = useWriter()

  writer.line()
  writer.write(`export interface ${name} {`)
  writer.tab(1)
  writeField(schema)
  writer.tab(-1)
  writer.write('}')
}

export function writeFormData (schema: FormDataSchema): void {
  const writer = useWriter()

  writer.write('const form = new FormData()')
  writer.line()
  writeBodyFormData(schema)
  writer.line()
}
