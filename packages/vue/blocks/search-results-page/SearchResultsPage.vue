<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { BookOpen, FileText, GitBranch, MessageSquare, Search, Users, Video } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Chip } from '@/components/ui/chip'
import { Input } from '@/components/ui/input'

interface SearchResult {
  id: string
  icon: Component
  title: string
  path: string
  snippet: string
  type: string
  updated: string
}

interface FacetOption {
  id: string
  label: string
  count: number
}

interface FacetGroup {
  id: string
  label: string
  options: FacetOption[]
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const query = ref('onboarding flows')

const chips = ref([
  { id: 'type-docs', label: 'Type: Docs' },
  { id: 'team-product', label: 'Team: Product' },
])

function removeChip(id: string) {
  chips.value = chips.value.filter((chip) => chip.id !== id)
}

function clearAll() {
  chips.value = []
}

const facetGroups: FacetGroup[] = [
  {
    id: 'type',
    label: 'Type',
    options: [
      { id: 'type-docs', label: 'Docs', count: 18 },
      { id: 'type-guides', label: 'Guides', count: 11 },
      { id: 'type-video', label: 'Video', count: 7 },
      { id: 'type-discussion', label: 'Discussion', count: 6 },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    options: [
      { id: 'team-product', label: 'Product', count: 14 },
      { id: 'team-engineering', label: 'Engineering', count: 16 },
      { id: 'team-design', label: 'Design', count: 8 },
      { id: 'team-support', label: 'Support', count: 4 },
    ],
  },
]

const activeFacets = ref(new Set(['type-docs', 'team-product']))

function toggleFacet(id: string, checked: boolean) {
  const next = new Set(activeFacets.value)
  if (checked) next.add(id)
  else next.delete(id)
  activeFacets.value = next
}

const results: SearchResult[] = [
  {
    id: 'r1',
    icon: BookOpen,
    title: 'Onboarding flows: design your first-run experience',
    path: 'docs.acme.dev / guides / onboarding-flows',
    snippet:
      'Learn how to compose onboarding flows from checklists, tours, and progressive disclosure so new users reach their first aha moment faster.',
    type: 'Docs',
    updated: '2 days ago',
  },
  {
    id: 'r2',
    icon: FileText,
    title: 'Checklist API reference for onboarding flows',
    path: 'docs.acme.dev / api / checklist',
    snippet:
      'Full reference for the Checklist primitive used to drive onboarding flows, including step completion events, persistence, and theming.',
    type: 'Reference',
    updated: '5 hours ago',
  },
  {
    id: 'r3',
    icon: Video,
    title: 'Video walkthrough: building onboarding flows in 20 minutes',
    path: 'learn.acme.dev / videos / onboarding-flows-walkthrough',
    snippet:
      'A hands-on screencast that builds a complete onboarding flow with branching steps, skippable tours, and analytics instrumentation.',
    type: 'Video',
    updated: '1 week ago',
  },
  {
    id: 'r4',
    icon: MessageSquare,
    title: 'How do you measure completion of onboarding flows?',
    path: 'community.acme.dev / discussions / 4821',
    snippet:
      'Community thread comparing activation-rate funnels, step-drop-off charts, and qualitative surveys for measuring onboarding flow success.',
    type: 'Discussion',
    updated: '3 days ago',
  },
  {
    id: 'r5',
    icon: GitBranch,
    title: 'Example repo: onboarding flows with A/B-tested variants',
    path: 'github.com / acme / examples / onboarding-ab-test',
    snippet:
      'Runnable example that splits new signups into two onboarding flow variants and reports which one converts better to first project creation.',
    type: 'Example',
    updated: '2 weeks ago',
  },
  {
    id: 'r6',
    icon: Users,
    title: 'Playbook: personalizing onboarding flows by team role',
    path: 'docs.acme.dev / playbooks / role-based-onboarding',
    snippet:
      'Patterns for tailoring onboarding flows to admins, editors, and viewers, with sample copy, suggested defaults, and rollout checklists.',
    type: 'Guide',
    updated: '4 days ago',
  },
]

const page = ref(1)
const totalPages = 3

const resultRange = computed(() => {
  const start = (page.value - 1) * 6 + 1
  return `${start}-${start + results.length - 1}`
})
</script>

<template>
  <div data-slot="search-results-page" :class="cn('w-full space-y-6', props.class)">
    <div class="space-y-3">
      <div class="relative max-w-xl">
        <Search
          aria-hidden="true"
          class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <Input v-model="query" type="search" placeholder="Search..." class="h-11 pl-9 text-base" />
      </div>
      <p class="text-muted-foreground text-sm">{{ resultRange }} of 42 results for &ldquo;{{ query }}&rdquo;</p>
    </div>

    <div v-if="chips.length > 0" class="flex flex-wrap items-center gap-2">
      <Chip v-for="chip in chips" :key="chip.id" variant="outline" size="sm" closable @close="removeChip(chip.id)">
        {{ chip.label }}
      </Chip>
      <Button variant="link" size="sm" class="text-muted-foreground h-auto min-h-6 px-2" @click="clearAll">
        Clear all
      </Button>
    </div>

    <div class="flex gap-8">
      <aside class="hidden w-48 shrink-0 space-y-6 lg:block" aria-label="Filters">
        <div v-for="group in facetGroups" :key="group.id">
          <h3 class="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
            {{ group.label }}
          </h3>
          <ul class="space-y-2.5">
            <li v-for="option in group.options" :key="option.id">
              <label :for="`${group.id}-${option.id}`" class="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  :id="`${group.id}-${option.id}`"
                  :model-value="activeFacets.has(option.id)"
                  @update:model-value="toggleFacet(option.id, $event === true)"
                />
                <span>{{ option.label }}</span>
                <span class="text-muted-foreground ml-auto text-xs tabular-nums">{{ option.count }}</span>
              </label>
            </li>
          </ul>
        </div>
      </aside>

      <div class="min-w-0 flex-1">
        <ol class="divide-border divide-y">
          <li v-for="result in results" :key="result.id">
            <a
              href="#"
              class="hover:bg-muted/50 focus-visible:ring-ring block rounded-lg p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <div class="flex gap-4">
                <div
                  class="bg-muted/50 text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-md border"
                >
                  <component :is="result.icon" aria-hidden="true" class="size-5" />
                </div>
                <div class="min-w-0 space-y-1">
                  <p class="truncate font-medium">{{ result.title }}</p>
                  <p class="text-muted-foreground truncate text-xs">{{ result.path }}</p>
                  <p class="text-muted-foreground line-clamp-2 text-sm">{{ result.snippet }}</p>
                  <div class="flex items-center gap-3 pt-1">
                    <Badge variant="secondary">{{ result.type }}</Badge>
                    <span class="text-muted-foreground text-xs">Updated {{ result.updated }}</span>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ol>

        <nav class="flex items-center justify-between pt-4" aria-label="Pagination">
          <Button variant="outline" size="sm" :disabled="page === 1" @click="page--">Previous</Button>
          <div class="flex items-center gap-1">
            <Button
              v-for="n in totalPages"
              :key="n"
              :variant="n === page ? 'outline' : 'ghost'"
              size="icon-sm"
              :aria-current="n === page ? 'page' : undefined"
              @click="page = n"
            >
              {{ n }}
            </Button>
          </div>
          <Button variant="outline" size="sm" :disabled="page === totalPages" @click="page++">Next</Button>
        </nav>
      </div>
    </div>
  </div>
</template>
