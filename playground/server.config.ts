import { defineServer, defineEventInterceptor } from '../src/'

export default defineServer([
  {
    name     : 'coba',
    baseUrl  : '/api/coba',
    targetUrl: 'https://reqres.in/api/',
  },
  {
    name      : 'bin',
    baseUrl   : '/api/bin',
    targetUrl : 'https://httpbin.org',
    onProxyReq: defineEventInterceptor((proxyEvent, event) => {
      const token = getCookie(event, 'session/token')

      if (token)
        setHeader(proxyEvent, 'Authentication', `Bearer ${token}`)
    }),
  },
])
