<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'
import { codeToTokens, type BundledLanguage, type ThemedToken } from 'shiki/bundle/web'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Props {
  /** Source code to display. */
  code: string
  /** Language label shown in the header. */
  language?: string
  /** Render line numbers in the gutter. */
  showLineNumbers?: boolean
  /** Maximum height of the code body before scrolling kicks in. CSS length (e.g. '400px'). */
  maxHeight?: string
  /** Render expanded on first paint. Default true. */
  defaultExpanded?: boolean
  /** Show the language label / copy / collapse header. */
  showHeader?: boolean
  class?: HTMLAttributes['class']
}

interface HighlightSegment {
  content: string
  style?: ThemedToken['htmlStyle']
}

const props = withDefaults(defineProps<Props>(), {
  language: 'vue',
  showLineNumbers: true,
  maxHeight: '400px',
  defaultExpanded: true,
  showHeader: true,
})

const isExpanded = ref(props.defaultExpanded)
const copyStatus = ref<'idle' | 'copied' | 'error'>('idle')
const highlightedSegments = ref<HighlightSegment[] | null>(null)
let copyResetTimer: ReturnType<typeof setTimeout> | undefined
let highlightRequest = 0

const bodyId = `code-block-${useId()}`
const lines = computed(() => props.code.split('\n'))
const bodyVisible = computed(() => !props.showHeader || isExpanded.value)
const copyLabel = computed(() => {
  if (copyStatus.value === 'copied') return 'Copied'
  if (copyStatus.value === 'error') return 'Copy failed'
  return 'Copy'
})

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

watch(
  () => [props.code, props.language] as const,
  async ([code, language]) => {
    const request = ++highlightRequest
    highlightedSegments.value = null

    try {
      const { tokens } = await codeToTokens(code, {
        lang: language.toLowerCase() as BundledLanguage,
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
      })
      if (request === highlightRequest) highlightedSegments.value = toHighlightSegments(tokens, code)
    } catch {
      if (request === highlightRequest) highlightedSegments.value = null
    }
  },
  { immediate: true },
)

function scheduleCopyStatusReset() {
  clearTimeout(copyResetTimer)
  copyResetTimer = setTimeout(() => (copyStatus.value = 'idle'), 1600)
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.code)
    copyStatus.value = 'copied'
  } catch (e) {
    copyStatus.value = 'error'
    console.warn('Clipboard write failed', e)
  } finally {
    scheduleCopyStatusReset()
  }
}

onBeforeUnmount(() => {
  highlightRequest++
  clearTimeout(copyResetTimer)
})
</script>

<template>
  <div
    data-uipkge
    data-slot="code-block"
    :class="cn('group border-border bg-muted/20 relative overflow-hidden rounded-lg border', props.class)"
  >
    <!-- Header -->
    <div v-if="showHeader" class="border-border bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-2">
      <span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {{ language }}
      </span>
      <div class="flex items-center gap-1">
        <Button variant="ghost" size="xs" class="h-7 gap-1.5 px-2" @click="copyToClipboard">
          <Check v-if="copyStatus === 'copied'" class="text-success size-3" aria-hidden="true" />
          <Copy v-else class="size-3" aria-hidden="true" />
          <span
            :class="cn('text-xs', copyStatus === 'error' && 'text-destructive')"
            aria-live="polite"
            aria-atomic="true"
          >
            {{ copyLabel }}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="xs"
          class="h-7 gap-1.5 px-2"
          :aria-expanded="isExpanded"
          :aria-controls="bodyId"
          @click="isExpanded = !isExpanded"
        >
          <ChevronUp v-if="isExpanded" class="size-3" aria-hidden="true" />
          <ChevronDown v-else class="size-3" aria-hidden="true" />
          <span class="text-xs">{{ isExpanded ? 'Hide' : 'Show' }} code</span>
        </Button>
      </div>
    </div>

    <!-- Code body. Shiki token offsets let the highlighted spans preserve the
         original source exactly, including whitespace between tokens. -->
    <div
      v-show="bodyVisible"
      :id="bodyId"
      role="region"
      :aria-label="`${language} code sample`"
      tabindex="0"
      class="bg-background/40 focus-visible:ring-ring overflow-auto font-mono text-sm leading-relaxed focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
      :style="{ maxHeight: props.maxHeight }"
    >
      <div class="flex w-max min-w-full">
        <div
          v-if="showLineNumbers"
          aria-hidden="true"
          class="text-muted-foreground/60 border-border/60 bg-muted/30 sticky left-0 border-r px-3 py-3 text-right tabular-nums select-none"
        >
          <span v-for="(_, i) in lines" :key="i" class="block">{{ i + 1 }}</span>
        </div>
        <pre class="m-0 min-w-max flex-1"><code class="block cursor-text whitespace-pre px-4 py-3"><template
              v-if="highlightedSegments"
            ><span
                v-for="(segment, i) in highlightedSegments"
                :key="i"
                data-syntax-token
                class="text-[var(--shiki-light)] dark:text-[var(--shiki-dark)]"
                :style="segment.style"
              >{{ segment.content }}</span></template><template v-else>{{ code }}</template></code></pre>
      </div>
    </div>
  </div>
</template>
