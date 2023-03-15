export interface ApiServer {
  name: string,
  baseUrl: string,
  targetUrl?: string,
  schemaUrl?: string,
}

export function defineServer (servers: ApiServer[]) {
  return servers
}
