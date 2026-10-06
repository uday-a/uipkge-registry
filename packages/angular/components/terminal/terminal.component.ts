import {
  type AfterViewInit,
  Component,
  ElementRef,
  Input,
  type OnDestroy,
  ViewChild,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

export interface TerminalLine {
  /** Prompt prefix shown before the command. Omit for output-only lines. */
  prompt?: string
  /** Command text shown after the prompt. */
  command?: string
  /** Output lines rendered below the command. */
  output?: string
  /** Override the line type: 'command' renders prompt+command, 'output' renders plain text. */
  type?: 'command' | 'output'
}

export interface ResolvedTerminalLine extends TerminalLine {
  type: 'command' | 'output'
  prompt: string
}

/**
 * Angular port of UIPKGE Terminal (React `Terminal`): macOS-style title bar with traffic-light
 * dots, command history with prompt + output, dark/light themes, auto-scroll to the newest
 * line, optional typing animation (one line per `typingSpeed` ms) and a max-height scroll.
 * Visible-line count is a signal so the timer-driven reveal renders in zoneless apps.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-terminal, [ui-terminal]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"terminal"',
    '[attr.data-uipkge]': '""',
    '[attr.data-theme]': 'theme',
    '[class]': 'hostClass',
  },
  template: `
    <div class="border-border bg-muted flex items-center gap-2 border-b px-4 py-2.5">
      <div class="flex gap-1.5">
        <span class="bg-destructive size-3 rounded-full"></span>
        <span class="bg-warning size-3 rounded-full"></span>
        <span class="bg-success size-3 rounded-full"></span>
      </div>
      <span class="text-muted-foreground ml-2 text-xs">{{ title }}</span>
    </div>
    <div #body class="overflow-auto p-4 leading-relaxed" [style.max-height]="maxHeight">
      @for (line of shownLines(); track $index) {
        <div data-slot="terminal-line" class="break-words whitespace-pre-wrap">
          @if (line.type === 'command') {
            <div data-slot="terminal-command" class="flex flex-wrap items-baseline gap-x-1.5">
              <span class="text-success shrink-0 font-semibold">{{ line.prompt }}</span>
              <span>{{ line.command }}</span>
            </div>
          }
          @if (line.output) {
            <div data-slot="terminal-output" class="text-muted-foreground">{{ line.output }}</div>
          }
        </div>
      }
    </div>
  `,
})
export class UiTerminalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('body', { static: true }) bodyRef?: ElementRef<HTMLDivElement>

  private readonly _lines = signal<TerminalLine[]>([])
  private readonly _promptChar = signal('$')
  readonly visibleCount = signal(0)
  private timer: ReturnType<typeof setTimeout> | null = null
  private raf = 0
  private ready = false

  /** Command history to render. */
  @Input() set lines(v: TerminalLine[]) {
    const prevLen = this._lines().length
    this._lines.set(v ?? [])
    if (!this.ready) {
      this.visibleCount.set(this.typing ? 0 : this._lines().length)
    } else if (this._lines().length !== prevLen) {
      this.onLinesChanged()
    }
  }
  get lines(): TerminalLine[] {
    return this._lines()
  }
  /** Window title shown in the title bar. */
  @Input() title = 'bash'
  /** Prompt character. */
  @Input() set promptChar(v: string) {
    this._promptChar.set(v)
  }
  get promptChar(): string {
    return this._promptChar()
  }
  @Input() theme: 'dark' | 'light' = 'dark'
  /** Auto-scroll to bottom when new lines arrive. */
  @Input({ transform: booleanAttribute }) autoScroll = true
  /** Animate lines typing in one-by-one. */
  @Input({ transform: booleanAttribute }) typing = false
  /** Typing speed in ms per line. */
  @Input() typingSpeed = 120
  /** Max height before scrolling. */
  @Input() maxHeight = '400px'
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'block relative overflow-hidden rounded-lg border font-mono text-sm shadow-sm',
      this.theme === 'dark' ? 'bg-card text-card-foreground border-border' : 'bg-muted border-border',
      this.className,
    )
  }

  resolvedLines(): ResolvedTerminalLine[] {
    const promptChar = this._promptChar()
    return this._lines().map((l) => ({
      ...l,
      type: l.type ?? (l.prompt || l.command ? 'command' : 'output'),
      prompt: l.prompt ?? (l.type === 'output' ? '' : promptChar),
    }))
  }

  shownLines(): ResolvedTerminalLine[] {
    return this.resolvedLines().slice(0, this.visibleCount())
  }

  scrollToBottom(): void {
    const body = this.bodyRef?.nativeElement
    if (!this.autoScroll || !body) return
    body.scrollTop = body.scrollHeight
  }

  ngAfterViewInit(): void {
    this.ready = true
    if (this.typing) {
      this.visibleCount.set(0)
      this.scheduleTyping()
    } else {
      this.visibleCount.set(this._lines().length)
      this.raf = requestAnimationFrame(() => this.scrollToBottom())
    }
  }

  ngOnDestroy(): void {
    this.clearTimer()
    cancelAnimationFrame(this.raf)
  }

  private onLinesChanged(): void {
    if (this.typing) {
      this.clearTimer()
      this.visibleCount.set(0)
      this.scheduleTyping()
      return
    }
    this.visibleCount.set(this._lines().length)
    cancelAnimationFrame(this.raf)
    this.raf = requestAnimationFrame(() => this.scrollToBottom())
  }

  private scheduleTyping(): void {
    if (!this.typing || this.visibleCount() >= this._lines().length) return
    this.timer = setTimeout(() => {
      this.timer = null
      this.visibleCount.update((c) => c + 1)
      this.scrollToBottom()
      this.scheduleTyping()
    }, this.typingSpeed)
  }

  private clearTimer(): void {
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
  }
}
