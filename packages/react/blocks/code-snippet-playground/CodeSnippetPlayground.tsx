'use client'

import * as React from 'react'
import {
  Braces,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  FileCode,
  Layers,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CodeFile {
  id: string
  name: string
  path: string
  language: string
  size: string
  content: string
}

interface TestLog {
  id: string
  name: string
  duration: string
  status: 'pass' | 'fail'
}

const files: CodeFile[] = [
  {
    id: 'button-tsx',
    name: 'Button.tsx',
    path: 'packages/registry-react/components/button/Button.tsx',
    language: 'typescript',
    size: '1.1 KB',
    content: `import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './button.variants'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        data-slot="button"
        data-variant={variant ?? undefined}
        data-size={size ?? undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...(asChild ? {} : { type })}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }`,
  },
  {
    id: 'button-variants',
    name: 'button.variants.ts',
    path: 'packages/registry-react/components/button/button.variants.ts',
    language: 'typescript',
    size: '1.4 KB',
    content: `import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>`,
  },
  {
    id: 'index-ts',
    name: 'index.ts',
    path: 'packages/registry-react/components/button/index.ts',
    language: 'typescript',
    size: '220 B',
    content: `export { Button, type ButtonProps } from './Button'
export { buttonVariants, type ButtonVariants } from './button.variants'`,
  },
  {
    id: 'button-test',
    name: 'button.test.tsx',
    path: 'packages/registry-react/components/button/__tests__/button.spec.tsx',
    language: 'typescript',
    size: '1.7 KB',
    content: `import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button Primitive', () => {
  it('renders default button with children text', () => {
    render(<Button>Submit</Button>)
    const btn = screen.getByRole('button', { name: /submit/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('data-slot', 'button')
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    const btn = screen.getByRole('button', { name: /delete/i })
    expect(btn).toHaveAttribute('data-variant', 'destructive')
    expect(btn.className).toContain('bg-destructive')
  })

  it('applies size styles correctly', () => {
    render(<Button size="sm">Small</Button>)
    const btn = screen.getByRole('button', { name: /small/i })
    expect(btn).toHaveAttribute('data-size', 'sm')
    expect(btn.className).toContain('h-8')
  })

  it('handles click events when active', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Trigger</Button>)
    fireEvent.click(screen.getByRole('button', { name: /trigger/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state attribute', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled()
  })

  it('forwards custom class names with cn()', () => {
    render(<Button className="custom-btn">Custom</Button>)
    const btn = screen.getByRole('button', { name: /custom/i })
    expect(btn.className).toContain('custom-btn')
  })
})`,
  },
]

const testLogs: TestLog[] = [
  { id: '1', name: 'renders default button with children text', duration: '4ms', status: 'pass' },
  { id: '2', name: 'applies variant classes correctly', duration: '7ms', status: 'pass' },
  { id: '3', name: 'applies size styles correctly', duration: '5ms', status: 'pass' },
  { id: '4', name: 'handles click events when active', duration: '8ms', status: 'pass' },
  { id: '5', name: 'respects disabled state attribute', duration: '6ms', status: 'pass' },
  { id: '6', name: 'forwards custom class names with cn()', duration: '12ms', status: 'pass' },
]

type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export interface CodeSnippetPlaygroundProps extends React.HTMLAttributes<HTMLDivElement> {}

function highlightSyntaxLine(line: string): string {
  if (!line.trim()) return '&nbsp;'

  const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Single line comments
  if (/^\s*\/\//.test(escaped) || /^\s*\/\*/.test(escaped) || /^\s*\*/.test(escaped) || /^\s*&lt;!--/.test(escaped)) {
    return `<span class="text-zinc-500 italic">${escaped}</span>`
  }

  // Every emitted <span> is parked behind a letter-only placeholder so later
  // passes cannot match inside the markup they already produced (the numeric
  // pass used to rewrite the `400` inside `text-purple-400` and shred the tag).
  const parked: string[] = []
  const park = (html: string) => {
    const key = String(parked.length)
      .split('')
      .map((d) => String.fromCharCode(97 + Number(d)))
      .join('')
    parked.push(html)
    return `\u0000${key}\u0000`
  }

  let out = escaped

  // Strings
  out = out.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, (m) =>
    park(`<span class="text-emerald-400 font-normal">${m}</span>`),
  )

  // Trailing comments
  out = out.replace(/(\/\/.*$)/, (m) => park(`<span class="text-zinc-500 italic">${m}</span>`))

  // Keywords
  out = out.replace(
    /\b(import|export|from|const|let|var|function|return|interface|type|default|as|typeof|withDefaults|defineProps|defineEmits|describe|it|expect|test|async|await|extends|new|true|false|null|undefined)\b/g,
    (m) => park(`<span class="text-purple-400 font-semibold">${m}</span>`),
  )

  // Types
  out = out.replace(
    /\b(string|boolean|number|void|HTMLAttributes|VariantProps|ButtonVariants|ButtonProps|Props|Variant|Size|HTMLButtonElement|Record)\b/g,
    (m) => park(`<span class="text-amber-300 font-medium">${m}</span>`),
  )

  // Functions / methods
  out = out.replace(
    /\b(cn|buttonVariants|cva|mount|render|screen|getByRole|fireEvent|vi|trigger|classes|attributes|emitted|toBe|toContain|toHaveProperty|toBeDefined|toBeInTheDocument|toHaveAttribute|toHaveBeenCalledTimes|toHaveBeenCalled|forwardRef|displayName|ref|computed|onMounted|onUnmounted|fn)\b/g,
    (m) => park(`<span class="text-blue-300">${m}</span>`),
  )

  // Vue/TSX tags
  out = out.replace(
    /(&lt;\/?(?:template|script|Primitive|Button|Slot|Comp|slot|div|span|button)\b(?:\s|\/|&gt;)?)/g,
    (m) => park(`<span class="text-sky-400 font-medium">${m}</span>`),
  )

  // Attributes / directives
  out = out.replace(
    /(\b(?:data-slot|data-variant|data-size|className|variant|size|asChild|as|type|class|lang|setup|ref|onClick|disabled)\b|:[a-zA-Z0-9_-]+)/g,
    (m) => park(`<span class="text-teal-300">${m}</span>`),
  )

  // Numbers
  out = out.replace(/\b(\d+)\b/g, (m) => park(`<span class="text-amber-400">${m}</span>`))

  // Restore every parked span
  return out.replace(/\u0000([a-j]+)\u0000/g, (_, key: string) => {
    const idx = Number(
      key
        .split('')
        .map((c: string) => String(c.charCodeAt(0) - 97))
        .join(''),
    )
    return parked[idx] ?? ''
  })
}

export function CodeSnippetPlayground({ className, ...props }: CodeSnippetPlaygroundProps) {
  const [activeFileId, setActiveFileId] = React.useState('button-tsx')
  const [activeRightTab, setActiveRightTab] = React.useState('preview')
  const [hoveredLine, setHoveredLine] = React.useState<number | null>(null)
  const [isCopied, setIsCopied] = React.useState(false)
  const [isSnippetCopied, setIsSnippetCopied] = React.useState(false)
  const [isRunning, setIsRunning] = React.useState(false)
  const [lastRunTime, setLastRunTime] = React.useState('14:32:08')
  const [executionCount, setExecutionCount] = React.useState(1)

  // Interactive Workbench State
  const [selectedVariant, setSelectedVariant] = React.useState<ButtonVariant>('default')
  const [selectedSize, setSelectedSize] = React.useState<ButtonSize>('default')
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [withIcon, setWithIcon] = React.useState(true)
  const [clickCount, setClickCount] = React.useState(0)
  const [lastInteraction, setLastInteraction] = React.useState('Ready for test interactions')

  const activeFile = React.useMemo(() => {
    return files.find((f) => f.id === activeFileId) || files[0]
  }, [activeFileId])

  const activeFileLines = React.useMemo(() => {
    return activeFile.content.split('\n')
  }, [activeFile])

  const generatedSnippet = React.useMemo(() => {
    const v = selectedVariant !== 'default' ? ` variant="${selectedVariant}"` : ''
    const s = selectedSize !== 'default' ? ` size="${selectedSize}"` : ''
    const d = isDisabled ? ' disabled' : ''

    if (selectedSize === 'icon') {
      return `<Button${v}${s}${d}>\n  <Sparkles className="size-4" />\n</Button>`
    }

    if (isLoading) {
      return `<Button${v}${s}${d}>\n  <Loader2 className="size-4 animate-spin" />\n  Please wait\n</Button>`
    }

    if (withIcon) {
      return `<Button${v}${s}${d}>\n  <Sparkles className="size-4" />\n  Interactive Button\n</Button>`
    }

    return `<Button${v}${s}${d}>Interactive Button</Button>`
  }, [selectedVariant, selectedSize, isDisabled, isLoading, withIcon])

  const handleRunCode = React.useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    setActiveRightTab('console')

    setTimeout(() => {
      setIsRunning(false)
      setExecutionCount((prev) => prev + 1)
      const now = new Date()
      setLastRunTime(now.toTimeString().split(' ')[0])
    }, 480)
  }, [isRunning])

  const handleCopyFile = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(activeFile.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }, [activeFile])

  const handleCopySnippet = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(generatedSnippet)
      setIsSnippetCopied(true)
      setTimeout(() => setIsSnippetCopied(false), 2000)
    }
  }, [generatedSnippet])

  const handleResetPlayground = React.useCallback(() => {
    setActiveFileId('button-tsx')
    setSelectedVariant('default')
    setSelectedSize('default')
    setIsDisabled(false)
    setIsLoading(false)
    setWithIcon(true)
    setClickCount(0)
    setLastInteraction('Playground reset to initial state')
  }, [])

  const handleButtonClick = React.useCallback(() => {
    if (isDisabled || isLoading) return
    setClickCount((prev) => {
      const next = prev + 1
      setLastInteraction(`Dispatched onClick event #${next} at ${new Date().toLocaleTimeString()}`)
      return next
    })
  }, [isDisabled, isLoading])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRunCode()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRunCode])

  return (
    <Card
      className={cn('border-border bg-card w-full overflow-hidden shadow-xs', className)}
      data-slot="code-snippet-playground"
      {...props}
    >
      {/* Top Toolbar */}
      <CardHeader className="border-border bg-muted/20 flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
            <Code2 className="size-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold tracking-tight">Button.tsx · Radix UI Primitive</CardTitle>
              <Badge variant="outline" className="text-muted-foreground font-mono text-xs">
                React 19
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                TypeScript 5.6
              </Badge>
            </div>
            <CardDescription className="text-muted-foreground text-xs">
              Multi-file component studio with live preview, syntax engine, and Vitest suite
            </CardDescription>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="border-border/80 bg-background/80 flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
            <span
              className={cn(
                'size-2 rounded-full transition-colors',
                isRunning ? 'animate-pulse bg-amber-500' : 'bg-emerald-500',
              )}
            />
            <span className="text-muted-foreground font-mono">
              {isRunning ? 'Running suite...' : '6 tests passing'}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs shadow-none"
            title="Reset Playground"
            onClick={handleResetPlayground}
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs shadow-none"
            title="Copy active file contents"
            onClick={handleCopyFile}
          >
            {isCopied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            <span>{isCopied ? 'Copied!' : 'Copy File'}</span>
          </Button>

          <Button size="sm" className="h-8 gap-1.5 text-xs font-medium" disabled={isRunning} onClick={handleRunCode}>
            {isRunning ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5 fill-current" />}
            <span>Run Code</span>
            <kbd className="border-primary-foreground/30 bg-primary-foreground/10 hidden rounded border px-1 font-mono text-xs sm:inline">
              ⌘↵
            </kbd>
          </Button>
        </div>
      </CardHeader>

      {/* Main 2-Column Studio Grid */}
      <div className="divide-border grid grid-cols-1 divide-y lg:grid-cols-12 lg:divide-x lg:divide-y-0">
        {/* Left Column: File Tabs & Dark Code Editor (7/12 cols) */}
        <section className="flex min-h-[560px] flex-col bg-zinc-950 text-zinc-100 lg:col-span-7">
          {/* File Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/70 px-2">
            <div className="flex scrollbar-none items-center gap-1 overflow-x-auto py-1.5">
              {files.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  className={cn(
                    'group flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs transition-colors',
                    activeFileId === file.id
                      ? 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xs'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200',
                  )}
                  onClick={() => setActiveFileId(file.id)}
                >
                  {file.name.endsWith('.tsx') ? (
                    <FileCode
                      className={cn(
                        'size-3.5 transition-colors',
                        activeFileId === file.id ? 'text-sky-400' : 'text-zinc-500',
                      )}
                    />
                  ) : file.name.endsWith('.variants.ts') ? (
                    <Braces
                      className={cn(
                        'size-3.5 transition-colors',
                        activeFileId === file.id ? 'text-purple-400' : 'text-zinc-500',
                      )}
                    />
                  ) : file.name === 'index.ts' ? (
                    <Layers
                      className={cn(
                        'size-3.5 transition-colors',
                        activeFileId === file.id ? 'text-amber-400' : 'text-zinc-500',
                      )}
                    />
                  ) : (
                    <CheckCircle2
                      className={cn(
                        'size-3.5 transition-colors',
                        activeFileId === file.id ? 'text-emerald-400' : 'text-zinc-500',
                      )}
                    />
                  )}
                  <span>{file.name}</span>
                </button>
              ))}
            </div>

            <span className="hidden font-mono text-xs text-zinc-500 xl:inline">{activeFile.size}</span>
          </div>

          {/* Breadcrumb / Path Info */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/80 px-4 py-1.5 font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="text-zinc-600">src /</span>
              <span>{activeFile.path}</span>
            </div>
            <span className="text-zinc-500">{activeFileLines.length} lines</span>
          </div>

          {/* Code Editor Body */}
          <div className="relative flex flex-1 overflow-x-auto bg-zinc-950 py-3 font-mono text-xs leading-relaxed select-text">
            {/* Gutter Line Numbers */}
            <div className="flex flex-col border-r border-zinc-800/60 px-3 text-right text-zinc-600 select-none">
              {activeFileLines.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    'h-5 leading-5 transition-colors',
                    hoveredLine === index + 1 ? 'font-semibold text-zinc-300' : '',
                  )}
                >
                  {index + 1}
                </span>
              ))}
            </div>

            {/* Code Lines with Syntax Coloring */}
            <div className="flex-1 px-4 whitespace-pre">
              {activeFileLines.map((line, index) => (
                <div
                  key={index}
                  className={cn(
                    'group flex h-5 items-center rounded-xs px-1 leading-5 transition-colors',
                    hoveredLine === index + 1 ? 'bg-zinc-800/40' : '',
                  )}
                  onMouseEnter={() => setHoveredLine(index + 1)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  <span dangerouslySetInnerHTML={{ __html: highlightSyntaxLine(line) }} />
                </div>
              ))}
            </div>
          </div>

          {/* Editor Status Bar */}
          <div className="flex items-center justify-between border-t border-zinc-800/60 bg-zinc-900/90 px-3 py-1 font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <span>UTF-8</span>
              <span>2 Spaces</span>
              <span className="text-zinc-500">React TSX</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Ln {hoveredLine ?? 1}, Col 1</span>
              <span className="text-emerald-400">Prettier ✓</span>
            </div>
          </div>
        </section>

        {/* Right Column: Live Sandbox & Terminal Console (5/12 cols) */}
        <section className="bg-background flex min-h-[560px] flex-col lg:col-span-5">
          <Tabs value={activeRightTab} onValueChange={setActiveRightTab} className="flex h-full flex-col">
            {/* Right Tab Header */}
            <div className="border-border bg-muted/30 border-b px-3 py-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview" className="gap-1.5 text-xs">
                  <Sparkles className="size-3.5" />
                  <span>Live Preview</span>
                </TabsTrigger>
                <TabsTrigger value="console" className="gap-1.5 text-xs">
                  <Terminal className="size-3.5" />
                  <span>Terminal</span>
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1 py-0 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    PASS
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: Live Component Sandbox */}
            <TabsContent value="preview" className="m-0 flex flex-1 flex-col gap-4 p-4">
              {/* Variant & Style Controls */}
              <div className="border-border bg-card space-y-3 rounded-lg border p-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-semibold">Variant</span>
                  <span className="text-muted-foreground font-mono text-xs">{selectedVariant}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as ButtonVariant[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={cn(
                        'min-h-6 cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs capitalize transition-colors',
                        selectedVariant === v
                          ? 'bg-primary text-primary-foreground font-medium shadow-xs'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <Separator className="my-2" />

                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-semibold">Size & Options</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['sm', 'default', 'lg', 'icon'] as ButtonSize[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={cn(
                        'min-h-6 cursor-pointer rounded-md px-2 py-0.5 font-mono text-xs uppercase transition-colors',
                        selectedSize === s
                          ? 'bg-secondary text-secondary-foreground font-semibold'
                          : 'bg-muted/40 text-muted-foreground hover:bg-muted',
                      )}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}

                  <div className="ml-auto flex items-center gap-2">
                    <label className="text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs select-none">
                      <input
                        type="checkbox"
                        checked={isDisabled}
                        onChange={(e) => setIsDisabled(e.target.checked)}
                        className="accent-primary"
                      />
                      <span>Disabled</span>
                    </label>
                    <label className="text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs select-none">
                      <input
                        type="checkbox"
                        checked={isLoading}
                        onChange={(e) => setIsLoading(e.target.checked)}
                        className="accent-primary"
                      />
                      <span>Loading</span>
                    </label>
                    <label className="text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs select-none">
                      <input
                        type="checkbox"
                        checked={withIcon}
                        onChange={(e) => setWithIcon(e.target.checked)}
                        className="accent-primary"
                      />
                      <span>Icon</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Render Stage Canvas */}
              <div className="border-border bg-muted/20 relative flex min-h-[160px] flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-6">
                <div className="flex flex-col items-center gap-3">
                  <Button
                    variant={selectedVariant}
                    size={selectedSize}
                    disabled={isDisabled || isLoading}
                    className="transition-all active:scale-95"
                    onClick={handleButtonClick}
                  >
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : withIcon || selectedSize === 'icon' ? (
                      <Sparkles className="size-4" />
                    ) : null}
                    {selectedSize !== 'icon' && <span>Interactive Button</span>}
                  </Button>

                  <p className="text-muted-foreground font-mono text-xs">
                    Clicks: <span className="text-foreground font-semibold">{clickCount}</span>
                  </p>
                </div>

                {/* Last Interaction Status */}
                <div className="bg-background/80 text-muted-foreground absolute right-2 bottom-2 left-2 flex items-center justify-between rounded-md px-2 py-1 text-xs backdrop-blur-xs">
                  <span className="truncate font-mono">{lastInteraction}</span>
                  <span className="shrink-0 font-medium text-emerald-500">Rendered OK</span>
                </div>
              </div>

              {/* Dynamic Snippet Output */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Usage Code</span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground flex min-h-6 cursor-pointer items-center gap-1"
                    onClick={handleCopySnippet}
                  >
                    {isSnippetCopied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{isSnippetCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="border-border bg-muted/40 text-foreground overflow-x-auto rounded-md border p-2.5 font-mono text-xs leading-relaxed">
                  <code>{generatedSnippet}</code>
                </pre>
              </div>
            </TabsContent>

            {/* TAB 2: Terminal Console Execution Output */}
            <TabsContent
              value="console"
              className="m-0 flex flex-1 flex-col bg-zinc-950 p-4 font-mono text-xs text-zinc-300"
            >
              {/* Console Toolbar */}
              <div className="mb-3 flex items-center justify-between border-b border-zinc-800 pb-2 text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-200">Vitest Test Runner</span>
                  <Badge variant="outline" className="border-zinc-700 bg-zinc-900 font-mono text-xs text-zinc-300">
                    v2.1.8
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500">
                    Run #{executionCount} ({lastRunTime})
                  </span>
                  <button
                    type="button"
                    className="cursor-pointer text-zinc-400 hover:text-zinc-100"
                    title="Re-run tests"
                    onClick={handleRunCode}
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Terminal Execution Logs */}
              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                <div className="text-zinc-500">
                  $ vitest run packages/registry-react/components/button/__tests__/button.spec.tsx
                </div>

                <div className="flex items-center gap-2 font-semibold text-emerald-400">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span>PASS packages/registry-react/components/button/__tests__/button.spec.tsx (6 tests)</span>
                  <span className="font-normal text-zinc-500">42ms</span>
                </div>

                <div className="ml-4 space-y-1.5 border-l border-zinc-800 pl-3">
                  {testLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Check className="size-3 text-emerald-400" />
                        <span>{log.name}</span>
                      </div>
                      <span className="text-zinc-500">{log.duration}</span>
                    </div>
                  ))}
                </div>

                {/* Summary Card */}
                <div className="mt-4 space-y-1 rounded-md border border-zinc-800/80 bg-zinc-900/60 p-2.5 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Test Files</span>
                    <span className="font-medium text-emerald-400">1 passed (1)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tests</span>
                    <span className="font-medium text-emerald-400">6 passed (6)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start at</span>
                    <span className="text-zinc-300">{lastRunTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="text-zinc-300">42ms (transform 12ms, setup 0ms, collect 8ms, tests 42ms)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Console Status Banner */}
              <div className="mt-3 flex items-center justify-between rounded-md border border-emerald-950/60 bg-emerald-950/20 px-3 py-2 text-emerald-400">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="size-4" />
                  <span>PASS · 6 passed, 0 failed in 42ms</span>
                </div>
                <span className="text-xs text-emerald-500/80">Exit code: 0</span>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </Card>
  )
}

export default CodeSnippetPlayground
