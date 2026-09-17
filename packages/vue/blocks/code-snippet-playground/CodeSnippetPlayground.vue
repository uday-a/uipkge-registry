<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
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

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

// --- Multi-file Definitions ---
const files: CodeFile[] = [
  {
    id: 'button-vue',
    name: 'Button.vue',
    path: 'packages/registry-vue/components/button/Button.vue',
    language: 'vue',
    size: '1.2 KB',
    content: `<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants } from './button.variants'

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type Size = 'default' | 'sm' | 'lg' | 'xs' | 'icon'

interface Props {
  as?: string
  asChild?: boolean
  variant?: Variant
  size?: Size
  type?: 'button' | 'submit' | 'reset'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  type: 'button',
})
<\/script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :type="as === 'button' && !asChild ? type : undefined"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>`,
  },
  {
    id: 'button-variants',
    name: 'button.variants.ts',
    path: 'packages/registry-vue/components/button/button.variants.ts',
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
    path: 'packages/registry-vue/components/button/index.ts',
    language: 'typescript',
    size: '240 B',
    content: `export { default as Button } from './Button.vue'
export { buttonVariants, type ButtonVariants } from './button.variants'`,
  },
  {
    id: 'button-test',
    name: 'button.test.ts',
    path: 'packages/registry-vue/components/button/__tests__/button.spec.ts',
    language: 'typescript',
    size: '1.6 KB',
    content: `import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button Primitive', () => {
  it('renders default button with slot text', () => {
    const wrapper = mount(Button, { slots: { default: 'Submit' } })
    expect(wrapper.text()).toBe('Submit')
    expect(wrapper.attributes('data-slot')).toBe('button')
  })

  it('applies variant classes correctly', () => {
    const wrapper = mount(Button, { props: { variant: 'destructive' } })
    expect(wrapper.attributes('data-variant')).toBe('destructive')
    expect(wrapper.classes()).toContain('bg-destructive')
  })

  it('applies size styles correctly', () => {
    const wrapper = mount(Button, { props: { size: 'sm' } })
    expect(wrapper.attributes('data-size')).toBe('sm')
    expect(wrapper.classes()).toContain('h-8')
  })

  it('handles click events when active', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('respects disabled state attribute', () => {
    const wrapper = mount(Button, { attrs: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('forwards custom class names with cn()', () => {
    const wrapper = mount(Button, { props: { class: 'custom-btn' } })
    expect(wrapper.classes()).toContain('custom-btn')
  })
})`,
  },
]

const testLogs: TestLog[] = [
  { id: '1', name: 'renders default button with slot text', duration: '4ms', status: 'pass' },
  { id: '2', name: 'applies variant classes correctly', duration: '7ms', status: 'pass' },
  { id: '3', name: 'applies size styles correctly', duration: '5ms', status: 'pass' },
  { id: '4', name: 'handles click events when active', duration: '8ms', status: 'pass' },
  { id: '5', name: 'respects disabled state attribute', duration: '6ms', status: 'pass' },
  { id: '6', name: 'forwards custom class names with cn()', duration: '12ms', status: 'pass' },
]

// --- State ---
const activeFileId = ref('button-vue')
const activeRightTab = ref<'preview' | 'console'>('preview')
const hoveredLine = ref<number | null>(null)
const isCopied = ref(false)
const isSnippetCopied = ref(false)
const isRunning = ref(false)
const lastRunTime = ref('14:32:08')
const executionCount = ref(1)

// Interactive Preview Sandbox State
type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

const selectedVariant = ref<ButtonVariant>('default')
const selectedSize = ref<ButtonSize>('default')
const isDisabled = ref(false)
const isLoading = ref(false)
const withIcon = ref(true)
const clickCount = ref(0)
const lastInteraction = ref('Ready for test interactions')

// --- Computed ---
const activeFile = computed(() => {
  return files.find((f) => f.id === activeFileId.value) || files[0]
})

const activeFileLines = computed(() => {
  return activeFile.value.content.split('\n')
})

const generatedSnippet = computed(() => {
  const v = selectedVariant.value !== 'default' ? ` variant="${selectedVariant.value}"` : ''
  const s = selectedSize.value !== 'default' ? ` size="${selectedSize.value}"` : ''
  const d = isDisabled.value ? ' disabled' : ''

  if (selectedSize.value === 'icon') {
    return `<Button${v}${s}${d}>\n  <Sparkles class="size-4" />\n</Button>`
  }

  if (isLoading.value) {
    return `<Button${v}${s}${d}>\n  <Loader2 class="size-4 animate-spin" />\n  Please wait\n</Button>`
  }

  if (withIcon.value) {
    return `<Button${v}${s}${d}>\n  <Sparkles class="size-4" />\n  Interactive Button\n</Button>`
  }

  return `<Button${v}${s}${d}>Interactive Button</Button>`
})

// --- Syntax Highlighting Engine ---
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

// --- Action Handlers ---
function handleRunCode() {
  if (isRunning.value) return
  isRunning.value = true
  activeRightTab.value = 'console'

  setTimeout(() => {
    isRunning.value = false
    executionCount.value++
    const now = new Date()
    lastRunTime.value = now.toTimeString().split(' ')[0]
  }, 480)
}

function handleCopyFile() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(activeFile.value.content)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }
}

function handleCopySnippet() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(generatedSnippet.value)
    isSnippetCopied.value = true
    setTimeout(() => {
      isSnippetCopied.value = false
    }, 2000)
  }
}

function handleResetPlayground() {
  activeFileId.value = 'button-vue'
  selectedVariant.value = 'default'
  selectedSize.value = 'default'
  isDisabled.value = false
  isLoading.value = false
  withIcon.value = true
  clickCount.value = 0
  lastInteraction.value = 'Playground reset to initial state'
}

function handleButtonClick() {
  if (isDisabled.value || isLoading.value) return
  clickCount.value++
  lastInteraction.value = `Dispatched onClick event #${clickCount.value} at ${new Date().toLocaleTimeString()}`
}

function handleKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    handleRunCode()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<template>
  <Card
    :class="cn('border-border bg-card w-full overflow-hidden shadow-xs', props.class)"
    data-slot="code-snippet-playground"
  >
    <!-- Top Toolbar -->
    <CardHeader
      class="border-border bg-muted/20 flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-3">
        <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
          <Code2 class="size-4.5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <CardTitle class="text-base font-semibold tracking-tight">Button.vue · Reka UI Primitive</CardTitle>
            <Badge variant="outline" class="text-muted-foreground font-mono text-xs"> Vue 3.5 </Badge>
            <Badge variant="secondary" class="font-mono text-xs"> TypeScript 5.6 </Badge>
          </div>
          <CardDescription class="text-muted-foreground text-xs">
            Multi-file component studio with live preview, syntax engine, and Vitest suite
          </CardDescription>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="border-border/80 bg-background/80 flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
          <span
            :class="
              cn('size-2 rounded-full transition-colors', isRunning ? 'animate-pulse bg-amber-500' : 'bg-emerald-500')
            "
          />
          <span class="text-muted-foreground font-mono">
            {{ isRunning ? 'Running suite...' : '6 tests passing' }}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          class="h-8 gap-1.5 text-xs shadow-none"
          title="Reset Playground"
          @click="handleResetPlayground"
        >
          <RotateCcw class="size-3.5" />
          <span class="hidden sm:inline">Reset</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          class="h-8 gap-1.5 text-xs shadow-none"
          title="Copy active file contents"
          @click="handleCopyFile"
        >
          <Check v-if="isCopied" class="size-3.5 text-emerald-500" />
          <Copy v-else class="size-3.5" />
          <span>{{ isCopied ? 'Copied!' : 'Copy File' }}</span>
        </Button>

        <Button size="sm" class="h-8 gap-1.5 text-xs font-medium" :disabled="isRunning" @click="handleRunCode">
          <Loader2 v-if="isRunning" class="size-3.5 animate-spin" />
          <Play v-else class="size-3.5 fill-current" />
          <span>Run Code</span>
          <kbd
            class="border-primary-foreground/30 bg-primary-foreground/10 hidden rounded border px-1 font-mono text-xs sm:inline"
          >
            ⌘↵
          </kbd>
        </Button>
      </div>
    </CardHeader>

    <!-- Main 2-Column Studio Grid -->
    <div class="divide-border grid grid-cols-1 divide-y lg:grid-cols-12 lg:divide-x lg:divide-y-0">
      <!-- Left Column: File Tabs & Dark Code Editor (60-65% width = 7/12 cols) -->
      <section class="flex min-h-[560px] flex-col bg-zinc-950 text-zinc-100 lg:col-span-7">
        <!-- File Navigation Tabs -->
        <div class="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/70 px-2">
          <div class="flex scrollbar-none items-center gap-1 overflow-x-auto py-1.5">
            <button
              v-for="file in files"
              :key="file.id"
              type="button"
              :class="
                cn(
                  'group flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs transition-colors',
                  activeFileId === file.id
                    ? 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xs'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200',
                )
              "
              @click="activeFileId = file.id"
            >
              <FileCode
                v-if="file.name.endsWith('.vue')"
                :class="
                  cn('size-3.5 transition-colors', activeFileId === file.id ? 'text-emerald-400' : 'text-zinc-500')
                "
              />
              <Braces
                v-else-if="file.name.endsWith('.variants.ts')"
                :class="
                  cn('size-3.5 transition-colors', activeFileId === file.id ? 'text-purple-400' : 'text-zinc-500')
                "
              />
              <Layers
                v-else-if="file.name === 'index.ts'"
                :class="cn('size-3.5 transition-colors', activeFileId === file.id ? 'text-amber-400' : 'text-zinc-500')"
              />
              <CheckCircle2
                v-else
                :class="cn('size-3.5 transition-colors', activeFileId === file.id ? 'text-sky-400' : 'text-zinc-500')"
              />
              <span>{{ file.name }}</span>
            </button>
          </div>

          <span class="hidden font-mono text-xs text-zinc-500 xl:inline">
            {{ activeFile.size }}
          </span>
        </div>

        <!-- Breadcrumb / Path Info -->
        <div
          class="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/80 px-4 py-1.5 font-mono text-xs text-zinc-400"
        >
          <div class="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <span class="text-zinc-600">src /</span>
            <span>{{ activeFile.path }}</span>
          </div>
          <span class="text-zinc-500">{{ activeFileLines.length }} lines</span>
        </div>

        <!-- Code Editor Body -->
        <div
          class="relative flex flex-1 overflow-x-auto bg-zinc-950 py-3 font-mono text-xs leading-relaxed select-text"
        >
          <!-- Gutter Line Numbers -->
          <div class="flex flex-col border-r border-zinc-800/60 px-3 text-right text-zinc-600 select-none">
            <span
              v-for="(_, index) in activeFileLines"
              :key="index"
              :class="
                cn('h-5 leading-5 transition-colors', hoveredLine === index + 1 ? 'font-semibold text-zinc-300' : '')
              "
            >
              {{ index + 1 }}
            </span>
          </div>

          <!-- Code Lines with Syntax Coloring -->
          <div class="flex-1 px-4 whitespace-pre">
            <div
              v-for="(line, index) in activeFileLines"
              :key="index"
              :class="
                cn(
                  'group flex h-5 items-center rounded-xs px-1 leading-5 transition-colors',
                  hoveredLine === index + 1 ? 'bg-zinc-800/40' : '',
                )
              "
              @mouseenter="hoveredLine = index + 1"
              @mouseleave="hoveredLine = null"
            >
              <span v-html="highlightSyntaxLine(line)" />
            </div>
          </div>
        </div>

        <!-- Editor Status Bar -->
        <div
          class="flex items-center justify-between border-t border-zinc-800/60 bg-zinc-900/90 px-3 py-1 font-mono text-xs text-zinc-400"
        >
          <div class="flex items-center gap-3">
            <span>UTF-8</span>
            <span>2 Spaces</span>
            <span class="text-zinc-500">Vue SFC / TS</span>
          </div>
          <div class="flex items-center gap-3">
            <span>Ln {{ hoveredLine ?? 1 }}, Col 1</span>
            <span class="text-emerald-400">Prettier ✓</span>
          </div>
        </div>
      </section>

      <!-- Right Column: Live Sandbox & Terminal Console (35-40% width = 5/12 cols) -->
      <section class="bg-background flex min-h-[560px] flex-col lg:col-span-5">
        <Tabs v-model="activeRightTab" class="flex h-full flex-col">
          <!-- Right Tab Header -->
          <div class="border-border bg-muted/30 border-b px-3 py-2">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="preview" class="gap-1.5 text-xs">
                <Sparkles class="size-3.5" />
                <span>Live Preview</span>
              </TabsTrigger>
              <TabsTrigger value="console" class="gap-1.5 text-xs">
                <Terminal class="size-3.5" />
                <span>Terminal</span>
                <Badge
                  variant="secondary"
                  class="ml-1 px-1 py-0 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                >
                  PASS
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <!-- TAB 1: Live Component Sandbox -->
          <TabsContent value="preview" class="m-0 flex flex-1 flex-col gap-4 p-4">
            <!-- Variant & Style Controls -->
            <div class="border-border bg-card space-y-3 rounded-lg border p-3 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="text-foreground text-xs font-semibold">Variant</span>
                <span class="text-muted-foreground font-mono text-xs">{{ selectedVariant }}</span>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="v in ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link']"
                  :key="v"
                  type="button"
                  :class="
                    cn(
                      'min-h-6 cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs capitalize transition-colors',
                      selectedVariant === v
                        ? 'bg-primary text-primary-foreground font-medium shadow-xs'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  "
                  @click="selectedVariant = v"
                >
                  {{ v }}
                </button>
              </div>

              <Separator class="my-2" />

              <div class="flex items-center justify-between">
                <span class="text-foreground text-xs font-semibold">Size & Options</span>
              </div>
              <div class="flex flex-wrap items-center gap-1.5">
                <button
                  v-for="s in ['sm', 'default', 'lg', 'icon'] as ButtonSize[]"
                  :key="s"
                  type="button"
                  :class="
                    cn(
                      'min-h-6 cursor-pointer rounded-md px-2 py-0.5 font-mono text-xs uppercase transition-colors',
                      selectedSize === s
                        ? 'bg-secondary text-secondary-foreground font-semibold'
                        : 'bg-muted/40 text-muted-foreground hover:bg-muted',
                    )
                  "
                  @click="selectedSize = s"
                >
                  {{ s }}
                </button>

                <div class="ml-auto flex items-center gap-2">
                  <label class="text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs select-none">
                    <input v-model="isDisabled" type="checkbox" class="accent-primary" />
                    <span>Disabled</span>
                  </label>
                  <label class="text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs select-none">
                    <input v-model="isLoading" type="checkbox" class="accent-primary" />
                    <span>Loading</span>
                  </label>
                  <label class="text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs select-none">
                    <input v-model="withIcon" type="checkbox" class="accent-primary" />
                    <span>Icon</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Render Stage Canvas -->
            <div
              class="border-border bg-muted/20 relative flex min-h-[160px] flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-6"
            >
              <div class="flex flex-col items-center gap-3">
                <Button
                  :variant="selectedVariant"
                  :size="selectedSize"
                  :disabled="isDisabled || isLoading"
                  class="transition-all active:scale-95"
                  @click="handleButtonClick"
                >
                  <Loader2 v-if="isLoading" class="size-4 animate-spin" />
                  <Sparkles v-else-if="withIcon || selectedSize === 'icon'" class="size-4" />
                  <span v-if="selectedSize !== 'icon'">Interactive Button</span>
                </Button>

                <p class="text-muted-foreground font-mono text-xs">
                  Clicks: <span class="text-foreground font-semibold">{{ clickCount }}</span>
                </p>
              </div>

              <!-- Last Interaction Status -->
              <div
                class="bg-background/80 text-muted-foreground absolute right-2 bottom-2 left-2 flex items-center justify-between rounded-md px-2 py-1 text-xs backdrop-blur-xs"
              >
                <span class="truncate font-mono">{{ lastInteraction }}</span>
                <span class="shrink-0 font-medium text-emerald-500">Rendered OK</span>
              </div>
            </div>

            <!-- Dynamic Snippet Output -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-foreground font-medium">Usage Code</span>
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground flex min-h-6 cursor-pointer items-center gap-1"
                  @click="handleCopySnippet"
                >
                  <Check v-if="isSnippetCopied" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                  <span>{{ isSnippetCopied ? 'Copied' : 'Copy' }}</span>
                </button>
              </div>
              <pre
                class="border-border bg-muted/40 text-foreground overflow-x-auto rounded-md border p-2.5 font-mono text-xs leading-relaxed"
              ><code>{{ generatedSnippet }}</code></pre>
            </div>
          </TabsContent>

          <!-- TAB 2: Terminal Console Execution Output -->
          <TabsContent value="console" class="m-0 flex flex-1 flex-col bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
            <!-- Console Toolbar -->
            <div class="mb-3 flex items-center justify-between border-b border-zinc-800 pb-2 text-zinc-400">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-zinc-200">Vitest Test Runner</span>
                <Badge variant="outline" class="border-zinc-700 bg-zinc-900 font-mono text-xs text-zinc-300">
                  v2.1.8
                </Badge>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-zinc-500">Run #{{ executionCount }} ({{ lastRunTime }})</span>
                <button
                  type="button"
                  class="cursor-pointer text-zinc-400 hover:text-zinc-100"
                  title="Re-run tests"
                  @click="handleRunCode"
                >
                  <RotateCcw class="size-3.5" />
                </button>
              </div>
            </div>

            <!-- Terminal Execution Logs -->
            <div class="flex-1 space-y-2 overflow-y-auto pr-1">
              <div class="text-zinc-500">
                $ vitest run packages/registry-vue/components/button/__tests__/button.spec.ts
              </div>

              <div class="flex items-center gap-2 font-semibold text-emerald-400">
                <CheckCircle2 class="size-3.5 shrink-0" />
                <span>PASS packages/registry-vue/components/button/__tests__/button.spec.ts (6 tests)</span>
                <span class="font-normal text-zinc-500">42ms</span>
              </div>

              <div class="ml-4 space-y-1.5 border-l border-zinc-800 pl-3">
                <div v-for="log in testLogs" :key="log.id" class="flex items-center justify-between text-zinc-300">
                  <div class="flex items-center gap-2">
                    <Check class="size-3 text-emerald-400" />
                    <span>{{ log.name }}</span>
                  </div>
                  <span class="text-zinc-500">{{ log.duration }}</span>
                </div>
              </div>

              <!-- Summary Card -->
              <div class="mt-4 space-y-1 rounded-md border border-zinc-800/80 bg-zinc-900/60 p-2.5 text-zinc-400">
                <div class="flex justify-between">
                  <span>Test Files</span>
                  <span class="font-medium text-emerald-400">1 passed (1)</span>
                </div>
                <div class="flex justify-between">
                  <span>Tests</span>
                  <span class="font-medium text-emerald-400">6 passed (6)</span>
                </div>
                <div class="flex justify-between">
                  <span>Start at</span>
                  <span class="text-zinc-300">{{ lastRunTime }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Duration</span>
                  <span class="text-zinc-300">42ms (transform 12ms, setup 0ms, collect 8ms, tests 42ms)</span>
                </div>
              </div>
            </div>

            <!-- Bottom Console Status Banner -->
            <div
              class="mt-3 flex items-center justify-between rounded-md border border-emerald-950/60 bg-emerald-950/20 px-3 py-2 text-emerald-400"
            >
              <div class="flex items-center gap-2 font-semibold">
                <CheckCircle2 class="size-4" />
                <span>PASS · 6 passed, 0 failed in 42ms</span>
              </div>
              <span class="text-xs text-emerald-500/80">Exit code: 0</span>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  </Card>
</template>
