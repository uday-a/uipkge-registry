import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  signal,
  untracked,
  ChangeDetectionStrategy,
} from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { cn } from '@/lib/utils'
import { ThemeService } from '@/lib/use-theme'

// ─────────────────────────────────────────────────────────────────────────────
// Toast state + imperative `toast()` API — a port of sonner 2.x (MIT) so Angular
// apps call the exact same functions React apps import from 'sonner'.
// ─────────────────────────────────────────────────────────────────────────────

export type ToastTypes = 'normal' | 'action' | 'success' | 'info' | 'warning' | 'error' | 'loading' | 'default'
export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
export type SwipeDirection = 'top' | 'right' | 'bottom' | 'left'
export type ToasterTheme = 'light' | 'dark' | 'system'
type StyleMap = Record<string, string>

export interface Action {
  label: string
  onClick: (event: MouseEvent) => void
  actionButtonStyle?: StyleMap
}

export interface ToastClassnames {
  toast?: string
  title?: string
  description?: string
  loader?: string
  closeButton?: string
  cancelButton?: string
  actionButton?: string
  success?: string
  error?: string
  info?: string
  warning?: string
  loading?: string
  default?: string
  content?: string
  icon?: string
}

export interface ExternalToast {
  id?: number | string
  toasterId?: string
  /** `null` hides the type icon (custom icon templates are not supported in the Angular port). */
  icon?: null
  richColors?: boolean
  invert?: boolean
  closeButton?: boolean
  dismissible?: boolean
  description?: string | (() => string)
  duration?: number
  action?: Action
  cancel?: Action
  onDismiss?: (toast: ToastT) => void
  onAutoClose?: (toast: ToastT) => void
  cancelButtonStyle?: StyleMap
  actionButtonStyle?: StyleMap
  style?: StyleMap
  unstyled?: boolean
  className?: string
  classNames?: ToastClassnames
  descriptionClassName?: string
  position?: Position
  testId?: string
}

export interface ToastT extends ExternalToast {
  id: number | string
  title?: string | (() => string)
  type?: ToastTypes
  promise?: PromiseLike<unknown> | (() => PromiseLike<unknown>)
  delete?: boolean
}

interface ToastToDismiss {
  id: number | string
  dismiss: boolean
}

type PromiseResult<T> =
  | string
  | (ExternalToast & { message?: string })
  | ((
      data: T,
    ) => string | (ExternalToast & { message?: string }) | Promise<string | (ExternalToast & { message?: string })>)
export type PromiseData<T = unknown> = Omit<ExternalToast, 'description'> & {
  loading?: string
  success?: PromiseResult<T>
  error?: PromiseResult<unknown>
  description?: string | ((data: unknown) => string | Promise<string>)
  finally?: () => void | Promise<void>
}

export interface HeightT {
  height: number
  toastId: number | string
  position?: Position
}

let toastsCounter = 1

const isHttpResponse = (data: unknown): data is Response =>
  !!data &&
  typeof data === 'object' &&
  'ok' in data &&
  typeof (data as Response).ok === 'boolean' &&
  'status' in data &&
  typeof (data as Response).status === 'number'

/** sonner's Observer: the toast queue every <ui-toaster> subscribes to. */
class Observer {
  subscribers: ((toast: ToastT | ToastToDismiss) => void)[] = []
  toasts: ToastT[] = []
  dismissedToasts = new Set<number | string>()

  subscribe = (subscriber: (toast: ToastT | ToastToDismiss) => void) => {
    this.subscribers.push(subscriber)
    return () => {
      const index = this.subscribers.indexOf(subscriber)
      this.subscribers.splice(index, 1)
    }
  }

  publish = (data: ToastT) => {
    this.subscribers.forEach((subscriber) => subscriber(data))
  }

  addToast = (data: ToastT) => {
    this.publish(data)
    this.toasts = [...this.toasts, data]
  }

  create = (
    data: ExternalToast & { message?: string | (() => string); type?: ToastTypes; promise?: ToastT['promise'] },
  ) => {
    const { message, ...rest } = data
    const id =
      typeof data?.id === 'number' || (typeof data?.id === 'string' && data.id.length > 0) ? data.id! : toastsCounter++
    const alreadyExists = this.toasts.find((toast) => toast.id === id)
    const dismissible = data.dismissible === undefined ? true : data.dismissible
    if (this.dismissedToasts.has(id)) this.dismissedToasts.delete(id)
    if (alreadyExists) {
      this.toasts = this.toasts.map((toast) => {
        if (toast.id === id) {
          this.publish({ ...toast, ...data, id, title: message })
          return { ...toast, ...data, id, dismissible, title: message }
        }
        return toast
      })
    } else {
      this.addToast({ title: message, ...rest, dismissible, id })
    }
    return id
  }

  dismiss = (id?: number | string) => {
    if (id) {
      this.dismissedToasts.add(id)
      requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({ id, dismiss: true })))
    } else {
      this.toasts.forEach((toast) => {
        this.subscribers.forEach((subscriber) => subscriber({ id: toast.id, dismiss: true }))
      })
    }
    return id
  }

  message = (message: string | (() => string), data?: ExternalToast) => this.create({ ...data, message })
  error = (message: string | (() => string), data?: ExternalToast) => this.create({ ...data, message, type: 'error' })
  success = (message: string | (() => string), data?: ExternalToast) =>
    this.create({ ...data, type: 'success', message })
  info = (message: string | (() => string), data?: ExternalToast) => this.create({ ...data, type: 'info', message })
  warning = (message: string | (() => string), data?: ExternalToast) =>
    this.create({ ...data, type: 'warning', message })
  loading = (message: string | (() => string), data?: ExternalToast) =>
    this.create({ ...data, type: 'loading', message })

  promise = <T>(promise: PromiseLike<T> | (() => PromiseLike<T>), data?: PromiseData<T>) => {
    if (!data) return
    let id: number | string | undefined = undefined
    if (data.loading !== undefined) {
      id = this.create({
        ...data,
        promise,
        type: 'loading',
        message: data.loading,
        description: typeof data.description !== 'function' ? data.description : undefined,
      } as never)
    }
    const p = Promise.resolve(promise instanceof Function ? promise() : promise)
    let shouldDismiss = id !== undefined
    let result: ['resolve', T] | ['reject', unknown]
    const settle = async (type: 'error' | 'success', handler: PromiseResult<never> | undefined, value: unknown) => {
      shouldDismiss = false
      const promiseData = typeof handler === 'function' ? await (handler as (v: unknown) => unknown)(value) : handler
      const description = typeof data.description === 'function' ? await data.description(value) : data.description
      const toastSettings =
        typeof promiseData === 'object' && promiseData !== null ? promiseData : { message: promiseData as string }
      this.create({ id, type, description, ...(toastSettings as object) })
    }
    const originalPromise = p
      .then(async (response) => {
        result = ['resolve', response]
        if (isHttpResponse(response) && !response.ok) {
          await settle('error', data.error as never, `HTTP error! status: ${response.status}`)
        } else if (response instanceof Error) {
          await settle('error', data.error as never, response)
        } else if (data.success !== undefined) {
          await settle('success', data.success as never, response)
        }
      })
      .catch(async (error) => {
        result = ['reject', error]
        if (data.error !== undefined) await settle('error', data.error as never, error)
      })
      .finally(() => {
        if (shouldDismiss) {
          this.dismiss(id)
          id = undefined
        }
        data.finally?.call(data)
      })
    const unwrap = () =>
      new Promise<T>((resolve, reject) =>
        originalPromise
          .then(() => (result[0] === 'reject' ? reject(result[1]) : resolve(result[1] as T)))
          .catch(reject),
      )
    if (typeof id !== 'string' && typeof id !== 'number') return { unwrap }
    return Object.assign(Object(id) as object, { unwrap })
  }

  getActiveToasts = () => this.toasts.filter((toast) => !this.dismissedToasts.has(toast.id))
}

export const ToastState = new Observer()

const toastFunction = (message: string | (() => string), data?: ExternalToast) => {
  const id = data?.id || toastsCounter++
  ToastState.addToast({ title: message, ...data, id })
  return id
}

/**
 * The sonner `toast()` API: `toast('Saved')`, `toast.success(...)`, `.info`, `.warning`,
 * `.error`, `.loading`, `.message`, `.promise(p, { loading, success, error })`,
 * `.dismiss(id?)`, `.getHistory()`, `.getToasts()`. Rendered by every mounted <ui-toaster>.
 */
export const toast = Object.assign(
  toastFunction,
  {
    success: ToastState.success,
    info: ToastState.info,
    warning: ToastState.warning,
    error: ToastState.error,
    message: ToastState.message,
    promise: ToastState.promise,
    dismiss: ToastState.dismiss,
    loading: ToastState.loading,
  },
  {
    getHistory: () => ToastState.toasts,
    getToasts: () => ToastState.getActiveToasts(),
  },
)

// ─────────────────────────────────────────────────────────────────────────────
// Rendering
// ─────────────────────────────────────────────────────────────────────────────

const VISIBLE_TOASTS_AMOUNT = 3
const VIEWPORT_OFFSET = '24px'
const MOBILE_VIEWPORT_OFFSET = '16px'
const TOAST_LIFETIME = 4000
const TOAST_WIDTH = 356
const GAP = 14
const SWIPE_THRESHOLD = 45
const TIME_BEFORE_UNMOUNT = 200

/** sonner's stylesheet (dist/styles.css, what the React Toaster injects), copied verbatim. */
const SONNER_CSS =
  "[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}"

type Offset =
  { top?: string | number; right?: string | number; bottom?: string | number; left?: string | number } | string | number

function assignOffset(defaultOffset?: Offset, mobileOffset?: Offset): StyleMap {
  const styles: StyleMap = {}
  ;[defaultOffset, mobileOffset].forEach((offset, index) => {
    const isMobile = index === 1
    const prefix = isMobile ? '--mobile-offset' : '--offset'
    const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET
    const assignAll = (o: string | number) => {
      for (const key of ['top', 'right', 'bottom', 'left'])
        styles[`${prefix}-${key}`] = typeof o === 'number' ? `${o}px` : o
    }
    if (typeof offset === 'number' || typeof offset === 'string') assignAll(offset)
    else if (typeof offset === 'object') {
      for (const key of ['top', 'right', 'bottom', 'left'] as const) {
        const v = offset[key]
        styles[`${prefix}-${key}`] = v === undefined ? defaultValue : typeof v === 'number' ? `${v}px` : v
      }
    } else assignAll(defaultValue)
  })
  return styles
}

function getDocumentDirection(): 'ltr' | 'rtl' {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 'ltr'
  const dirAttribute = document.documentElement.getAttribute('dir')
  if (dirAttribute === 'auto' || !dirAttribute)
    return window.getComputedStyle(document.documentElement).direction as 'ltr' | 'rtl'
  return dirAttribute as 'ltr' | 'rtl'
}

function defaultSwipeDirections(position: string): SwipeDirection[] {
  const [y, x] = position.split('-')
  const directions: SwipeDirection[] = []
  if (y) directions.push(y as SwipeDirection)
  if (x) directions.push(x as SwipeDirection)
  return directions
}

const str = (v: boolean | undefined) => (v === undefined ? null : String(v))

export interface ToastOptions {
  className?: string
  closeButton?: boolean
  descriptionClassName?: string
  style?: StyleMap
  cancelButtonStyle?: StyleMap
  actionButtonStyle?: StyleMap
  duration?: number
  unstyled?: boolean
  classNames?: ToastClassnames
  closeButtonAriaLabel?: string
}

/** One toast (sonner's <Toast>): the <li data-sonner-toast>. Internal to the Toaster. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'li[ui-sonner-toast]',
  standalone: true,
  host: {
    tabindex: '0',
    'data-sonner-toast': '',
    '[attr.data-rich-colors]': 'str(t().richColors ?? toaster.richColors)',
    '[attr.data-styled]': 'String(!(t().unstyled || toaster.toastOptions?.unstyled))',
    '[attr.data-mounted]': 'String(mounted())',
    '[attr.data-promise]': 'String(!!t().promise)',
    '[attr.data-swiped]': 'String(isSwiped())',
    '[attr.data-removed]': 'String(removed())',
    '[attr.data-visible]': 'String(index + 1 <= toaster.visibleToasts)',
    '[attr.data-y-position]': 'y',
    '[attr.data-x-position]': 'x',
    '[attr.data-index]': 'index',
    '[attr.data-front]': 'String(index === 0)',
    '[attr.data-swiping]': 'String(swiping())',
    '[attr.data-dismissible]': 'String(dismissible)',
    '[attr.data-type]': 't().type ?? null',
    '[attr.data-invert]': 'str(t().invert || toaster.invert)',
    '[attr.data-swipe-out]': 'String(swipeOut())',
    '[attr.data-swipe-direction]': 'swipeOutDirection()',
    '[attr.data-expanded]': 'String(toaster.expanded() || (toaster.expand && mounted()))',
    '[attr.data-testid]': 't().testId ?? null',
    '[class]': 'toastClass',
    '[style]': 'toastStyle()',
    '(dragend)': 'onDragEnd()',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointerup)': 'onPointerUp()',
    '(pointermove)': 'onPointerMove($event)',
  },
  template: `
    @if (closeButton && t().type !== 'loading') {
      <button
        [attr.aria-label]="toaster.toastOptions?.closeButtonAriaLabel ?? 'Close toast'"
        [attr.data-disabled]="String(disabled)"
        data-close-button="true"
        [class]="cls('closeButton')"
        (click)="onCloseClick()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-x size-4"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    }
    @if (showIcon) {
      <div data-icon="" [class]="cls('icon')">
        @if (t().promise || (t().type === 'loading' && !t().icon)) {
          <div [class]="loaderClass" [attr.data-visible]="String(t().type === 'loading')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-loader-circle size-4 motion-safe:animate-spin"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        }
        @if (t().type !== 'loading') {
          @switch (t().type) {
            @case ('success') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-circle-check size-4"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            }
            @case ('info') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-info size-4"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            }
            @case ('warning') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-triangle-alert size-4"
                aria-hidden="true"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            }
            @case ('error') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-octagon-x size-4"
                aria-hidden="true"
              >
                <path d="m15 9-6 6" />
                <path
                  d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"
                />
                <path d="m9 9 6 6" />
              </svg>
            }
          }
        }
      </div>
    }
    <div data-content="" [class]="cls('content')">
      <div data-title="" [class]="cls('title')">{{ title }}</div>
      @if (t().description) {
        <div data-description="" [class]="descriptionClass">{{ description }}</div>
      }
    </div>
    @if (t().cancel; as cancel) {
      <button
        data-button="true"
        data-cancel="true"
        [style]="t().cancelButtonStyle || toaster.toastOptions?.cancelButtonStyle || null"
        [class]="cls('cancelButton')"
        (click)="onCancel($event)"
      >
        {{ cancel.label }}
      </button>
    }
    @if (t().action; as action) {
      <button
        data-button="true"
        data-action="true"
        [style]="t().actionButtonStyle || toaster.toastOptions?.actionButtonStyle || null"
        [class]="cls('actionButton')"
        (click)="onAction($event)"
      >
        {{ action.label }}
      </button>
    }
  `,
})
export class UiSonnerToastComponent implements AfterViewInit, OnDestroy {
  readonly toaster = inject(UiToasterComponent)
  private readonly el = inject<ElementRef<HTMLLIElement>>(ElementRef).nativeElement
  readonly str = str
  readonly String = String

  readonly t = signal<ToastT>({ id: 0 })
  @Input({ required: true })
  set toast(value: ToastT) {
    const prev = this.t()
    this.t.set(value)
    if (
      this.mounted() &&
      (prev.title !== value.title ||
        prev.description !== value.description ||
        prev.action !== value.action ||
        prev.cancel !== value.cancel)
    ) {
      requestAnimationFrame(() => this.remeasure())
    }
  }
  @Input() index = 0
  @Input() position: Position = 'bottom-right'

  readonly mounted = signal(false)
  readonly removed = signal(false)
  readonly swiping = signal(false)
  readonly swipeOut = signal(false)
  readonly isSwiped = signal(false)
  readonly swipeOutDirection = signal<'left' | 'right' | 'up' | 'down' | null>(null)
  private readonly offsetBeforeRemove = signal(0)
  private readonly initialHeight = signal(0)
  private swipeDirection: 'x' | 'y' | null = null
  private pointerStart: { x: number; y: number } | null = null
  private dragStartTime: Date | null = null
  private remainingTime = TOAST_LIFETIME
  private lastDuration = 0
  private closeTimerStartTime = 0
  private lastCloseTimerStartTime = 0
  private deleting = false

  get y(): string {
    return this.position.split('-')[0]!
  }
  get x(): string {
    return this.position.split('-')[1]!
  }
  get dismissible(): boolean {
    return this.t().dismissible !== false
  }
  get disabled(): boolean {
    return this.t().type === 'loading'
  }
  get closeButton(): boolean {
    return this.t().closeButton ?? this.toaster.toastOptions?.closeButton ?? this.toaster.closeButton
  }
  private get duration(): number {
    return this.t().duration || this.toaster.toastOptions?.duration || this.toaster.duration || TOAST_LIFETIME
  }

  get showIcon(): boolean {
    const t = this.t()
    return !!(t.type || t.icon || t.promise) && t.icon !== null
  }
  get title(): string {
    const title = this.t().title
    return typeof title === 'function' ? title() : (title ?? '')
  }
  get description(): string {
    const d = this.t().description
    return typeof d === 'function' ? d() : (d ?? '')
  }

  cls(part: keyof ToastClassnames): string {
    return cn(this.toaster.toastOptions?.classNames?.[part], this.t().classNames?.[part])
  }
  get loaderClass(): string {
    return cn(this.toaster.toastOptions?.classNames?.loader, this.t().classNames?.loader, 'sonner-loader')
  }
  get descriptionClass(): string {
    return cn(
      this.toaster.toastOptions?.descriptionClassName,
      this.t().descriptionClassName,
      this.toaster.toastOptions?.classNames?.description,
      this.t().classNames?.description,
    )
  }
  get toastClass(): string {
    const t = this.t()
    const type = t.type as keyof ToastClassnames | undefined
    const o = this.toaster.toastOptions?.classNames
    return cn(
      this.toaster.toastOptions?.className,
      t.className,
      o?.toast,
      t.classNames?.toast,
      o?.default,
      type && o?.[type],
      type && t.classNames?.[type],
    )
  }

  // sonner layout math: offset = (index in heights) * gap + heights of newer toasts.
  private readonly heights = computed(() => this.toaster.heights().filter((h) => h.position == this.t().position))
  private readonly heightIndex = computed(() => this.heights().findIndex((h) => h.toastId === this.t().id) || 0)
  readonly offset = computed(() => {
    const idx = this.heightIndex()
    const before = this.heights().reduce((prev, curr, i) => (i >= idx ? prev : prev + curr.height), 0)
    return idx * this.toaster.gap + before
  })

  toastStyle(): StyleMap {
    const siblings = this.toaster.filteredToasts().filter((t) => t.position == this.t().position)
    return {
      '--index': String(this.index),
      '--toasts-before': String(this.index),
      '--z-index': String(siblings.length - this.index),
      '--offset': `${this.removed() ? this.offsetBeforeRemove() : this.offset()}px`,
      '--initial-height': this.toaster.expand ? 'auto' : `${this.initialHeight()}px`,
      ...this.toaster.toastOptions?.style,
      ...this.t().style,
    }
  }

  constructor() {
    // Auto-dismiss timer: pauses while the stack is expanded (hover), being interacted with, or the tab is hidden.
    effect((onCleanup) => {
      const t = this.t()
      const paused = this.toaster.expanded() || this.toaster.interacting() || this.toaster.documentHidden()
      const duration = this.duration
      if (duration !== this.lastDuration) {
        this.lastDuration = duration
        this.remainingTime = duration
      }
      if ((t.promise && t.type === 'loading') || t.duration === Infinity || t.type === 'loading') return
      let timeoutId: ReturnType<typeof setTimeout> | undefined
      if (paused) {
        if (this.lastCloseTimerStartTime < this.closeTimerStartTime) {
          this.remainingTime = this.remainingTime - (Date.now() - this.closeTimerStartTime)
        }
        this.lastCloseTimerStartTime = Date.now()
      } else if (this.remainingTime !== Infinity) {
        this.closeTimerStartTime = Date.now()
        timeoutId = setTimeout(() => {
          t.onAutoClose?.(t)
          this.deleteToast()
        }, this.remainingTime)
      }
      onCleanup(() => clearTimeout(timeoutId))
    })
    // toast.dismiss(id) marks the toast `delete`: animate out, then notify.
    effect(() => {
      const t = this.t()
      if (!t.delete) return
      untracked(() => {
        this.deleteToast()
        t.onDismiss?.(t)
      })
    })
  }

  ngAfterViewInit(): void {
    const height = this.el.getBoundingClientRect().height
    this.initialHeight.set(height)
    const t = this.t()
    this.toaster.heights.update((h) => [{ toastId: t.id, height, position: t.position }, ...h])
    // Trigger the enter transition (sonner flips data-mounted after first paint).
    requestAnimationFrame(() => this.mounted.set(true))
  }

  private remeasure(): void {
    if (!this.el.isConnected) return
    const original = this.el.style.height
    this.el.style.height = 'auto'
    const newHeight = this.el.getBoundingClientRect().height
    this.el.style.height = original
    this.initialHeight.set(newHeight)
    const t = this.t()
    this.toaster.heights.update((heights) =>
      heights.find((h) => h.toastId === t.id)
        ? heights.map((h) => (h.toastId === t.id ? { ...h, height: newHeight } : h))
        : [{ toastId: t.id, height: newHeight, position: t.position }, ...heights],
    )
  }

  deleteToast(): void {
    if (this.deleting) return
    this.deleting = true
    this.removed.set(true)
    this.offsetBeforeRemove.set(this.offset())
    const t = this.t()
    this.toaster.heights.update((h) => h.filter((x) => x.toastId !== t.id))
    setTimeout(() => this.toaster.removeToast(t), TIME_BEFORE_UNMOUNT)
  }

  onCloseClick(): void {
    if (this.disabled || !this.dismissible) return
    this.deleteToast()
    this.t().onDismiss?.(this.t())
  }

  onCancel(event: MouseEvent): void {
    const cancel = this.t().cancel
    if (!cancel || !this.dismissible) return
    cancel.onClick?.(event)
    this.deleteToast()
  }

  onAction(event: MouseEvent): void {
    const action = this.t().action
    if (!action) return
    action.onClick?.(event)
    if (event.defaultPrevented) return
    this.deleteToast()
  }

  onDragEnd(): void {
    this.swiping.set(false)
    this.swipeDirection = null
    this.pointerStart = null
  }

  onPointerDown(event: PointerEvent): void {
    if (event.button === 2) return
    if (this.disabled || !this.dismissible) return
    this.dragStartTime = new Date()
    this.offsetBeforeRemove.set(this.offset())
    const target = event.target as HTMLElement
    target.setPointerCapture?.(event.pointerId)
    if (target.tagName === 'BUTTON') return
    this.swiping.set(true)
    this.pointerStart = { x: event.clientX, y: event.clientY }
  }

  onPointerUp(): void {
    if (this.swipeOut() || !this.dismissible) return
    this.pointerStart = null
    const amountX = Number(this.el.style.getPropertyValue('--swipe-amount-x').replace('px', '') || 0)
    const amountY = Number(this.el.style.getPropertyValue('--swipe-amount-y').replace('px', '') || 0)
    const timeTaken = Date.now() - (this.dragStartTime?.getTime() ?? Date.now())
    const amount = this.swipeDirection === 'x' ? amountX : amountY
    const velocity = Math.abs(amount) / timeTaken
    if (Math.abs(amount) >= SWIPE_THRESHOLD || velocity > 0.11) {
      this.offsetBeforeRemove.set(this.offset())
      this.t().onDismiss?.(this.t())
      if (this.swipeDirection === 'x') this.swipeOutDirection.set(amountX > 0 ? 'right' : 'left')
      else this.swipeOutDirection.set(amountY > 0 ? 'down' : 'up')
      this.deleteToast()
      this.swipeOut.set(true)
      return
    }
    this.el.style.setProperty('--swipe-amount-x', '0px')
    this.el.style.setProperty('--swipe-amount-y', '0px')
    this.isSwiped.set(false)
    this.swiping.set(false)
    this.swipeDirection = null
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.pointerStart || !this.dismissible) return
    if ((window.getSelection()?.toString().length ?? 0) > 0) return
    const yDelta = event.clientY - this.pointerStart.y
    const xDelta = event.clientX - this.pointerStart.x
    const directions = this.toaster.swipeDirections ?? defaultSwipeDirections(this.position)
    if (!this.swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
      this.swipeDirection = Math.abs(xDelta) > Math.abs(yDelta) ? 'x' : 'y'
    }
    const amount = { x: 0, y: 0 }
    const dampening = (delta: number) => 1 / (1.5 + Math.abs(delta) / 20)
    if (this.swipeDirection === 'y') {
      if (directions.includes('top') || directions.includes('bottom')) {
        if ((directions.includes('top') && yDelta < 0) || (directions.includes('bottom') && yDelta > 0))
          amount.y = yDelta
        else {
          const damped = yDelta * dampening(yDelta)
          amount.y = Math.abs(damped) < Math.abs(yDelta) ? damped : yDelta
        }
      }
    } else if (this.swipeDirection === 'x') {
      if (directions.includes('left') || directions.includes('right')) {
        if ((directions.includes('left') && xDelta < 0) || (directions.includes('right') && xDelta > 0))
          amount.x = xDelta
        else {
          const damped = xDelta * dampening(xDelta)
          amount.x = Math.abs(damped) < Math.abs(xDelta) ? damped : xDelta
        }
      }
    }
    if (Math.abs(amount.x) > 0 || Math.abs(amount.y) > 0) this.isSwiped.set(true)
    this.el.style.setProperty('--swipe-amount-x', `${amount.x}px`)
    this.el.style.setProperty('--swipe-amount-y', `${amount.y}px`)
  }

  ngOnDestroy(): void {
    const id = this.t().id
    this.toaster.heights.update((h) => h.filter((x) => x.toastId !== id))
  }
}

/**
 * Angular port of UIPKGE Sonner — the React registry's <Toaster> (sonner 2.x) with the
 * same defaults: bottom-right, 4000ms, 3 visible, rich colors, no close button, collapsed
 * stack that expands on hover, shadcn token CSS vars, Lucide icons. Toasts come from the
 * global `toast()` API; the region renders sonner's exact DOM (section > ol[data-sonner-toaster]
 * > li[data-sonner-toast]) and stylesheet, so stacking, swipe-to-dismiss and animations match.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-toaster, [ui-toaster]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [UiSonnerToastComponent],
  host: {
    class: 'contents',
    '[attr.data-slot]': '"sonner"',
    '[attr.data-uipkge]': '""',
  },
  template: `
    <section
      [attr.aria-label]="containerAriaLabel + ' ' + hotkeyLabel"
      tabindex="-1"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic="false"
    >
      @for (pos of possiblePositions(); track pos; let i = $index) {
        @if (filteredToasts().length) {
          <ol
            [attr.dir]="resolvedDir"
            tabindex="-1"
            [class]="listClass"
            data-sonner-toaster="true"
            [attr.data-sonner-theme]="actualTheme()"
            [attr.data-y-position]="pos.split('-')[0]"
            [attr.data-x-position]="pos.split('-')[1]"
            [style]="listStyle()"
            (focusout)="onListBlur($event)"
            (focusin)="onListFocus($event)"
            (mouseenter)="expanded.set(true)"
            (mousemove)="expanded.set(true)"
            (mouseleave)="onMouseLeave()"
            (dragend)="expanded.set(false)"
            (pointerdown)="onListPointerDown($event)"
            (pointerup)="interacting.set(false)"
          >
            @for (t of toastsFor(pos, i); track t.id; let j = $index) {
              <li ui-sonner-toast [toast]="t" [index]="j" [position]="pos"></li>
            }
          </ol>
        }
      }
    </section>
  `,
})
export class UiToasterComponent implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly themeService = inject(ThemeService)

  @Input() id?: string
  @Input() invert?: boolean
  /** Defaults to the app theme (ThemeService), like React's next-themes `useTheme()`. */
  @Input()
  set theme(value: ToasterTheme | undefined) {
    this.themeInput.set(value)
  }
  get theme(): ToasterTheme | undefined {
    return this.themeInput()
  }
  @Input() position: Position = 'bottom-right'
  @Input() hotkey: string[] = ['altKey', 'KeyT']
  @Input() richColors = true
  @Input() expand = false
  @Input() duration = 4000
  @Input() gap = GAP
  @Input() visibleToasts = VISIBLE_TOASTS_AMOUNT
  @Input() closeButton = false
  @Input() toastOptions?: ToastOptions
  @Input('class') className?: string
  @Input() style?: StyleMap
  @Input() offset?: Offset
  @Input() mobileOffset?: Offset
  @Input() dir?: 'rtl' | 'ltr' | 'auto'
  @Input() swipeDirections?: SwipeDirection[]
  @Input() containerAriaLabel = 'Notifications'

  readonly toasts = signal<ToastT[]>([])
  readonly heights = signal<HeightT[]>([])
  readonly expanded = signal(false)
  readonly interacting = signal(false)
  readonly documentHidden = signal(typeof document !== 'undefined' ? document.hidden : false)
  private readonly systemDark = signal(
    typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches,
  )
  private unsubscribe?: () => void
  private cleanups: (() => void)[] = []
  private lastFocused: HTMLElement | null = null
  private focusWithin = false

  private readonly themeInput = signal<ToasterTheme | undefined>(undefined)
  readonly actualTheme = computed(() => {
    const theme = this.themeInput() ?? this.themeService.theme()
    if (theme !== 'system') return theme
    return this.systemDark() ? 'dark' : 'light'
  })

  readonly filteredToasts = computed(() =>
    this.toasts().filter((t) => (this.id ? t.toasterId === this.id : !t.toasterId)),
  )
  readonly possiblePositions = computed(() =>
    Array.from(
      new Set([
        this.position,
        ...this.filteredToasts()
          .filter((t) => t.position)
          .map((t) => t.position!),
      ]),
    ),
  )

  get hotkeyLabel(): string {
    return this.hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '')
  }
  get resolvedDir(): string {
    const dir = this.dir ?? getDocumentDirection()
    return dir === 'auto' ? getDocumentDirection() : dir
  }
  get listClass(): string {
    return cn('toaster group', this.className)
  }

  listStyle(): StyleMap {
    return {
      '--front-toast-height': `${this.heights()[0]?.height || 0}px`,
      '--width': `${TOAST_WIDTH}px`,
      '--gap': `${this.gap}px`,
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
      ...this.style,
      ...assignOffset(this.offset, this.mobileOffset),
    }
  }

  toastsFor(position: Position, index: number): ToastT[] {
    return this.filteredToasts().filter((t) => (!t.position && index === 0) || t.position === position)
  }

  constructor() {
    // sonner's stylesheet (~14 kB) goes into <head> once instead of `styles`: it's global
    // either way (ViewEncapsulation.None), and Angular's default budget fails any
    // component whose styles exceed 8 kB, which broke `ng build` for every app using this.
    const doc = inject(DOCUMENT)
    if (!doc.head.querySelector('style[data-uipkge-sonner]')) {
      const style = doc.createElement('style')
      style.setAttribute('data-uipkge-sonner', '')
      style.textContent = SONNER_CSS
      doc.head.appendChild(style)
    }
    // Ensure expanded is always false when no toasts are present / only one left.
    effect(() => {
      if (this.toasts().length <= 1) untracked(() => this.expanded.set(false))
    })
  }

  ngOnInit(): void {
    this.unsubscribe = ToastState.subscribe((t) => {
      if ('dismiss' in t && (t as ToastToDismiss).dismiss) {
        requestAnimationFrame(() =>
          this.toasts.update((list) => list.map((x) => (x.id === t.id ? { ...x, delete: true } : x))),
        )
        return
      }
      setTimeout(() => {
        this.toasts.update((list) => {
          const i = list.findIndex((x) => x.id === t.id)
          if (i !== -1) return [...list.slice(0, i), { ...list[i]!, ...(t as ToastT) }, ...list.slice(i + 1)]
          return [t as ToastT, ...list]
        })
      })
    })
    if (typeof document === 'undefined') return
    const onVisibility = () => this.documentHidden.set(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    const onKeydown = (event: KeyboardEvent) => {
      const list = this.el.querySelector<HTMLElement>('[data-sonner-toaster]')
      const pressed = this.hotkey.every(
        (key) => (event as unknown as Record<string, unknown>)[key] || event.code === key,
      )
      if (pressed) {
        this.expanded.set(true)
        list?.focus()
      }
      if (
        event.code === 'Escape' &&
        list &&
        (document.activeElement === list || list.contains(document.activeElement))
      ) {
        this.expanded.set(false)
      }
    }
    document.addEventListener('keydown', onKeydown)
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)')
    const onScheme = (e: MediaQueryListEvent) => this.systemDark.set(e.matches)
    mql?.addEventListener?.('change', onScheme)
    this.cleanups.push(
      () => document.removeEventListener('visibilitychange', onVisibility),
      () => document.removeEventListener('keydown', onKeydown),
      () => mql?.removeEventListener?.('change', onScheme),
    )
  }

  removeToast(toRemove: ToastT): void {
    this.toasts.update((list) => {
      if (!list.find((t) => t.id === toRemove.id)?.delete) ToastState.dismiss(toRemove.id)
      return list.filter(({ id }) => id !== toRemove.id)
    })
  }

  onMouseLeave(): void {
    if (!this.interacting()) this.expanded.set(false)
  }

  onListPointerDown(event: PointerEvent): void {
    const notDismissible = event.target instanceof HTMLElement && event.target.dataset['dismissible'] === 'false'
    if (!notDismissible) this.interacting.set(true)
  }

  onListFocus(event: FocusEvent): void {
    const notDismissible = event.target instanceof HTMLElement && event.target.dataset['dismissible'] === 'false'
    if (notDismissible) return
    if (!this.focusWithin) {
      this.focusWithin = true
      this.lastFocused = event.relatedTarget as HTMLElement | null
    }
  }

  onListBlur(event: FocusEvent): void {
    const list = event.currentTarget as HTMLElement
    if (this.focusWithin && !list.contains(event.relatedTarget as Node | null)) {
      this.focusWithin = false
      this.lastFocused?.focus({ preventScroll: true })
      this.lastFocused = null
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe?.()
    this.cleanups.splice(0).forEach((fn) => fn())
    this.lastFocused?.focus({ preventScroll: true })
  }
}
