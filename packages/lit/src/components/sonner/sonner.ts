import { LitElement, css, html, isServer, nothing, type TemplateResult } from 'lit'
import { CircleCheck, Info, Loader2, OctagonX, TriangleAlert, X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

export type ToastType = 'default' | 'success' | 'info' | 'warning' | 'error' | 'loading'
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface ToastAction {
  label: string
  onClick: (e: MouseEvent) => void
}

export interface ToastOptions {
  id?: string | number
  description?: string
  duration?: number
  closeButton?: boolean
  action?: ToastAction
  type?: ToastType
}

export interface ToastItem extends ToastOptions {
  id: string | number
  message: string
  createdAt: number
}

let toastIdCounter = 0
const listeners = new Set<(toasts: ToastItem[]) => void>()
let currentToasts: ToastItem[] = []

function notify() {
  for (const listener of listeners) {
    listener([...currentToasts])
  }
}

export function createToast(message: string, options: ToastOptions = {}): string | number {
  const id = options.id ?? ++toastIdCounter
  const item: ToastItem = {
    ...options,
    id,
    message,
    createdAt: Date.now(),
    type: options.type ?? 'default',
  }
  const existingIdx = currentToasts.findIndex((t) => t.id === id)
  if (existingIdx >= 0) {
    currentToasts[existingIdx] = item
  } else {
    currentToasts.push(item)
  }
  notify()

  const dur = options.duration ?? 4000
  if (dur !== Number.POSITIVE_INFINITY && options.type !== 'loading') {
    setTimeout(() => {
      dismissToast(id)
    }, dur)
  }

  return id
}

export function dismissToast(id: string | number) {
  currentToasts = currentToasts.filter((t) => t.id !== id)
  notify()
}

export const toast = Object.assign(
  (message: string, options?: ToastOptions) => createToast(message, options),
  {
    success: (message: string, options?: ToastOptions) => createToast(message, { ...options, type: 'success' }),
    info: (message: string, options?: ToastOptions) => createToast(message, { ...options, type: 'info' }),
    warning: (message: string, options?: ToastOptions) => createToast(message, { ...options, type: 'warning' }),
    error: (message: string, options?: ToastOptions) => createToast(message, { ...options, type: 'error' }),
    loading: (message: string, options?: ToastOptions) => createToast(message, { ...options, type: 'loading' }),
    dismiss: (id: string | number) => dismissToast(id),
    promise: <T>(
      promise: Promise<T>,
      options: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((err: unknown) => string)
      },
    ) => {
      const id = createToast(options.loading, { type: 'loading', duration: Number.POSITIVE_INFINITY })
      promise
        .then((data) => {
          const msg = typeof options.success === 'function' ? options.success(data) : options.success
          createToast(msg, { id, type: 'success', duration: 4000 })
        })
        .catch((err) => {
          const msg = typeof options.error === 'function' ? options.error(err) : options.error
          createToast(msg, { id, type: 'error', duration: 4000 })
        })
      return promise
    },
  },
)

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

/**
 * <uip-sonner> — Toast container compatible with sonner.
 */
export class UipSonner extends LitElement {
  static styles = [tailwind, css`:host { display: block; position: fixed; z-index: 9999; pointer-events: none; }`]

  static properties = {
    position: { type: String },
    duration: { type: Number },
    visibleToasts: { type: Number, attribute: 'visible-toasts' },
    richColors: { attribute: 'rich-colors', converter: trueByDefault },
    closeButton: { attribute: 'close-button', type: Boolean },
    toasts: { state: true },
  }

  position: ToastPosition = 'bottom-right'
  duration = 4000
  visibleToasts = 3
  richColors = true
  closeButton = false

  private toasts: ToastItem[] = []
  private unsubscribe?: () => void

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'sonner')

    const update = (t: ToastItem[]) => {
      this.toasts = t
    }
    listeners.add(update)
    this.unsubscribe = () => listeners.delete(update)
    this.toasts = [...currentToasts]
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.unsubscribe?.()
  }

  private renderIcon(type: ToastType): TemplateResult | typeof nothing {
    switch (type) {
      case 'success':
        return icon(CircleCheck, 'circle-check', 'size-4 text-emerald-500')
      case 'info':
        return icon(Info, 'info', 'size-4 text-blue-500')
      case 'warning':
        return icon(TriangleAlert, 'triangle-alert', 'size-4 text-amber-500')
      case 'error':
        return icon(OctagonX, 'octagon-x', 'size-4 text-red-500')
      case 'loading':
        return icon(Loader2, 'loader-2', 'size-4 animate-spin text-muted-foreground')
      default:
        return nothing
    }
  }

  render() {
    const positionClasses: Record<ToastPosition, string> = {
      'top-left': 'top-4 left-4 flex-col',
      'top-center': 'top-4 left-1/2 -translate-x-1/2 flex-col items-center',
      'top-right': 'top-4 right-4 flex-col items-end',
      'bottom-left': 'bottom-4 left-4 flex-col-reverse',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse items-center',
      'bottom-right': 'bottom-4 right-4 flex-col-reverse items-end',
    }

    const shown = this.toasts.slice(-this.visibleToasts)

    return html`
      <div
        part="container"
        data-slot="sonner-container"
        class=${cn('fixed flex gap-2 pointer-events-none p-4 z-[9999]', positionClasses[this.position])}
      >
        ${shown.map((item) => {
          const showClose = item.closeButton !== undefined ? item.closeButton : this.closeButton
          return html`
            <div
              part="toast"
              data-slot="sonner-toast"
              data-type=${item.type ?? 'default'}
              class="border-border bg-popover text-popover-foreground pointer-events-auto relative flex w-80 items-center justify-between gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div class="flex items-start gap-3">
                ${item.type && item.type !== 'default'
                  ? html`<span class="mt-0.5 shrink-0">${this.renderIcon(item.type)}</span>`
                  : nothing}
                <div class="space-y-1">
                  <div class="text-sm font-medium leading-none">${item.message}</div>
                  ${item.description
                    ? html`<div class="text-muted-foreground text-xs leading-relaxed">${item.description}</div>`
                    : nothing}
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                ${item.action
                  ? html`
                      <button
                        type="button"
                        class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                        @click=${(e: MouseEvent) => {
                          item.action?.onClick(e)
                          dismissToast(item.id)
                        }}
                      >
                        ${item.action.label}
                      </button>
                    `
                  : nothing}
                ${showClose
                  ? html`
                      <button
                        type="button"
                        class="text-muted-foreground hover:text-foreground inline-flex size-5 items-center justify-center rounded transition-colors"
                        aria-label="Dismiss toast"
                        @click=${() => dismissToast(item.id)}
                      >
                        ${icon(X, 'x', 'size-3.5')}
                      </button>
                    `
                  : nothing}
              </div>
            </div>
          `
        })}
      </div>
    `
  }
}

customElements.get('uip-sonner') || customElements.define('uip-sonner', UipSonner)

declare global {
  interface HTMLElementTagNameMap {
    'uip-sonner': UipSonner
  }
}
