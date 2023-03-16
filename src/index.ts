import { type H3Event } from 'h3'

export interface ApiServer {
  name: string,
  baseUrl: string,
  targetUrl?: string,
  schemaUrl?: string,
  onProxyReq?: (proxyEvent: H3Event, event: H3Event) => void | Promise<void>,
  onProxyRes?: (proxyEvent: H3Event, event: H3Event) => void | Promise<void>,
}

export function defineServer (servers: ApiServer[]) {
  return servers
}
