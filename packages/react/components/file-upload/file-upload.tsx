'use client'

import * as React from 'react'
import { FileIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FileUploadProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'value' | 'defaultValue' | 'content'
> {
  accept?: string
  multiple?: boolean
  disabled?: boolean
  /** Controlled file list. */
  value?: File[]
  /** Uncontrolled initial file list. */
  defaultValue?: File[]
  onValueChange?: (files: File[]) => void
  /** Custom dropzone icon. */
  icon?: React.ReactNode
  /** Custom dropzone label content (replaces the default click/drag copy). */
  children?: React.ReactNode
  /** Rendered below the dropzone (e.g. the file list). */
  content?: React.ReactNode
  className?: string
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    { className, accept, multiple, disabled, value, defaultValue, onValueChange, icon, children, content, ...props },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      },
      [ref],
    )

    const isControlled = value !== undefined
    const [internal, setInternal] = React.useState<File[]>(defaultValue ?? [])

    const [isDragging, setIsDragging] = React.useState(false)

    function emit(files: File[]) {
      if (!isControlled) setInternal(files)
      onValueChange?.(files)
    }

    function handleFiles(files: FileList | null) {
      if (disabled || !files) return
      const fileArray = Array.from(files)
      const first = fileArray[0]
      emit(multiple ? fileArray : first ? [first] : [])
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      handleFiles(e.target.files)
    }

    function handleDrop(e: React.DragEvent) {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      handleFiles(e.dataTransfer?.files ?? null)
    }

    function handleDragOver(e: React.DragEvent) {
      if (disabled) return
      e.preventDefault()
      setIsDragging(true)
    }

    function handleDragLeave() {
      setIsDragging(false)
    }

    function openFilePicker() {
      if (disabled) return
      innerRef.current?.click()
    }

    function onDropzoneKeyDown(e: React.KeyboardEvent) {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openFilePicker()
      }
    }

    return (
      <div className={cn('space-y-3', className)} {...props}>
        <input
          ref={setRefs}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          onChange={handleInputChange}
        />

        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-label={multiple ? 'Upload files' : 'Upload file'}
          className={cn(
            'border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/50 focus-visible:ring-ring flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none',
            isDragging && 'border-primary bg-primary/5',
            disabled && 'pointer-events-none opacity-50',
          )}
          onClick={openFilePicker}
          onKeyDown={onDropzoneKeyDown}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {icon ?? (
            <svg
              className="text-muted-foreground mb-2 size-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          )}
          {children ?? (
            <>
              <p className="text-muted-foreground text-sm">
                <span className="text-foreground font-semibold">Click to upload</span> or drag and drop
              </p>
              {accept && <p className="text-muted-foreground/70 mt-1 text-xs">{accept}</p>}
            </>
          )}
        </div>

        {content}
      </div>
    )
  },
)
FileUpload.displayName = 'FileUpload'

export interface FileUploadTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const FileUploadTrigger = React.forwardRef<HTMLDivElement, FileUploadTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('cursor-pointer', className)} {...props}>
      {children}
    </div>
  ),
)
FileUploadTrigger.displayName = 'FileUploadTrigger'

export interface FileUploadContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const FileUploadContent = React.forwardRef<HTMLDivElement, FileUploadContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  ),
)
FileUploadContent.displayName = 'FileUploadContent'

export interface FileUploadItemProps extends React.HTMLAttributes<HTMLDivElement> {
  file: File
  onRemove?: () => void
  className?: string
}

const FileUploadItem = React.forwardRef<HTMLDivElement, FileUploadItemProps>(
  ({ className, file, onRemove, children, ...props }, ref) => (
    <div ref={ref} className={cn('bg-muted/50 flex items-center gap-3 rounded-md border p-3', className)} {...props}>
      {children ?? (
        <>
          <FileIcon className="text-muted-foreground size-8 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto rounded-sm transition-colors duration-200 focus-visible:ring-1 focus-visible:outline-none"
            onClick={onRemove}
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Remove file</span>
          </button>
        </>
      )}
    </div>
  ),
)
FileUploadItem.displayName = 'FileUploadItem'

export interface FileUploadItemNameProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

const FileUploadItemName = React.forwardRef<HTMLParagraphElement, FileUploadItemNameProps>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('truncate text-sm font-medium', className)} {...props}>
      {children}
    </p>
  ),
)
FileUploadItemName.displayName = 'FileUploadItemName'

export interface FileUploadItemSizeProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
}

const FileUploadItemSize = React.forwardRef<HTMLSpanElement, FileUploadItemSizeProps>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('text-muted-foreground text-xs', className)} {...props}>
      {children}
    </span>
  ),
)
FileUploadItemSize.displayName = 'FileUploadItemSize'

export { FileUpload, FileUploadTrigger, FileUploadContent, FileUploadItem, FileUploadItemName, FileUploadItemSize }
