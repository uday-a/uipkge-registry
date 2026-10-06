/**
 * Shared option shape for `AdvanceSelect` and any future options-driven select.
 * Components accept this canonical shape OR any object shape if `fieldNames`
 * are provided. (Local copy of the select primitive's `option-types` so this
 * item installs standalone until the select port lands.)
 */
export interface SelectOption<V = string> {
  label: string
  value: V
  disabled?: boolean
  /** Items sharing this key render under one heading. */
  group?: string
}

export interface AdvanceSelectFieldNames {
  label?: string
  value?: string
  group?: string
  disabled?: string
}

/**
 * Resolve `option[key]` with a default fallback. Used by AdvanceSelect so every
 * accessor obeys `fieldNames`.
 */
export function readKey<T>(option: T, key: string, fallback?: unknown): unknown {
  if (option == null || typeof option !== 'object') return fallback
  const v = (option as Record<string, unknown>)[key]
  return v === undefined ? fallback : v
}
