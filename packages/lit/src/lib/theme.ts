import type { ReactiveController, ReactiveControllerHost } from 'lit'

/**
 * Mirrors the page theme (`<html class="dark">`) onto the host as
 * `data-theme="dark"`, so the shadow stylesheet's `dark:` variant can match it
 * with `:host([data-theme=dark])`. Token values already switch through CSS
 * custom properties; this only matters for explicit `dark:` utilities.
 */
const hosts = new Set<HTMLElement>()
let observer: MutationObserver | undefined

const isDark = () => document.documentElement.classList.contains('dark')
const apply = (el: HTMLElement) => el.setAttribute('data-theme', isDark() ? 'dark' : 'light')

export class ThemeController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & HTMLElement) {
    host.addController(this)
  }

  hostConnected() {
    hosts.add(this.host)
    apply(this.host)
    observer ??= new MutationObserver(() => hosts.forEach(apply))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  }

  hostDisconnected() {
    hosts.delete(this.host)
  }
}
