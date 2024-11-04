import type * as http from 'node:http'
import type * as net from 'node:net'
import type * as url from 'node:url'
import type { ProxyServerOptions } from 'httpxy'

type Target = NonNullable<ProxyServerOptions['target'] | ProxyServerOptions['forward']>

/**
 * Use types based on the events listeners from http-proxy
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/51504fd999031b7f025220fab279f1b2155cbaff/types/http-proxy/index.d.ts
 */
export type OnErrorCallback = (
  err: Error,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  target?: string | Partial<url.Url>
) => void

export type OnProxyResCallback = (
  proxyRes: http.IncomingMessage,
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void

export type OnProxyReqCallback = (
  proxyReq: http.ClientRequest,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  options: ProxyServerOptions
) => void

export type OnProxyReqWsCallback = (
  proxyReq: http.ClientRequest,
  req: http.IncomingMessage,
  socket: net.Socket,
  options: ProxyServerOptions,
  head: any
) => void

export type OnEndCallback = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  proxyRes: http.IncomingMessage,
) => void

export type OnStartCallback = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  target: Target,
) => void

export type PathRewrite =
  | Record<string, string>
  | ((path: string, req: http.IncomingMessage) => string | undefined)
  | ((path: string, req: http.IncomingMessage) => Promise<string>)
