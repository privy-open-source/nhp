import { type OpenAPIV2 } from 'openapi-types'
import { useConfig } from './context'
import { upperFirst, camelCase } from 'lodash-es'

const TYPES = {
  boolean: 'boolean',
  integer: 'number',
  number : 'number',
  string : 'string',
  object : 'any',
  array  : 'Array',
  file   : 'File',
} as const

export function pascalCase (text: string): string {
  return upperFirst(camelCase(text))
}

export function getRefType (rawName: string) {
  const config = useConfig()
  const name   = rawName.replace('#/definitions/', '')

  return pascalCase(config.swagger?.formatModel?.(name) ?? name)
}

export function getPrimitiveType (type: string | undefined): string {
  return TYPES[type as keyof typeof TYPES] ?? 'any'
}

export function getObjectType (schema: OpenAPIV2.SchemaObject): string {
  const keys: string[] = []

  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties))
      keys.push(`${key}: ${resolveType(value)}`)
  }

  return keys.length > 0
    ? `{ ${keys.join(', ')} }`
    : 'any'
}

export function resolveType (schema: OpenAPIV2.SchemaObject | undefined): string {
  if (!schema)
    return 'void'

  if (schema.allOf) {
    if (schema.allOf.length === 1 && schema.allOf[0].$ref)
      return resolveType(schema.allOf[0] as OpenAPIV2.SchemaObject)

    if (schema.allOf.length === 2) {
      const A = resolveType(schema.allOf[0] as OpenAPIV2.SchemaObject)
      const B = resolveType(schema.allOf[1] as OpenAPIV2.SchemaObject)

      return `Merge<${A}, ${B}>`
    }
  }

  if (schema.$ref)
    return getRefType(schema.$ref)

  if (schema.type === 'object') {
    return schema.additionalProperties
      ? `Record<string, ${resolveType(schema.additionalProperties as OpenAPIV2.SchemaObject)}>`
      : getObjectType(schema)
  }

  if (Array.isArray(schema.type)) {
    return schema.type
      .map((type) => getPrimitiveType(type))
      .join(' | ')
  }

  if (schema.enum && schema.type === 'string')
    return schema.enum.map((i) => `'${i as string}'`).join(' | ')

  if (schema.type === 'array')
    return `Array<${resolveType(schema.items as OpenAPIV2.SchemaObject)}>`

  return getPrimitiveType(schema.type)
}

export function isParamPath (params: any): params is OpenAPIV2.GeneralParameterObject {
  return !params.$ref && params.in === 'path'
}

export function isParamBody (params: any): params is OpenAPIV2.InBodyParameterObject {
  return !params.$ref && params.in === 'body'
}

export function isParamFormData (params: any): params is OpenAPIV2.InBodyParameterObject {
  return !params.$ref && params.in === 'formData'
}
