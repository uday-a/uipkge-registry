/**
 * Svelte 5 adapter for `@tanstack/table-core` (the pattern shadcn-svelte
 * ships). `@tanstack/svelte-table` v8 is store-based (Svelte 3/4 era), so we
 * wrap `createTable()` directly: options are merged through lazy getters, and
 * the table's own internal state (anything not controlled via `options.state`,
 * e.g. column sizing) lives in a `$state` so reads made while rendering are
 * tracked by Svelte's fine-grained reactivity.
 */
import {
  createTable,
  type RowData,
  type TableOptions,
  type TableOptionsResolved,
  type TableState,
} from '@tanstack/table-core'

export function createSvelteTable<TData extends RowData>(options: TableOptions<TData>) {
  const resolvedOptions: TableOptionsResolved<TData> = mergeObjects(
    {
      state: {},
      onStateChange() {},
      renderFallbackValue: null,
      mergeOptions: (defaultOptions: TableOptions<TData>, opts: Partial<TableOptions<TData>>) =>
        mergeObjects(defaultOptions, opts),
    },
    options,
  )

  const table = createTable(resolvedOptions)
  let state = $state<Partial<TableState>>(table.initialState)

  function updateOptions() {
    table.setOptions((prev) =>
      mergeObjects(prev, options, {
        // Thunk (not the value) so every read goes through the `state` signal:
        // reassigning `state` then invalidates renders that read internal
        // slices such as columnSizing / columnSizingInfo.
        state: mergeObjects(() => state, options.state || {}),
        onStateChange: (updater: unknown) => {
          if (updater instanceof Function) state = updater(state)
          else state = mergeObjects(state, updater as Partial<TableState>)
          options.onStateChange?.(updater as never)
        },
      }),
    )
  }

  updateOptions()

  $effect.pre(() => {
    updateOptions()
  })

  return table
}

type MaybeThunk<T extends object> = T | (() => T | null | undefined)
type Intersection<T extends readonly unknown[]> = (T extends [infer H, ...infer R]
  ? H & Intersection<R>
  : unknown) & {}

/**
 * Merge objects into one whose properties are lazy getters resolving
 * right-to-left (later sources win, `undefined` falls through). Keeping the
 * getters lazy is what lets reactive `$state`/`$props` reads flow through
 * TanStack's option object without being snapshotted.
 */
export function mergeObjects<Sources extends readonly MaybeThunk<object>[]>(
  ...sources: Sources
): Intersection<{ [K in keyof Sources]: Sources[K] extends () => infer R ? NonNullable<R> : Sources[K] }> {
  const target = {}
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i]
    if (typeof source === 'function') source = source()
    if (source) {
      const descriptors = Object.getOwnPropertyDescriptors(source)
      for (const key in descriptors) {
        if (key in target) continue
        Object.defineProperty(target, key, {
          enumerable: true,
          get() {
            for (let j = sources.length - 1; j >= 0; j--) {
              let s = sources[j]
              if (typeof s === 'function') s = s()
              const v = ((s || {}) as Record<string, unknown>)[key]
              if (v !== undefined) return v
            }
          },
        })
      }
    }
  }
  return target as never
}
