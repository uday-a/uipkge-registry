export interface PropMeta {
  name: string
  type: string
  required: boolean
  doc?: string
  default?: string
  values?: string[]
}

export interface PropForward {
  name: string
  source: string | null
}

export interface PropsExtractResult {
  props: PropMeta[]
  forwards: PropForward[]
}

/**
 * Strips comments from TypeScript/TSX code
 */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (match) => ' '.repeat(match.length))
    .replace(/\/\/.*$/gm, (match) => ' '.repeat(match.length))
}

/**
 * Parses cva(...) variants object to extract variant keys and default values
 */
export function extractCvaVariants(source: string): PropMeta[] {
  const result: PropMeta[] = []
  if (!source.includes('cva(')) return result

  const clean = stripComments(source)
  const vIdx = clean.indexOf('variants:')
  if (vIdx === -1) return result

  const openBrace = clean.indexOf('{', vIdx)
  if (openBrace === -1) return result

  let depth = 1
  let closeBrace = -1
  for (let i = openBrace + 1; i < clean.length; i++) {
    if (clean[i] === '{') depth++
    else if (clean[i] === '}') {
      depth--
      if (depth === 0) {
        closeBrace = i
        break
      }
    }
  }
  if (closeBrace === -1) return result

  const variantsBody = clean.slice(openBrace + 1, closeBrace)

  // Find defaultVariants: { ... }
  const defaultMap: Record<string, string> = {}
  const defIdx = clean.indexOf('defaultVariants:')
  if (defIdx !== -1) {
    const defOpen = clean.indexOf('{', defIdx)
    if (defOpen !== -1) {
      let defDepth = 1
      let defClose = -1
      for (let i = defOpen + 1; i < clean.length; i++) {
        if (clean[i] === '{') defDepth++
        else if (clean[i] === '}') {
          defDepth--
          if (defDepth === 0) {
            defClose = i
            break
          }
        }
      }
      if (defClose !== -1) {
        const defBody = clean.slice(defOpen + 1, defClose)
        const dEntries = defBody.matchAll(/([a-zA-Z0-9_]+)\s*:\s*['"]([^'"]+)['"]/g)
        for (const m of dEntries) {
          defaultMap[m[1]] = `'${m[2]}'`
        }
      }
    }
  }

  // Parse each variant family, e.g. variant: { ... }, size: { ... }
  const familyHeaderRegex = /(?:^|[\s,])([a-zA-Z0-9_]+)\s*:\s*\{/g
  let m: RegExpExecArray | null
  while ((m = familyHeaderRegex.exec(variantsBody)) !== null) {
    const familyName = m[1]
    const subOpen = m.index + m[0].length - 1
    let subDepth = 1
    let subClose = -1
    for (let i = subOpen + 1; i < variantsBody.length; i++) {
      if (variantsBody[i] === '{') subDepth++
      else if (variantsBody[i] === '}') {
        subDepth--
        if (subDepth === 0) {
          subClose = i
          break
        }
      }
    }

    if (subClose !== -1) {
      const optionsBody = variantsBody.slice(subOpen + 1, subClose)
      const values: string[] = []
      const keyRegex = /(?:^|\n)\s*(?:['"]([a-zA-Z0-9_-]+)['"]|([a-zA-Z0-9_]+))\s*:\s*['"`]/g
      let keyMatch: RegExpExecArray | null
      while ((keyMatch = keyRegex.exec(optionsBody)) !== null) {
        const val = keyMatch[1] || keyMatch[2]
        if (val && !values.includes(val)) {
          values.push(val)
        }
      }

      if (values.length > 0) {
        result.push({
          name: familyName,
          type: values.map((v) => `'${v}'`).join(' | '),
          required: false,
          default: defaultMap[familyName],
          values,
          doc: `Component visual ${familyName} variant`,
        })
      }
      familyHeaderRegex.lastIndex = subClose + 1
    }
  }

  return result
}

/**
 * Extracts props from React TSX/TS component files and companion variant files
 */
export function extractProps(source: string, variantsSource?: string): PropsExtractResult {
  const propsMap = new Map<string, PropMeta>()
  const forwards: PropForward[] = []

  // 1. Extract from companion variants source if present
  if (variantsSource) {
    const cvaProps = extractCvaVariants(variantsSource)
    for (const p of cvaProps) {
      propsMap.set(p.name, p)
    }
  } else if (source.includes('cva(')) {
    const cvaProps = extractCvaVariants(source)
    for (const p of cvaProps) {
      propsMap.set(p.name, p)
    }
  }

  // 2. Find interface or type definition ending with 'Props'
  const cleanSource = stripComments(source)
  const interfaceMatch =
    source.match(/export\s+interface\s+([A-Za-z0-9_]*Props)[^{]*\{([\s\S]*?)\}/) ||
    source.match(/interface\s+([A-Za-z0-9_]*Props)[^{]*\{([\s\S]*?)\}/) ||
    source.match(/type\s+([A-Za-z0-9_]*Props)[^=]*=\s*\{([\s\S]*?)\}/)

  if (interfaceMatch) {
    const body = interfaceMatch[2]
    // Parse fields: (/** doc */)? name?: type
    const fieldRegex = /(?:\/\*\*([\s\S]*?)\*\/\s*)?([a-zA-Z0-9_]+)(\?)?:\s*([^;\n]+)/g
    let fMatch: RegExpExecArray | null
    while ((fMatch = fieldRegex.exec(body)) !== null) {
      const rawDoc = fMatch[1]
      const name = fMatch[2]
      const isOptional = !!fMatch[3]
      const type = fMatch[4].trim()

      if (['className', 'ref', 'key', 'children'].includes(name)) continue

      const doc = rawDoc
        ? rawDoc
            .replace(/\n\s*\*\s*/g, ' ')
            .replace(/^\s*\*?\s*/, '')
            .trim()
        : undefined

      let values: string[] | undefined
      if (type.includes('|')) {
        const unionVals = type
          .split('|')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter((s) => s && !s.includes('&') && !s.includes('undefined'))
        if (unionVals.length > 1) values = unionVals
      }

      propsMap.set(name, {
        name,
        type,
        required: !isOptional,
        doc,
        values,
      })
    }
  }

  // 3. Extract defaults and props from component destructuring
  // e.g. ({ className, variant, size, asChild = false, type = 'button', ...props }, ref)
  const destructureMatch = source.match(/\(\s*\{([^}]+)\}\s*[,:]/)
  if (destructureMatch) {
    const inner = destructureMatch[1]
    const items = inner.split(',')
    for (const item of items) {
      const parts = item.split('=')
      if (parts.length === 2) {
        const pName = parts[0].trim()
        const pDef = parts[1].trim()
        if (pName && !['className', 'ref', 'key', 'children', '...props'].includes(pName)) {
          const existing = propsMap.get(pName)
          if (existing) {
            existing.default = pDef
          } else {
            // Infer type from default
            let inferredType = 'any'
            if (pDef === 'true' || pDef === 'false') inferredType = 'boolean'
            else if (/^['"].*['"]$/.test(pDef)) inferredType = 'string'
            else if (/^\d+$/.test(pDef)) inferredType = 'number'

            propsMap.set(pName, {
              name: pName,
              type: inferredType,
              required: false,
              default: pDef,
            })
          }
        }
      }
    }
  }

  return {
    props: Array.from(propsMap.values()),
    forwards,
  }
}
