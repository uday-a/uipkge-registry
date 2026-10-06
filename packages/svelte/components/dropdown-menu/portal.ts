import type { Action } from 'svelte/action'

/**
 * Move the node to `document.body` (or a selector/element target) while it is
 * mounted. Actions only run in the browser, so this is SSR-safe.
 */
export const portal: Action<HTMLElement, HTMLElement | string | undefined> = (node, target) => {
  const targetEl = typeof target === 'string' ? document.querySelector(target) : (target ?? document.body)
  ;(targetEl ?? document.body).appendChild(node)
  return {
    destroy() {
      node.remove()
    },
  }
}
