import type * as http from 'node:http'
import { type H3Event, createEvent } from 'h3'
import { type Options } from 'http-proxy-middleware'

export interface ApiServer extends Options {
  name: string,
  baseUrl: string,
  targetUrl?: string,
  schemaUrl?: string,
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
   * Download extention
   */
  downloadExt?: string,
}

export type EventInterceptor = (proxyEvent: H3Event, event: H3Event) => unknown | Promise<unknown>

/**
 * Transform http-proxy-middleware
 * @param handler H3-Compabilities event handler
 */
export function defineEventInterceptor (handler: EventInterceptor) {
  return (proxy: unknown, req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
    const event      = createEvent(req, res)
    const proxyEvent = createEvent(
      proxy as http.IncomingMessage,
      proxy as http.ServerResponse<http.IncomingMessage>,
    )

    handler(proxyEvent, event)
  }
}

/**
 * Define proxy server
 */
export function defineServer (servers: ApiServer[]) {
  return servers
}
