<script setup lang="ts">
import { ref, computed } from 'vue'
import { HelpCircle, MessageSquare, Search, ThumbsUp, ShieldCheck, CheckCircle, Plus, Send } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export interface QuestionItem {
  id: string
  question: string
  askedBy: string
  askedDate: string
  category: 'compatibility' | 'sound' | 'comfort' | 'cables' | 'shipping'
  upvotes: number
  hasVoted?: boolean
  answers: {
    id: string
    answer: string
    answeredBy: string
    answeredDate: string
    role: 'staff' | 'verified_buyer' | 'community'
    helpfulCount: number
    hasUpvoted?: boolean
  }[]
}

export interface ProductQaProps {
  productName?: string
  questions?: QuestionItem[]
  className?: string
}

const defaultQuestions: QuestionItem[] = [
  {
    id: 'q1',
    question:
      'Can these 32-ohm planar drivers be driven directly from a MacBook Pro headphone jack without an external DAC/AMP?',
    askedBy: 'Julian R. (Audio Engineer)',
    askedDate: '3 days ago',
    category: 'compatibility',
    upvotes: 42,
    answers: [
      {
        id: 'a1',
        answer:
          'Yes! Thanks to our high-sensitivity 106 dB/mW planar trace design and flat 32Ω impedance curve, modern high-power laptops (such as Apple Silicon M-series MacBook Pros) drive them with pristine headroom. However, for 192kHz/24-bit studio mastering, pairing with a dedicated balanced 4.4mm DAC/AMP will unlock their full dynamic staging.',
        answeredBy: 'Marcus Sterling · Lead Acoustic Engineer (Apex)',
        answeredDate: '2 days ago',
        role: 'staff',
        helpfulCount: 38,
      },
    ],
  },
  {
    id: 'q2',
    question: 'Are the lambskin earpads user-replaceable if they wear down over time?',
    askedBy: 'Elena K.',
    askedDate: '1 week ago',
    category: 'comfort',
    upvotes: 19,
    answers: [
      {
        id: 'a2',
        answer:
          'The earpads utilize our magnetic snap-lock mounting system. You can easily remove and swap them in seconds without adhesive. We also offer perforated vegan suede and cooling velour pads in our accessories catalog.',
        answeredBy: 'Apex Support Team',
        answeredDate: '6 days ago',
        role: 'staff',
        helpfulCount: 22,
      },
      {
        id: 'a3',
        answer:
          'Verified buyer here — swapped mine to the cooling velour for long 6-hour mixing sessions. Magnetic snaps are rock solid!',
        answeredBy: 'Devon T. (Verified Studio Buyer)',
        answeredDate: '5 days ago',
        role: 'verified_buyer',
        helpfulCount: 14,
      },
    ],
  },
  {
    id: 'q3',
    question:
      'Does the included balanced 4.4mm cable work with Sony DAP walkmans and standard desktop audio interfaces?',
    askedBy: 'Kenji S.',
    askedDate: '2 weeks ago',
    category: 'cables',
    upvotes: 15,
    answers: [
      {
        id: 'a4',
        answer:
          'Yes, the native 4.4mm TRRRS Pentaconn termination matches Sony, FiiO, Astell&Kern, and modern studio DAC balanced outputs. The package also includes a gold-plated 6.35mm (1/4") TRS screw-on adapter for standard rack equipment.',
        answeredBy: 'David L. · Product Specialist',
        answeredDate: '2 weeks ago',
        role: 'staff',
        helpfulCount: 16,
      },
    ],
  },
]

const props = withDefaults(defineProps<ProductQaProps>(), {
  productName: 'Apex Pro Reference Studio Monitor Headphones',
})

const localQuestions = ref<QuestionItem[]>(JSON.parse(JSON.stringify(props.questions ?? defaultQuestions)))
const searchQuery = ref('')
const selectedCategory = ref<'all' | 'compatibility' | 'sound' | 'comfort' | 'cables' | 'shipping'>('all')

const isAsking = ref(false)
const newQuestionText = ref('')
const newQuestionCategory = ref<'compatibility' | 'sound' | 'comfort' | 'cables' | 'shipping'>('compatibility')

const categories = [
  { id: 'all', label: 'All Questions' },
  { id: 'compatibility', label: 'Compatibility & DACs' },
  { id: 'sound', label: 'Sound Signature' },
  { id: 'comfort', label: 'Fit & Ergonomics' },
  { id: 'cables', label: 'Cables & Hardware' },
  { id: 'shipping', label: 'Warranty & Shipping' },
]

const filteredQuestions = computed(() => {
  return localQuestions.value.filter((q) => {
    const matchesCat = selectedCategory.value === 'all' || q.category === selectedCategory.value
    const matchesSearch =
      searchQuery.value.trim() === '' ||
      q.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      q.answers.some((a) => a.answer.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesCat && matchesSearch
  })
})

function toggleVoteQuestion(q: QuestionItem) {
  if (q.hasVoted) {
    q.upvotes--
    q.hasVoted = false
  } else {
    q.upvotes++
    q.hasVoted = true
  }
}

function toggleVoteAnswer(ans: QuestionItem['answers'][0]) {
  if (ans.hasUpvoted) {
    ans.helpfulCount--
    ans.hasUpvoted = false
  } else {
    ans.helpfulCount++
    ans.hasUpvoted = true
  }
}

function submitNewQuestion() {
  if (!newQuestionText.value.trim()) return
  localQuestions.value.unshift({
    id: `q-${Date.now()}`,
    question: newQuestionText.value.trim(),
    askedBy: 'You (Guest User)',
    askedDate: 'Just now',
    category: newQuestionCategory.value,
    upvotes: 1,
    hasVoted: true,
    answers: [],
  })
  newQuestionText.value = ''
  isAsking.value = false
}
</script>

<template>
  <Card data-slot="product-qa-community" :class="['border-border w-full shadow-xs', className]">
    <CardHeader class="border-border bg-muted/20 border-b pb-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span
              class="border-border bg-background flex size-6 items-center justify-center rounded-md border shadow-2xs"
            >
              <HelpCircle class="text-primary size-3.5" />
            </span>
            <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Customer & Engineering Community
            </span>
          </div>
          <CardTitle class="text-foreground mt-1 text-lg font-semibold tracking-tight sm:text-xl">
            Questions & Answers
          </CardTitle>
          <CardDescription class="text-xs">
            Have questions about {{ productName }}? Search community inquiries or ask our acoustic engineering team.
          </CardDescription>
        </div>

        <Button size="sm" class="gap-1.5 self-start text-xs shadow-xs sm:self-auto" @click="isAsking = !isAsking">
          <Plus class="size-3.5" />
          <span>Ask a Question</span>
        </Button>
      </div>

      <!-- Controls: Category Chips & Search Input -->
      <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            :class="[
              'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
              selectedCategory === cat.id
                ? 'bg-foreground text-background shadow-2xs'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent',
            ]"
            @click="selectedCategory = cat.id as any"
          >
            {{ cat.label }}
          </button>
        </div>

        <div class="relative w-full sm:w-64">
          <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input v-model="searchQuery" placeholder="Search answered Q&A..." class="h-8 pl-8 text-xs" />
        </div>
      </div>
    </CardHeader>

    <CardContent class="space-y-6 p-4 sm:p-6">
      <!-- Ask Question Form Accordion -->
      <div v-if="isAsking" class="border-primary/40 bg-primary/5 space-y-3 rounded-lg border p-4 shadow-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <MessageSquare class="text-primary size-4" />
            <span class="text-foreground text-xs font-semibold">Post a Question to Engineering & Community</span>
          </div>
          <span class="text-muted-foreground text-xs">Staff answers typically arrive within 4 hours</span>
        </div>

        <Textarea
          v-model="newQuestionText"
          rows="3"
          placeholder="e.g. Does the headband clamping force loosen up after 20 hours of break-in?"
          class="text-xs"
        />

        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2 text-xs">
            <span class="text-muted-foreground">Topic:</span>
            <select
              v-model="newQuestionCategory"
              class="border-border bg-background text-foreground h-7 rounded-md border px-2 text-xs focus:outline-hidden"
            >
              <option value="compatibility">Compatibility & DACs</option>
              <option value="sound">Sound Signature</option>
              <option value="comfort">Fit & Ergonomics</option>
              <option value="cables">Cables & Hardware</option>
              <option value="shipping">Warranty & Shipping</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <Button variant="ghost" size="sm" class="h-7 text-xs" @click="isAsking = false"> Cancel </Button>
            <Button size="sm" class="h-7 gap-1.5 text-xs shadow-2xs" @click="submitNewQuestion">
              <Send class="size-3" />
              <span>Submit Question</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Question List -->
      <div class="divide-border space-y-5 divide-y">
        <div v-for="q in filteredQuestions" :key="q.id" class="space-y-3 pt-5 first:pt-0">
          <!-- Question Header Row -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3">
              <div
                class="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              >
                Q
              </div>
              <div class="space-y-1">
                <h4 class="text-foreground text-sm leading-snug font-semibold">
                  {{ q.question }}
                </h4>
                <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                  <span>Asked by {{ q.askedBy }}</span>
                  <span>·</span>
                  <span>{{ q.askedDate }}</span>
                  <Badge variant="outline" class="h-4.5 font-mono text-xs uppercase">
                    {{ q.category }}
                  </Badge>
                </div>
              </div>
            </div>

            <!-- Upvote Question Button -->
            <button
              type="button"
              :class="[
                'flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all',
                q.hasVoted
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
              ]"
              @click="toggleVoteQuestion(q)"
            >
              <ThumbsUp class="size-3" />
              <span>{{ q.upvotes }}</span>
            </button>
          </div>

          <!-- Answers Section -->
          <div class="ml-9 space-y-3">
            <div
              v-for="ans in q.answers"
              :key="ans.id"
              :class="[
                'space-y-2 rounded-lg border p-3.5 text-xs',
                ans.role === 'staff'
                  ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10'
                  : 'border-border bg-muted/30',
              ]"
            >
              <!-- Answer Meta Bar -->
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <Badge
                    v-if="ans.role === 'staff'"
                    variant="default"
                    class="h-4.5 gap-1 bg-emerald-600 px-1.5 text-xs font-semibold text-white"
                  >
                    <ShieldCheck class="size-2.5" />
                    Staff Expert
                  </Badge>
                  <Badge
                    v-else-if="ans.role === 'verified_buyer'"
                    variant="secondary"
                    class="text-foreground h-4.5 gap-1 px-1.5 text-xs font-semibold"
                  >
                    <CheckCircle class="size-2.5 text-emerald-500" />
                    Verified Owner
                  </Badge>

                  <span class="text-foreground font-semibold">{{ ans.answeredBy }}</span>
                  <span class="text-muted-foreground">· {{ ans.answeredDate }}</span>
                </div>

                <button
                  type="button"
                  :class="[
                    'flex items-center gap-1 text-xs font-medium transition-colors',
                    ans.hasUpvoted ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground',
                  ]"
                  @click="toggleVoteAnswer(ans)"
                >
                  <ThumbsUp class="size-3" />
                  <span>Helpful ({{ ans.helpfulCount }})</span>
                </button>
              </div>

              <!-- Answer Body Text -->
              <p class="text-foreground leading-relaxed">
                {{ ans.answer }}
              </p>
            </div>

            <div
              v-if="q.answers.length === 0"
              class="border-border text-muted-foreground rounded-lg border border-dashed p-3 text-xs"
            >
              Awaiting answer from engineering team. You will be notified when responded.
            </div>
          </div>
        </div>

        <div v-if="filteredQuestions.length === 0" class="text-muted-foreground py-12 text-center text-xs">
          No questions found matching your search. Be the first to ask!
        </div>
      </div>
    </CardContent>
  </Card>
</template>
