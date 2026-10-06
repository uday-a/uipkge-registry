<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FileUploadProps extends HTMLAttributes<HTMLDivElement> {
    accept?: string
    multiple?: boolean
    disabled?: boolean
    /** Primary file list API (React `value` parity). Bindable — wins over `files` when both are set. */
    value?: File[]
    /** Uncontrolled initial file list (React parity). */
    defaultValue?: File[]
    /** Selected files. Bindable — the Svelte counterpart of Vue's `v-model`.
     * @deprecated Use `value`. Kept as an alias — both stay functional and in sync. */
    files?: File[]
    /** Overrides the default upload icon in the dropzone. */
    icon?: Snippet
    /** Rendered below the dropzone — typically a `FileUploadContent` file list. */
    content?: Snippet
    ref?: HTMLDivElement | null
    onValueChange?: (files: File[]) => void
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    accept,
    multiple = false,
    disabled = false,
    value = $bindable<File[]>(),
    defaultValue,
    files = $bindable<File[]>(),
    icon,
    content,
    children,
    ref = $bindable(null),
    onValueChange,
    ...restProps
  }: FileUploadProps = $props()

  let inputRef = $state<HTMLInputElement | null>(null)
  let isDragging = $state(false)

  // Seed initial value so bound consumers never see undefined on mount.
  // svelte-ignore state_referenced_locally
  const initial = defaultValue ?? value ?? files ?? []
  if (value === undefined) value = initial
  if (files === undefined) files = initial

  let inner = $state<File[]>(initial)

  // Dual-bindable sync (`value` primary, `files` deprecated alias): last writer
  // wins, with `value` winning when both change in the same tick.
  // svelte-ignore state_referenced_locally
  let prevValue = value
  // svelte-ignore state_referenced_locally
  let prevFiles = files

  $effect(() => {
    const v = value
    const f = files
    const vChanged = v !== prevValue
    const fChanged = f !== prevFiles
    if (vChanged && v !== undefined) {
      prevValue = v
      inner = v
      if (f !== v) {
        files = v
        prevFiles = v
      }
    } else if (fChanged && f !== undefined) {
      prevFiles = f
      inner = f
      if (v !== f) {
        value = f
        prevValue = f
      }
    } else {
      if (vChanged) prevValue = v
      if (fChanged) prevFiles = f
    }
  })

  function commit(next: File[]) {
    inner = next
    prevValue = next
    prevFiles = next
    value = next
    files = next
    onValueChange?.(next)
  }

  function handleFiles(list: FileList | null) {
    if (disabled || !list) return
    const fileArray = Array.from(list)
    const first = fileArray[0]
    commit(multiple ? fileArray : first ? [first] : [])
  }

  function handleInputChange(e: Event) {
    handleFiles((e.target as HTMLInputElement).files)
  }

  function handleDrop(e: DragEvent) {
    isDragging = false
    if (disabled) return
    handleFiles(e.dataTransfer?.files ?? null)
  }

  function handleDragOver(e: DragEvent) {
    if (disabled) return
    e.preventDefault()
    isDragging = true
  }

  function handleDragLeave() {
    isDragging = false
  }

  function openFilePicker() {
    if (disabled) return
    inputRef?.click()
  }

  function onDropzoneKeydown(e: KeyboardEvent) {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openFilePicker()
    }
  }
</script>

<div bind:this={ref} class={cn('space-y-3', className)} data-uipkge data-slot="file-upload" {...restProps}>
  <input
    bind:this={inputRef}
    type="file"
    {accept}
    {multiple}
    {disabled}
    class="sr-only"
    tabindex="-1"
    onchange={handleInputChange}
  />

  <div
    role="button"
    tabindex={disabled ? -1 : 0}
    aria-disabled={disabled || undefined}
    aria-label={multiple ? 'Upload files' : 'Upload file'}
    class={cn(
      'border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/50 focus-visible:ring-ring flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none',
      isDragging && 'border-primary bg-primary/5',
      disabled && 'pointer-events-none opacity-50',
    )}
    onclick={openFilePicker}
    onkeydown={onDropzoneKeydown}
    ondrop={(e) => {
      e.preventDefault()
      handleDrop(e)
    }}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
  >
    {#if icon}
      {@render icon()}
    {:else}
      <svg
        class="text-muted-foreground mb-2 size-10"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
    {/if}
    {#if children}
      {@render children()}
    {:else}
      <p class="text-muted-foreground text-sm">
        <span class="text-foreground font-semibold">Click to upload</span> or drag and drop
      </p>
      {#if accept}
        <p class="text-muted-foreground/70 mt-1 text-xs">{accept}</p>
      {/if}
    {/if}
  </div>

  {@render content?.()}
</div>
