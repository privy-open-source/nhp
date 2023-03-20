import type * as http from 'node:http'
import { type H3Event } from 'h3'
import { type Options } from 'http-proxy-middleware'

export interface ApiServer extends Options {
  name: string,
  baseUrl: string,
  targetUrl?: string,
  schemaUrl?: string,
}

type EventInterceptor = (proxyEvent: H3Event, event: H3Event) => unknown | Promise<unknown>

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

export function defineServer (servers: ApiServer[]) {
  return servers
}
