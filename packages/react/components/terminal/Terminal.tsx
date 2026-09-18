'use client'

import * as React from 'react'
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

export interface TerminalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Command history to render. */
  lines: TerminalLine[]
  /** Window title shown in the title bar. Default 'bash'. */
  title?: string
  /** Prompt character. Default '$'. */
  promptChar?: string
  /** Color theme. Default 'dark'. */
  theme?: 'dark' | 'light'
  /** Auto-scroll to bottom when new lines arrive. Default true. */
  autoScroll?: boolean
  /** Animate lines typing in one-by-one. Default false. */
  typing?: boolean
  /** Typing speed in ms per line. Default 120. */
  typingSpeed?: number
  /** Max height before scrolling. Default '400px'. */
  maxHeight?: string
}

const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  (
    {
      lines,
      title = 'bash',
      promptChar = '$',
      theme = 'dark',
      autoScroll = true,
      typing = false,
      typingSpeed = 120,
      maxHeight = '400px',
      className,
      ...props
    },
    ref,
  ) => {
    const bodyRef = React.useRef<HTMLDivElement | null>(null)
    const [visibleCount, setVisibleCount] = React.useState(typing ? 0 : lines.length)
    const typingTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const resolvedLines = React.useMemo(
      () =>
        lines.map((l) => ({
          ...l,
          type: l.type ?? (l.prompt || l.command ? 'command' : 'output'),
          prompt: l.prompt ?? (l.type === 'output' ? '' : promptChar),
        })),
      [lines, promptChar],
    )

    const shownLines = resolvedLines.slice(0, visibleCount)

    const scrollToBottom = React.useCallback(() => {
      if (!autoScroll || !bodyRef.current) return
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }, [autoScroll])

    // Reset/advance visible count when the lines array changes.
    React.useEffect(() => {
      if (typing) {
        // Reset typing animation when lines change.
        setVisibleCount(0)
        return
      }
      setVisibleCount(lines.length)
      // Scroll on the next paint once the new lines are rendered.
      const raf = requestAnimationFrame(scrollToBottom)
      return () => cancelAnimationFrame(raf)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lines.length, typing])

    // Drive the typing animation whenever visibleCount is below the total.
    React.useEffect(() => {
      if (!typing) return
      if (visibleCount >= lines.length) return

      typingTimerRef.current = setTimeout(() => {
        setVisibleCount((c) => c + 1)
        scrollToBottom()
      }, typingSpeed)

      return () => {
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current)
          typingTimerRef.current = null
        }
      }
    }, [typing, visibleCount, lines.length, typingSpeed, scrollToBottom])

    // Initial scroll-to-bottom for the non-typing case.
    React.useEffect(() => {
      if (!typing) scrollToBottom()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="terminal"
        data-theme={theme}
        className={cn(
          'relative overflow-hidden rounded-lg border font-mono text-sm shadow-sm',
          theme === 'dark' ? 'bg-card text-card-foreground border-border' : 'bg-muted border-border',
          className,
        )}
        {...props}
      >
        {/* Title bar */}
        <div className={cn('flex items-center gap-2 border-b px-4 py-2.5', 'border-border bg-muted')}>
          <div className="flex gap-1.5">
            <span className="bg-destructive size-3 rounded-full" />
            <span className="bg-warning size-3 rounded-full" />
            <span className="bg-success size-3 rounded-full" />
          </div>
          <span className="text-muted-foreground ml-2 text-xs">{title}</span>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="overflow-auto p-4 leading-relaxed" style={{ maxHeight }}>
          {shownLines.map((line, i) => (
            <div key={i} data-slot="terminal-line" className="break-words whitespace-pre-wrap">
              {line.type === 'command' && (
                <div data-slot="terminal-command" className="flex flex-wrap items-baseline gap-x-1.5">
                  <span className="text-success shrink-0 font-semibold">{line.prompt}</span>
                  <span>{line.command}</span>
                </div>
              )}
              {line.output && (
                <div data-slot="terminal-output" className="text-muted-foreground">
                  {line.output}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  },
)
Terminal.displayName = 'Terminal'

export { Terminal }
