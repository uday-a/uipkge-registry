import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  UiPopoverComponent,
  UiPopoverContentComponent,
  UiPopoverTriggerComponent,
} from '@/ui/popover/popover.component'
import type { CascadeOption } from './types'

export type { CascadeOption } from './types'
export type CascadeSelectSize = 'sm' | 'default' | 'lg'

function findPathIndices(options: CascadeOption[], values: string[]): number[] {
  const indices: number[] = []
  let current = options
  for (const val of values) {
    const idx = current.findIndex((o) => o.value === val)
    if (idx === -1) return indices
    indices.push(idx)
    const next = current[idx].children
    if (!next?.length) break
    current = next
  }
  return indices
}

function buildPathFromIndices(options: CascadeOption[], indices: number[]): CascadeOption[] {
  const path: CascadeOption[] = []
  let current = options
  for (const idx of indices) {
    if (idx == null || !current[idx]) break
    const opt = current[idx]
    path.push(opt)
    if (!opt.children?.length) break
    current = opt.children
  }
  return path
}

const sizeClasses: Record<CascadeSelectSize, string> = {
  sm: 'h-8 text-xs px-2.5',
  default: 'h-9 text-sm px-3',
  lg: 'h-11 text-base px-4',
}

interface SearchResult {
  path: CascadeOption[]
  values: string[]
}

/**
 * Angular port of UIPKGE CascadeSelect, 1:1 with the React component: a Popover whose
 * trigger is a combobox button showing the selected path, and whose content is either one
 * column per level (clicking a parent opens the next column, clicking a leaf commits the
 * path and closes) or, while searching, a flat list of matching leaf paths. Escape on the
 * closed trigger clears. `value` / `defaultValue` / `valueChange` work controlled or
 * uncontrolled like React. Class strings copied verbatim from React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-cascade-select, [ui-cascade-select]',
  standalone: true,
  imports: [UiPopoverComponent, UiPopoverTriggerComponent, UiPopoverContentComponent],
  // Block (not `contents`) so parent spacing utilities reach it like React's trigger button.
  host: { '[class]': '"block"' },
  template: `
    <ui-popover [open]="isOpen()" (openChange)="setOpen($event)">
      <button
        #triggerEl
        ui-popover-trigger
        type="button"
        role="combobox"
        [attr.aria-expanded]="isOpen()"
        [disabled]="disabled || loading"
        data-uipkge=""
        data-slot="cascade-select"
        [class]="triggerClasses"
        (keydown)="onTriggerKeyDown($event)"
      >
        <span [class]="labelClass">{{ displayLabel }}</span>
        <span class="flex shrink-0 items-center gap-1">
          @if (loading) {
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
              class="lucide lucide-loader-circle text-muted-foreground size-4 animate-spin"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          } @else if (clearable && hasValue && !disabled) {
            <!-- Decorative clear affordance -- not a nested interactive control. -->
            <span
              aria-hidden="true"
              class="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center rounded transition-colors"
              (click)="clearAll($event)"
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
            </span>
          } @else {
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
              [attr.class]="chevronClass"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          }
        </span>
      </button>

      <ui-popover-content class="p-0" align="start" [sideOffset]="4" (openAutoFocus)="onPanelOpen()">
        <div #body class="flex max-h-80 flex-col">
          @if (searchable) {
            <div class="border-b p-2">
              <div class="relative">
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
                  class="lucide lucide-search text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                  aria-hidden="true"
                >
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
                <input
                  [value]="search()"
                  (input)="search.set($any($event.target).value)"
                  [placeholder]="searchPlaceholder"
                  aria-label="Search options"
                  class="border-input focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent pl-8 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                />
              </div>
            </div>
          }

          @if (loading) {
            <div class="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
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
                class="lucide lucide-loader-circle size-4 animate-spin"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Loading...
            </div>
          } @else if (searchResults; as results) {
            <div class="flex-1 overflow-y-auto p-1">
              @if (results.length === 0) {
                <div class="text-muted-foreground py-6 text-center text-sm">{{ emptyText }}</div>
              } @else {
                @for (result of results; track $index) {
                  <button
                    type="button"
                    class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:outline-none"
                    (click)="selectSearchResult(result)"
                  >
                    <span class="flex-1 truncate">{{ pathLabel(result.path) }}</span>
                  </button>
                }
              }
            </div>
          } @else {
            <div class="flex flex-1 overflow-x-auto overflow-y-hidden">
              @for (lvl of levels; track lvl.level) {
                <div class="max-w-56 min-w-44 shrink-0 overflow-y-auto border-r p-1 last:border-r-0">
                  @for (opt of lvl.options; track opt.value; let idx = $index) {
                    <button
                      type="button"
                      [disabled]="opt.disabled"
                      [class]="optionClass(lvl.level, idx)"
                      (click)="selectAtLevel(lvl.level, idx)"
                    >
                      <span class="flex-1 truncate">{{ opt.label }}</span>
                      @if (activePath()[lvl.level] === idx && !opt.children?.length) {
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
                          class="lucide lucide-check size-4 shrink-0"
                          aria-hidden="true"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      } @else if (opt.children?.length) {
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
                          class="lucide lucide-chevron-right text-muted-foreground size-3.5 shrink-0"
                          aria-hidden="true"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      }
                    </button>
                  }
                </div>
              }
            </div>
          }
        </div>
      </ui-popover-content>
    </ui-popover>
  `,
})
export class UiCascadeSelectComponent implements AfterViewInit {
  /** Controlled selected path (pair with `valueChange`). Leave unset for uncontrolled use. */
  @Input() value?: string[] | null
  @Input() defaultValue: string[] | null = null
  @Input() options: CascadeOption[] = []
  @Input() placeholder = 'Select...'
  @Input({ transform: booleanAttribute }) searchable = true
  @Input({ transform: booleanAttribute }) clearable = true
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) loading = false
  @Input() size: CascadeSelectSize = 'default'
  @Input() separator = ' / '
  @Input() searchPlaceholder = 'Search...'
  @Input() emptyText = 'No options.'
  @Input('class') className?: string

  /** React `onValueChange`. */
  @Output() valueChange = new EventEmitter<string[] | null>()
  /** React `onChange(value, path)`. */
  @Output() change = new EventEmitter<{ value: string[] | null; path: CascadeOption[] }>()
  /** React `onClear`. */
  @Output() clear = new EventEmitter<void>()

  @ViewChild('triggerEl', { static: true }) private triggerEl?: ElementRef<HTMLButtonElement>
  @ViewChild('body', { static: true }) private body?: ElementRef<HTMLElement>

  readonly isOpen = signal(false)
  readonly activePath = signal<number[]>([])
  readonly search = signal('')
  private readonly internalValue = signal<string[] | null | undefined>(undefined)

  ngAfterViewInit(): void {
    // Radix Slot: the child's props win over PopoverTrigger's (Angular host bindings would win).
    const el = this.triggerEl?.nativeElement
    el?.setAttribute('data-slot', 'cascade-select')
    el?.setAttribute('aria-haspopup', 'listbox')
  }

  get currentValue(): string[] | null {
    if (this.value !== undefined) return this.value
    const v = this.internalValue()
    return v === undefined ? this.defaultValue : v
  }

  setOpen(open: boolean): void {
    this.isOpen.set(open)
    // Sync the active path with the value when opened; clear the search when closed.
    if (open) {
      const v = this.currentValue
      this.activePath.set(v?.length ? findPathIndices(this.options, v) : [])
    } else {
      this.search.set('')
    }
  }

  /** Content width tracks the trigger (React passes `style` to PopoverContent). */
  onPanelOpen(): void {
    const panel = this.body?.nativeElement.parentElement
    if (panel) panel.style.width = 'var(--radix-popover-trigger-width)'
  }

  private commitValue(values: string[] | null, path: CascadeOption[]): void {
    if (this.value === undefined) this.internalValue.set(values)
    this.valueChange.emit(values)
    this.change.emit({ value: values, path })
  }

  private getOptionsAtLevel(level: number): CascadeOption[] {
    let current = this.options
    const active = this.activePath()
    for (let i = 0; i < level; i++) {
      const idx = active[i]
      if (idx == null || !current[idx]?.children?.length) return []
      current = current[idx].children!
    }
    return current
  }

  selectAtLevel(level: number, index: number): void {
    const option = this.getOptionsAtLevel(level)[index]
    if (option?.disabled) return
    const next = [...this.activePath()]
    next[level] = index
    next.splice(level + 1)
    this.activePath.set(next)
    // Leaf node: emit the value and close.
    if (!option?.children?.length) {
      const path = buildPathFromIndices(this.options, next)
      this.commitValue(
        path.map((p) => p.value),
        path,
      )
      this.setOpen(false)
    }
  }

  get selectedPath(): CascadeOption[] {
    const v = this.currentValue
    if (!v?.length) return []
    return buildPathFromIndices(this.options, findPathIndices(this.options, v))
  }

  get displayLabel(): string {
    const path = this.selectedPath
    if (path.length === 0) return this.placeholder
    return path.map((p) => p.label).join(this.separator)
  }

  get hasValue(): boolean {
    return this.selectedPath.length > 0
  }

  pathLabel(path: CascadeOption[]): string {
    return path.map((p) => p.label).join(this.separator)
  }

  clearAll(event?: Event): void {
    event?.stopPropagation()
    if (this.disabled) return
    this.clear.emit()
    this.commitValue(null, [])
    this.activePath.set([])
  }

  onTriggerKeyDown(e: KeyboardEvent): void {
    // Escape clears when closed (open Escape is handled by Popover).
    if (e.key === 'Escape' && !this.isOpen() && this.clearable && this.hasValue && !this.disabled) {
      e.preventDefault()
      this.clearAll(e)
    }
  }

  /** Search: flatten the tree and match leaf labels. */
  get searchResults(): SearchResult[] | null {
    const q = this.search().trim().toLowerCase()
    if (!q) return null
    const results: SearchResult[] = []
    const walk = (opts: CascadeOption[], path: CascadeOption[], values: string[]) => {
      for (const opt of opts) {
        const newPath = [...path, opt]
        const newValues = [...values, opt.value]
        if (opt.label.toLowerCase().includes(q) && !opt.children?.length)
          results.push({ path: newPath, values: newValues })
        if (opt.children?.length) walk(opt.children, newPath, newValues)
      }
    }
    walk(this.options, [], [])
    return results
  }

  selectSearchResult(result: SearchResult): void {
    this.commitValue(result.values, result.path)
    this.setOpen(false)
    this.search.set('')
  }

  get levels(): { options: CascadeOption[]; level: number }[] {
    const result: { options: CascadeOption[]; level: number }[] = [{ options: this.options, level: 0 }]
    const active = this.activePath()
    for (let i = 0; i < active.length; i++) {
      const idx = active[i]
      const current = result[i].options
      if (idx == null || !current[idx]?.children?.length) break
      result.push({ options: current[idx].children!, level: i + 1 })
    }
    return result
  }

  get triggerClasses(): string {
    return cn(
      'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none',
      'hover:border-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[this.size],
      this.className,
    )
  }

  get labelClass(): string {
    return cn('flex-1 truncate text-left', this.hasValue ? 'text-foreground' : 'text-muted-foreground')
  }

  get chevronClass(): string {
    return cn(
      'lucide lucide-chevron-down',
      'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
      this.isOpen() && 'rotate-180',
    )
  }

  optionClass(level: number, idx: number): string {
    return cn(
      'flex w-full items-center justify-between gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm outline-none',
      'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.activePath()[level] === idx && 'bg-accent text-accent-foreground font-medium',
    )
  }
}
