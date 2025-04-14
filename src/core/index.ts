import type * as http from 'node:http'
import {
  type H3Event,
  createEvent,
  getHeader,
  setHeader,
} from 'h3'
import { type ProxyServerOptions as Options } from 'httpxy'
import type {
  OnEndCallback,
  OnErrorCallback,
  OnStartCallback,
  OnProxyReqCallback,
  OnProxyReqWsCallback,
  OnProxyResCallback,
  PathRewrite,
} from './types'

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
   * Schema output destination folder
   * @default './api'
   */
  schemaDest?: string,
  /**
   * Proxy type
   * @default 'basic'
   */
  proxyType?: 'basic' | 'dynamic',
  /**
   * White hostname for dynamic proxy
   * @default []
   */
  allowFrom?: string | string[],
  /**
   * Force add download header when query params 'download' present (dynamic proxy)
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
  /**
   * path Rewrite
   */
  pathRewrite?: PathRewrite,
  /**
   * on proxy error
   */
  onError?: OnErrorCallback,
  /**
   * on proxy request
   */
  onProxyReq?: OnProxyReqCallback,
  /**
   * on proxy response
   */
  onProxyRes?: OnProxyResCallback,
  /**
   * on proxy request (websocket)
   */
  onProxyReqWs?: OnProxyReqWsCallback,
  /**
   * on proxy start
   */
  onStart?: OnStartCallback,
  /**
   * on proxy end
   */
  onEnd?: OnEndCallback,
}

export type EventInterceptor = (proxyEvent: H3Event, event: H3Event, options?: Options) => unknown | Promise<unknown>

/**
 * Transform http-proxy-middleware
 * @param handler H3-Compabilities event handler
 */
export function defineEventInterceptor (handler: EventInterceptor) {
  return (proxy: http.ClientRequest | http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse, options?: Options) => {
    const event      = createEvent(req, res)
    const proxyEvent = createEvent(
      proxy as unknown as http.IncomingMessage,
      proxy as unknown as http.ServerResponse<http.IncomingMessage>,
    )

    handler(proxyEvent, event, options)
  }
}

/**
 * Define proxy server
 */
export function defineServer (servers: ApiServer[]): ApiServer[] {
  return servers
}

/**
 * Check header is exist, if not set to default value
 * @param event
 * @param proxyEvent
 * @param name
 * @param defaultValue
 */
export function ensureHeader (event: H3Event, proxyEvent: H3Event, name: string, defaultValue: string) {
  if (!getHeader(event, name))
    setHeader(proxyEvent, name, defaultValue)
}
