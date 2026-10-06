import { html, nothing } from 'lit'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import type { IconNode } from 'lucide'
import { cn } from './utils'

const esc = (v: unknown) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/**
 * Render a Lucide icon (from the framework-free `lucide` package) as an inline
 * <svg> inside a Lit template, with the same attributes and `lucide
 * lucide-<name>` classes lucide-react emits — so DOM/class parity with the
 * React registry holds.
 *
 *   import { Mail } from 'lucide'
 *   html`${icon(Mail, 'mail', 'size-4 opacity-50')}`
 *
 * `name` is the kebab-case icon name (lucide-react's class suffix).
 */
export function icon(node: IconNode, name: string, className = '', label?: string) {
  const inner = node
    .map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}/>`)
    .join('')
  return html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class=${cn('lucide', `lucide-${name}`, className)}
    aria-hidden=${label ? 'false' : 'true'}
    aria-label=${label ?? nothing}
  >${unsafeSVG(inner)}</svg>`
}
