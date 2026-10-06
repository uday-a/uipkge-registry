import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiButtonComponent } from '@/ui/button/button.component'
import { codeToTokens, type ThemedToken, type BundledLanguage } from 'shiki/bundle/web'

export type CodeBlockCopyState = 'idle' | 'copied' | 'error'

interface HighlightSegment {
  content: string
  style?: ThemedToken['htmlStyle']
}

function toHighlightSegments(tokens: ThemedToken[][], source: string): HighlightSegment[] {
  const segments: HighlightSegment[] = []
  let cursor = 0

  for (const token of tokens.flat()) {
    if (token.offset > cursor) segments.push({ content: source.slice(cursor, token.offset) })
    segments.push({ content: token.content, style: token.htmlStyle })
    cursor = token.offset + token.content.length
  }

  if (cursor < source.length) segments.push({ content: source.slice(cursor) })
  return segments
}

let nextId = 0

/**
 * Angular port of UIPKGE CodeBlock. Syntax-highlighted code preview with a
 * language header, copy button, optional line numbers, and collapsible `<pre>`
 * content. 1:1 React parity.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-code-block, [ui-code-block]',
  standalone: true,
  imports: [UiButtonComponent],
  host: {
    '[attr.data-slot]': '"code-block"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    @if (showHeader) {
      <div class="border-border bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-2">
        <span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">{{ language }}</span>
        <div class="flex items-center gap-1">
          <button
            ui-button
            variant="ghost"
            size="xs"
            class="h-7 gap-1.5 px-2"
            data-slot="code-block-copy"
            (click)="copyToClipboard()"
          >
            @if (copyStatus === 'copied') {
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
                class="lucide lucide-check text-success size-3"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
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
                class="lucide lucide-copy size-3"
                aria-hidden="true"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            }
            <span
              class="text-xs"
              [class.text-destructive]="copyStatus === 'error'"
              aria-live="polite"
              aria-atomic="true"
            >
              {{ copyLabel }}
            </span>
          </button>
          <button
            ui-button
            variant="ghost"
            size="xs"
            class="h-7 gap-1.5 px-2"
            data-slot="code-block-toggle"
            [attr.aria-expanded]="isExpanded"
            [attr.aria-controls]="bodyId"
            (click)="isExpanded = !isExpanded"
          >
            @if (isExpanded) {
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
                class="lucide lucide-chevron-up size-3"
                aria-hidden="true"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
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
                class="lucide lucide-chevron-down size-3"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            }
            <span class="text-xs">{{ isExpanded ? 'Hide' : 'Show' }} code</span>
          </button>
        </div>
      </div>
    }

    <div
      [id]="bodyId"
      data-slot="code-block-body"
      role="region"
      [attr.aria-label]="language + ' code sample'"
      tabindex="0"
      [hidden]="!bodyVisible"
      class="bg-background/40 focus-visible:ring-ring overflow-auto font-mono text-sm leading-relaxed focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
      [style.max-height]="maxHeight"
    >
      <div class="flex w-max min-w-full">
        @if (showLineNumbers) {
          <div
            aria-hidden="true"
            class="text-muted-foreground/60 border-border/60 bg-muted/30 sticky left-0 border-r px-3 py-3 text-right tabular-nums select-none"
          >
            @for (line of lines; track $index) {
              <span class="block">{{ $index + 1 }}</span>
            }
          </div>
        }
        <pre
          class="m-0 min-w-max flex-1"
        ><code class="block cursor-text whitespace-pre px-4 py-3">@if (highlightedSegments) {@for (segment of highlightedSegments; track $index) {<span data-syntax-token="" class="text-[var(--shiki-light)] dark:text-[var(--shiki-dark)]" [style]="segment.style">{{ segment.content }}</span>}} @else {{{ code }}}</code></pre>
      </div>
    </div>
  `,
})
export class UiCodeBlockComponent implements OnInit, OnChanges, OnDestroy {
  @Input() code = ''
  @Input() language = 'tsx'
  @Input({ transform: booleanAttribute }) showLineNumbers = true
  @Input() maxHeight = '400px'
  @Input({ transform: booleanAttribute }) defaultExpanded = true
  @Input({ transform: booleanAttribute }) showHeader = true
  @Input('class') className?: string

  readonly bodyId = `code-block-${++nextId}`
  isExpanded = true
  copyStatus: CodeBlockCopyState = 'idle'
  highlightedSegments: HighlightSegment[] | null = null

  private copyResetTimer?: ReturnType<typeof setTimeout>
  private highlightRequest = 0

  ngOnInit(): void {
    this.isExpanded = this.defaultExpanded
    this.highlightCode()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code'] || changes['language']) {
      this.highlightCode()
    }
  }

  ngOnDestroy(): void {
    if (this.copyResetTimer) clearTimeout(this.copyResetTimer)
  }

  get hostClass(): string {
    return cn('block group border-border bg-muted/20 relative overflow-hidden rounded-lg border', this.className)
  }

  get lines(): string[] {
    return this.code.split('\n')
  }

  get bodyVisible(): boolean {
    return !this.showHeader || this.isExpanded
  }

  get copyLabel(): string {
    if (this.copyStatus === 'copied') return 'Copied'
    if (this.copyStatus === 'error') return 'Copy failed'
    return 'Copy'
  }

  get copyLabelClass(): string {
    return cn('text-xs', this.copyStatus === 'error' && 'text-destructive')
  }

  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code)
      this.copyStatus = 'copied'
    } catch {
      this.copyStatus = 'error'
    } finally {
      if (this.copyResetTimer) clearTimeout(this.copyResetTimer)
      this.copyResetTimer = setTimeout(() => {
        this.copyStatus = 'idle'
      }, 1600)
    }
  }

  private async highlightCode(): Promise<void> {
    const req = ++this.highlightRequest
    this.highlightedSegments = null

    try {
      const { tokens } = await codeToTokens(this.code, {
        lang: this.language.toLowerCase() as BundledLanguage,
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
      })
      if (req === this.highlightRequest) {
        this.highlightedSegments = toHighlightSegments(tokens, this.code)
      }
    } catch {
      if (req === this.highlightRequest) {
        this.highlightedSegments = null
      }
    }
  }
}
