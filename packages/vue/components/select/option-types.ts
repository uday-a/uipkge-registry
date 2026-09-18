/**
 * Shared option shape for `AdvanceSelect` and any future options-driven select.
 * Components accept this canonical shape OR any object shape if `value-key` /
 * `label-key` are provided.
 */
export interface SelectOption<V = string> {
  label: string
  value: V
  disabled?: boolean
  /** Items sharing this key render under one heading. */
  group?: string
}

/**
 * Resolve `option[key]` with a default fallback. Used by AdvanceSelect so every
 * accessor obeys `value-key` / `label-key`.
 */
export function readKey<T>(option: T, key: string, fallback?: unknown): unknown {
  if (option == null || typeof option !== 'object') return fallback
  const v = (option as Record<string, unknown>)[key]
  return v === undefined ? fallback : v
}
