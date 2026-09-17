<script setup lang="ts">
import { computed, onMounted, ref, watch, type HTMLAttributes } from 'vue'
import {
  Check,
  Clock,
  Copy,
  Dice5,
  Eye,
  EyeOff,
  Hash,
  History,
  KeyRound,
  Lock,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sliders,
  Trash2,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  class?: HTMLAttributes['class']
}

defineProps<Props>()

// --- WORD LIST & CONSTANTS ---
const WORD_LIST = [
  'anchor',
  'apple',
  'apron',
  'arctic',
  'arrow',
  'atlas',
  'autumn',
  'bacon',
  'badge',
  'banner',
  'beacon',
  'blanket',
  'breeze',
  'bridge',
  'cabin',
  'cactus',
  'camera',
  'candle',
  'canyon',
  'carpet',
  'castle',
  'cedar',
  'celestial',
  'channel',
  'cherry',
  'chimney',
  'cipher',
  'circle',
  'clay',
  'cliff',
  'clock',
  'cloud',
  'clover',
  'cobalt',
  'coffee',
  'comet',
  'compass',
  'copper',
  'coral',
  'cosmos',
  'crater',
  'creek',
  'crystal',
  'curtain',
  'delta',
  'desert',
  'diamond',
  'dolphin',
  'dragon',
  'drift',
  'eagle',
  'earth',
  'echo',
  'eclipse',
  'ember',
  'emerald',
  'engine',
  'falcon',
  'feather',
  'fender',
  'filter',
  'flame',
  'flask',
  'forest',
  'fossil',
  'galaxy',
  'garden',
  'garlic',
  'garnet',
  'gem',
  'glacier',
  'glass',
  'globe',
  'granite',
  'gravel',
  'grove',
  'harbor',
  'haven',
  'hawk',
  'hazel',
  'horizon',
  'island',
  'ivory',
  'jungle',
  'jupiter',
  'kettle',
  'lagoon',
  'lantern',
  'laser',
  'lava',
  'leaf',
  'lemon',
  'leopard',
  'lighthouse',
  'lightning',
  'lotus',
  'lunar',
  'magnet',
  'mango',
  'maple',
  'marble',
  'matrix',
  'meadow',
  'meteor',
  'mineral',
  'mirror',
  'monarch',
  'moon',
  'mosaic',
  'mountain',
  'nebula',
  'nickel',
  'oasis',
  'ocean',
  'olive',
  'onyx',
  'opal',
  'orbit',
  'orchid',
  'oxygen',
  'palace',
  'panther',
  'paradise',
  'pebble',
  'pelican',
  'peacock',
  'phoenix',
  'pillar',
  'planet',
  'plasma',
  'platinum',
  'polar',
  'prism',
  'pulse',
  'pyramid',
  'quartz',
  'quiver',
  'radar',
  'rainbow',
  'raven',
  'reef',
  'ridge',
  'ripple',
  'river',
  'rocket',
  'ruby',
  'safari',
  'sail',
  'sapphire',
  'saturn',
  'shadow',
  'shield',
  'sierra',
  'silver',
  'solstice',
  'spark',
  'sphere',
  'spiral',
  'spring',
  'spruce',
  'star',
  'stone',
  'summit',
  'sunset',
  'surge',
  'timber',
  'topaz',
  'torch',
  'trail',
  'treasure',
  'tundra',
  'valley',
  'vector',
  'velvet',
  'vessel',
  'vintage',
  'violet',
  'vortex',
  'voyage',
  'vulcan',
  'walnut',
  'willow',
  'wind',
  'winter',
  'zenith',
  'zephyr',
]

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz'
const NUMBER_CHARS = '0123456789'
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const AMBIGUOUS_CHARS = new Set(['l', '1', 'I', 'O', '0', 'o', '|', '`', "'", '"', ',', ';'])

export interface HistoryItem {
  id: string
  secret: string
  mode: 'password' | 'passphrase' | 'pin'
  entropy: number
  strengthLabel: string
  createdAt: string
}

// --- STATE ---
const mode = ref<'password' | 'passphrase' | 'pin'>('password')
const passwordLength = ref(20)
const includeUpper = ref(true)
const includeLower = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(true)
const avoidAmbiguous = ref(true)

// Passphrase state
const wordCount = ref(5)
const separator = ref('-')
const capitalizeWords = ref(true)
const includeNumberInPassphrase = ref(true)

// PIN state
const pinLength = ref(6)
const avoidPinRepeats = ref(true)

// Output state
const currentSecret = ref('')
const copied = ref(false)
const isSpinning = ref(false)
const copiedHistoryId = ref<string | null>(null)
const revealedHistoryIds = ref<Set<string>>(new Set())

// History
const history = ref<HistoryItem[]>([
  {
    id: 'hist-1',
    secret: 'kX9#mQ4$vL2!pW8*jT7^',
    mode: 'password',
    entropy: 114,
    strengthLabel: 'Very Strong',
    createdAt: 'Just now',
  },
  {
    id: 'hist-2',
    secret: 'Celestial-Falcon-Lagoon-Timber-83',
    mode: 'passphrase',
    entropy: 48,
    strengthLabel: 'Fair',
    createdAt: '4m ago',
  },
  {
    id: 'hist-3',
    secret: '928401',
    mode: 'pin',
    entropy: 20,
    strengthLabel: 'Very Weak',
    createdAt: '12m ago',
  },
])

// --- CRYPTO RANDOM HELPER ---
function getRandomInt(max: number): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return array[0] % max
  }
  return Math.floor(Math.random() * max)
}

// --- GENERATION FUNCTIONS ---
function generatePassword(): string {
  let pool = ''
  const requiredChars: string[] = []

  const filterPool = (chars: string) => {
    if (!avoidAmbiguous.value) return chars
    return chars
      .split('')
      .filter((c) => !AMBIGUOUS_CHARS.has(c))
      .join('')
  }

  const uppers = filterPool(UPPERCASE_CHARS)
  const lowers = filterPool(LOWERCASE_CHARS)
  const numbers = filterPool(NUMBER_CHARS)
  const symbols = filterPool(SYMBOL_CHARS)

  if (includeUpper.value && uppers.length > 0) {
    pool += uppers
    requiredChars.push(uppers[getRandomInt(uppers.length)])
  }
  if (includeLower.value && lowers.length > 0) {
    pool += lowers
    requiredChars.push(lowers[getRandomInt(lowers.length)])
  }
  if (includeNumbers.value && numbers.length > 0) {
    pool += numbers
    requiredChars.push(numbers[getRandomInt(numbers.length)])
  }
  if (includeSymbols.value && symbols.length > 0) {
    pool += symbols
    requiredChars.push(symbols[getRandomInt(symbols.length)])
  }

  if (pool.length === 0) {
    pool = lowers.length > 0 ? lowers : 'abcdefghjkmnpqrstuvwxyz'
    requiredChars.push(pool[getRandomInt(pool.length)])
  }

  const result: string[] = [...requiredChars]
  for (let i = result.length; i < passwordLength.value; i++) {
    result.push(pool[getRandomInt(pool.length)])
  }

  // Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1)
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }

  return result.join('')
}

function generatePassphrase(): string {
  const chosenWords: string[] = []
  for (let i = 0; i < wordCount.value; i++) {
    let word = WORD_LIST[getRandomInt(WORD_LIST.length)]
    if (capitalizeWords.value) {
      word = word.charAt(0).toUpperCase() + word.slice(1)
    }
    chosenWords.push(word)
  }

  if (includeNumberInPassphrase.value) {
    const num = getRandomInt(90) + 10 // 2-digit number (10-99)
    chosenWords.push(num.toString())
  }

  return chosenWords.join(separator.value)
}

function generatePin(): string {
  const digits: string[] = []
  for (let i = 0; i < pinLength.value; i++) {
    let nextDigit = getRandomInt(10).toString()
    if (avoidPinRepeats.value && digits.length > 0 && nextDigit === digits[digits.length - 1]) {
      nextDigit = ((parseInt(nextDigit, 10) + 1 + getRandomInt(8)) % 10).toString()
    }
    digits.push(nextDigit)
  }
  return digits.join('')
}

function regenerateSecret(recordHistory = true) {
  let secret = ''
  if (mode.value === 'password') {
    secret = generatePassword()
  } else if (mode.value === 'passphrase') {
    secret = generatePassphrase()
  } else {
    secret = generatePin()
  }

  currentSecret.value = secret

  if (recordHistory && secret) {
    const ent = currentStrength.value.entropy
    const item: HistoryItem = {
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      secret,
      mode: mode.value,
      entropy: ent,
      strengthLabel: currentStrength.value.label,
      createdAt: 'Just now',
    }
    // Prepend and limit to 8 items
    history.value = [item, ...history.value.slice(0, 7)]
  }
}

function handleManualRegenerate() {
  isSpinning.value = true
  regenerateSecret(true)
  setTimeout(() => {
    isSpinning.value = false
  }, 400)
}

// Ensure at least one character type stays active in password mode
function toggleUpper(val: boolean) {
  if (!val && !includeLower.value && !includeNumbers.value && !includeSymbols.value) return
  includeUpper.value = val
}

function toggleLower(val: boolean) {
  if (!val && !includeUpper.value && !includeNumbers.value && !includeSymbols.value) return
  includeLower.value = val
}

function toggleNumbers(val: boolean) {
  if (!val && !includeUpper.value && !includeLower.value && !includeSymbols.value) return
  includeNumbers.value = val
}

function toggleSymbols(val: boolean) {
  if (!val && !includeUpper.value && !includeLower.value && !includeNumbers.value) return
  includeSymbols.value = val
}

// Watchers for reactive auto-regeneration
watch(
  [
    mode,
    passwordLength,
    includeUpper,
    includeLower,
    includeNumbers,
    includeSymbols,
    avoidAmbiguous,
    wordCount,
    separator,
    capitalizeWords,
    includeNumberInPassphrase,
    pinLength,
    avoidPinRepeats,
  ],
  () => {
    regenerateSecret(false)
  },
  { immediate: false },
)

onMounted(() => {
  regenerateSecret(false)
})

// --- ENTROPY & STRENGTH METRICS ---
const currentStrength = computed(() => {
  let entropy = 0
  if (mode.value === 'password') {
    let poolSize = 0
    if (includeUpper.value) poolSize += avoidAmbiguous.value ? 24 : 26
    if (includeLower.value) poolSize += avoidAmbiguous.value ? 24 : 26
    if (includeNumbers.value) poolSize += avoidAmbiguous.value ? 8 : 10
    if (includeSymbols.value) poolSize += avoidAmbiguous.value ? 26 : 28
    entropy = poolSize > 1 ? Math.round(passwordLength.value * Math.log2(poolSize)) : 0
  } else if (mode.value === 'passphrase') {
    entropy = wordCount.value * Math.log2(WORD_LIST.length)
    if (capitalizeWords.value) entropy += wordCount.value * 1
    if (includeNumberInPassphrase.value) entropy += Math.log2(90)
    entropy = Math.round(entropy)
  } else {
    entropy = Math.round(pinLength.value * Math.log2(10))
  }

  if (entropy < 30) {
    return {
      entropy,
      score: 1,
      label: 'Very Weak',
      crackTime: 'Instant (< 1 ms)',
      color: 'text-destructive',
      barClass: 'bg-destructive',
    }
  }
  if (entropy < 50) {
    return {
      entropy,
      score: 2,
      label: 'Weak',
      crackTime: 'A few minutes',
      color: 'text-orange-500',
      barClass: 'bg-orange-500',
    }
  }
  if (entropy < 70) {
    return {
      entropy,
      score: 3,
      label: 'Fair',
      crackTime: 'Several months',
      color: 'text-amber-500 dark:text-amber-400',
      barClass: 'bg-amber-500',
    }
  }
  if (entropy < 95) {
    return {
      entropy,
      score: 4,
      label: 'Strong',
      crackTime: 'Hundreds of years',
      color: 'text-emerald-500',
      barClass: 'bg-emerald-500',
    }
  }
  return {
    entropy,
    score: 4,
    label: 'Very Strong',
    crackTime: '100+ billion years',
    color: 'text-emerald-600 dark:text-emerald-400',
    barClass: 'bg-emerald-600',
  }
})

// --- CHARACTER FORMATTING FOR SYNTAX HIGHLIGHTING ---
const formattedCharacters = computed(() => {
  if (!currentSecret.value) return []
  return currentSecret.value.split('').map((char) => {
    let type: 'number' | 'symbol' | 'letter' | 'separator' = 'letter'
    if (/[0-9]/.test(char)) {
      type = 'number'
    } else if (/[-_. /]/.test(char)) {
      type = 'separator'
    } else if (/[^a-zA-Z0-9]/.test(char)) {
      type = 'symbol'
    }
    return { char, type }
  })
})

function formatItemCharacters(text: string) {
  return text.split('').map((char) => {
    let type: 'number' | 'symbol' | 'letter' | 'separator' = 'letter'
    if (/[0-9]/.test(char)) {
      type = 'number'
    } else if (/[-_. /]/.test(char)) {
      type = 'separator'
    } else if (/[^a-zA-Z0-9]/.test(char)) {
      type = 'symbol'
    }
    return { char, type }
  })
}

// --- CLIPBOARD ---
async function copySecret(text: string, isHistory = false, historyId = '') {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    if (isHistory && historyId) {
      copiedHistoryId.value = historyId
      setTimeout(() => {
        if (copiedHistoryId.value === historyId) copiedHistoryId.value = null
      }, 2000)
    } else {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err)
  }
}

function toggleHistoryReveal(id: string) {
  if (revealedHistoryIds.value.has(id)) {
    revealedHistoryIds.value.delete(id)
  } else {
    revealedHistoryIds.value.add(id)
  }
}

function clearHistory() {
  history.value = []
}
</script>

<template>
  <div data-slot="password-generator-widget" :class="cn('mx-auto w-full max-w-4xl space-y-6', $props.class)">
    <!-- HERO: GENERATOR OUTPUT CARD -->
    <Card class="border-border overflow-hidden shadow-xs">
      <CardHeader class="border-border/50 bg-muted/20 border-b pb-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <KeyRound class="size-4" />
            </div>
            <div>
              <CardTitle class="text-base font-semibold">Generated Secret</CardTitle>
              <CardDescription class="text-xs">
                Client-side cryptographic output &amp; entropy estimation
              </CardDescription>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Badge variant="outline" class="gap-1.5 text-xs font-normal">
              <span class="size-2 animate-pulse rounded-full bg-emerald-500" />
              100% Client-Side
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent class="space-y-6 pt-6">
        <!-- Monospace Output Box -->
        <div
          class="border-border/80 bg-muted/40 dark:bg-muted/20 relative flex min-h-[4.75rem] w-full flex-col justify-center gap-4 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between"
        >
          <div
            class="flex flex-wrap items-center gap-x-0.5 gap-y-1 pr-2 font-mono text-lg font-medium tracking-wider break-all select-all md:text-xl"
          >
            <template v-if="formattedCharacters.length > 0">
              <span
                v-for="(item, idx) in formattedCharacters"
                :key="idx"
                :class="[
                  item.type === 'number' && 'font-semibold text-sky-500 dark:text-sky-400',
                  item.type === 'symbol' && 'font-semibold text-amber-500 dark:text-amber-400',
                  item.type === 'separator' && 'text-muted-foreground px-0.5 font-normal',
                  item.type === 'letter' && 'text-foreground font-medium',
                ]"
              >
                {{ item.char }}
              </span>
            </template>
            <span v-else class="text-muted-foreground text-sm">Generating secret...</span>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex shrink-0 items-center gap-2 self-end sm:self-center">
            <Button
              variant="outline"
              size="sm"
              class="h-9 gap-1.5 px-3 transition-all active:scale-95"
              @click="handleManualRegenerate"
            >
              <RefreshCw :class="cn('size-4', isSpinning && 'text-primary animate-spin')" />
              <span class="text-xs font-medium">Regenerate</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              :class="
                cn(
                  'h-9 gap-1.5 px-3.5 transition-all active:scale-95',
                  copied && 'bg-emerald-600 text-white hover:bg-emerald-600',
                )
              "
              @click="copySecret(currentSecret)"
            >
              <Check v-if="copied" class="size-4 stroke-[2.5]" />
              <Copy v-else class="size-4" />
              <span class="text-xs font-medium">{{ copied ? 'Copied!' : 'Copy' }}</span>
            </Button>
          </div>
        </div>

        <!-- Entropy & Strength Meter -->
        <div class="border-border/60 bg-muted/10 space-y-2.5 rounded-lg border p-4">
          <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2">
              <ShieldCheck class="size-4" :class="currentStrength.color" />
              <span class="text-foreground font-semibold">{{ currentStrength.label }}</span>
              <span class="text-muted-foreground font-mono">{{ currentStrength.entropy }}-bit entropy</span>
            </div>
            <div class="text-muted-foreground flex items-center gap-1.5">
              <Clock class="size-3.5" />
              <span>Crack time:</span>
              <span class="text-foreground font-medium">{{ currentStrength.crackTime }}</span>
            </div>
          </div>

          <!-- 4-Segment Strength Bar -->
          <div class="grid h-2 w-full grid-cols-4 gap-1.5 overflow-hidden rounded-full">
            <div
              class="rounded-full transition-all duration-300"
              :class="currentStrength.score >= 1 ? currentStrength.barClass : 'bg-muted/80 dark:bg-muted'"
            />
            <div
              class="rounded-full transition-all duration-300"
              :class="currentStrength.score >= 2 ? currentStrength.barClass : 'bg-muted/80 dark:bg-muted'"
            />
            <div
              class="rounded-full transition-all duration-300"
              :class="currentStrength.score >= 3 ? currentStrength.barClass : 'bg-muted/80 dark:bg-muted'"
            />
            <div
              class="rounded-full transition-all duration-300"
              :class="currentStrength.score >= 4 ? currentStrength.barClass : 'bg-muted/80 dark:bg-muted'"
            />
          </div>

          <!-- Monospace Character Type Legend -->
          <div class="text-muted-foreground flex flex-wrap items-center gap-4 pt-1 text-xs">
            <span class="flex items-center gap-1.5">
              <span class="bg-foreground size-2 rounded-full" />
              Letters
            </span>
            <span class="flex items-center gap-1.5">
              <span class="size-2 rounded-full bg-sky-500" />
              Numbers (0-9)
            </span>
            <span class="flex items-center gap-1.5">
              <span class="size-2 rounded-full bg-amber-500" />
              Symbols (!@#$)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- GENERATOR CONFIGURATION CARD -->
    <Card class="border-border shadow-xs">
      <CardHeader class="border-border/50 border-b pb-3">
        <div class="flex items-center gap-2">
          <div class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-lg">
            <Sliders class="size-4" />
          </div>
          <div>
            <CardTitle class="text-base font-semibold">Generator Configuration</CardTitle>
            <CardDescription class="text-xs">
              Customize character pools, length constraints, and format patterns
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent class="pt-6">
        <Tabs v-model="mode" class="w-full">
          <TabsList class="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="password" class="gap-1.5 text-xs">
              <Lock class="size-3.5" />
              <span>Random Password</span>
            </TabsTrigger>
            <TabsTrigger value="passphrase" class="gap-1.5 text-xs">
              <Dice5 class="size-3.5" />
              <span>Passphrase</span>
            </TabsTrigger>
            <TabsTrigger value="pin" class="gap-1.5 text-xs">
              <Hash class="size-3.5" />
              <span>PIN Code</span>
            </TabsTrigger>
          </TabsList>

          <!-- TAB 1: RANDOM PASSWORD -->
          <TabsContent value="password" class="mt-0 space-y-6">
            <!-- Length Control -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-foreground text-sm font-medium">Password Length</label>
                <Badge variant="secondary" class="font-mono text-xs font-semibold tabular-nums">
                  {{ passwordLength }} characters
                </Badge>
              </div>

              <Slider
                :model-value="passwordLength"
                :min="8"
                :max="64"
                :step="1"
                class="w-full py-1"
                @update:model-value="(val) => (passwordLength = Array.isArray(val) ? val[0] : val)"
              />

              <!-- Preset length buttons -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-muted-foreground mr-1 text-xs">Presets:</span>
                <button
                  v-for="preset in [12, 16, 20, 24, 32, 48, 64]"
                  :key="preset"
                  type="button"
                  :class="
                    cn(
                      'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                      passwordLength === preset
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                    )
                  "
                  @click="passwordLength = preset"
                >
                  {{ preset }}
                </button>
              </div>
            </div>

            <Separator />

            <!-- Character Type Switches -->
            <div class="space-y-3">
              <label class="text-muted-foreground text-xs font-medium"> Character Pools </label>

              <div class="border-border/80 bg-muted/20 space-y-3 rounded-lg border p-4">
                <!-- Uppercase -->
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <div class="text-foreground flex items-center gap-2 text-sm font-medium">
                      <span>Uppercase Letters</span>
                      <span class="text-muted-foreground font-mono text-xs font-normal">(A-Z)</span>
                    </div>
                    <p class="text-muted-foreground text-xs">Include capital Latin characters</p>
                  </div>
                  <Switch :model-value="includeUpper" @update:model-value="toggleUpper" />
                </div>

                <Separator />

                <!-- Lowercase -->
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <div class="text-foreground flex items-center gap-2 text-sm font-medium">
                      <span>Lowercase Letters</span>
                      <span class="text-muted-foreground font-mono text-xs font-normal">(a-z)</span>
                    </div>
                    <p class="text-muted-foreground text-xs">Include small Latin characters</p>
                  </div>
                  <Switch :model-value="includeLower" @update:model-value="toggleLower" />
                </div>

                <Separator />

                <!-- Numbers -->
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <div class="text-foreground flex items-center gap-2 text-sm font-medium">
                      <span>Numbers</span>
                      <span class="font-mono text-xs font-semibold text-sky-500 dark:text-sky-400">(0-9)</span>
                    </div>
                    <p class="text-muted-foreground text-xs">Include numeric digits 0 through 9</p>
                  </div>
                  <Switch :model-value="includeNumbers" @update:model-value="toggleNumbers" />
                </div>

                <Separator />

                <!-- Symbols -->
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <div class="text-foreground flex items-center gap-2 text-sm font-medium">
                      <span>Special Symbols</span>
                      <span class="font-mono text-xs font-semibold text-amber-500 dark:text-amber-400">(!@#$%^&*)</span>
                    </div>
                    <p class="text-muted-foreground text-xs">Include non-alphanumeric punctuation marks</p>
                  </div>
                  <Switch :model-value="includeSymbols" @update:model-value="toggleSymbols" />
                </div>

                <Separator />

                <!-- Avoid Ambiguous -->
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <div class="text-foreground flex items-center gap-2 text-sm font-medium">
                      <span>Avoid Ambiguous Characters</span>
                      <span class="text-muted-foreground font-mono text-xs font-normal">(l, 1, I, O, 0)</span>
                    </div>
                    <p class="text-muted-foreground text-xs">Exclude confusing lookalike letters and digits</p>
                  </div>
                  <Switch :model-value="avoidAmbiguous" @update:model-value="(val) => (avoidAmbiguous = val)" />
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- TAB 2: MEMORABLE PASSPHRASE -->
          <TabsContent value="passphrase" class="mt-0 space-y-6">
            <!-- Word Count Control -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-foreground text-sm font-medium">Number of Words</label>
                <Badge variant="secondary" class="font-mono text-xs font-semibold tabular-nums">
                  {{ wordCount }} words
                </Badge>
              </div>

              <Slider
                :model-value="wordCount"
                :min="3"
                :max="8"
                :step="1"
                class="w-full py-1"
                @update:model-value="(val) => (wordCount = Array.isArray(val) ? val[0] : val)"
              />

              <!-- Preset word count buttons -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-muted-foreground mr-1 text-xs">Presets:</span>
                <button
                  v-for="preset in [3, 4, 5, 6, 8]"
                  :key="preset"
                  type="button"
                  :class="
                    cn(
                      'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                      wordCount === preset
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                    )
                  "
                  @click="wordCount = preset"
                >
                  {{ preset }} words
                </button>
              </div>
            </div>

            <Separator />

            <!-- Separator Selector -->
            <div class="space-y-3">
              <label class="text-muted-foreground text-xs font-medium"> Word Separator </label>

              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="sep in [
                    { id: '-', label: 'Hyphen (-)' },
                    { id: '_', label: 'Under (_)' },
                    { id: '.', label: 'Period (.)' },
                    { id: ' ', label: 'Space ( )' },
                    { id: '/', label: 'Slash (/)' },
                  ]"
                  :key="sep.id"
                  type="button"
                  :class="
                    cn(
                      'flex cursor-pointer flex-col items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition-all',
                      separator === sep.id
                        ? 'bg-primary/10 border-primary text-primary font-semibold shadow-xs'
                        : 'border-border bg-background hover:bg-muted/50 text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="separator = sep.id"
                >
                  <span class="font-mono text-sm font-semibold">{{ sep.id === ' ' ? '␣' : sep.id }}</span>
                  <span class="mt-0.5 truncate text-xs">{{ sep.label.split(' ')[0] }}</span>
                </button>
              </div>
            </div>

            <Separator />

            <!-- Passphrase Switches -->
            <div class="border-border/80 bg-muted/20 space-y-3 rounded-lg border p-4">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <div class="text-foreground text-sm font-medium">Capitalize Words</div>
                  <p class="text-muted-foreground text-xs">Transform each word into TitleCase for easy reading</p>
                </div>
                <Switch :model-value="capitalizeWords" @update:model-value="(val) => (capitalizeWords = val)" />
              </div>

              <Separator />

              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <div class="text-foreground text-sm font-medium">Append Random Number</div>
                  <p class="text-muted-foreground text-xs">Add a 2-digit number (10-99) for additional security</p>
                </div>
                <Switch
                  :model-value="includeNumberInPassphrase"
                  @update:model-value="(val) => (includeNumberInPassphrase = val)"
                />
              </div>
            </div>
          </TabsContent>

          <!-- TAB 3: PIN CODE -->
          <TabsContent value="pin" class="mt-0 space-y-6">
            <!-- Length Control -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-foreground text-sm font-medium">PIN Length</label>
                <Badge variant="secondary" class="font-mono text-xs font-semibold tabular-nums">
                  {{ pinLength }} digits
                </Badge>
              </div>

              <Slider
                :model-value="pinLength"
                :min="4"
                :max="16"
                :step="1"
                class="w-full py-1"
                @update:model-value="(val) => (pinLength = Array.isArray(val) ? val[0] : val)"
              />

              <!-- Preset PIN length buttons -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-muted-foreground mr-1 text-xs">Presets:</span>
                <button
                  v-for="preset in [4, 6, 8, 10, 12, 16]"
                  :key="preset"
                  type="button"
                  :class="
                    cn(
                      'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                      pinLength === preset
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                    )
                  "
                  @click="pinLength = preset"
                >
                  {{ preset }} digits
                </button>
              </div>
            </div>

            <Separator />

            <!-- PIN Rules -->
            <div class="border-border/80 bg-muted/20 space-y-3 rounded-lg border p-4">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <div class="text-foreground text-sm font-medium">Avoid Consecutive Repeated Digits</div>
                  <p class="text-muted-foreground text-xs">
                    Prevent obvious repetitive patterns like &ldquo;1122&rdquo; or &ldquo;8888&rdquo;
                  </p>
                </div>
                <Switch :model-value="avoidPinRepeats" @update:model-value="(val) => (avoidPinRepeats = val)" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    <!-- RECENT HISTORY CARD -->
    <Card class="border-border shadow-xs">
      <CardHeader class="border-border/50 border-b pb-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <div class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-lg">
              <History class="size-4" />
            </div>
            <div>
              <CardTitle class="text-base font-semibold">Generated History</CardTitle>
              <CardDescription class="text-xs">
                Stored in volatile browser memory only &bull; Cleared on page refresh
              </CardDescription>
            </div>
          </div>
          <Button
            v-if="history.length > 0"
            variant="ghost"
            size="sm"
            class="text-muted-foreground hover:text-destructive h-8 gap-1.5 text-xs"
            @click="clearHistory"
          >
            <Trash2 class="size-3.5" />
            <span>Clear History</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent class="pt-4">
        <div v-if="history.length === 0" class="text-muted-foreground py-8 text-center text-xs">
          No recent secrets in session history. Regenerate or copy above to log items here.
        </div>

        <div v-else class="divide-border/60 divide-y">
          <div
            v-for="item in history"
            :key="item.id"
            class="group hover:bg-muted/30 flex flex-col justify-between gap-3 rounded-md px-1 py-3 transition-colors sm:flex-row sm:items-center"
          >
            <div class="flex min-w-0 items-center gap-3">
              <div class="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-md">
                <Lock v-if="item.mode === 'password'" class="size-3.5" />
                <Dice5 v-else-if="item.mode === 'passphrase'" class="size-3.5" />
                <Hash v-else class="size-3.5" />
              </div>

              <div class="min-w-0 space-y-1">
                <div class="flex items-center gap-2">
                  <!-- Monospace secret or masked bullets -->
                  <div class="max-w-[18rem] truncate font-mono text-xs font-medium md:max-w-md">
                    <template v-if="revealedHistoryIds.has(item.id)">
                      <span
                        v-for="(subChar, idx) in formatItemCharacters(item.secret)"
                        :key="idx"
                        :class="[
                          subChar.type === 'number' && 'font-semibold text-sky-500 dark:text-sky-400',
                          subChar.type === 'symbol' && 'font-semibold text-amber-500 dark:text-amber-400',
                          subChar.type === 'separator' && 'text-muted-foreground font-normal',
                          subChar.type === 'letter' && 'text-foreground',
                        ]"
                      >
                        {{ subChar.char }}
                      </span>
                    </template>
                    <span v-else class="text-muted-foreground tracking-widest">
                      &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                    </span>
                  </div>

                  <!-- Reveal Toggle -->
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 transition-colors"
                    title="Toggle Visibility"
                    @click="toggleHistoryReveal(item.id)"
                  >
                    <EyeOff v-if="revealedHistoryIds.has(item.id)" class="size-3.5" />
                    <Eye v-else class="size-3.5" />
                  </button>
                </div>

                <div class="text-muted-foreground flex items-center gap-2 text-xs">
                  <Badge variant="outline" class="px-1.5 py-0 text-xs font-normal">
                    {{ item.mode }}
                  </Badge>
                  <span>&bull;</span>
                  <span>{{ item.entropy }}-bit ({{ item.strengthLabel }})</span>
                  <span>&bull;</span>
                  <span>{{ item.createdAt }}</span>
                </div>
              </div>
            </div>

            <div class="flex shrink-0 items-center gap-2 self-end sm:self-center">
              <Button
                variant="outline"
                size="sm"
                :class="
                  cn(
                    'h-8 gap-1.5 px-2.5 text-xs transition-all active:scale-95',
                    copiedHistoryId === item.id && 'bg-emerald-600 text-white hover:bg-emerald-600',
                  )
                "
                @click="copySecret(item.secret, true, item.id)"
              >
                <Check v-if="copiedHistoryId === item.id" class="size-3.5" />
                <Copy v-else class="size-3.5" />
                <span>{{ copiedHistoryId === item.id ? 'Copied' : 'Copy' }}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter
        class="text-muted-foreground border-border/40 flex items-center justify-between border-t pt-0 pt-3 pb-4 text-xs"
      >
        <span class="flex items-center gap-1.5">
          <Shield class="size-3.5 text-emerald-500" />
          Cryptographically random &bull; Never transmitted over network
        </span>
        <span class="font-mono tabular-nums">{{ history.length }} entries</span>
      </CardFooter>
    </Card>
  </div>
</template>
