/* eslint-disable no-template-curly-in-string */
import { type OpenAPIV2 } from 'openapi-types'
import {
  MODEL_MARK,
  useConfig,
  useWriter,
} from './context'
import { camelCase } from 'lodash-es'
import {
  isParamBody,
  isParamPath,
  getRefType,
  resolveType,
} from './types'
import { writeComment } from './comment'
import {
  parseParams,
  writeModel,
  writeFormData,
} from './formdata'

export function getURL (rawURL: string): string {
  const config = useConfig()
  const url    = config.swagger?.formatURL?.(rawURL) ?? rawURL

  return url
    .replaceAll(/{(\w+)}/g, '${$1}')
    .replaceAll(/:(\w+)/g, '${$1}')
}

export function getMethod (method: string, url: string) {
  const config = useConfig()
  const name   = config.swagger?.formatMethod?.(method, url) ?? `${method}_${url}`

  return camelCase(name)
}

export function getResponseSchema (operation: OpenAPIV2.OperationObject): OpenAPIV2.SchemaObject | undefined {
  const responseObject: OpenAPIV2.ResponseObject = operation.responses['201']
    ? (operation.responses['201'] as OpenAPIV2.ResponseObject)
    : (operation.responses['200'] as OpenAPIV2.ResponseObject)

  return responseObject?.schema
}

export function isFormData (schema: OpenAPIV2.OperationObject): boolean {
  return schema.consumes?.includes('multipart/form-data') ?? false
}

export function isStream (schema: OpenAPIV2.OperationObject): boolean {
  return schema.produces?.includes('application/octet-stream') ?? false
}

export function isHaveBody (method: string) {
  return [
    'post',
    'put',
    'patch',
  ].includes(method)
}

export function writeMethod (url: string, method: string, schema: OpenAPIV2.OperationObject) {
  const writer   = useWriter()
  const path     = getURL(url)
  const name     = getMethod(method, path)
  const response = isStream(schema)
    ? 'globalThis.File'
    : resolveType(getResponseSchema(schema))

  writer.line()

  const note = schema.summary ?? schema.description
  if (note)
    writeComment(note)

  const params: string[] = []
  const body: string[]   = [`\`${path}\``]

  const isMultipart = isFormData(schema)
  const hasBody     = isHaveBody(method)
  const schemaBody  = isMultipart && schema.parameters
    ? parseParams(schema.parameters)
    : {}

  if (Object.keys(schemaBody).length > 0) {
    const bodyType = getRefType(`form_${path}`)

    writer.goto(MODEL_MARK)
    writeModel(schemaBody, bodyType)
    writer.end()

    params.push(`body: ${bodyType}`)
  }

  if (schema.parameters) {
    for (const param of schema.parameters) {
      if (isParamPath(param))
        params.push(`${param.name}: ${resolveType(param as unknown as OpenAPIV2.SchemaObject)}`)
      else if (!isMultipart && isParamBody(param))
        params.push(`body: ${resolveType(param.schema)}`)
    }
  }

  if (hasBody) {
    body.push(
      params.some((i) => i.startsWith('body'))
        ? (isMultipart ? 'form' : 'body')
        : '{}',
    )
  }

  params.push('config?: AxiosRequestConfig')
  body.push('config')

  writer.write(`export async function ${name} (`)
  writer.tab()

  for (const param of params)
    writer.write(param, ',')

  writer.tab(-1)
  writer.write(`): ApiResponse<${response}> {`)
  writer.tab()

  if (isMultipart && Object.keys(schemaBody).length > 0)
    writeFormData(schemaBody)

  writer.write(`return await useApi().${method}(${body.join(', ')})`)
  writer.tab(-1)
  writer.write('}')
}
