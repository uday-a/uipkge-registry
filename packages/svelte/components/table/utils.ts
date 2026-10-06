/**
 * Applies a TanStack Table updater (value or `(old) => next` function) to a
 * `{ value }` box. The Vue twin imports `Updater`/`isFunction` from
 * `@tanstack/vue-table`; this port inlines the two-line check so plain-table
 * consumers pull zero table-state dependencies. Pair with
 * `@tanstack/svelte-table` when you need full data-table state.
 */
export function valueUpdater<T>(updaterOrValue: T | ((old: T) => T), ref: { value: T }) {
  ref.value = typeof updaterOrValue === 'function' ? (updaterOrValue as (old: T) => T)(ref.value) : updaterOrValue
}
