'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TagsInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled list of tags. */
  value?: string[]
  /** Fires with the next list whenever a tag is added or removed. */
  onValueChange?: (value: string[]) => void
  /** Uncontrolled initial list. */
  defaultValue?: string[]
  placeholder?: string
  disabled?: boolean
  /** Characters that commit the typed value into a tag. Defaults to Enter + comma. */
  addOnKeys?: string[]
  /** Split pasted text on whitespace and add each token as a tag. */
  addOnPaste?: boolean
  /** Character that commits the typed value into a tag (alias for addOnKeys). */
  delimiter?: string
  /** Reject duplicate tags (case-sensitive). Defaults to true. */
  unique?: boolean
  /** Maximum number of tags allowed. */
  max?: number
}

const TagsInput = React.forwardRef<HTMLDivElement, TagsInputProps>(
  (
    {
      className,
      value,
      onValueChange,
      defaultValue,
      placeholder,
      disabled,
      addOnKeys,
      addOnPaste = false,
      delimiter,
      unique = true,
      max,
      ...props
    },
    ref,
  ) => {
    const commitKeys = addOnKeys ?? (delimiter ? [delimiter] : ['Enter', ','])
    const isControlled = value !== undefined
    const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
    const tags = isControlled ? (value as string[]) : internal
    const [draft, setDraft] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const atMax = max !== undefined && tags.length >= max

    function commit(next: string[]) {
      const capped = max !== undefined ? next.slice(0, max) : next
      if (!isControlled) setInternal(capped)
      onValueChange?.(capped)
    }

    function addTag(raw: string) {
      const trimmed = raw.trim()
      if (!trimmed) return
      if (atMax) {
        setDraft('')
        return
      }
      if (unique && tags.includes(trimmed)) {
        setDraft('')
        return
      }
      commit([...tags, trimmed])
      setDraft('')
    }

    function removeAt(index: number) {
      commit(tags.filter((_, i) => i !== index))
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (commitKeys.includes(e.key)) {
        e.preventDefault()
        addTag(draft)
      } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
        removeAt(tags.length - 1)
      }
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
      if (!addOnPaste) return
      const text = e.clipboardData.getData('text')
      if (!text.trim()) return
      e.preventDefault()
      const tokens = text
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean)
      let next = [...tags]
      for (const token of tokens) {
        if (max !== undefined && next.length >= max) break
        if (unique && next.includes(token)) continue
        next = [...next, token]
      }
      commit(next)
      setDraft('')
    }

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="tags-input"
        className={cn(
          'border-input bg-background flex flex-wrap items-center gap-2 rounded-md border px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        onClick={() => {
          if (!disabled) inputRef.current?.focus()
        }}
        {...props}
      >
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            data-uipkge=""
            data-slot="tags-input-item"
            className="bg-secondary data-[state=active]:ring-ring ring-offset-background flex h-5 items-center rounded-md data-[state=active]:ring-2 data-[state=active]:ring-offset-2"
          >
            <span data-slot="tags-input-item-text" className="rounded bg-transparent px-2 py-0.5 text-sm">
              {tag}
            </span>
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              disabled={disabled}
              data-slot="tags-input-item-delete"
              className="hover:text-foreground focus-visible:ring-ring mr-1 flex rounded bg-transparent focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation()
                removeAt(i)
              }}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </span>
        ))}

        {!disabled && (
          <input
            ref={inputRef}
            data-slot="tags-input-input"
            value={draft}
            placeholder={atMax ? undefined : placeholder}
            disabled={atMax}
            className="min-h-5 flex-1 bg-transparent px-1 text-sm focus:outline-none disabled:cursor-default"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={() => addTag(draft)}
          />
        )}
      </div>
    )
  },
)
TagsInput.displayName = 'TagsInput'

export { TagsInput }
