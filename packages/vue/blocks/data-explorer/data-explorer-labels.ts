// Shared label access for the block's sub-components: the shell resolves
// `DEFAULT_LABELS` + the `labels` prop once and provides them; children read
// them here so a consumer localises everything from a single prop.
import { computed, inject, type ComputedRef } from 'vue'
import { interpolate } from './data-explorer-core'
import { DEFAULT_LABELS, LABELS_INJECTION_KEY, type ExplorerLabels } from './data-explorer-types'

export function useExplorerLabels() {
  const labels = inject<ComputedRef<ExplorerLabels>>(
    LABELS_INJECTION_KEY,
    computed(() => DEFAULT_LABELS),
  )
  const t = (key: keyof ExplorerLabels, vars?: Record<string, unknown>) => interpolate(labels.value[key], vars)
  return { labels, t }
}
