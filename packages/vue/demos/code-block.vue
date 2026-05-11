<script setup lang="ts">
import { CodeBlock } from '@/components/ui/code-block'
const vueSnippet = `<template>
  <Button variant="primary">Click me</Button>
</template>

<script setup>
import { Button } from '@/components/ui/button'
<\/script>`

const bashSnippet = `# Install one component
npx shadcn-vue@latest add @uipkge/button -y

# Or install a block
npx shadcn-vue@latest add @uipkge/inbox -y`

const tsSnippet = `interface User {
  id: string
  name: string
  role: 'admin' | 'member' | 'guest'
}

export function isAdmin(u: User): boolean {
  return u.role === 'admin'
}`

const longSnippet = `// A longer file — line numbers really pay off here.
import { computed, onMounted, onUnmounted, ref } from 'vue'

export function useActiveTab(tabs: readonly string[]) {
  const fallback = tabs[0]!
  const active = ref<string>(fallback)

  const syncFromHash = () => {
    const fromHash = window.location.hash.replace(/^#/, '')
    if (tabs.includes(fromHash as any)) {
      active.value = fromHash
    }
  }

  onMounted(() => {
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
  })
  onUnmounted(() => {
    window.removeEventListener('hashchange', syncFromHash)
  })

  const setActive = (next: string) => {
    if (!tabs.includes(next as any)) return
    active.value = next
    window.location.hash = next
  }

  return { active: computed(() => active.value), setActive }
}`
</script>

<template>
  <Story
    title="Default"
    description="Code block with a short Vue snippet and default settings. Line numbers and Copy button are on."
  >
    <CodeBlock :code="vueSnippet" language="vue" />
  </Story>

  <Story
    title="Without line numbers"
    description="Drop line numbers for short snippets or when the block is embedded in prose."
  >
    <CodeBlock :code="vueSnippet" language="vue" :show-line-numbers="false" />
  </Story>

  <Story
    title="Shell / bash"
    description="Set language='bash' (or 'shell') to render command snippets. Copy button stays the same regardless of language."
  >
    <CodeBlock :code="bashSnippet" language="bash" :show-line-numbers="false" />
  </Story>

  <Story
    title="TypeScript"
    description="Same renderer, different language label. Pair with a filename heading or surrounding doc when you need more context."
  >
    <CodeBlock :code="tsSnippet" language="ts" />
  </Story>

  <Story
    title="Longer snippet"
    description="Line numbers earn their keep at 15+ line snippets — readers can reference 'line 9' in code review or docs without ambiguity."
  >
    <CodeBlock :code="longSnippet" language="ts" />
  </Story>
</template>
