import type * as http from 'node:http'
import { type H3Event, createEvent } from 'h3'
import { type Options } from 'http-proxy-middleware'
import type { Request, Response } from 'http-proxy-middleware/dist/types'

export interface SwaggerConfig {
  /**
   * Tranform interface model name
   * @param name
   */
  formatModel?: (name: string) => string,
  /**
   * Tranform endpoint URL
   * @param path
   */
  formatURL?: (path: string) => string,
  /**
   * Tranform function name
   * @param method
   * @param path
   */
  formatMethod?: (method: string, path: string) => string,
}

export interface ApiServer extends Options {
  /**
   * Uniq name
   * @requires
   */
  name: string,
  /**
   * Base proxy path
   * @requires
   */
  baseUrl: string,
  /**
   * Target proxy
   * @requires
   */
  targetUrl?: string,
  /**
   * API schema url
   */
  schemaUrl?: string,
  /**
   * Schema output dest
   * @default './api''
   */
  schemaDest?: string,
  /**
   * Proxy type
   * @default 'basic''
   */
  proxyType?: 'basic' | 'dynamic',
  /**
   * White hostname for dynamic proxy
   * @default []
   */
  allowFrom?: string | string[],
  /**
   *  Force add download header when query params 'download' present (dynamic proxy)
   * @default true
   */
  downloadHeader?: boolean,
  /**
   * Download extension (dynamic proxy)
   */
  downloadExt?: string,
  /**
   * Swagger transformer config
   */
  swagger?: SwaggerConfig,
}

export type EventInterceptor = (proxyEvent: H3Event, event: H3Event) => unknown | Promise<unknown>

/**
 * Transform http-proxy-middleware
 * @param handler H3-Compabilities event handler
 */
export function defineEventInterceptor (handler: EventInterceptor) {
  return (proxy: http.ClientRequest | http.IncomingMessage, req: Request, res: Response) => {
    const event      = createEvent(req as http.IncomingMessage, res as http.ServerResponse<http.IncomingMessage>)
    const proxyEvent = createEvent(
      proxy as unknown as http.IncomingMessage,
      proxy as unknown as http.ServerResponse<http.IncomingMessage>,
    )

    handler(proxyEvent, event)
  }
}

/**
 * Define proxy server
 */
export function defineServer (servers: ApiServer[]): ApiServer[] {
  return servers
}
