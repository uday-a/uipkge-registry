import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiSectionCardComponent } from '@/ui/section-card'

export type Theme = 'light' | 'dark' | 'system' | 'black'
export type ThemeSwitchVariant = 'cards' | 'icons' | 'icon-only' | 'dropdown' | 'pill' | 'pill-4' | 'switch'

const VARIANT_OPTIONS: Record<ThemeSwitchVariant, Theme[]> = {
  cards: ['light', 'dark', 'system'],
  icons: ['light', 'dark', 'system'],
  'icon-only': ['light', 'dark'],
  dropdown: ['light', 'dark', 'system'],
  pill: ['light', 'dark', 'system'],
  'pill-4': ['system', 'light', 'dark', 'black'],
  switch: ['light', 'dark'],
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => unknown) => { finished: Promise<void> }
}

let revealing = false

async function withThemeReveal(enabled: boolean, event: MouseEvent | undefined, swap: () => void): Promise<void> {
  if (typeof document === 'undefined') {
    swap()
    return
  }
  const startViewTransition = (document as ViewTransitionDocument).startViewTransition?.bind(document)
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!enabled || !startViewTransition || reduceMotion) {
    swap()
    return
  }
  if (revealing) return
  revealing = true

  const root = document.documentElement
  const x = event?.clientX ?? window.innerWidth / 2
  const y = event?.clientY ?? window.innerHeight / 2
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  root.style.setProperty('--uipkge-theme-x', `${x}px`)
  root.style.setProperty('--uipkge-theme-y', `${y}px`)
  root.style.setProperty('--uipkge-theme-r', `${radius}px`)
  root.setAttribute('data-uipkge-theme-reveal', '')

  try {
    await startViewTransition(swap).finished
  } finally {
    root.removeAttribute('data-uipkge-theme-reveal')
    revealing = false
  }
}

/**
 * Angular port of UIPKGE ThemeSwitch — light/dark/system toggle persisted to
 * localStorage. Same seven visual variants as Vue; theme swap runs inside a
 * View Transition wipe when enabled and supported.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-theme-switch, [ui-theme-switch]',
  standalone: true,
  imports: [UiSectionCardComponent],
  host: {
    '[attr.data-slot]': '"theme-switch"',
    '[attr.data-uipkge]': '""',
    '[attr.data-variant]': 'variant',
    '[attr.data-theme]': 'currentValue',
    '[class]': 'hostClass',
  },
  template: `
    @switch (variant) {
      @case ('cards') {
        <ui-section-card
          [title]="title ?? 'Appearance'"
          [description]="description ?? 'Choose your interface theme.'"
          class="w-full"
        >
          <svg
            slot="header-action"
            class="text-muted-foreground size-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
            />
          </svg>
          <div class="grid grid-cols-3 gap-2" role="radiogroup" [attr.aria-label]="title ?? 'Theme'">
            @for (t of options(); track t) {
              <button
                type="button"
                role="radio"
                [attr.aria-checked]="currentValue === t"
                class="focus-visible:ring-ring rounded-md border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:outline-none"
                [class]="
                  currentValue === t
                    ? 'border-primary ring-primary bg-primary/5 ring-1'
                    : 'border-border hover:bg-muted/50'
                "
                (click)="select(t, $event)"
              >
                @switch (t) {
                  @case ('light') {
                    <svg
                      class="text-muted-foreground mb-2 size-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" />
                      <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                  }
                  @case ('dark') {
                    <svg
                      class="text-muted-foreground mb-2 size-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
                      />
                    </svg>
                  }
                  @case ('system') {
                    <svg
                      class="text-muted-foreground mb-2 size-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect width="20" height="14" x="2" y="3" rx="2" />
                      <line x1="8" x2="16" y1="21" y2="21" />
                      <line x1="12" x2="12" y1="17" y2="21" />
                    </svg>
                  }
                }
                <p class="text-xs font-medium">{{ labels[t] }}</p>
              </button>
            }
          </div>
        </ui-section-card>
      }

      @case ('icons') {
        <div
          role="radiogroup"
          [attr.aria-label]="title ?? 'Theme'"
          class="border-border bg-card inline-flex items-center gap-0.5 rounded-md border p-0.5"
        >
          @for (t of options(); track t) {
            <button
              type="button"
              role="radio"
              [attr.aria-checked]="currentValue === t"
              [attr.aria-label]="labels[t]"
              class="focus-visible:ring-ring grid size-7 place-items-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              [class]="
                currentValue === t
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              "
              (click)="select(t, $event)"
            >
              @switch (t) {
                @case ('light') {
                  <svg
                    class="size-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                }
                @case ('dark') {
                  <svg
                    class="size-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
                    />
                  </svg>
                }
                @case ('system') {
                  <svg
                    class="size-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect width="20" height="14" x="2" y="3" rx="2" />
                    <line x1="8" x2="16" y1="21" y2="21" />
                    <line x1="12" x2="12" y1="17" y2="21" />
                  </svg>
                }
              }
            </button>
          }
        </div>
      }

      @case ('icon-only') {
        <button
          type="button"
          [attr.aria-label]="labels[currentValue]"
          class="text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
          (click)="cycle($event)"
        >
          @switch (currentValue) {
            @case ('light') {
              <svg
                class="size-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            }
            @case ('dark') {
              <svg
                class="size-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
                />
              </svg>
            }
            @default {
              <svg
                class="size-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="20" height="14" x="2" y="3" rx="2" />
                <line x1="8" x2="16" y1="21" y2="21" />
                <line x1="12" x2="12" y1="17" y2="21" />
              </svg>
            }
          }
        </button>
      }

      @case ('dropdown') {
        <div class="relative inline-block text-left">
          <button
            type="button"
            aria-haspopup="menu"
            [attr.aria-expanded]="dropdownOpen"
            class="border-border bg-card hover:bg-muted focus-visible:ring-ring inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none"
            (click)="dropdownOpen = !dropdownOpen"
          >
            @switch (currentValue) {
              @case ('light') {
                <svg
                  class="size-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              }
              @case ('dark') {
                <svg
                  class="size-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
                  />
                </svg>
              }
              @default {
                <svg
                  class="size-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
              }
            }
            <span>{{ labels[currentValue] }}</span>
            <svg
              class="size-3 opacity-60"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          @if (dropdownOpen) {
            <div
              role="menu"
              class="border-border bg-popover text-popover-foreground absolute right-0 z-50 mt-1 min-w-[140px] rounded-md border p-1 shadow-md"
              (keydown.escape)="dropdownOpen = false"
            >
              @for (t of options(); track t) {
                <button
                  type="button"
                  role="menuitem"
                  class="hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none"
                  (click)="select(t, $event); dropdownOpen = false"
                >
                  <span class="mr-2 inline-flex size-4 items-center justify-center">
                    @switch (t) {
                      @case ('light') {
                        <svg
                          class="size-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2" />
                          <path d="M12 20v2" />
                          <path d="m4.93 4.93 1.41 1.41" />
                          <path d="m17.66 17.66 1.41 1.41" />
                          <path d="M2 12h2" />
                          <path d="M20 12h2" />
                          <path d="m6.34 17.66-1.41 1.41" />
                          <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                      }
                      @case ('dark') {
                        <svg
                          class="size-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
                          />
                        </svg>
                      }
                      @case ('system') {
                        <svg
                          class="size-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <rect width="20" height="14" x="2" y="3" rx="2" />
                          <line x1="8" x2="16" y1="21" y2="21" />
                          <line x1="12" x2="12" y1="17" y2="21" />
                        </svg>
                      }
                    }
                  </span>
                  <span>{{ labels[t] }}</span>
                </button>
              }
            </div>
          }
        </div>
      }

      @case ('pill') {
        <div
          role="radiogroup"
          [attr.aria-label]="title ?? 'Theme'"
          class="border-border bg-card relative inline-flex w-full max-w-md rounded-full border p-0.5"
        >
          <span
            aria-hidden="true"
            class="bg-primary pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 rounded-full transition-transform duration-300 ease-out"
            [style.width]="indicatorStyle()['width']"
            [style.transform]="indicatorStyle()['transform']"
          ></span>
          @for (t of options(); track t) {
            <button
              type="button"
              role="radio"
              [attr.aria-checked]="currentValue === t"
              [attr.aria-label]="labels[t]"
              class="focus-visible:ring-ring relative z-[1] inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              [class]="currentValue === t ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'"
              (click)="select(t, $event)"
            >
              @switch (t) {
                @case ('light') {
                  <svg
                    class="size-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                }
                @case ('dark') {
                  <svg
                    class="size-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
                    />
                  </svg>
                }
                @case ('system') {
                  <svg
                    class="size-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect width="20" height="14" x="2" y="3" rx="2" />
                    <line x1="8" x2="16" y1="21" y2="21" />
                    <line x1="12" x2="12" y1="17" y2="21" />
                  </svg>
                }
              }
              <span>{{ labels[t] }}</span>
            </button>
          }
        </div>
      }

      @case ('pill-4') {
        <div
          role="radiogroup"
          [attr.aria-label]="title ?? 'Theme'"
          class="border-border bg-card relative inline-flex w-full max-w-md rounded-full border p-0.5"
        >
          <span
            aria-hidden="true"
            class="bg-primary pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 rounded-full transition-transform duration-300 ease-out"
            [style.width]="indicatorStyle()['width']"
            [style.transform]="indicatorStyle()['transform']"
          ></span>
          @for (t of options(); track t) {
            <button
              type="button"
              role="radio"
              [attr.aria-checked]="currentValue === t"
              [attr.aria-label]="labels[t]"
              class="focus-visible:ring-ring relative z-[1] inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              [class]="currentValue === t ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'"
              (click)="select(t, $event)"
            >
              @switch (t) {
                @case ('light') {
                  <svg
                    class="size-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                }
                @case ('dark') {
                  <svg
                    class="size-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
                    />
                  </svg>
                }
                @case ('system') {
                  <svg
                    class="size-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect width="20" height="14" x="2" y="3" rx="2" />
                    <line x1="8" x2="16" y1="21" y2="21" />
                    <line x1="12" x2="12" y1="17" y2="21" />
                  </svg>
                }
                @case ('black') {
                  <svg
                    class="size-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                    />
                    <path d="M20 3v4" />
                    <path d="M22 5h-4" />
                    <path d="M4 17v2" />
                    <path d="M5 18H3" />
                  </svg>
                }
              }
              <span>{{ labels[t] }}</span>
            </button>
          }
        </div>
      }

      @case ('switch') {
        <button
          type="button"
          role="switch"
          [attr.aria-checked]="currentValue === 'dark'"
          [attr.aria-label]="labels[currentValue]"
          class="border-border focus-visible:ring-ring relative inline-flex h-8 w-16 items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none"
          [class]="currentValue === 'dark' ? 'bg-primary' : 'bg-muted'"
          (click)="select(currentValue === 'dark' ? 'light' : 'dark', $event)"
        >
          <svg
            class="text-warning absolute left-1.5 size-4 transition-opacity"
            [class]="currentValue === 'dark' ? 'opacity-30' : 'opacity-100'"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <svg
            class="text-muted-foreground absolute right-1.5 size-4 transition-opacity"
            [class]="currentValue === 'light' ? 'opacity-30' : 'opacity-100'"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
            />
          </svg>
          <span
            aria-hidden="true"
            class="bg-card border-border absolute size-6 rounded-full border shadow transition-transform duration-300 ease-out"
            [style.transform]="switchThumbStyle()['transform']"
          ></span>
        </button>
      }
    }
  `,
})
export class UiThemeSwitchComponent {
  // Last click seen bubbling through this component's host. The document listener runs later in
  // the same bubble phase, so a matching event originated inside and must not close the dropdown.
  // This avoids injecting ElementRef, whose constructor DI metadata broke JIT/TestBed instantiation
  // (NG0202), and keeps the class `new`-able without an injection context.
  private lastInsideEvent: Event | null = null

  @HostListener('click', ['$event'])
  onHostClick(event: Event): void {
    this.lastInsideEvent = event
  }

  /** Radix Menu parity: clicking anywhere outside the open dropdown closes it. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (event === this.lastInsideEvent) {
      this.lastInsideEvent = null
      return
    }
    if (this.dropdownOpen) {
      this.dropdownOpen = false
    }
  }

  @Input() value?: Theme
  @Input() modelValue: Theme = 'system'
  @Input() variant: ThemeSwitchVariant = 'cards'
  @Input() title?: string
  @Input() description?: string
  @Input({ transform: booleanAttribute }) viewTransition = true
  @Input('class') className?: string
  @Output() valueChange = new EventEmitter<Theme>()
  @Output() modelValueChange = new EventEmitter<Theme>()

  dropdownOpen = false

  readonly labels: Record<Theme, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    black: 'Black',
  }

  get currentValue(): Theme {
    return this.value ?? this.modelValue
  }

  get hostClass(): string {
    if (this.variant === 'cards') return cn('block w-full', this.className)
    if (this.variant === 'pill' || this.variant === 'pill-4') return cn('inline-flex w-full', this.className)
    if (this.variant === 'switch') return cn('contents', this.className)
    return cn('inline-flex items-center', this.className)
  }

  options(): Theme[] {
    return VARIANT_OPTIONS[this.variant]
  }

  activeIndex(): number {
    const i = this.options().indexOf(this.currentValue)
    return i === -1 ? 0 : i
  }

  indicatorStyle(): Record<string, string> {
    const n = this.options().length
    return {
      width: `calc((100% - 4px) / ${n})`,
      transform: `translateX(calc(${this.activeIndex()} * 100%))`,
    }
  }

  switchThumbStyle(): Record<string, string> {
    return { transform: `translateX(${this.currentValue === 'dark' ? '36px' : '4px'})` }
  }

  select(theme: Theme, event?: MouseEvent): void {
    void withThemeReveal(this.viewTransition, event, () => {
      this.modelValue = theme
      this.value = theme
      this.modelValueChange.emit(theme)
      this.valueChange.emit(theme)
    })
  }

  cycle(event?: MouseEvent): void {
    const opts = this.options()
    const next = opts[(this.activeIndex() + 1) % opts.length]
    if (next) this.select(next, event)
  }

  resolve(systemDark: boolean): 'light' | 'dark' {
    if (this.currentValue === 'system') return systemDark ? 'dark' : 'light'
    return this.currentValue === 'dark' ? 'dark' : 'light'
  }
}
