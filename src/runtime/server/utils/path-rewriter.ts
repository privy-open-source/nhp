// Original: https://github.com/chimurai/http-proxy-middleware/blob/master/src/path-rewriter.ts

import type { PathRewrite } from '../../../core/types'
import { isPlainObject } from 'lodash-es'

interface RewriteRule {
  regex: RegExp,
  value: string,
}

type Rewriter = Exclude<PathRewrite, Record<string, string>>

function isValid (config: unknown): config is PathRewrite {
  if (typeof config === 'function')
    return true
  else if (isPlainObject(config))
    return Object.keys(config as Record<string, string>).length > 0
  else if (config === undefined || config === null)
    return false
  else
    throw new Error('Invalid path rewrite')
}

function parseRules (rewriteConfig: Record<string, string>): RewriteRule[] {
  const rules: RewriteRule[] = []

  if (isPlainObject(rewriteConfig)) {
    for (const [key, value] of Object.entries(rewriteConfig)) {
      rules.push({
        regex: new RegExp(key),
        value,
      })
    }
  }

  return rules
}

/**
 * Create rewrite function, to cache parsed rewrite rules.
 *
 * @param {Object} rewriteConfig
 * @return {Function} Function to rewrite paths; This function should accept `path` (request.url) as parameter
 */
export function createPathRewriter (rewriteConfig?: PathRewrite): Rewriter | undefined {
  if (!isValid(rewriteConfig))
    return

  if (typeof rewriteConfig === 'function')
    return rewriteConfig

  const rules = parseRules(rewriteConfig)

  return (path: string) => {
    let result = path

    for (const rule of rules) {
      if (rule.regex.test(path)) {
        result = result.replace(rule.regex, rule.value)

        break
      }
    }

    return result
  }
}
