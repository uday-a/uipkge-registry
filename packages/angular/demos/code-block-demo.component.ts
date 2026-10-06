import { Component, Input } from '@angular/core'
import { UiCodeBlockComponent } from '../../../../../packages/registry-angular/components/code-block/code-block.component'

const vueSnippet = `<template>
  <Button variant="primary">Click me</Button>
</template>

<script setup>
import { Button } from '@/components/ui/button'
</script>`

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

@Component({
  selector: 'angular-code-block-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiCodeBlockComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-code-block [code]="vueSnippet" language="vue" />
      }
      @case ('Without line numbers') {
        <ui-code-block [code]="vueSnippet" language="vue" [showLineNumbers]="false" />
      }
      @case ('Shell / bash') {
        <ui-code-block [code]="bashSnippet" language="bash" [showLineNumbers]="false" />
      }
      @case ('TypeScript') {
        <ui-code-block [code]="tsSnippet" language="ts" />
      }
      @case ('Longer snippet') {
        <ui-code-block [code]="longSnippet" language="ts" />
      }
    }
  `,
})
export class AngularCodeBlockDemoComponent {
  @Input() story = 'Default'

  readonly vueSnippet = vueSnippet
  readonly bashSnippet = bashSnippet
  readonly tsSnippet = tsSnippet
  readonly longSnippet = longSnippet
}
