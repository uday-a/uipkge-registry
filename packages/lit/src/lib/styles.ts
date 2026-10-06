import { isServer, unsafeCSS } from 'lit'
import css from '../styles/shadow.css?inline'

/**
 * Shared Tailwind sheet for every element. One CSSResult object, so Lit
 * adopts the same constructable stylesheet into every shadow root (parsed
 * once, not once per element).
 */
export const tailwind = unsafeCSS(css)

/**
 * `@property` rules are ignored inside shadow roots, but Tailwind v4's
 * shadow/ring/transform utilities rely on them for their initial values
 * (`--tw-shadow: 0 0 #0000` …). Without them `shadow-xs`, `ring-[3px]` and
 * `translate-*` silently render nothing. Lift the rules to the document once.
 */
function registerPropertiesOnDocument() {
  // Server renders (Lit's DOM shim has a fake, read-only `document`) skip it.
  if (isServer || (globalThis as { __uipProps?: boolean }).__uipProps) return
  ;(globalThis as { __uipProps?: boolean }).__uipProps = true
  const rules = css.match(/@property\s+--[\w-]+\s*\{[^}]*\}/g)
  if (!rules?.length) return
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(rules.join('\n'))
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
}

registerPropertiesOnDocument()
