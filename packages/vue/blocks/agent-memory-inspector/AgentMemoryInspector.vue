<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bot,
  Brain,
  Check,
  Clock,
  CornerDownRight,
  Cpu,
  Database,
  Network,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  User,
  Workflow,
  X,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

type MemoryCategory = 'User Preference' | 'Architecture Rule' | 'System Constraint'

interface EpisodicMemory {
  id: string
  content: string
  category: MemoryCategory
  confidence: number
  lastRecalled: string
  recallsCount: number
  sourceTurn: string
  tags: string[]
  isPinned: boolean
}

interface MessageTurn {
  id: string
  turnNumber: number
  role: 'user' | 'assistant'
  authorName: string
  avatarText: string
  timestamp: string
  importanceScore: number
  importanceLevel: 'Critical' | 'High' | 'Standard' | 'Action Item'
  tokens: number
  content: string
  extractedFacts: string[]
  embeddingHash: string
}

interface EntityNode {
  id: string
  label: string
  entityType: 'Person' | 'Repository' | 'CSS Engine' | 'Design System' | 'Framework' | 'Standard'
  description: string
  degree: number
  status: 'active' | 'synced' | 'cached'
  embeddingId: string
}

interface GraphTriplet {
  id: string
  subject: string
  subjectType: string
  predicate: 'MAINTAINS' | 'USES' | 'CONFIGURES' | 'IMPLEMENTS' | 'MIRRORS' | 'ENFORCES'
  object: string
  objectType: string
  confidence: number
  weight: string
  lastTraversed: string
}

// Memory Facts State
const memoryFacts = ref<EpisodicMemory[]>([
  {
    id: 'fact-1',
    content: 'User prefers Vue 3.5 SFC with <script setup lang="ts">',
    category: 'User Preference',
    confidence: 0.98,
    lastRecalled: '2m ago',
    recallsCount: 42,
    sourceTurn: 'Turn #1 (Workspace Init)',
    tags: ['vue3', 'sfc', 'typescript'],
    isPinned: true,
  },
  {
    id: 'fact-2',
    content: 'User repository uses Tailwind v4 with OKLCH theme tokens',
    category: 'Architecture Rule',
    confidence: 0.95,
    lastRecalled: '14m ago',
    recallsCount: 89,
    sourceTurn: 'Turn #3 (CSS System)',
    tags: ['tailwind4', 'oklch', 'tokens'],
    isPinned: true,
  },
  {
    id: 'fact-3',
    content: 'User enforces strict 120-character printWidth in Prettier',
    category: 'System Constraint',
    confidence: 0.99,
    lastRecalled: '1h ago',
    recallsCount: 126,
    sourceTurn: 'Turn #1 (Code Standards)',
    tags: ['prettier', 'formatting'],
    isPinned: false,
  },
  {
    id: 'fact-4',
    content: 'Company domain is uipkge.dev',
    category: 'System Constraint',
    confidence: 0.97,
    lastRecalled: '3h ago',
    recallsCount: 31,
    sourceTurn: 'Turn #3 (Domain Policy)',
    tags: ['domain', 'hosting'],
    isPinned: false,
  },
  {
    id: 'fact-5',
    content: 'Never publish to npm; components distributed as unbundled raw source registries',
    category: 'Architecture Rule',
    confidence: 0.96,
    lastRecalled: '4h ago',
    recallsCount: 67,
    sourceTurn: 'Turn #2 (Architecture Rules)',
    tags: ['no-npm', 'shadcn', 'registry'],
    isPinned: true,
  },
])

// Message Window Buffer
const messageTurns = ref<MessageTurn[]>([
  {
    id: 'turn-1',
    turnNumber: 1,
    role: 'user',
    authorName: 'Elena Rostova (Lead Architect)',
    avatarText: 'ER',
    timestamp: '12m ago',
    importanceScore: 0.94,
    importanceLevel: 'Critical',
    tokens: 142,
    content:
      'We are configuring the UIPKGE monorepo for Vue 3.5 and React 19. All Vue components must use <script setup lang="ts"> and strict 120-character printWidth in Prettier. Do not output semicolons.',
    extractedFacts: ['User prefers Vue 3.5 SFC', '120-char printWidth enforced'],
    embeddingHash: '0x7f8a91c4',
  },
  {
    id: 'turn-2',
    turnNumber: 2,
    role: 'assistant',
    authorName: 'Senior Engineering Co-Pilot',
    avatarText: 'AI',
    timestamp: '11m ago',
    importanceScore: 0.78,
    importanceLevel: 'Standard',
    tokens: 512,
    content:
      'Understood. I have recorded the formatting rules (no semicolons, single quotes, 120 width) and dual-framework targets. All component scaffolding will adhere strictly to Vue 3.5 script setup standards and OKLCH color token architecture.',
    extractedFacts: ['Single-quote formatting indexed', 'Vue 3.5 + React dual pipeline'],
    embeddingHash: '0x3b1d84e2',
  },
  {
    id: 'turn-3',
    turnNumber: 3,
    role: 'user',
    authorName: 'Elena Rostova (Lead Architect)',
    avatarText: 'ER',
    timestamp: '4m ago',
    importanceScore: 0.98,
    importanceLevel: 'High',
    tokens: 286,
    content:
      'Remember that company domain is uipkge.dev and we do NOT publish npm packages. Components are distributed directly as unbundled registry JSON files via shadcn CLI. Tailwind v4 with OKLCH theme tokens must be used across all blocks.',
    extractedFacts: ['Company domain is uipkge.dev', 'Zero npm publishing policy', 'Tailwind v4 OKLCH token model'],
    embeddingHash: '0x92e4ca10',
  },
  {
    id: 'turn-4',
    turnNumber: 4,
    role: 'assistant',
    authorName: 'Senior Engineering Co-Pilot',
    avatarText: 'AI',
    timestamp: 'Just now',
    importanceScore: 0.91,
    importanceLevel: 'Action Item',
    tokens: 1490,
    content:
      'Memory updated. Synced "uipkge.dev" and registry-first unbundled distribution architecture into Mem0 vector collection and Neo4j dependency graph. Short-term context buffer is currently utilizing 6,420 / 128,000 tokens (5.0%). Ready for task execution.',
    extractedFacts: ['Neo4j triplets linked', 'Mem0 vector index synced'],
    embeddingHash: '0x48c71bf9',
  },
])

// Entity Knowledge Graph Nodes & Triplets
const entityNodes = ref<EntityNode[]>([
  {
    id: 'node-1',
    label: 'Elena Rostova',
    entityType: 'Person',
    description: 'Lead Maintainer & Core Architect',
    degree: 2,
    status: 'active',
    embeddingId: 'emb_981a',
  },
  {
    id: 'node-2',
    label: 'uipkge-ui',
    entityType: 'Repository',
    description: 'Dual-Framework UI Registry Monorepo',
    degree: 5,
    status: 'active',
    embeddingId: 'emb_432b',
  },
  {
    id: 'node-3',
    label: 'Tailwind v4',
    entityType: 'CSS Engine',
    description: 'CSS-first @theme inline styling layer',
    degree: 2,
    status: 'synced',
    embeddingId: 'emb_771c',
  },
  {
    id: 'node-4',
    label: 'OKLCH Tokens',
    entityType: 'Design System',
    description: 'Perceptually uniform color model palette',
    degree: 1,
    status: 'synced',
    embeddingId: 'emb_118d',
  },
  {
    id: 'node-5',
    label: 'Vue 3.5 SFC',
    entityType: 'Framework',
    description: 'Primary component authoring standard',
    degree: 1,
    status: 'active',
    embeddingId: 'emb_554e',
  },
  {
    id: 'node-6',
    label: 'React 19 Components',
    entityType: 'Framework',
    description: 'Headless mirror registry implementation',
    degree: 1,
    status: 'active',
    embeddingId: 'emb_229f',
  },
  {
    id: 'node-7',
    label: '120-char printWidth',
    entityType: 'Standard',
    description: 'Prettier wrap limit constraint',
    degree: 1,
    status: 'cached',
    embeddingId: 'emb_883g',
  },
])

const graphTriplets = ref<GraphTriplet[]>([
  {
    id: 'trip-1',
    subject: 'Elena Rostova',
    subjectType: 'Person',
    predicate: 'MAINTAINS',
    object: 'uipkge-ui',
    objectType: 'Repository',
    confidence: 0.99,
    weight: '1.00',
    lastTraversed: '12s ago',
  },
  {
    id: 'trip-2',
    subject: 'uipkge-ui',
    subjectType: 'Repository',
    predicate: 'USES',
    object: 'Tailwind v4',
    objectType: 'CSS Engine',
    confidence: 0.98,
    weight: '0.96',
    lastTraversed: '45s ago',
  },
  {
    id: 'trip-3',
    subject: 'Tailwind v4',
    subjectType: 'CSS Engine',
    predicate: 'CONFIGURES',
    object: 'OKLCH Tokens',
    objectType: 'Design System',
    confidence: 0.97,
    weight: '0.94',
    lastTraversed: '2m ago',
  },
  {
    id: 'trip-4',
    subject: 'uipkge-ui',
    subjectType: 'Repository',
    predicate: 'IMPLEMENTS',
    object: 'Vue 3.5 SFC',
    objectType: 'Framework',
    confidence: 0.99,
    weight: '0.98',
    lastTraversed: '1m ago',
  },
  {
    id: 'trip-5',
    subject: 'uipkge-ui',
    subjectType: 'Repository',
    predicate: 'MIRRORS',
    object: 'React 19 Components',
    objectType: 'Framework',
    confidence: 0.96,
    weight: '0.91',
    lastTraversed: '3m ago',
  },
  {
    id: 'trip-6',
    subject: 'Elena Rostova',
    subjectType: 'Person',
    predicate: 'ENFORCES',
    object: '120-char printWidth',
    objectType: 'Standard',
    confidence: 0.95,
    weight: '0.89',
    lastTraversed: '5m ago',
  },
])

// UI Controls State
const activeTab = ref('context')
const selectedCategory = ref<string>('all')
const searchQuery = ref('')
const selectedTurnId = ref<string>('turn-4')
const selectedNodeId = ref<string>('node-2')
const isWiped = ref(false)
const wipeToastVisible = ref(false)
const isAddingFact = ref(false)
const editingFactId = ref<string | null>(null)

// Form State for new memory fact
const newFactForm = ref<{
  content: string
  category: MemoryCategory
  confidence: number
}>({
  content: '',
  category: 'User Preference',
  confidence: 0.95,
})

const filteredMemories = computed(() => {
  return memoryFacts.value.filter((fact) => {
    const matchesCategory = selectedCategory.value === 'all' || fact.category === selectedCategory.value
    const matchesSearch =
      searchQuery.value.trim() === '' ||
      fact.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      fact.tags.some((t) => t.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesCategory && matchesSearch
  })
})

const selectedTurn = computed(() => {
  return messageTurns.value.find((t) => t.id === selectedTurnId.value) || messageTurns.value[0]
})

const selectedNode = computed(() => {
  return entityNodes.value.find((n) => n.id === selectedNodeId.value) || entityNodes.value[1]
})

const filteredTriplets = computed(() => {
  if (!selectedNode.value) return graphTriplets.value
  return graphTriplets.value.filter(
    (t) => t.subject === selectedNode.value.label || t.object === selectedNode.value.label,
  )
})

function wipeWorkingMemory() {
  isWiped.value = true
  wipeToastVisible.value = true
  setTimeout(() => {
    wipeToastVisible.value = false
  }, 4000)
}

function restoreWorkingMemory() {
  isWiped.value = false
  wipeToastVisible.value = false
}

function deleteFact(id: string) {
  memoryFacts.value = memoryFacts.value.filter((f) => f.id !== id)
}

function togglePinFact(id: string) {
  const fact = memoryFacts.value.find((f) => f.id === id)
  if (fact) {
    fact.isPinned = !fact.isPinned
  }
}

function startAddFact() {
  isAddingFact.value = true
  editingFactId.value = null
  newFactForm.value = {
    content: '',
    category: 'User Preference',
    confidence: 0.95,
  }
}

function saveNewFact() {
  if (!newFactForm.value.content.trim()) return

  if (editingFactId.value) {
    const existing = memoryFacts.value.find((f) => f.id === editingFactId.value)
    if (existing) {
      existing.content = newFactForm.value.content
      existing.category = newFactForm.value.category
      existing.confidence = Number(newFactForm.value.confidence)
      existing.lastRecalled = 'Just now'
    }
  } else {
    const newId = `fact-${Date.now()}`
    memoryFacts.value.unshift({
      id: newId,
      content: newFactForm.value.content,
      category: newFactForm.value.category,
      confidence: Number(newFactForm.value.confidence),
      lastRecalled: 'Just now',
      recallsCount: 1,
      sourceTurn: 'Manual Injection',
      tags: [newFactForm.value.category.toLowerCase().replace(/\s+/g, '-')],
      isPinned: false,
    })
  }

  isAddingFact.value = false
  editingFactId.value = null
}

function editFact(fact: EpisodicMemory) {
  editingFactId.value = fact.id
  newFactForm.value = {
    content: fact.content,
    category: fact.category,
    confidence: fact.confidence,
  }
  isAddingFact.value = true
}

function cancelAddFact() {
  isAddingFact.value = false
  editingFactId.value = null
}

function getCategoryVariant(category: MemoryCategory): 'default' | 'secondary' | 'outline' {
  switch (category) {
    case 'User Preference':
      return 'default'
    case 'Architecture Rule':
      return 'secondary'
    case 'System Constraint':
      return 'outline'
  }
}
</script>

<template>
  <div :class="cn('w-full space-y-6 font-sans antialiased', props.class)">
    <!-- Header Block -->
    <Card class="border-border shadow-xs">
      <CardHeader class="p-6 pb-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <!-- Left: Agent Identity & Engine Details -->
          <div class="flex items-start gap-4">
            <div class="relative">
              <Avatar class="border-border bg-muted/60 h-12 w-12 rounded-xl border p-1">
                <AvatarFallback class="bg-primary/10 text-primary rounded-lg font-mono text-sm font-bold">
                  <Brain class="text-primary h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <span
                class="bg-background absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full"
              >
                <span class="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              </span>
            </div>

            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-foreground text-lg font-semibold tracking-tight">Senior Engineering Co-Pilot Agent</h2>
                <Badge variant="outline" class="gap-1 px-2 py-0.5 text-xs font-medium">
                  <Sparkles class="h-3 w-3 text-amber-500" />
                  Autonomous Sync
                </Badge>
              </div>

              <div class="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span class="text-foreground flex items-center gap-1.5 font-medium">
                  <Database class="text-primary h-3.5 w-3.5" />
                  Mem0 Vector + Neo4j Entity Graph
                </span>
                <span class="flex items-center gap-1">
                  <Network class="h-3.5 w-3.5" />
                  142 Episodic Memories · 28 Entity Nodes
                </span>
                <span class="text-muted-foreground flex items-center gap-1 font-mono">
                  <Activity class="h-3 w-3 text-emerald-500" />
                  Recall: 12ms
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              class="text-muted-foreground hover:text-destructive h-9 gap-1.5 text-xs font-medium"
              @click="wipeWorkingMemory"
            >
              <Trash2 class="h-3.5 w-3.5" />
              Wipe Working Memory
            </Button>

            <Button size="sm" class="h-9 gap-1.5 text-xs font-medium shadow-xs" @click="startAddFact">
              <Plus class="h-3.5 w-3.5" />
              Add Memory Fact
            </Button>
          </div>
        </div>
      </CardHeader>

      <!-- Wipe State Feedback Banner -->
      <div v-if="wipeToastVisible" class="border-destructive/20 bg-destructive/5 border-t px-6 py-2.5">
        <div class="text-destructive flex items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2">
            <AlertCircle class="h-4 w-4 shrink-0" />
            <span>Working context buffer cache cleared. Persistent episodic facts remain intact.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            class="border-destructive/30 text-destructive hover:bg-destructive/10 h-7 text-xs"
            @click="restoreWorkingMemory"
          >
            <RefreshCw class="mr-1 h-3 w-3" />
            Restore
          </Button>
        </div>
      </div>
    </Card>

    <!-- Inline Add/Edit Memory Fact Modal / Drawer -->
    <Card v-if="isAddingFact" class="border-primary/30 bg-card ring-primary/20 shadow-sm ring-1">
      <CardHeader class="p-4 pb-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Sparkles class="text-primary h-4 w-4" />
            <CardTitle class="text-sm font-semibold">
              {{ editingFactId ? 'Edit Memory Fact' : 'Add Episodic Memory Fact' }}
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" class="h-7 w-7 p-0" aria-label="Cancel adding fact" @click="cancelAddFact">
            <X class="h-4 w-4" />
          </Button>
        </div>
        <CardDescription class="text-xs">
          Inject a verified truth into the persistent Mem0 vector embedding space.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-3 p-4 pt-2">
        <div class="space-y-1.5">
          <label class="text-foreground text-xs font-medium">Fact Content</label>
          <textarea
            v-model="newFactForm.content"
            placeholder="e.g. User enforces strict 120-character printWidth in Prettier..."
            rows="2"
            class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-xs focus-visible:ring-1 focus-visible:outline-none"
          />
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-medium">Memory Category</label>
            <select
              v-model="newFactForm.category"
              class="border-input bg-background text-foreground focus-visible:ring-ring w-full rounded-md border px-2.5 py-1.5 text-xs focus-visible:ring-1 focus-visible:outline-none"
            >
              <option value="User Preference">User Preference</option>
              <option value="Architecture Rule">Architecture Rule</option>
              <option value="System Constraint">System Constraint</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-medium">Confidence Score (0.0 - 1.0)</label>
            <input
              v-model.number="newFactForm.confidence"
              type="number"
              step="0.01"
              min="0"
              max="1"
              class="border-input bg-background text-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-1.5 font-mono text-xs focus-visible:ring-1 focus-visible:outline-none"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter class="border-border flex justify-end gap-2 border-t p-3">
        <Button aria-label="Cancel adding fact" variant="ghost" size="sm" class="h-8 text-xs" @click="cancelAddFact">
          Cancel
        </Button>
        <Button size="sm" class="h-8 text-xs font-medium" @click="saveNewFact">
          <Check class="mr-1 h-3.5 w-3.5" />
          {{ editingFactId ? 'Save Changes' : 'Store Fact' }}
        </Button>
      </CardFooter>
    </Card>

    <!-- Main Tabs Section -->
    <Tabs v-model="activeTab" default-value="context" class="w-full space-y-4">
      <TabsList class="border-border bg-muted/40 grid h-10 w-full grid-cols-3 rounded-lg border p-1">
        <TabsTrigger value="context" class="gap-2 text-xs font-medium">
          <Cpu class="h-3.5 w-3.5" />
          <span>Short-Term Context Buffer</span>
          <Badge variant="secondary" class="ml-1 px-1.5 py-0 font-mono text-xs font-normal">
            {{ isWiped ? '0 turns' : '4 turns' }}
          </Badge>
        </TabsTrigger>

        <TabsTrigger value="episodic" class="gap-2 text-xs font-medium">
          <Database class="h-3.5 w-3.5" />
          <span>Long-Term Episodic Memory</span>
          <Badge variant="secondary" class="ml-1 px-1.5 py-0 font-mono text-xs font-normal">
            {{ memoryFacts.length }} Facts
          </Badge>
        </TabsTrigger>

        <TabsTrigger value="graph" class="gap-2 text-xs font-medium">
          <Network class="h-3.5 w-3.5" />
          <span>Entity Knowledge Graph</span>
          <Badge variant="secondary" class="ml-1 px-1.5 py-0 font-mono text-xs font-normal">
            {{ entityNodes.length }} Nodes
          </Badge>
        </TabsTrigger>
      </TabsList>

      <!-- ========================================== -->
      <!-- TAB 1: SHORT-TERM CONTEXT BUFFER          -->
      <!-- ========================================== -->
      <TabsContent value="context" class="space-y-4 outline-none">
        <!-- Token Utilization Overview Card -->
        <Card class="border-border shadow-xs">
          <CardHeader class="p-5 pb-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <CardTitle class="text-sm font-semibold">Session Context Window Utilization</CardTitle>
                  <Badge variant="outline" class="text-muted-foreground font-mono text-xs"> 128k Model Window </Badge>
                </div>
                <CardDescription class="text-xs">
                  Active in-memory token allocation for the current autonomous execution session.
                </CardDescription>
              </div>

              <div class="flex items-baseline gap-1.5 font-mono">
                <span class="text-foreground text-base font-bold">
                  {{ isWiped ? '0' : '6,420' }}
                </span>
                <span class="text-muted-foreground text-xs">/ 128,000 tokens</span>
                <Badge variant="secondary" class="ml-1 font-mono text-xs font-semibold">
                  {{ isWiped ? '0.0%' : '5.0%' }}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 p-5 pt-0">
            <!-- Progress Bar -->
            <Progress :model-value="isWiped ? 0 : 5.0" class="bg-muted h-2 w-full" />

            <!-- Detailed Token Allocation Breakdown Grid -->
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div class="border-border/80 bg-card/60 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center justify-between text-xs">
                  <span>System Prompt</span>
                  <span class="text-foreground font-mono">{{ isWiped ? '0' : '2,140' }}</span>
                </div>
                <div class="text-foreground mt-1 text-xs font-medium">33.3% allocated</div>
              </div>

              <div class="border-border/80 bg-card/60 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center justify-between text-xs">
                  <span>Episodic Injections</span>
                  <span class="text-foreground font-mono">{{ isWiped ? '0' : '1,850' }}</span>
                </div>
                <div class="text-foreground mt-1 text-xs font-medium">28.8% allocated</div>
              </div>

              <div class="border-border/80 bg-card/60 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center justify-between text-xs">
                  <span>Message History</span>
                  <span class="text-foreground font-mono">{{ isWiped ? '0' : '2,430' }}</span>
                </div>
                <div class="text-foreground mt-1 text-xs font-medium">37.9% allocated</div>
              </div>

              <div class="border-border/80 bg-card/60 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center justify-between text-xs">
                  <span>Available Headroom</span>
                  <span class="font-mono text-emerald-600 dark:text-emerald-400">
                    {{ isWiped ? '128,000' : '121,580' }}
                  </span>
                </div>
                <div class="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {{ isWiped ? '100% free' : '95.0% free' }}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Sliding Message Window Buffer (Recent 4 Conversation Turns) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-2">
              <h3 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Sliding Message Window Buffer
              </h3>
              <Badge variant="outline" class="font-mono text-xs">FIFO Window: 4 Turns Active</Badge>
            </div>
            <span class="text-muted-foreground text-xs">Click turn to inspect vector payload</span>
          </div>

          <div v-if="isWiped" class="border-border rounded-xl border border-dashed p-8 text-center">
            <AlertCircle class="text-muted-foreground/60 mx-auto h-8 w-8" />
            <h4 class="text-foreground mt-2 text-sm font-semibold">Working Buffer Cleared</h4>
            <p class="text-muted-foreground mt-1 text-xs">
              Working memory is empty. Start typing or restore the test buffer.
            </p>
            <Button size="sm" variant="outline" class="mt-3 text-xs" @click="restoreWorkingMemory">
              Restore Message Turns
            </Button>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="turn in messageTurns"
              :key="turn.id"
              role="button"
              tabindex="0"
              :aria-pressed="selectedTurnId === turn.id"
              :class="
                cn(
                  'group bg-card hover:border-primary/40 focus-visible:ring-ring relative cursor-pointer rounded-xl border p-4.5 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none',
                  selectedTurnId === turn.id
                    ? 'border-primary/60 bg-accent/20 ring-primary/30 ring-1'
                    : 'border-border',
                )
              "
              @click="selectedTurnId = turn.id"
              @keydown.enter="selectedTurnId = turn.id"
              @keydown.space.prevent="selectedTurnId = turn.id"
            >
              <!-- Turn Header -->
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-3">
                  <Avatar class="border-border bg-muted h-7 w-7 rounded-md border">
                    <AvatarFallback
                      :class="
                        cn(
                          'text-xs font-bold',
                          turn.role === 'assistant'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted-foreground/10 text-foreground',
                        )
                      "
                    >
                      <Bot v-if="turn.role === 'assistant'" class="text-primary h-4 w-4" />
                      <User v-else class="text-muted-foreground h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-foreground text-xs font-semibold">{{ turn.authorName }}</span>
                      <span class="text-muted-foreground font-mono text-xs">Turn #{{ turn.turnNumber }}</span>
                    </div>
                  </div>
                </div>

                <!-- Importance & Meta Badges -->
                <div class="flex flex-wrap items-center gap-2">
                  <Badge
                    :variant="
                      turn.importanceLevel === 'Critical'
                        ? 'destructive'
                        : turn.importanceLevel === 'High'
                          ? 'default'
                          : 'secondary'
                    "
                    class="gap-1 font-mono text-xs"
                  >
                    <Zap class="h-3 w-3" />
                    Score: {{ turn.importanceScore }} · {{ turn.importanceLevel }}
                  </Badge>

                  <Badge variant="outline" class="text-muted-foreground font-mono text-xs">
                    {{ turn.tokens }} tokens
                  </Badge>

                  <span class="text-muted-foreground text-xs">{{ turn.timestamp }}</span>
                </div>
              </div>

              <!-- Turn Content Body -->
              <div
                class="border-border/60 bg-muted/30 text-foreground mt-3 rounded-lg border p-3 font-mono text-xs leading-relaxed"
              >
                {{ turn.content }}
              </div>

              <!-- Turn Footer / Extracted Facts -->
              <div class="mt-3 flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="text-muted-foreground flex items-center gap-1 font-medium">
                    <CornerDownRight class="text-primary h-3.5 w-3.5" />
                    Extracted Memory Facts:
                  </span>
                  <Badge
                    v-for="(fact, idx) in turn.extractedFacts"
                    :key="idx"
                    variant="outline"
                    class="border-primary/20 bg-primary/5 text-foreground text-xs font-normal"
                  >
                    {{ fact }}
                  </Badge>
                </div>

                <div class="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                  <span>Embedding: {{ turn.embeddingHash }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <!-- ========================================== -->
      <!-- TAB 2: LONG-TERM EPISODIC MEMORY TABLE    -->
      <!-- ========================================== -->
      <TabsContent value="episodic" class="space-y-4 outline-none">
        <Card class="border-border shadow-xs">
          <!-- Filter and Search Header -->
          <CardHeader class="p-5 pb-3">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle class="text-sm font-semibold">Persistent Episodic Facts</CardTitle>
                <CardDescription class="text-xs">
                  Distilled knowledge facts retrieved via Mem0 vector cosine similarity search.
                </CardDescription>
              </div>

              <!-- Search & Category Filters -->
              <div class="flex flex-wrap items-center gap-2">
                <div class="relative w-full sm:w-64">
                  <Search class="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search memory facts or tags..."
                    class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-8.5 w-full rounded-md border pr-3 pl-8 text-xs focus-visible:ring-1 focus-visible:outline-none"
                  />
                </div>

                <div class="border-border bg-muted/40 flex items-center gap-1 rounded-lg border p-0.5">
                  <button
                    type="button"
                    :class="
                      cn(
                        'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                        selectedCategory === 'all'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )
                    "
                    @click="selectedCategory = 'all'"
                  >
                    All ({{ memoryFacts.length }})
                  </button>
                  <button
                    type="button"
                    :class="
                      cn(
                        'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                        selectedCategory === 'User Preference'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )
                    "
                    @click="selectedCategory = 'User Preference'"
                  >
                    Preference
                  </button>
                  <button
                    type="button"
                    :class="
                      cn(
                        'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                        selectedCategory === 'Architecture Rule'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )
                    "
                    @click="selectedCategory = 'Architecture Rule'"
                  >
                    Architecture
                  </button>
                  <button
                    type="button"
                    :class="
                      cn(
                        'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                        selectedCategory === 'System Constraint'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )
                    "
                    @click="selectedCategory = 'System Constraint'"
                  >
                    Constraint
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>

          <!-- Memory Table -->
          <CardContent class="p-0">
            <div class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow class="hover:bg-transparent">
                    <TableHead class="w-8"></TableHead>
                    <TableHead class="min-w-[280px]">Memory Fact Content</TableHead>
                    <TableHead class="w-[160px]">Category</TableHead>
                    <TableHead class="w-[130px]">Confidence</TableHead>
                    <TableHead class="w-[140px]">Last Recalled</TableHead>
                    <TableHead class="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow v-if="filteredMemories.length === 0">
                    <TableCell colspan="6" class="text-muted-foreground h-28 text-center text-xs">
                      No matching memory facts found for the current query.
                    </TableCell>
                  </TableRow>

                  <TableRow v-for="fact in filteredMemories" :key="fact.id" class="group hover:bg-muted/40">
                    <!-- Pin / Star Icon -->
                    <TableCell class="py-3 pr-1 pl-4">
                      <button
                        type="button"
                        class="text-muted-foreground hover:text-amber-500 focus-visible:outline-none"
                        :title="fact.isPinned ? 'Unpin fact' : 'Pin fact'"
                        @click="togglePinFact(fact.id)"
                      >
                        <Star
                          :class="
                            cn('h-4 w-4', fact.isPinned ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/40')
                          "
                        />
                      </button>
                    </TableCell>

                    <!-- Content & Source Details -->
                    <TableCell class="py-3">
                      <div class="space-y-1">
                        <div class="text-foreground text-xs leading-relaxed font-medium">
                          {{ fact.content }}
                        </div>
                        <div class="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
                          <span class="text-muted-foreground font-mono">{{ fact.sourceTurn }}</span>
                          <span>·</span>
                          <div class="flex items-center gap-1">
                            <span
                              v-for="tag in fact.tags"
                              :key="tag"
                              class="bg-muted py-0.2 text-muted-foreground rounded px-1.5 font-mono text-xs"
                            >
                              #{{ tag }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <!-- Category Badge -->
                    <TableCell class="py-3">
                      <Badge :variant="getCategoryVariant(fact.category)" class="text-xs font-normal">
                        {{ fact.category }}
                      </Badge>
                    </TableCell>

                    <!-- Confidence Meter -->
                    <TableCell class="py-3">
                      <div class="space-y-1">
                        <div class="flex items-center justify-between font-mono text-xs">
                          <span class="text-foreground font-semibold">{{ (fact.confidence * 100).toFixed(0) }}%</span>
                          <span class="text-muted-foreground">({{ fact.confidence }})</span>
                        </div>
                        <Progress :model-value="fact.confidence * 100" class="bg-muted h-1.5 w-20" />
                      </div>
                    </TableCell>

                    <!-- Last Recalled & Recalls Count -->
                    <TableCell class="py-3">
                      <div class="space-y-0.5 text-xs">
                        <div class="text-foreground flex items-center gap-1 font-medium">
                          <Clock class="text-muted-foreground h-3 w-3" />
                          <span>{{ fact.lastRecalled }}</span>
                        </div>
                        <div class="text-muted-foreground font-mono text-xs">Recalled {{ fact.recallsCount }}×</div>
                      </div>
                    </TableCell>

                    <!-- Actions -->
                    <TableCell class="py-3 pr-4 text-right">
                      <div class="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          class="text-muted-foreground hover:text-foreground h-7 w-7 p-0"
                          title="Edit fact"
                          @click="editFact(fact)"
                        >
                          <Pencil class="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          class="text-muted-foreground hover:text-destructive h-7 w-7 p-0"
                          title="Delete fact"
                          @click="deleteFact(fact.id)"
                        >
                          <Trash2 class="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ========================================== -->
      <!-- TAB 3: ENTITY KNOWLEDGE GRAPH             -->
      <!-- ========================================== -->
      <TabsContent value="graph" class="space-y-4 outline-none">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <!-- Left 2 Cols: Interactive Graph Map & Triplets Table -->
          <div class="space-y-4 lg:col-span-2">
            <!-- Node Explorer Grid -->
            <Card class="border-border shadow-xs">
              <CardHeader class="p-5 pb-3">
                <div class="flex items-center justify-between">
                  <div>
                    <CardTitle class="text-sm font-semibold">Knowledge Graph Entity Nodes</CardTitle>
                    <CardDescription class="text-xs">
                      Discovered named entities mapped to graph node properties in Neo4j.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" class="font-mono text-xs"> {{ entityNodes.length }} Active Nodes </Badge>
                </div>
              </CardHeader>

              <CardContent class="p-5 pt-0">
                <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  <button
                    v-for="node in entityNodes"
                    :key="node.id"
                    type="button"
                    :class="
                      cn(
                        'hover:border-primary/50 focus-visible:ring-ring w-full cursor-pointer rounded-lg border p-3 text-left transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none',
                        selectedNodeId === node.id
                          ? 'border-primary bg-primary/5 ring-primary/20 ring-1'
                          : 'border-border bg-card',
                      )
                    "
                    :aria-pressed="selectedNodeId === node.id"
                    @click="selectedNodeId = node.id"
                  >
                    <div class="flex items-start justify-between gap-1">
                      <div class="text-foreground text-xs font-semibold">{{ node.label }}</div>
                      <Badge variant="secondary" class="px-1.5 py-0 text-xs font-normal">
                        {{ node.entityType }}
                      </Badge>
                    </div>

                    <p class="text-muted-foreground mt-1.5 line-clamp-1 text-xs">
                      {{ node.description }}
                    </p>

                    <div class="text-muted-foreground mt-2.5 flex items-center justify-between text-xs">
                      <span class="flex items-center gap-1 font-mono">
                        <Workflow class="text-primary h-3 w-3" />
                        {{ node.degree }} Relations
                      </span>
                      <span class="flex items-center gap-1">
                        <span
                          :class="
                            cn(
                              'h-1.5 w-1.5 rounded-full',
                              node.status === 'active'
                                ? 'bg-emerald-500'
                                : node.status === 'synced'
                                  ? 'bg-blue-500'
                                  : 'bg-muted-foreground',
                            )
                          "
                        />
                        {{ node.status }}
                      </span>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            <!-- Relationship Triplets Table -->
            <Card class="border-border shadow-xs">
              <CardHeader class="p-5 pb-3">
                <div class="flex items-center justify-between">
                  <div>
                    <CardTitle class="text-sm font-semibold">
                      Relationship Triplets ({{ selectedNode ? selectedNode.label : 'All' }})
                    </CardTitle>
                    <CardDescription class="text-xs">
                      Directed semantic graph edges representing knowledge connections.
                    </CardDescription>
                  </div>
                  <span class="text-muted-foreground font-mono text-xs"> {{ filteredTriplets.length }} Edges </span>
                </div>
              </CardHeader>

              <CardContent class="p-0">
                <div class="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow class="hover:bg-transparent">
                        <TableHead class="min-w-[140px]">Subject (S)</TableHead>
                        <TableHead class="min-w-[140px]">Predicate [P]</TableHead>
                        <TableHead class="min-w-[140px]">Object (O)</TableHead>
                        <TableHead class="w-[100px]">Weight</TableHead>
                        <TableHead class="w-[110px] text-right">Traversed</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      <TableRow v-for="trip in filteredTriplets" :key="trip.id" class="hover:bg-muted/30">
                        <!-- Subject -->
                        <TableCell class="py-2.5">
                          <div class="flex items-center gap-1.5">
                            <span class="text-foreground text-xs font-semibold">{{ trip.subject }}</span>
                            <span class="bg-muted py-0.2 text-muted-foreground rounded px-1 font-mono text-xs">
                              {{ trip.subjectType }}
                            </span>
                          </div>
                        </TableCell>

                        <!-- Predicate -->
                        <TableCell class="py-2.5">
                          <Badge variant="outline" class="border-primary/30 text-primary gap-1 font-mono text-xs">
                            <ArrowRight class="h-3 w-3" />
                            {{ trip.predicate }}
                          </Badge>
                        </TableCell>

                        <!-- Object -->
                        <TableCell class="py-2.5">
                          <div class="flex items-center gap-1.5">
                            <span class="text-foreground text-xs font-semibold">{{ trip.object }}</span>
                            <span class="bg-muted py-0.2 text-muted-foreground rounded px-1 font-mono text-xs">
                              {{ trip.objectType }}
                            </span>
                          </div>
                        </TableCell>

                        <!-- Weight -->
                        <TableCell class="text-foreground py-2.5 font-mono text-xs">
                          {{ trip.weight }}
                        </TableCell>

                        <!-- Last Traversed -->
                        <TableCell class="text-muted-foreground py-2.5 text-right font-mono text-xs">
                          {{ trip.lastTraversed }}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Right Col: Selected Entity Node Inspector -->
          <div class="space-y-4">
            <Card class="border-border shadow-xs">
              <CardHeader class="p-5 pb-3">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-sm font-semibold">Entity Node Inspector</CardTitle>
                  <Badge variant="outline" class="font-mono text-xs">
                    {{ selectedNode.id }}
                  </Badge>
                </div>
                <CardDescription class="text-xs">
                  Neo4j Graph Database node properties & vector embeddings.
                </CardDescription>
              </CardHeader>

              <CardContent class="space-y-4 p-5 pt-1 text-xs">
                <!-- Node Hero -->
                <div class="border-border bg-muted/40 space-y-2 rounded-lg border p-3.5">
                  <div class="flex items-center justify-between">
                    <span class="text-foreground text-xs font-bold">{{ selectedNode.label }}</span>
                    <Badge variant="default" class="text-xs font-normal">
                      {{ selectedNode.entityType }}
                    </Badge>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    {{ selectedNode.description }}
                  </p>
                </div>

                <!-- Node Attributes -->
                <div class="space-y-2.5">
                  <div class="border-border/60 flex items-center justify-between border-b pb-1.5">
                    <span class="text-muted-foreground">Graph Degree</span>
                    <span class="text-foreground font-mono font-semibold">{{ selectedNode.degree }} Edges</span>
                  </div>

                  <div class="border-border/60 flex items-center justify-between border-b pb-1.5">
                    <span class="text-muted-foreground">Sync Status</span>
                    <span class="text-foreground flex items-center gap-1.5 font-medium">
                      <span class="h-2 w-2 rounded-full bg-emerald-500" />
                      {{ selectedNode.status }}
                    </span>
                  </div>

                  <div class="border-border/60 flex items-center justify-between border-b pb-1.5">
                    <span class="text-muted-foreground">Vector Hash</span>
                    <span class="text-muted-foreground font-mono">{{ selectedNode.embeddingId }}</span>
                  </div>

                  <div class="border-border/60 flex items-center justify-between border-b pb-1.5">
                    <span class="text-muted-foreground">Storage Engine</span>
                    <span class="text-foreground font-mono">Neo4j Bolt + HNSW</span>
                  </div>
                </div>

                <!-- Cypher Query Snippet -->
                <div class="space-y-1.5 pt-1">
                  <div class="text-muted-foreground flex items-center justify-between text-xs">
                    <span class="font-medium">Live Cypher Match</span>
                    <span class="font-mono text-xs">MATCH (n)</span>
                  </div>
                  <div
                    class="border-border bg-card text-foreground overflow-x-auto rounded-lg border p-2.5 font-mono text-xs leading-relaxed"
                  >
                    MATCH (n:Entity {id: '{{ selectedNode.id }}'})<br />
                    OPTIONAL MATCH (n)-[r]-&gt;(m)<br />
                    RETURN n, r, m LIMIT 25;
                  </div>
                </div>
              </CardContent>

              <CardFooter class="border-border text-muted-foreground border-t p-3 text-xs">
                <span class="flex items-center gap-1">
                  <ShieldCheck class="h-3.5 w-3.5 text-emerald-500" />
                  Verified graph consistency check passed
                </span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
