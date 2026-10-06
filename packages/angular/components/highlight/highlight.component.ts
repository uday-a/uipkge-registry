import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

export interface HighlightSegment {
  text: string
  match: boolean
}

export function buildPattern(query: string | RegExp, caseSensitive: boolean, wholeWord: boolean): RegExp | null {
  if (query instanceof RegExp) {
    const flags = query.flags.includes('g') ? query.flags : query.flags + 'g'
    return new RegExp(query.source, flags)
  }
  if (!query) return null
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const body = wholeWord ? `\\b${escaped}\\b` : escaped
  return new RegExp(body, caseSensitive ? 'g' : 'gi')
}

/**
 * Highlights matching substrings of `text` (React `Highlight`): string or RegExp queries,
 * case-sensitive and whole-word matching, `mark` / `span` wrapper, a max-highlight cap.
 * `matchCount` fires with the rendered count (after the cap), `totalMatchCount` with the total.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-highlight, [ui-highlight]',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'highlight',
    '[class]': 'hostClass',
  },
  template: `@for (seg of segments; track $index) {
    @if (!seg.match) {
      <ng-container>{{ seg.text }}</ng-container>
    } @else if (highlightTag === 'span') {
      <span data-slot="highlight-match" [class]="matchClass" [style]="highlightStyle ?? null">{{ seg.text }}</span>
    } @else {
      <mark data-slot="highlight-match" [class]="matchClass" [style]="highlightStyle ?? null">{{ seg.text }}</mark>
    }
  }`,
})
export class UiHighlightComponent implements OnChanges {
  /** Text to search within. */
  @Input({ required: true }) text = ''
  /** Query string or RegExp to highlight. */
  @Input({ required: true }) query: string | RegExp = ''
  /** HTML tag used to wrap matched substrings. */
  @Input() highlightTag: 'mark' | 'span' = 'mark'
  /** Class applied to each highlight wrapper. */
  @Input() highlightClass?: string
  /** Inline style applied to each highlight wrapper. */
  @Input() highlightStyle?: string | Record<string, string>
  @Input({ transform: booleanAttribute }) caseSensitive = false
  @Input({ transform: booleanAttribute }) wholeWord = false
  /** Cap the number of highlights rendered. 0 = unlimited. */
  @Input() maxHighlights = 0
  @Input('class') className?: string

  /** Fired with the number of highlights actually rendered (after maxHighlights cap). React `onMatchCount`. */
  @Output() matchCount = new EventEmitter<number>()
  /** Fired with the total match count (before maxHighlights cap). React `onTotalMatchCount`. */
  @Output() totalMatchCount = new EventEmitter<number>()

  segments: HighlightSegment[] = []
  total = 0
  private emitted: { rendered?: number; total?: number } = {}

  get hostClass(): string {
    return cn(this.className)
  }

  get matchClass(): string {
    return cn(
      'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground rounded px-0.5 font-medium',
      this.highlightClass,
    )
  }

  get renderedCount(): number {
    return this.segments.filter((s) => s.match).length
  }

  ngOnChanges(): void {
    this.segments = this.computeSegments()
    this.total = this.computeTotal()
    // Like React's effects: report after render, and only when a count actually changed.
    const rendered = this.renderedCount
    const total = this.total
    queueMicrotask(() => {
      if (this.emitted.rendered !== rendered) this.matchCount.emit((this.emitted.rendered = rendered))
      if (this.emitted.total !== total) this.totalMatchCount.emit((this.emitted.total = total))
    })
  }

  private computeSegments(): HighlightSegment[] {
    const text = this.text
    if (!text) return []
    if (!this.query) return [{ text, match: false }]
    const pattern = buildPattern(this.query, this.caseSensitive, this.wholeWord)
    if (!pattern) return [{ text, match: false }]
    const out: HighlightSegment[] = []
    let last = 0
    let count = 0
    let m: RegExpExecArray | null
    while ((m = pattern.exec(text)) !== null) {
      if (m.index > last) out.push({ text: text.slice(last, m.index), match: false })
      out.push({ text: m[0], match: true })
      last = m.index + m[0].length
      count++
      if (this.maxHighlights > 0 && count >= this.maxHighlights) break
      if (m[0] === '') pattern.lastIndex++
    }
    if (last < text.length) out.push({ text: text.slice(last), match: false })
    return out
  }

  private computeTotal(): number {
    if (!this.text || !this.query) return 0
    const pattern = buildPattern(this.query, this.caseSensitive, this.wholeWord)
    if (!pattern) return 0
    let total = 0
    let m: RegExpExecArray | null
    while ((m = pattern.exec(this.text)) !== null) {
      total++
      if (m[0] === '') pattern.lastIndex++
    }
    return total
  }
}
