import {
  useBase,
  createRouter,
  defineLazyEventHandler,
} from 'h3'
import { joinURL } from 'ufo'
import configs from '~/server.config'
import { createProxyBasic } from '../utils/proxy-basic'
import { createProxyDynamic } from '../utils/proxy-dynamic'
import { consola as console } from 'consola'

export default defineLazyEventHandler(() => {
  const router = createRouter()

  for (const config of configs) {
    if (config.proxyType === 'dynamic')
      router.use(config.baseUrl, createProxyDynamic(config))
    else if (config.targetUrl) {
      router.use(
        joinURL(config.baseUrl, '**'),
        useBase(config.baseUrl, createProxyBasic(config)),
      )
    } else
      console.warn('[NHP] Skip create proxy "%s", missing target url', config.name)
  }

  return router.handler
})
