import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  UiPopoverComponent,
  UiPopoverContentComponent,
  UiPopoverTriggerComponent,
} from '@/ui/popover/popover.component'
import {
  UiCommandComponent,
  UiCommandEmptyComponent,
  UiCommandGroupComponent,
  UiCommandInputComponent,
  UiCommandItemComponent,
  UiCommandListComponent,
  UiCommandSeparatorComponent,
} from '@/ui/command/command.component'
import { UiBadgeComponent } from '@/ui/badge/badge.component'
import { readKey, type AdvanceSelectFieldNames } from './types'

export type { AdvanceSelectFieldNames, SelectOption } from './types'
export type AdvanceSelectMode = 'single' | 'multiple' | 'tags'
export type AdvanceSelectSize = 'sm' | 'default' | 'lg'
export type AdvanceSelectVariant = 'outlined' | 'filled' | 'borderless'
export type AdvanceSelectStatus = 'default' | 'error' | 'warning'
/** Any option shape: `SelectOption`, a custom object mapped through `fieldNames`, or a primitive. */
export type AdvanceSelectOption = Record<string, unknown> | string | number
/** Rich content slot (React `ReactNode`): plain text or an `<ng-template>`. */
export type AdvanceSelectContent = string | TemplateRef<unknown> | null | undefined

/** `renderLabel` template context (React `renderLabel(info)`). */
export interface AdvanceSelectLabelContext {
  value: unknown
  label: string
}
/** `renderTag` template context (React `renderTag(info)`). */
export interface AdvanceSelectTagContext {
  value: unknown
  label: string
  closable: boolean
  onClose: (e?: Event) => void
}
/** `renderOption` template context (React `renderOption(info)`). */
export interface AdvanceSelectOptionContext<T = AdvanceSelectOption> {
  option: T
  index: number
}

const sizeClasses: Record<AdvanceSelectSize, string> = {
  sm: 'h-8 text-xs px-2.5 py-1',
  default: 'h-9 text-sm px-3 py-1.5',
  lg: 'h-11 text-base px-4 py-2',
}

const variantClasses: Record<AdvanceSelectVariant, string> = {
  outlined:
    'border-input bg-transparent shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  filled:
    'border-transparent bg-muted/50 shadow-none focus-visible:bg-muted focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  borderless:
    'border-transparent bg-transparent shadow-none focus-visible:bg-muted/30 focus-visible:ring-ring/50 focus-visible:ring-[3px]',
}

const statusClasses: Record<AdvanceSelectStatus, string> = {
  default: '',
  error:
    'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 aria-invalid:border-destructive',
  warning: 'border-warning focus-visible:border-warning focus-visible:ring-warning/20',
}

/**
 * Template outlet with a context (`<ng-container [uiAdvanceSelectOutlet]="tpl" [uiAdvanceSelectOutletContext]="ctx" />`).
 * The context is exposed both as `$implicit` and spread, so `let-info` and `let-label="label"` both work.
 */
@Directive({ selector: '[uiAdvanceSelectOutlet]', standalone: true })
export class UiAdvanceSelectOutletDirective implements OnChanges, OnDestroy {
  @Input('uiAdvanceSelectOutlet') template: TemplateRef<unknown> | null | undefined
  @Input('uiAdvanceSelectOutletContext') context: object | undefined
  private readonly vcr = inject(ViewContainerRef)
  private view: EmbeddedViewRef<Record<string, unknown>> | null = null

  ngOnChanges(changes: SimpleChanges): void {
    const ctx = { $implicit: this.context, ...(this.context ?? {}) }
    if (changes['template'] || !this.view) {
      this.vcr.clear()
      this.view = this.template
        ? (this.vcr.createEmbeddedView(this.template, ctx) as EmbeddedViewRef<Record<string, unknown>>)
        : null
    } else {
      Object.assign(this.view.context, ctx)
    }
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

/**
 * Sits on the element projected into PopoverContent and styles the portalled panel the way
 * React passes `style` / `onScroll` to PopoverContent (width tracks the trigger, max height).
 */
@Directive({ selector: '[uiAdvanceSelectPanel]', standalone: true })
export class UiAdvanceSelectPanelDirective implements OnInit, OnChanges, OnDestroy {
  @Input() listHeight = 300
  @Output() popupScroll = new EventEmitter<Event>()
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private panel: HTMLElement | null = null
  private readonly onScroll = (e: Event) => this.popupScroll.emit(e)

  ngOnInit(): void {
    this.panel = this.el.parentElement
    this.panel?.addEventListener('scroll', this.onScroll)
    this.apply()
  }

  ngOnChanges(): void {
    this.apply()
  }

  private apply(): void {
    if (!this.panel) return
    this.panel.style.width = 'var(--radix-popover-trigger-width)'
    this.panel.style.maxHeight = `${this.listHeight}px`
  }

  ngOnDestroy(): void {
    this.panel?.removeEventListener('scroll', this.onScroll)
  }
}

/**
 * Angular port of UIPKGE AdvanceSelect, 1:1 with the React component: a Popover whose
 * trigger is the combobox button (tags as Badges in multiple / tags mode, clear X, spinner),
 * and whose content is a Command list (search input, grouped items with separators, check
 * marks, "Create" item, "N selected / Clear all" footer). Selection is controlled through
 * `value` / `valueChange` exactly like React's `value` / `onValueChange`; `open` and
 * `searchValue` are controlled-or-uncontrolled. Class strings copied verbatim from React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-advance-select, [ui-advance-select]',
  standalone: true,
  imports: [
    UiPopoverComponent,
    UiPopoverTriggerComponent,
    UiPopoverContentComponent,
    UiCommandComponent,
    UiCommandInputComponent,
    UiCommandListComponent,
    UiCommandEmptyComponent,
    UiCommandGroupComponent,
    UiCommandItemComponent,
    UiCommandSeparatorComponent,
    UiBadgeComponent,
    UiAdvanceSelectOutletDirective,
    UiAdvanceSelectPanelDirective,
  ],
  // React renders no wrapper element. The host is a plain block (not `contents`) so parent
  // spacing utilities (space-y-*) still reach it like they reach React's trigger button.
  host: { '[class]': '"block"' },
  template: `
    <ui-popover [open]="isOpen" (openChange)="setOpen($event)">
      <button
        #triggerEl
        ui-popover-trigger
        type="button"
        role="combobox"
        [attr.aria-expanded]="isOpen"
        [attr.aria-invalid]="status === 'error' ? true : null"
        [disabled]="disabled || loading"
        data-uipkge=""
        data-slot="advance-select"
        [class]="triggerClass"
        (focus)="focus.emit($event)"
        (blur)="blur.emit($event)"
      >
        @if (prefix) {
          <span class="shrink-0"><ng-container [uiAdvanceSelectOutlet]="prefix" /></span>
        }
        @if (isMultiple) {
          <div
            class="flex flex-1 [scrollbar-width:none] flex-nowrap items-center gap-1 overflow-x-auto [-ms-overflow-style:none]"
          >
            @if (selectedOptions.length) {
              @for (opt of visibleTags; track tagKey(opt)) {
                @if (renderTag) {
                  <ng-container [uiAdvanceSelectOutlet]="renderTag" [uiAdvanceSelectOutletContext]="tagContext(opt)" />
                } @else {
                  <span
                    ui-badge
                    variant="secondary"
                    class="bg-muted text-foreground h-6 gap-1 pr-1 pl-2 text-xs font-normal"
                  >
                    <span class="truncate">{{ displayLabel(opt) }}</span>
                    @if (!disabled) {
                      <span
                        role="button"
                        tabindex="0"
                        class="hover:bg-muted-foreground/20 inline-flex items-center justify-center rounded-full p-0.5 transition-colors"
                        [attr.aria-label]="'Remove ' + getLabel(opt)"
                        (click)="removeTag(getValue(opt), $event)"
                        (keydown)="onActionKeydown($event, removeTagFn(opt))"
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
                          class="lucide lucide-x size-3"
                          aria-hidden="true"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </span>
                    }
                  </span>
                }
              }
              @if (hiddenTagCount > 0) {
                <span ui-badge variant="secondary" class="bg-muted text-foreground h-6 text-xs font-normal">{{
                  maxTagPlaceholderText
                }}</span>
              }
            } @else {
              <span class="text-muted-foreground truncate">{{ placeholder }}</span>
            }
          </div>
        } @else if (renderLabel) {
          <ng-container [uiAdvanceSelectOutlet]="renderLabel" [uiAdvanceSelectOutletContext]="labelContext" />
        } @else {
          <span [class]="singleLabelClass">{{ selectedOptions[0] ? getLabel(selectedOptions[0]) : placeholder }}</span>
        }

        <span class="flex shrink-0 items-center gap-1">
          @if (suffix) {
            <ng-container [uiAdvanceSelectOutlet]="suffix" />
          }
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
          } @else if (showClear) {
            <span
              role="button"
              tabindex="0"
              class="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center rounded transition-colors"
              aria-label="Clear selection"
              (click)="clearAll($event)"
              (keydown)="onActionKeydown($event, clearAllFn)"
            >
              @if (clearIcon) {
                <ng-container [uiAdvanceSelectOutlet]="clearIcon" />
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
                  class="lucide lucide-x size-4"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              }
            </span>
          } @else if (suffixIcon) {
            <ng-container [uiAdvanceSelectOutlet]="suffixIcon" />
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
              class="lucide lucide-chevron-down text-muted-foreground size-4 opacity-50"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          }
        </span>
      </button>

      <ui-popover-content class="p-0" align="start" [sideOffset]="4" (closeAutoFocus)="mounted = false">
        <!-- Radix mounts content only while open (kept through the exit animation): 10k options must not render up front. -->
        @if (renderContent) {
          <ui-command
            uiAdvanceSelectPanel
            [listHeight]="listHeight"
            (popupScroll)="popupScroll.emit($event)"
            [shouldFilter]="false"
            class="flex flex-col overflow-hidden"
          >
            @if (showSearchInput) {
              <ui-command-input
                [value]="query"
                (valueChange)="setQuery($event)"
                [placeholder]="placeholder"
                (keydown)="handleInputKeydown($event)"
              />
            }

            <ui-command-list class="flex-1 overflow-y-auto">
              @if (!loading && filteredOptions.length === 0) {
                <ui-command-empty>
                  @if (isTemplate(emptyContent ?? notFoundContent)) {
                    <ng-container [uiAdvanceSelectOutlet]="asTemplate(emptyContent ?? notFoundContent)" />
                  } @else {
                    {{ emptyContent ?? notFoundContent }}
                  }
                </ui-command-empty>
              }

              @if (loading && filteredOptions.length === 0) {
                <div class="py-6 text-center text-sm">
                  @if (isTemplate(loadingText)) {
                    <ng-container [uiAdvanceSelectOutlet]="asTemplate(loadingText)" />
                  } @else {
                    {{ loadingText }}
                  }
                </div>
              }

              @for (group of grouped; track group.heading; let gi = $index) {
                @if (gi > 0) {
                  <ui-command-separator />
                }
                <ui-command-group [heading]="group.heading || undefined">
                  @for (opt of group.items; track tagKey(opt); let idx = $index) {
                    <ui-command-item
                      [value]="tagKey(opt)"
                      [disabled]="isDisabledOption(opt) || (atMax && !isSelected(opt))"
                      [attr.data-active]="gi === 0 && idx === 0 && defaultActiveFirstOption ? 'true' : null"
                      [class]="virtual && options.length > 100 ? '[content-visibility:auto]' : ''"
                      (select)="selectOption(opt)"
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
                        [attr.class]="checkClass(opt)"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      @if (renderOption) {
                        <ng-container
                          [uiAdvanceSelectOutlet]="renderOption"
                          [uiAdvanceSelectOutletContext]="{ option: opt, index: idx }"
                        />
                      } @else {
                        {{ getLabel(opt) }}
                      }
                    </ui-command-item>
                  }
                </ui-command-group>
              }

              @if (showCreateItem) {
                <ui-command-item [value]="'create:' + query" (select)="createTag()">
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
                    class="lucide lucide-check mr-2 size-4 opacity-0"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Create &quot;{{ query.trim() }}&quot;
                </ui-command-item>
              }
            </ui-command-list>

            @if (isMultiple && selectedOptions.length > 0) {
              <div class="flex items-center justify-between border-t px-2 py-1.5 text-xs">
                <span class="text-muted-foreground">{{ selectedOptions.length }} selected</span>
                <button type="button" class="text-muted-foreground hover:text-foreground" (click)="clearAll($event)">
                  Clear all
                </button>
              </div>
            }
          </ui-command>
        }
      </ui-popover-content>
    </ui-popover>
  `,
})
export class UiAdvanceSelectComponent<T extends AdvanceSelectOption = AdvanceSelectOption>
  implements OnChanges, AfterViewInit
{
  /** Controlled selection: a value (single) or an array (multiple / tags). */
  @Input() value?: unknown
  @Input() options: T[] = []

  // Mode
  @Input() mode: AdvanceSelectMode = 'single'

  // Field mapping
  @Input() fieldNames: AdvanceSelectFieldNames = {}

  // Appearance
  @Input() size: AdvanceSelectSize = 'default'
  @Input() variant: AdvanceSelectVariant = 'outlined'
  @Input() status: AdvanceSelectStatus = 'default'
  @Input() placeholder = 'Select...'

  // Search
  @Input({ transform: booleanAttribute }) showSearch = false
  /** Controlled search query (pair with `searchChange`). */
  @Input() searchValue?: string
  @Input({ transform: booleanAttribute }) autoClearSearchValue = true
  @Input() filterOption: boolean | ((input: string, option: T) => boolean) = true
  @Input() optionFilterProp: string | string[] = 'label'
  @Input() filterSort?: (optionA: T, optionB: T, info: { searchValue: string }) => number

  // Multiple / tags
  @Input() maxCount?: number
  @Input() maxTagCount?: number
  @Input() maxTagTextLength?: number
  @Input() maxTagPlaceholder?: string | ((omittedValues: T[]) => string)
  @Input() tokenSeparators: string[] = []
  @Input({ transform: booleanAttribute }) hideSelected = false
  @Input({ transform: booleanAttribute }) allowCreate = false

  // State
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) loading = false
  @Input({ transform: booleanAttribute }) allowClear = true
  /** Controlled open state (pair with `openChange`). Leave unset for uncontrolled use. */
  @Input() open?: boolean
  @Input({ transform: booleanAttribute }) defaultOpen = false
  @Input({ transform: booleanAttribute }) defaultActiveFirstOption = true

  // Customization
  @Input() notFoundContent: AdvanceSelectContent = 'No results.'
  @Input() loadingText: AdvanceSelectContent = 'Loading...'
  @Input() listHeight = 300
  @Input({ transform: booleanAttribute }) virtual = true

  @Input('class') className?: string

  // Render slots (React ReactNode / render props -> TemplateRef)
  @Input() prefix?: TemplateRef<unknown> | null
  @Input() suffix?: TemplateRef<unknown> | null
  @Input() suffixIcon?: TemplateRef<unknown> | null
  @Input() clearIcon?: TemplateRef<unknown> | null
  @Input() renderLabel?: TemplateRef<unknown> | null
  @Input() renderTag?: TemplateRef<unknown> | null
  @Input() renderOption?: TemplateRef<unknown> | null
  @Input() emptyContent?: AdvanceSelectContent

  // Events
  /** React `onValueChange(value, option)`: the value (two-way `[(value)]`). */
  @Output() valueChange = new EventEmitter<unknown>()
  /** React `onValueChange`'s second argument: `{ value, option }` for every value change. */
  @Output() optionChange = new EventEmitter<{ value: unknown; option: T | T[] | undefined }>()
  @Output() searchChange = new EventEmitter<string>()
  @Output() openChange = new EventEmitter<boolean>()
  @Output() select = new EventEmitter<{ value: unknown; option: T }>()
  @Output() deselect = new EventEmitter<{ value: unknown; option: T }>()
  @Output() clear = new EventEmitter<void>()
  @Output() focus = new EventEmitter<FocusEvent>()
  @Output() blur = new EventEmitter<FocusEvent>()
  @Output() popupScroll = new EventEmitter<Event>()
  @Output() inputKeyDown = new EventEmitter<KeyboardEvent>()

  private readonly internalOpen = signal<boolean | null>(null)
  private readonly internalQuery = signal('')

  readonly clearAllFn = (e: Event) => this.clearAll(e)
  /** True from open until the exit animation finishes (Radix Presence). */
  mounted = false

  get renderContent(): boolean {
    if (this.isOpen) this.mounted = true
    return this.mounted
  }

  @ViewChild('triggerEl', { static: true }) private triggerEl?: ElementRef<HTMLButtonElement>

  ngAfterViewInit(): void {
    // Radix Slot lets the child's props win over PopoverTrigger's (data-slot="popover-trigger");
    // Angular host bindings win over template attributes, so restore the child's slot here.
    this.triggerEl?.nativeElement.setAttribute('data-slot', 'advance-select')
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React clears the query whenever the popover closes (controlled or not).
    const open = changes['open']
    if (open && !open.firstChange && !open.currentValue && this.autoClearSearchValue) this.setQuery('')
  }

  get isOpen(): boolean {
    if (this.open !== undefined) return this.open
    return this.internalOpen() ?? this.defaultOpen
  }

  setOpen(v: boolean): void {
    if (this.open === undefined) this.internalOpen.set(v)
    this.openChange.emit(v)
    if (!v && this.autoClearSearchValue) this.setQuery('')
  }

  get query(): string {
    return this.searchValue !== undefined ? this.searchValue : this.internalQuery()
  }

  setQuery(v: string): void {
    if (this.searchValue === undefined) this.internalQuery.set(v)
    this.searchChange.emit(v)
  }

  private get valueKey(): string {
    return this.fieldNames.value ?? 'value'
  }
  private get labelKey(): string {
    return this.fieldNames.label ?? 'label'
  }
  private get groupKey(): string {
    return this.fieldNames.group ?? 'group'
  }
  private get disabledKey(): string {
    return this.fieldNames.disabled ?? 'disabled'
  }

  getValue(o: T): unknown {
    return readKey(o, this.valueKey, o)
  }
  getLabel(o: T): string {
    return String(readKey(o, this.labelKey, ''))
  }
  private getGroup(o: T): string | undefined {
    const g = readKey(o, this.groupKey)
    return g == null ? undefined : String(g)
  }
  isDisabledOption(o: T): boolean {
    return Boolean(readKey(o, this.disabledKey, false))
  }
  tagKey(o: T): string {
    return String(this.getValue(o))
  }

  get isMultiple(): boolean {
    return this.mode === 'multiple' || this.mode === 'tags'
  }

  get selectedValues(): unknown[] {
    if (this.value == null) return []
    if (this.isMultiple) return Array.isArray(this.value) ? this.value : []
    return [this.value]
  }

  isSelected(o: T): boolean {
    return this.selectedValues.includes(this.getValue(o))
  }

  get selectedOptions(): T[] {
    return this.selectedValues.map((v) => {
      const found = this.options.find((o) => this.getValue(o) === v)
      if (found) return found
      // For created tags not in options, create a minimal option object
      return { [this.labelKey]: String(v), [this.valueKey]: v } as T
    })
  }

  private getOptionByValue(v: unknown): T | undefined {
    return this.options.find((o) => this.getValue(o) === v)
  }

  private matchesFilter(o: T, q: string): boolean {
    if (typeof this.filterOption === 'function') return this.filterOption(q, o)
    if (this.filterOption === false) return true
    const label = this.getLabel(o).toLowerCase()
    const search = q.toLowerCase()
    const props = Array.isArray(this.optionFilterProp) ? this.optionFilterProp : [this.optionFilterProp]
    for (const prop of props) {
      if (prop === 'label' && label.includes(search)) return true
      const val = String(readKey(o, prop, '')).toLowerCase()
      if (val.includes(search)) return true
    }
    return false
  }

  get filteredOptions(): T[] {
    let result = this.options
    const q = this.query.trim()
    if (q) result = result.filter((o) => this.matchesFilter(o, q))
    if (this.hideSelected && this.isMultiple) {
      const selected = new Set(this.selectedValues)
      result = result.filter((o) => !selected.has(this.getValue(o)))
    }
    if (q && this.filterSort) {
      const sort = this.filterSort
      result = [...result].sort((a, b) => sort(a, b, { searchValue: q }))
    }
    return result
  }

  get grouped(): { heading: string; items: T[] }[] {
    const groups = new Map<string, T[]>()
    for (const opt of this.filteredOptions) {
      const key = this.getGroup(opt) ?? ''
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(opt)
    }
    return Array.from(groups, ([heading, items]) => ({ heading, items }))
  }

  get atMax(): boolean {
    if (typeof this.maxCount !== 'number') return false
    const count = Array.isArray(this.value) ? this.value.length : this.value ? 1 : 0
    return count >= this.maxCount
  }

  get visibleTags(): T[] {
    if (!this.isMultiple) return []
    const opts = this.selectedOptions
    return typeof this.maxTagCount === 'number' ? opts.slice(0, this.maxTagCount) : opts
  }

  get hiddenTagCount(): number {
    if (!this.isMultiple || typeof this.maxTagCount !== 'number') return 0
    return Math.max(0, this.selectedOptions.length - this.maxTagCount)
  }

  get maxTagPlaceholderText(): string {
    const p = this.maxTagPlaceholder
    if (typeof p === 'function') return p(this.selectedOptions.slice(this.maxTagCount ?? 0))
    return p ? p : `+${this.hiddenTagCount}`
  }

  displayLabel(o: T): string {
    let label = this.getLabel(o)
    if (this.maxTagTextLength && label.length > this.maxTagTextLength) {
      label = label.slice(0, this.maxTagTextLength) + '...'
    }
    return label
  }

  tagContext(o: T): AdvanceSelectTagContext {
    return {
      value: this.getValue(o),
      label: this.displayLabel(o),
      closable: !this.disabled,
      onClose: (e?: Event) => this.removeTag(this.getValue(o), e),
    }
  }

  get labelContext(): AdvanceSelectLabelContext {
    const first = this.selectedOptions[0]
    return { value: this.value, label: first ? this.getLabel(first) : '' }
  }

  removeTagFn(o: T): (e: Event) => void {
    return (e) => this.removeTag(this.getValue(o), e)
  }

  get isEmpty(): boolean {
    return this.isMultiple
      ? !Array.isArray(this.value) || this.value.length === 0
      : this.value == null || this.value === ''
  }

  get showClear(): boolean {
    return this.allowClear && !this.isEmpty && !this.disabled && !this.loading
  }

  get showSearchInput(): boolean {
    return this.showSearch || this.mode === 'tags'
  }

  get showCreateItem(): boolean {
    const q = this.query.trim()
    return !!q && (this.allowCreate || this.mode === 'tags') && !this.options.some((o) => this.getLabel(o) === q)
  }

  get triggerClass(): string {
    return cn(
      'flex w-full items-center justify-between gap-2 rounded-md border text-sm transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[this.size],
      variantClasses[this.variant],
      statusClasses[this.status],
      this.className,
    )
  }

  get singleLabelClass(): string {
    return cn('flex-1 truncate text-left', this.selectedOptions.length ? 'text-foreground' : 'text-muted-foreground')
  }

  checkClass(o: T): string {
    return cn('lucide lucide-check mr-2 size-4 shrink-0', this.isSelected(o) ? 'opacity-100' : 'opacity-0')
  }

  isTemplate(v: unknown): boolean {
    return v instanceof TemplateRef
  }

  asTemplate(v: unknown): TemplateRef<unknown> {
    return v as TemplateRef<unknown>
  }

  private emitValue(v: unknown, option: T | T[] | undefined): void {
    this.valueChange.emit(v)
    this.optionChange.emit({ value: v, option })
  }

  selectOption(option: T): void {
    if (this.isDisabledOption(option)) return
    const v = this.getValue(option)

    if (!this.isMultiple) {
      this.emitValue(v, option)
      this.select.emit({ value: v, option })
      this.setOpen(false)
      if (this.autoClearSearchValue) this.setQuery('')
      return
    }

    const current = Array.isArray(this.value) ? [...this.value] : []
    if (this.selectedValues.includes(v)) {
      this.emitValue(
        current.filter((x) => x !== v),
        option,
      )
      this.deselect.emit({ value: v, option })
    } else {
      if (this.atMax) return
      this.emitValue([...current, v], option)
      this.select.emit({ value: v, option })
    }
    if (this.autoClearSearchValue) this.setQuery('')
  }

  removeTag(value: unknown, event?: Event): void {
    event?.stopPropagation()
    if (this.disabled) return
    const current = Array.isArray(this.value) ? [...this.value] : []
    const option = this.getOptionByValue(value)
    this.emitValue(
      current.filter((x) => x !== value),
      option,
    )
    if (option) this.deselect.emit({ value, option })
  }

  clearAll(event?: Event): void {
    event?.stopPropagation()
    if (this.disabled) return
    this.clear.emit()
    if (this.isMultiple) this.emitValue([], [])
    else this.emitValue(null, undefined)
    this.setQuery('')
  }

  createTag(): void {
    if (!this.allowCreate && this.mode !== 'tags') return
    const q = this.query.trim()
    if (!q) return
    if (this.options.some((o) => this.getLabel(o) === q || String(this.getValue(o)) === q)) return
    const newOption = { [this.labelKey]: q, [this.valueKey]: q } as T

    if (!this.isMultiple) {
      this.emitValue(q, newOption)
      this.select.emit({ value: q, option: newOption })
      this.setOpen(false)
      this.setQuery('')
      return
    }

    if (this.atMax) return
    const current = Array.isArray(this.value) ? [...this.value] : []
    this.emitValue([...current, q], newOption)
    this.select.emit({ value: q, option: newOption })
    this.setQuery('')
  }

  handleInputKeydown(event: KeyboardEvent): void {
    this.inputKeyDown.emit(event)
    if (event.key === 'Enter' && this.query.trim() && this.mode === 'tags') {
      event.preventDefault()
      this.createTag()
    }
    if (this.tokenSeparators.length && this.mode === 'tags' && this.tokenSeparators.includes(event.key)) {
      event.preventDefault()
      this.createTag()
    }
  }

  /** Enter / Space on the role=button spans inside the trigger (React onKeyDown). */
  onActionKeydown(event: KeyboardEvent, action: (e: Event) => void): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action(event)
    }
  }
}
