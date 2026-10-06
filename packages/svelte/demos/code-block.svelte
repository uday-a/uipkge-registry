<script lang="ts">
  import { CodeBlock } from '@svelte-registry/code-block'

  let { story }: { story: string } = $props()

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

{#if story === 'Default'}
  <CodeBlock code={vueSnippet} language="vue" />
{/if}

{#if story === 'Without line numbers'}
  <CodeBlock code={vueSnippet} language="vue" showLineNumbers={false} />
{/if}

{#if story === 'Shell / bash'}
  <CodeBlock code={bashSnippet} language="bash" showLineNumbers={false} />
{/if}

{#if story === 'TypeScript'}
  <CodeBlock code={tsSnippet} language="ts" />
{/if}

{#if story === 'Longer snippet'}
  <CodeBlock code={longSnippet} language="ts" />
{/if}
