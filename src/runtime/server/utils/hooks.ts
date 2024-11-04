import type { ProxyServer } from 'httpxy'
import type { ApiServer } from '../../../core'

// https://github.com/chimurai/http-proxy-middleware/blob/7341704d0aa9d1606dfd37ebfdffddd34c894784/src/_handlers.ts#L20-L27
export const PROXY_EVENT_MAP = {
  onProxyReq  : 'proxyReq',
  onProxyRes  : 'proxyRes',
  onProxyReqWs: 'proxyReqWs',
  onStart     : 'start',
  onEnd       : 'end',
  onError     : 'error',
} as const

export type EventName = keyof typeof PROXY_EVENT_MAP

export type HooksOptions = Pick<ApiServer, EventName>

export function installHook (proxy: ProxyServer, config: HooksOptions): void {
  for (const key in PROXY_EVENT_MAP) {
    const name    = PROXY_EVENT_MAP[key as EventName]
    const handler = config[key as EventName]

    if (typeof handler === 'function')
      proxy.on(name, handler)
  }
}
