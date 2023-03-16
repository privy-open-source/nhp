import { defineServer } from '../src/'

export default defineServer([
  {
    name     : 'coba',
    baseUrl  : '/api/coba',
    targetUrl: 'https://reqres.in/api/',
  },
  {
    name     : 'bin',
    baseUrl  : '/api/bin',
    targetUrl: 'https://httpbin.org',
    onProxyReq (proxyEvent) {
      setHeader(proxyEvent, 'X-Req-Signature', 'Hello World')
    },
  },
])
