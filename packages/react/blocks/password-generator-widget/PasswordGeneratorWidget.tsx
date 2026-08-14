'use client'

import * as React from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

function getRandomInt(max: number): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return array[0] % max
  }
  return Math.floor(Math.random() * max)
}

export function PasswordGeneratorWidget({ className }: { className?: string }) {
  // --- STATE ---
  const [mode, setMode] = React.useState<'password' | 'passphrase' | 'pin'>('password')
  const [passwordLength, setPasswordLength] = React.useState(20)
  const [includeUpper, setIncludeUpper] = React.useState(true)
  const [includeLower, setIncludeLower] = React.useState(true)
  const [includeNumbers, setIncludeNumbers] = React.useState(true)
  const [includeSymbols, setIncludeSymbols] = React.useState(true)
  const [avoidAmbiguous, setAvoidAmbiguous] = React.useState(true)

  // Passphrase state
  const [wordCount, setWordCount] = React.useState(5)
  const [separator, setSeparator] = React.useState('-')
  const [capitalizeWords, setCapitalizeWords] = React.useState(true)
  const [includeNumberInPassphrase, setIncludeNumberInPassphrase] = React.useState(true)

  // PIN state
  const [pinLength, setPinLength] = React.useState(6)
  const [avoidPinRepeats, setAvoidPinRepeats] = React.useState(true)

  // Output & UI state
  const [currentSecret, setCurrentSecret] = React.useState('')
  const [copied, setCopied] = React.useState(false)
  const [isSpinning, setIsSpinning] = React.useState(false)
  const [copiedHistoryId, setCopiedHistoryId] = React.useState<string | null>(null)
  const [revealedHistoryIds, setRevealedHistoryIds] = React.useState<Set<string>>(new Set())

  // History state
  const [history, setHistory] = React.useState<HistoryItem[]>([
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

  // --- ENTROPY & STRENGTH METRICS ---
  const currentStrength = React.useMemo(() => {
    let entropy = 0
    if (mode === 'password') {
      let poolSize = 0
      if (includeUpper) poolSize += avoidAmbiguous ? 24 : 26
      if (includeLower) poolSize += avoidAmbiguous ? 24 : 26
      if (includeNumbers) poolSize += avoidAmbiguous ? 8 : 10
      if (includeSymbols) poolSize += avoidAmbiguous ? 26 : 28
      entropy = poolSize > 1 ? Math.round(passwordLength * Math.log2(poolSize)) : 0
    } else if (mode === 'passphrase') {
      entropy = wordCount * Math.log2(WORD_LIST.length)
      if (capitalizeWords) entropy += wordCount * 1
      if (includeNumberInPassphrase) entropy += Math.log2(90)
      entropy = Math.round(entropy)
    } else {
      entropy = Math.round(pinLength * Math.log2(10))
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
  }, [
    mode,
    passwordLength,
    includeUpper,
    includeLower,
    includeNumbers,
    includeSymbols,
    avoidAmbiguous,
    wordCount,
    capitalizeWords,
    includeNumberInPassphrase,
    pinLength,
  ])

  // --- GENERATION FUNCTIONS ---
  const generatePassword = React.useCallback((): string => {
    let pool = ''
    const requiredChars: string[] = []

    const filterPool = (chars: string) => {
      if (!avoidAmbiguous) return chars
      return chars
        .split('')
        .filter((c) => !AMBIGUOUS_CHARS.has(c))
        .join('')
    }

    const uppers = filterPool(UPPERCASE_CHARS)
    const lowers = filterPool(LOWERCASE_CHARS)
    const numbers = filterPool(NUMBER_CHARS)
    const symbols = filterPool(SYMBOL_CHARS)

    if (includeUpper && uppers.length > 0) {
      pool += uppers
      requiredChars.push(uppers[getRandomInt(uppers.length)])
    }
    if (includeLower && lowers.length > 0) {
      pool += lowers
      requiredChars.push(lowers[getRandomInt(lowers.length)])
    }
    if (includeNumbers && numbers.length > 0) {
      pool += numbers
      requiredChars.push(numbers[getRandomInt(numbers.length)])
    }
    if (includeSymbols && symbols.length > 0) {
      pool += symbols
      requiredChars.push(symbols[getRandomInt(symbols.length)])
    }

    if (pool.length === 0) {
      pool = lowers.length > 0 ? lowers : 'abcdefghjkmnpqrstuvwxyz'
      requiredChars.push(pool[getRandomInt(pool.length)])
    }

    const result: string[] = [...requiredChars]
    for (let i = result.length; i < passwordLength; i++) {
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
  }, [avoidAmbiguous, includeLower, includeNumbers, includeSymbols, includeUpper, passwordLength])

  const generatePassphrase = React.useCallback((): string => {
    const chosenWords: string[] = []
    for (let i = 0; i < wordCount; i++) {
      let word = WORD_LIST[getRandomInt(WORD_LIST.length)]
      if (capitalizeWords) {
        word = word.charAt(0).toUpperCase() + word.slice(1)
      }
      chosenWords.push(word)
    }

    if (includeNumberInPassphrase) {
      const num = getRandomInt(90) + 10 // 2-digit number (10-99)
      chosenWords.push(num.toString())
    }

    return chosenWords.join(separator)
  }, [capitalizeWords, includeNumberInPassphrase, separator, wordCount])

  const generatePin = React.useCallback((): string => {
    const digits: string[] = []
    for (let i = 0; i < pinLength; i++) {
      let nextDigit = getRandomInt(10).toString()
      if (avoidPinRepeats && digits.length > 0 && nextDigit === digits[digits.length - 1]) {
        nextDigit = ((parseInt(nextDigit, 10) + 1 + getRandomInt(8)) % 10).toString()
      }
      digits.push(nextDigit)
    }
    return digits.join('')
  }, [avoidPinRepeats, pinLength])

  const regenerateSecret = React.useCallback(
    (recordHistory = false) => {
      let secret = ''
      if (mode === 'password') {
        secret = generatePassword()
      } else if (mode === 'passphrase') {
        secret = generatePassphrase()
      } else {
        secret = generatePin()
      }

      setCurrentSecret(secret)

      if (recordHistory && secret) {
        const ent = currentStrength.entropy
        const item: HistoryItem = {
          id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          secret,
          mode,
          entropy: ent,
          strengthLabel: currentStrength.label,
          createdAt: 'Just now',
        }
        setHistory((prev) => [item, ...prev.slice(0, 7)])
      }
    },
    [currentStrength.entropy, currentStrength.label, generatePassphrase, generatePassword, generatePin, mode],
  )

  const handleManualRegenerate = React.useCallback(() => {
    setIsSpinning(true)
    regenerateSecret(true)
    setTimeout(() => {
      setIsSpinning(false)
    }, 400)
  }, [regenerateSecret])

  // Ensure at least one character type stays active in password mode
  const handleUpperChange = (val: boolean) => {
    if (!val && !includeLower && !includeNumbers && !includeSymbols) return
    setIncludeUpper(val)
  }

  const handleLowerChange = (val: boolean) => {
    if (!val && !includeUpper && !includeNumbers && !includeSymbols) return
    setIncludeLower(val)
  }

  const handleNumbersChange = (val: boolean) => {
    if (!val && !includeUpper && !includeLower && !includeSymbols) return
    setIncludeNumbers(val)
  }

  const handleSymbolsChange = (val: boolean) => {
    if (!val && !includeUpper && !includeLower && !includeNumbers) return
    setIncludeSymbols(val)
  }

  // Reactive regeneration on parameter change
  React.useEffect(() => {
    regenerateSecret(false)
  }, [
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
  ])

  // --- CHARACTER FORMATTING FOR SYNTAX HIGHLIGHTING ---
  const formattedCharacters = React.useMemo(() => {
    if (!currentSecret) return []
    return currentSecret.split('').map((char) => {
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
  }, [currentSecret])

  const formatItemCharacters = (text: string) => {
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
  const copySecret = async (text: string, isHistory = false, historyId = '') => {
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
        setCopiedHistoryId(historyId)
        setTimeout(() => {
          setCopiedHistoryId((prev) => (prev === historyId ? null : prev))
        }, 2000)
      } else {
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err)
    }
  }

  const toggleHistoryReveal = (id: string) => {
    setRevealedHistoryIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div data-slot="password-generator-widget" className={cn('mx-auto w-full max-w-4xl space-y-6', className)}>
      {/* HERO: GENERATOR OUTPUT CARD */}
      <Card className="border-border overflow-hidden shadow-xs">
        <CardHeader className="border-border/50 bg-muted/20 border-b pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <KeyRound className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Generated Secret</CardTitle>
                <CardDescription className="text-xs">
                  Client-side cryptographic output &amp; entropy estimation
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 text-xs font-normal">
                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                100% Client-Side
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Monospace Output Box */}
          <div className="border-border/80 bg-muted/40 dark:bg-muted/20 relative flex min-h-[4.75rem] w-full flex-col justify-center gap-4 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-0.5 gap-y-1 pr-2 font-mono text-lg font-medium tracking-wider break-all select-all md:text-xl">
              {formattedCharacters.length > 0 ? (
                formattedCharacters.map((item, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      item.type === 'number' && 'font-semibold text-sky-500 dark:text-sky-400',
                      item.type === 'symbol' && 'font-semibold text-amber-500 dark:text-amber-400',
                      item.type === 'separator' && 'text-muted-foreground px-0.5 font-normal',
                      item.type === 'letter' && 'text-foreground font-medium',
                    )}
                  >
                    {item.char}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">Generating secret...</span>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
              <Button
                variant="outline"
                size="sm"
                className="h-9 cursor-pointer gap-1.5 px-3 transition-all active:scale-95"
                onClick={handleManualRegenerate}
              >
                <RefreshCw className={cn('size-4', isSpinning && 'text-primary animate-spin')} />
                <span className="text-xs font-medium">Regenerate</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                className={cn(
                  'h-9 cursor-pointer gap-1.5 px-3.5 transition-all active:scale-95',
                  copied && 'bg-emerald-600 text-white hover:bg-emerald-600',
                )}
                onClick={() => copySecret(currentSecret)}
              >
                {copied ? <Check className="size-4 stroke-[2.5]" /> : <Copy className="size-4" />}
                <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>

          {/* Entropy & Strength Meter */}
          <div className="border-border/60 bg-muted/10 space-y-2.5 rounded-lg border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className={cn('size-4', currentStrength.color)} />
                <span className="text-foreground font-semibold">{currentStrength.label}</span>
                <span className="text-muted-foreground font-mono">{currentStrength.entropy}-bit entropy</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5" />
                <span>Crack time:</span>
                <span className="text-foreground font-medium">{currentStrength.crackTime}</span>
              </div>
            </div>

            {/* 4-Segment Strength Bar */}
            <div className="grid h-2 w-full grid-cols-4 gap-1.5 overflow-hidden rounded-full">
              <div
                className={cn(
                  'rounded-full transition-all duration-300',
                  currentStrength.score >= 1 ? currentStrength.barClass : 'bg-muted/80 dark:bg-muted',
                )}
              />
              <div
                className={cn(
                  'rounded-full transition-all duration-300',
                  currentStrength.score >= 2 ? currentStrength.barClass : 'bg-muted/80 dark:bg-muted',
                )}
              />
              <div
                className={cn(
                  'rounded-full transition-all duration-300',
                  currentStrength.score >= 3 ? currentStrength.barClass : 'bg-muted/80 dark:bg-muted',
                )}
              />
              <div
                className={cn(
                  'rounded-full transition-all duration-300',
                  currentStrength.score >= 4 ? currentStrength.barClass : 'bg-muted/80 dark:bg-muted',
                )}
              />
            </div>

            {/* Monospace Character Type Legend */}
            <div className="text-muted-foreground flex flex-wrap items-center gap-4 pt-1 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="bg-foreground size-2 rounded-full" />
                Letters
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-sky-500" />
                Numbers (0-9)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500" />
                Symbols (!@#$)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GENERATOR CONFIGURATION CARD */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-border/50 border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-lg">
              <Sliders className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Generator Configuration</CardTitle>
              <CardDescription className="text-xs">
                Customize character pools, length constraints, and format patterns
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs
            value={mode}
            onValueChange={(val) => setMode(val as 'password' | 'passphrase' | 'pin')}
            className="w-full"
          >
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="password" className="gap-1.5 text-xs">
                <Lock className="size-3.5" />
                <span>Random Password</span>
              </TabsTrigger>
              <TabsTrigger value="passphrase" className="gap-1.5 text-xs">
                <Dice5 className="size-3.5" />
                <span>Passphrase</span>
              </TabsTrigger>
              <TabsTrigger value="pin" className="gap-1.5 text-xs">
                <Hash className="size-3.5" />
                <span>PIN Code</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: RANDOM PASSWORD */}
            <TabsContent value="password" className="mt-0 space-y-6">
              {/* Length Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-foreground text-sm font-medium">Password Length</label>
                  <Badge variant="secondary" className="font-mono text-xs font-semibold tabular-nums">
                    {passwordLength} characters
                  </Badge>
                </div>

                <Slider
                  value={[passwordLength]}
                  min={8}
                  max={64}
                  step={1}
                  className="w-full py-1"
                  onValueChange={([val]) => setPasswordLength(val)}
                />

                {/* Preset length buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground mr-1 text-xs">Presets:</span>
                  {[12, 16, 20, 24, 32, 48, 64].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={cn(
                        'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                        passwordLength === preset
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                      )}
                      onClick={() => setPasswordLength(preset)}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Character Type Switches */}
              <div className="space-y-3">
                <label className="text-muted-foreground text-xs font-medium">Character Pools</label>

                <div className="border-border/80 bg-muted/20 space-y-3 rounded-lg border p-4">
                  {/* Uppercase */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <span>Uppercase Letters</span>
                        <span className="text-muted-foreground font-mono text-xs font-normal">(A-Z)</span>
                      </div>
                      <p className="text-muted-foreground text-xs">Include capital Latin characters</p>
                    </div>
                    <Switch checked={includeUpper} onCheckedChange={handleUpperChange} />
                  </div>

                  <Separator />

                  {/* Lowercase */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <span>Lowercase Letters</span>
                        <span className="text-muted-foreground font-mono text-xs font-normal">(a-z)</span>
                      </div>
                      <p className="text-muted-foreground text-xs">Include small Latin characters</p>
                    </div>
                    <Switch checked={includeLower} onCheckedChange={handleLowerChange} />
                  </div>

                  <Separator />

                  {/* Numbers */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <span>Numbers</span>
                        <span className="font-mono text-xs font-semibold text-sky-500 dark:text-sky-400">(0-9)</span>
                      </div>
                      <p className="text-muted-foreground text-xs">Include numeric digits 0 through 9</p>
                    </div>
                    <Switch checked={includeNumbers} onCheckedChange={handleNumbersChange} />
                  </div>

                  <Separator />

                  {/* Symbols */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <span>Special Symbols</span>
                        <span className="font-mono text-xs font-semibold text-amber-500 dark:text-amber-400">
                          (!@#$%^&*)
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">Include non-alphanumeric punctuation marks</p>
                    </div>
                    <Switch checked={includeSymbols} onCheckedChange={handleSymbolsChange} />
                  </div>

                  <Separator />

                  {/* Avoid Ambiguous */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <span>Avoid Ambiguous Characters</span>
                        <span className="text-muted-foreground font-mono text-xs font-normal">(l, 1, I, O, 0)</span>
                      </div>
                      <p className="text-muted-foreground text-xs">Exclude confusing lookalike letters and digits</p>
                    </div>
                    <Switch checked={avoidAmbiguous} onCheckedChange={setAvoidAmbiguous} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: MEMORABLE PASSPHRASE */}
            <TabsContent value="passphrase" className="mt-0 space-y-6">
              {/* Word Count Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-foreground text-sm font-medium">Number of Words</label>
                  <Badge variant="secondary" className="font-mono text-xs font-semibold tabular-nums">
                    {wordCount} words
                  </Badge>
                </div>

                <Slider
                  value={[wordCount]}
                  min={3}
                  max={8}
                  step={1}
                  className="w-full py-1"
                  onValueChange={([val]) => setWordCount(val)}
                />

                {/* Preset word count buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground mr-1 text-xs">Presets:</span>
                  {[3, 4, 5, 6, 8].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={cn(
                        'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                        wordCount === preset
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                      )}
                      onClick={() => setWordCount(preset)}
                    >
                      {preset} words
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Separator Selector */}
              <div className="space-y-3">
                <label className="text-muted-foreground text-xs font-medium">Word Separator</label>

                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: '-', label: 'Hyphen (-)' },
                    { id: '_', label: 'Under (_)' },
                    { id: '.', label: 'Period (.)' },
                    { id: ' ', label: 'Space ( )' },
                    { id: '/', label: 'Slash (/)' },
                  ].map((sep) => (
                    <button
                      key={sep.id}
                      type="button"
                      className={cn(
                        'flex cursor-pointer flex-col items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition-all',
                        separator === sep.id
                          ? 'bg-primary/10 border-primary text-primary font-semibold shadow-xs'
                          : 'border-border bg-background hover:bg-muted/50 text-muted-foreground hover:text-foreground',
                      )}
                      onClick={() => setSeparator(sep.id)}
                    >
                      <span className="font-mono text-sm font-semibold">{sep.id === ' ' ? '␣' : sep.id}</span>
                      <span className="mt-0.5 truncate text-xs">{sep.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Passphrase Switches */}
              <div className="border-border/80 bg-muted/20 space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-foreground text-sm font-medium">Capitalize Words</div>
                    <p className="text-muted-foreground text-xs">Transform each word into TitleCase for easy reading</p>
                  </div>
                  <Switch checked={capitalizeWords} onCheckedChange={setCapitalizeWords} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-foreground text-sm font-medium">Append Random Number</div>
                    <p className="text-muted-foreground text-xs">
                      Add a 2-digit number (10-99) for additional security
                    </p>
                  </div>
                  <Switch checked={includeNumberInPassphrase} onCheckedChange={setIncludeNumberInPassphrase} />
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: PIN CODE */}
            <TabsContent value="pin" className="mt-0 space-y-6">
              {/* Length Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-foreground text-sm font-medium">PIN Length</label>
                  <Badge variant="secondary" className="font-mono text-xs font-semibold tabular-nums">
                    {pinLength} digits
                  </Badge>
                </div>

                <Slider
                  value={[pinLength]}
                  min={4}
                  max={16}
                  step={1}
                  className="w-full py-1"
                  onValueChange={([val]) => setPinLength(val)}
                />

                {/* Preset PIN length buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground mr-1 text-xs">Presets:</span>
                  {[4, 6, 8, 10, 12, 16].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={cn(
                        'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                        pinLength === preset
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                      )}
                      onClick={() => setPinLength(preset)}
                    >
                      {preset} digits
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* PIN Rules */}
              <div className="border-border/80 bg-muted/20 space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-foreground text-sm font-medium">Avoid Consecutive Repeated Digits</div>
                    <p className="text-muted-foreground text-xs">
                      Prevent obvious repetitive patterns like &ldquo;1122&rdquo; or &ldquo;8888&rdquo;
                    </p>
                  </div>
                  <Switch checked={avoidPinRepeats} onCheckedChange={setAvoidPinRepeats} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* RECENT HISTORY CARD */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-border/50 border-b pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-lg">
                <History className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Generated History</CardTitle>
                <CardDescription className="text-xs">
                  Stored in volatile browser memory only &bull; Cleared on page refresh
                </CardDescription>
              </div>
            </div>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive h-8 cursor-pointer gap-1.5 text-xs"
                onClick={clearHistory}
              >
                <Trash2 className="size-3.5" />
                <span>Clear History</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {history.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-xs">
              No recent secrets in session history. Regenerate or copy above to log items here.
            </div>
          ) : (
            <div className="divide-border/60 divide-y">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="group hover:bg-muted/30 flex flex-col justify-between gap-3 rounded-md px-1 py-3 transition-colors sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-md">
                      {item.mode === 'password' && <Lock className="size-3.5" />}
                      {item.mode === 'passphrase' && <Dice5 className="size-3.5" />}
                      {item.mode === 'pin' && <Hash className="size-3.5" />}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        {/* Monospace secret or masked bullets */}
                        <div className="max-w-[18rem] truncate font-mono text-xs font-medium md:max-w-md">
                          {revealedHistoryIds.has(item.id) ? (
                            formatItemCharacters(item.secret).map((subChar, idx) => (
                              <span
                                key={idx}
                                className={cn(
                                  subChar.type === 'number' && 'font-semibold text-sky-500 dark:text-sky-400',
                                  subChar.type === 'symbol' && 'font-semibold text-amber-500 dark:text-amber-400',
                                  subChar.type === 'separator' && 'text-muted-foreground font-normal',
                                  subChar.type === 'letter' && 'text-foreground',
                                )}
                              >
                                {subChar.char}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground tracking-widest">
                              &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                            </span>
                          )}
                        </div>

                        {/* Reveal Toggle */}
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 transition-colors"
                          title="Toggle Visibility"
                          onClick={() => toggleHistoryReveal(item.id)}
                        >
                          {revealedHistoryIds.has(item.id) ? (
                            <EyeOff className="size-3.5" />
                          ) : (
                            <Eye className="size-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="px-1.5 py-0 text-xs font-normal">
                          {item.mode}
                        </Badge>
                        <span>&bull;</span>
                        <span>
                          {item.entropy}-bit ({item.strengthLabel})
                        </span>
                        <span>&bull;</span>
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        'h-8 cursor-pointer gap-1.5 px-2.5 text-xs transition-all active:scale-95',
                        copiedHistoryId === item.id && 'bg-emerald-600 text-white hover:bg-emerald-600',
                      )}
                      onClick={() => copySecret(item.secret, true, item.id)}
                    >
                      {copiedHistoryId === item.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      <span>{copiedHistoryId === item.id ? 'Copied' : 'Copy'}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-muted-foreground border-border/40 flex items-center justify-between border-t pt-0 pt-3 pb-4 text-xs">
          <span className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-emerald-500" />
            Cryptographically random &bull; Never transmitted over network
          </span>
          <span className="font-mono tabular-nums">{history.length} entries</span>
        </CardFooter>
      </Card>
    </div>
  )
}
