import React, { useState, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Eye, Code2, Copy, Check, Maximize2, Minimize2 } from 'lucide-react'
import { useStoryCode } from './StoryContext'

export interface StoryProps {
  title: string
  description?: string
  code?: string
  children: ReactNode
}

export default function Story({ title, description, code, children }: StoryProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const contextCode = useStoryCode(title)
  const sourceCode = code || contextCode

  const copyCode = async () => {
    if (!sourceCode) return
    try {
      await navigator.clipboard.writeText(sourceCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy snippet:', err)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  const storyContent = (
    <>
      {isFullscreen && (
        <div
          className="animate-in fade-in fixed inset-0 z-40 bg-black/60 backdrop-blur-xs duration-150"
          onClick={() => setIsFullscreen(false)}
        />
      )}
      <section
        id={title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
        className={`group border-border bg-card text-card-foreground overflow-hidden rounded-xl border shadow-xs transition-[border-color,box-shadow] duration-200 ${
          isFullscreen
            ? 'bg-card border-border/80 animate-in zoom-in-95 flex flex-col shadow-2xl duration-150'
            : 'relative mb-8'
        }`}
        style={
          isFullscreen
            ? {
                position: 'fixed',
                top: '2rem',
                bottom: '2rem',
                left: '2rem',
                right: '2rem',
                zIndex: 50,
              }
            : undefined
        }
      >
        {/* Header bar */}
        <div className="border-border bg-muted/20 flex shrink-0 flex-col justify-between gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:px-5">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground text-sm font-semibold tracking-tight">{title}</h3>
              {isFullscreen && (
                <span className="bg-primary/10 text-primary shrink-0 rounded px-2 py-0.5 text-xs font-medium">
                  Focused View
                </span>
              )}
            </div>
            {description && <p className="text-muted-foreground text-xs">{description}</p>}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-1.5 text-xs sm:justify-end">
            {/* Preview / Code tabs */}
            <div className="border-border bg-background/80 flex items-center rounded-lg border p-0.5 shadow-xs">
              <button
                type="button"
                className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-muted text-foreground border-border/80 border font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground border border-transparent'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                <Eye className="size-3.5" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
                  activeTab === 'code'
                    ? 'bg-muted text-foreground border-border/80 border font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground border border-transparent'
                }`}
                onClick={() => setActiveTab('code')}
              >
                <Code2 className="size-3.5" />
                <span>Code</span>
              </button>
            </div>

            {/* One-click copy source */}
            {sourceCode && (
              <button
                type="button"
                title={copied ? 'Copied!' : 'Copy source code'}
                className="border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted flex size-7 cursor-pointer items-center justify-center rounded-md border shadow-xs transition"
                onClick={copyCode}
              >
                {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              </button>
            )}

            {/* Fullscreen / focus view */}
            <button
              type="button"
              title={isFullscreen ? 'Exit focus (Esc)' : 'Focus story'}
              className="border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted flex size-7 cursor-pointer items-center justify-center rounded-md border shadow-xs transition"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
          </div>
        </div>

        {/* Story Canvas / Preview Content */}
        <div
          className={`relative overflow-x-auto p-4 sm:p-8 ${
            isFullscreen ? 'flex-1 overflow-y-auto' : ''
          } ${activeTab === 'preview' ? 'block' : 'hidden'}`}
        >
          {children}
        </div>

        {/* Story Source Code View */}
        <div
          className={`bg-muted/40 relative p-4 sm:p-5 ${
            isFullscreen ? 'flex-1 overflow-y-auto' : ''
          } ${activeTab === 'code' ? 'block' : 'hidden'}`}
        >
          {sourceCode ? (
            <div className="relative">
              <pre className="code-block border-border bg-card text-foreground overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-relaxed">
                <code>{sourceCode}</code>
              </pre>
            </div>
          ) : (
            <div className="text-muted-foreground py-12 text-center font-mono text-xs">
              Source code available in inspector tab below.
            </div>
          )}
        </div>
      </section>
    </>
  )

  if (isFullscreen && typeof document !== 'undefined') {
    return createPortal(storyContent, document.body)
  }

  return storyContent
}
