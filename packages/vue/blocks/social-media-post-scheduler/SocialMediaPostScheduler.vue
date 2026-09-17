<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Bookmark,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Repeat2,
  Send,
  Share2,
  Sparkles,
  ThumbsUp,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface SocialMediaPostSchedulerProps {
  initialContent?: string
  initialChannels?: string[]
  initialMediaUrl?: string
  initialDate?: string
  initialTime?: string
  initialAutoRepost?: boolean
}

const props = withDefaults(defineProps<SocialMediaPostSchedulerProps>(), {
  initialContent:
    'Excited to announce the new component release for our open source design system! 🚀 Built with accessible keyboard ergonomics, fluid motion, and crisp token hierarchy out of the box.\n\n#UI #Developer #OpenSource',
  initialChannels: () => ['twitter', 'linkedin', 'instagram', 'threads'],
  initialMediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  initialDate: '2026-08-25',
  initialTime: '10:00 AM EST',
  initialAutoRepost: true,
})

// State
const content = ref(props.initialContent)
const selectedChannels = ref<string[]>([...props.initialChannels])
const activeTab = ref('twitter')
const mediaUrl = ref<string | null>(props.initialMediaUrl)
const scheduledDate = ref(props.initialDate)
const scheduledTime = ref(props.initialTime)
const autoRepost = ref(props.initialAutoRepost)
const firstCommentThread = ref(true)
const isLikedInPreview = ref(false)
const notificationMessage = ref<string | null>(null)
const notificationType = ref<'success' | 'draft'>('success')

// Hardcoded Author Profile Data
const author = {
  name: 'Alex Morgan',
  role: 'Staff Product Engineer',
  headline: 'Staff Product Engineer · Building open-source UI design systems & web tools',
  twitterHandle: '@alexmorgan_dev',
  instagramHandle: 'alexmorgan.dev',
  threadsHandle: 'alexmorgan',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  initials: 'AM',
}

// Media Presets
const sampleImages = [
  {
    id: 'dashboard',
    label: 'Dashboard Preview',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 × 675 px · 284 KB',
    aspect: '16:9 Landscape',
  },
  {
    id: 'workspace',
    label: 'Dev Workspace',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 × 800 px · 340 KB',
    aspect: '3:2 Photo',
  },
  {
    id: 'design',
    label: 'Design Canvas',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1080 × 1080 px · 410 KB',
    aspect: '1:1 Square',
  },
]

// Suggested Hashtags
const suggestedHashtags = [
  '#UI',
  '#Developer',
  '#OpenSource',
  '#DesignSystem',
  '#WebDev',
  '#Frontend',
  '#Tech',
  '#SaaS',
]

// Quick Emojis
const quickEmojis = ['🚀', '✨', '💡', '🔥', '📊', '🧵', '🎉', '⚡', '👇', '🎯']

// Recommended Time Slots
const timeSlots = ['09:00 AM EST', '10:00 AM EST', '01:30 PM EST', '05:00 PM EST']

// Platform Specs
const platformLimits: Record<string, { name: string; limit: number; color: string }> = {
  twitter: { name: 'X (Twitter)', limit: 280, color: 'text-sky-500' },
  threads: { name: 'Threads', limit: 500, color: 'text-foreground' },
  instagram: { name: 'Instagram', limit: 2200, color: 'text-pink-500' },
  linkedin: { name: 'LinkedIn', limit: 3000, color: 'text-blue-600' },
}

// Channel Toggle Logic
function toggleChannel(channelId: string) {
  if (selectedChannels.value.includes(channelId)) {
    if (selectedChannels.value.length > 1) {
      selectedChannels.value = selectedChannels.value.filter((c) => c !== channelId)
    }
  } else {
    selectedChannels.value.push(channelId)
  }
}

function isChannelSelected(channelId: string) {
  return selectedChannels.value.includes(channelId)
}

// Hashtag & Emoji Insertion
function insertHashtag(tag: string) {
  if (content.value.includes(tag)) return
  if (!content.value.trim()) {
    content.value = tag
  } else {
    content.value = `${content.value.trim()} ${tag}`
  }
}

function insertEmoji(emoji: string) {
  content.value = `${content.value}${emoji}`
}

function polishWithAi() {
  content.value =
    '🚀 Excited to announce our newest UI component release! Built with zero-dependency headless primitives, fluid spring physics, and full OKLCH dark mode tokens.\n\nExplore the interactive playground & let us know your thoughts below! 👇\n\n#UI #Developer #OpenSource #DesignSystem'
}

function setPresetImage(url: string) {
  mediaUrl.value = url
}

function removeMedia() {
  mediaUrl.value = null
}

function saveDraft() {
  notificationType.value = 'draft'
  notificationMessage.value =
    'Post draft saved locally. All changes, media attachments, and channel targets are up to date.'
}

function schedulePost() {
  notificationType.value = 'success'
  notificationMessage.value = `Post scheduled for ${scheduledDate.value} at ${scheduledTime.value} across ${selectedChannels.value.length} connected channels!`
}

function dismissNotification() {
  notificationMessage.value = null
}

// Character Limit Computed
const currentLength = computed(() => content.value.length)
const currentPlatformLimit = computed(() => platformLimits[activeTab.value]?.limit ?? 280)
const isOverLimit = computed(() => currentLength.value > currentPlatformLimit.value)
const isWarningLimit = computed(() => currentLength.value > currentPlatformLimit.value - 40 && !isOverLimit.value)

// Text tokens parsing for hashtag highlighting in preview
const formattedContentSegments = computed(() => {
  if (!content.value) return []
  // Split by hashtags or newlines
  const words = content.value.split(/(\s+)/)
  return words.map((word) => ({
    text: word,
    isHashtag: word.startsWith('#') && word.length > 1,
    isMention: word.startsWith('@') && word.length > 1,
  }))
})
</script>

<template>
  <div data-slot="social-media-post-scheduler" class="bg-background text-foreground flex w-full flex-col gap-6">
    <!-- Top Global Header -->
    <header
      class="bg-card border-border flex flex-col gap-4 rounded-xl border p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <Calendar class="size-4" />
          </div>
          <h1 class="text-foreground text-lg font-semibold tracking-tight">Social Post Composer & Scheduler</h1>
          <Badge variant="secondary" class="font-mono text-xs"> {{ selectedChannels.length }} / 4 Networks </Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          Compose, calibrate, and orchestrate cross-platform social broadcasts with live authentic previews.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <Button variant="outline" size="sm" @click="saveDraft">
          <Bookmark class="mr-1.5 size-3.5" />
          Save Draft
        </Button>
        <Button size="sm" @click="schedulePost">
          <Calendar class="mr-1.5 size-3.5" />
          Schedule Post
        </Button>
      </div>
    </header>

    <!-- Feedback Notification Toast Banner -->
    <div
      v-if="notificationMessage"
      :class="
        cn(
          'flex items-center justify-between rounded-lg border p-3.5 text-sm shadow-xs transition-all',
          notificationType === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
            : 'bg-primary/10 border-primary/20 text-primary',
        )
      "
    >
      <div class="flex flex-wrap items-center gap-2.5">
        <CheckCircle2 v-if="notificationType === 'success'" class="size-4 shrink-0" />
        <Bookmark v-else class="size-4 shrink-0" />
        <span>{{ notificationMessage }}</span>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded p-1 focus-visible:ring-2 focus-visible:outline-none"
        @click="dismissNotification"
      >
        <X class="size-4" />
      </button>
    </div>

    <!-- 2-Column Composer & Live Preview Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Composer, Channels, Media, Schedule Settings -->
      <section class="space-y-6 lg:col-span-6">
        <!-- Target Channels Selection Card -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <CardTitle class="text-base font-semibold">Publishing Channels</CardTitle>
              <span class="text-muted-foreground text-xs font-medium">Select all target feeds</span>
            </div>
            <CardDescription class="text-xs">
              Toggle the target social accounts for this scheduled broadcast.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <!-- X (Twitter) Pill -->
              <button
                type="button"
                :class="
                  cn(
                    'group focus-visible:ring-ring relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                    isChannelSelected('twitter')
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'border-border bg-card hover:bg-accent/50 opacity-65',
                  )
                "
                @click="toggleChannel('twitter')"
              >
                <div class="flex w-full items-center justify-between">
                  <div class="bg-foreground text-background flex size-6 items-center justify-center rounded-md">
                    <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      />
                    </svg>
                  </div>
                  <div
                    :class="
                      cn(
                        'flex size-4 items-center justify-center rounded-full text-xs',
                        isChannelSelected('twitter') ? 'bg-primary text-primary-foreground' : 'border-border border',
                      )
                    "
                  >
                    <Check v-if="isChannelSelected('twitter')" class="size-2.5 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <div class="text-xs font-semibold">X / Twitter</div>
                  <div class="text-muted-foreground text-xs">280 chars</div>
                </div>
              </button>

              <!-- LinkedIn Pill -->
              <button
                type="button"
                :class="
                  cn(
                    'group focus-visible:ring-ring relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                    isChannelSelected('linkedin')
                      ? 'border-blue-600 bg-blue-600/5 ring-1 ring-blue-600'
                      : 'border-border bg-card hover:bg-accent/50 opacity-65',
                  )
                "
                @click="toggleChannel('linkedin')"
              >
                <div class="flex w-full items-center justify-between">
                  <div class="flex size-6 items-center justify-center rounded-md bg-[#0077B5] text-white">
                    <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path
                        d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.4 9.74v-8.37H5.06v8.37z"
                      />
                    </svg>
                  </div>
                  <div
                    :class="
                      cn(
                        'flex size-4 items-center justify-center rounded-full text-xs',
                        isChannelSelected('linkedin') ? 'bg-blue-600 text-white' : 'border-border border',
                      )
                    "
                  >
                    <Check v-if="isChannelSelected('linkedin')" class="size-2.5 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <div class="text-xs font-semibold">LinkedIn</div>
                  <div class="text-muted-foreground text-xs">3,000 chars</div>
                </div>
              </button>

              <!-- Instagram Pill -->
              <button
                type="button"
                :class="
                  cn(
                    'group focus-visible:ring-ring relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                    isChannelSelected('instagram')
                      ? 'border-pink-500 bg-pink-500/5 ring-1 ring-pink-500'
                      : 'border-border bg-card hover:bg-accent/50 opacity-65',
                  )
                "
                @click="toggleChannel('instagram')"
              >
                <div class="flex w-full items-center justify-between">
                  <div
                    class="flex size-6 items-center justify-center rounded-md bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white"
                  >
                    <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path
                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                      />
                    </svg>
                  </div>
                  <div
                    :class="
                      cn(
                        'flex size-4 items-center justify-center rounded-full text-xs',
                        isChannelSelected('instagram') ? 'bg-pink-500 text-white' : 'border-border border',
                      )
                    "
                  >
                    <Check v-if="isChannelSelected('instagram')" class="size-2.5 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <div class="text-xs font-semibold">Instagram</div>
                  <div class="text-muted-foreground text-xs">2,200 chars</div>
                </div>
              </button>

              <!-- Threads Pill -->
              <button
                type="button"
                :class="
                  cn(
                    'group focus-visible:ring-ring relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                    isChannelSelected('threads')
                      ? 'border-foreground bg-foreground/5 ring-foreground ring-1'
                      : 'border-border bg-card hover:bg-accent/50 opacity-65',
                  )
                "
                @click="toggleChannel('threads')"
              >
                <div class="flex w-full items-center justify-between">
                  <div class="bg-foreground text-background flex size-6 items-center justify-center rounded-md">
                    <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path
                        d="M12.186 24C5.454 24 0 18.618 0 12.016 0 5.414 5.454.032 12.186.032c6.64 0 11.966 5.228 12.004 11.758a12.08 12.08 0 0 1-3.69 8.643 11.85 11.85 0 0 1-8.314 3.567zm0-2.352a9.66 9.66 0 0 0 6.84-2.88 9.77 9.77 0 0 0 2.83-6.978c-.03-5.263-4.3-9.458-9.67-9.458-5.438 0-9.845 4.343-9.845 9.684 0 5.342 4.407 9.632 9.845 9.632z"
                      />
                    </svg>
                  </div>
                  <div
                    :class="
                      cn(
                        'flex size-4 items-center justify-center rounded-full text-xs',
                        isChannelSelected('threads') ? 'bg-foreground text-background' : 'border-border border',
                      )
                    "
                  >
                    <Check v-if="isChannelSelected('threads')" class="size-2.5 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <div class="text-xs font-semibold">Threads</div>
                  <div class="text-muted-foreground text-xs">500 chars</div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <!-- Post Content Composer Card -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <CardTitle class="text-base font-semibold">Post Content</CardTitle>
              <Button variant="ghost" size="xs" class="text-primary hover:text-primary gap-1" @click="polishWithAi">
                <Sparkles class="size-3.5" />
                <span>AI Polish</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Textarea -->
            <div class="space-y-2">
              <Textarea
                v-model="content"
                rows="6"
                placeholder="What would you like to share? Write once, preview across all social platforms..."
                class="min-h-[140px] text-sm"
              />

              <!-- Bottom Bar: Emojis & Character Counter -->
              <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
                <!-- Quick Emojis -->
                <div class="flex flex-wrap items-center gap-1">
                  <button
                    v-for="emoji in quickEmojis"
                    :key="emoji"
                    type="button"
                    class="hover:bg-muted text-muted-foreground hover:text-foreground focus-visible:ring-ring flex size-7 items-center justify-center rounded text-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                    @click="insertEmoji(emoji)"
                  >
                    {{ emoji }}
                  </button>
                </div>

                <!-- Character Counter with dynamic limits -->
                <div class="flex items-center gap-2">
                  <Badge
                    :variant="isOverLimit ? 'destructive' : isWarningLimit ? 'warning' : 'secondary'"
                    class="font-mono text-xs"
                  >
                    {{ currentLength }} / {{ currentPlatformLimit }}
                  </Badge>
                </div>
              </div>
            </div>

            <!-- Hashtag suggestions chips -->
            <div class="space-y-1.5 pt-1">
              <span class="text-muted-foreground text-xs font-medium">Recommended Hashtags</span>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="tag in suggestedHashtags"
                  :key="tag"
                  type="button"
                  :class="
                    cn(
                      'focus-visible:ring-ring min-h-6 rounded-md border px-2 py-0.5 text-xs font-medium transition-all focus-visible:ring-1 focus-visible:outline-none',
                      content.includes(tag)
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                    )
                  "
                  @click="insertHashtag(tag)"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Media Attachment Dropzone Card -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <CardTitle class="text-base font-semibold">Media Attachment</CardTitle>
              <Badge v-if="mediaUrl" variant="success" class="text-xs">Attached</Badge>
              <Badge v-else variant="outline" class="text-xs">Optional</Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-3">
            <!-- Active Media Preview -->
            <div
              v-if="mediaUrl"
              class="border-border bg-muted/20 relative flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="border-border relative size-16 shrink-0 overflow-hidden rounded-md border">
                  <img :src="mediaUrl" alt="Post attachment preview" class="size-full object-cover" />
                </div>
                <div class="space-y-1">
                  <div class="text-foreground text-xs font-semibold">product-launch-graphic.png</div>
                  <div class="text-muted-foreground text-xs">1200 × 675 px · 284 KB</div>
                  <Badge variant="secondary" class="text-xs">16:9 Aspect</Badge>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-destructive hover:text-destructive hover:bg-destructive/10"
                  @click="removeMedia"
                >
                  <Trash2 class="mr-1.5 size-3.5" />
                  Remove
                </Button>
              </div>
            </div>

            <!-- Upload Dropzone (when empty) -->
            <div
              v-else
              class="border-border hover:border-primary/50 flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors"
            >
              <div class="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
                <UploadCloud class="size-5" />
              </div>
              <p class="text-foreground mt-2 text-xs font-semibold">Drag & drop media attachment</p>
              <p class="text-muted-foreground text-xs">PNG, JPG, GIF or MP4 up to 25MB</p>
            </div>

            <!-- Preset Sample Selector -->
            <div class="space-y-1.5 pt-1">
              <span class="text-muted-foreground text-xs font-medium">Quick Sample Media:</span>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="sample in sampleImages"
                  :key="sample.id"
                  type="button"
                  :class="
                    cn(
                      'focus-visible:ring-ring min-h-6 rounded-md border px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-1 focus-visible:outline-none',
                      mediaUrl === sample.url
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="setPresetImage(sample.url)"
                >
                  {{ sample.label }}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Schedule Configuration Card -->
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-base font-semibold">Schedule Settings</CardTitle>
            <CardDescription class="text-xs">
              Determine publish timing and automated amplification rules.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div class="space-y-1.5">
                <label class="text-foreground text-xs font-medium">Publish Date</label>
                <Input v-model="scheduledDate" type="date" class="text-xs" />
              </div>
              <div class="space-y-1.5">
                <label class="text-foreground text-xs font-medium">Publish Time</label>
                <Input v-model="scheduledTime" placeholder="10:00 AM EST" class="text-xs" />
              </div>
            </div>

            <!-- Optimal engagement recommendation banner -->
            <div class="bg-primary/5 border-primary/20 flex items-start gap-2.5 rounded-lg border p-3 text-xs">
              <Sparkles class="text-primary mt-0.5 size-4 shrink-0" />
              <div class="space-y-1">
                <span class="text-foreground font-semibold">Optimal window: 10:00 AM EST</span>
                <p class="text-muted-foreground leading-relaxed">
                  Based on your audience timezone, posting between 09:30 AM – 10:30 AM EST generates +34% higher average
                  CTR.
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <button
                    v-for="slot in timeSlots"
                    :key="slot"
                    type="button"
                    :class="
                      cn(
                        'focus-visible:ring-ring min-h-6 rounded border px-2 py-0.5 text-xs transition-colors focus-visible:ring-1 focus-visible:outline-none',
                        scheduledTime === slot
                          ? 'border-primary bg-primary text-primary-foreground font-medium'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground',
                      )
                    "
                    @click="scheduledTime = slot"
                  >
                    {{ slot }}
                  </button>
                </div>
              </div>
            </div>

            <Separator />

            <!-- Switches -->
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-2">
                <div class="space-y-0.5">
                  <span class="text-foreground text-xs font-medium">Auto-repost evergreen content</span>
                  <p class="text-muted-foreground text-xs">
                    Reshuffle and repost to X & Threads after 24h if initial engagement crosses 100 interactions.
                  </p>
                </div>
                <Switch v-model="autoRepost" />
              </div>

              <div class="flex items-center justify-between gap-2">
                <div class="space-y-0.5">
                  <span class="text-foreground text-xs font-medium">Auto-append first comment / thread link</span>
                  <p class="text-muted-foreground text-xs">
                    Places outbound GitHub & documentation links in the first comment to avoid algorithm penalty.
                  </p>
                </div>
                <Switch v-model="firstCommentThread" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <!-- Right Column: Live Social Feed Preview -->
      <section class="space-y-4 lg:col-span-6">
        <Card class="flex h-full flex-col">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <CardTitle class="text-base font-semibold">Live Social Feed Preview</CardTitle>
                <Badge
                  variant="outline"
                  class="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                >
                  <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live Sync
                </Badge>
              </div>
              <span class="text-muted-foreground font-mono text-xs">
                Scheduled: {{ scheduledDate }} · {{ scheduledTime }}
              </span>
            </div>
            <CardDescription class="text-xs">
              Preview pixel-accurate mockups in authentic platform containers.
            </CardDescription>
          </CardHeader>

          <CardContent class="flex flex-1 flex-col space-y-4">
            <!-- Platform Preview Switcher Tabs -->
            <Tabs v-model="activeTab" class="w-full">
              <TabsList class="grid w-full grid-cols-4">
                <TabsTrigger value="twitter" class="gap-1.5 text-xs">
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </svg>
                  <span>X / Twitter</span>
                </TabsTrigger>
                <TabsTrigger value="linkedin" class="gap-1.5 text-xs">
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.4 9.74v-8.37H5.06v8.37z"
                    />
                  </svg>
                  <span>LinkedIn</span>
                </TabsTrigger>
                <TabsTrigger value="instagram" class="gap-1.5 text-xs">
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    />
                  </svg>
                  <span>Instagram</span>
                </TabsTrigger>
                <TabsTrigger value="threads" class="gap-1.5 text-xs">
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      d="M12.186 24C5.454 24 0 18.618 0 12.016 0 5.414 5.454.032 12.186.032c6.64 0 11.966 5.228 12.004 11.758a12.08 12.08 0 0 1-3.69 8.643 11.85 11.85 0 0 1-8.314 3.567zm0-2.352a9.66 9.66 0 0 0 6.84-2.88 9.77 9.77 0 0 0 2.83-6.978c-.03-5.263-4.3-9.458-9.67-9.458-5.438 0-9.845 4.343-9.845 9.684 0 5.342 4.407 9.632 9.845 9.632z"
                    />
                  </svg>
                  <span>Threads</span>
                </TabsTrigger>
              </TabsList>

              <!-- TAB 1: X / Twitter Mockup -->
              <TabsContent value="twitter" class="mt-4">
                <div class="border-border bg-card rounded-xl border p-4 shadow-xs">
                  <div class="flex items-start gap-3">
                    <Avatar class="size-10">
                      <AvatarImage :src="author.avatar" :alt="author.name" />
                      <AvatarFallback>{{ author.initials }}</AvatarFallback>
                    </Avatar>

                    <div class="flex-1 space-y-2">
                      <!-- X Header -->
                      <div class="flex items-center justify-between">
                        <div class="flex flex-wrap items-center gap-1.5">
                          <span class="text-foreground text-sm font-bold">{{ author.name }}</span>
                          <!-- Verified blue check badge -->
                          <svg class="size-4 shrink-0 fill-sky-500 text-sky-500" viewBox="0 0 24 24">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.004 6.308a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            />
                          </svg>
                          <span class="text-muted-foreground text-xs">{{ author.twitterHandle }}</span>
                          <span class="text-muted-foreground text-xs">· Scheduled</span>
                        </div>
                        <MoreHorizontal class="text-muted-foreground size-4" />
                      </div>

                      <!-- X Body -->
                      <div class="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        <template v-for="(seg, idx) in formattedContentSegments" :key="idx">
                          <span v-if="seg.isHashtag" class="cursor-pointer font-normal text-sky-500 hover:underline">{{
                            seg.text
                          }}</span>
                          <span v-else>{{ seg.text }}</span>
                        </template>
                        <span v-if="!content" class="text-muted-foreground italic">Post body is empty...</span>
                      </div>

                      <!-- Attached Media -->
                      <div v-if="mediaUrl" class="border-border mt-3 overflow-hidden rounded-2xl border">
                        <img :src="mediaUrl" alt="Post preview image" class="max-h-72 w-full object-cover" />
                      </div>

                      <!-- Scheduled Metadata Stamp -->
                      <div class="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                        <Clock class="size-3" />
                        <span>Will publish on {{ scheduledDate }} at {{ scheduledTime }}</span>
                      </div>

                      <Separator class="my-2" />

                      <!-- X Action Bar -->
                      <div class="text-muted-foreground flex items-center justify-between text-xs">
                        <button
                          type="button"
                          class="flex min-h-6 items-center gap-1.5 transition-colors hover:text-sky-500"
                        >
                          <MessageCircle class="size-4" />
                          <span>24</span>
                        </button>
                        <button
                          type="button"
                          class="flex min-h-6 items-center gap-1.5 transition-colors hover:text-emerald-500"
                        >
                          <Repeat2 class="size-4" />
                          <span>12</span>
                        </button>
                        <button
                          type="button"
                          class="flex min-h-6 items-center gap-1.5 transition-colors hover:text-rose-500"
                          :class="isLikedInPreview ? 'text-rose-500' : ''"
                          @click="isLikedInPreview = !isLikedInPreview"
                        >
                          <Heart class="size-4" :class="isLikedInPreview ? 'fill-rose-500' : ''" />
                          <span>{{ isLikedInPreview ? 159 : 158 }}</span>
                        </button>
                        <button
                          type="button"
                          class="flex min-h-6 items-center gap-1.5 transition-colors hover:text-sky-500"
                        >
                          <Eye class="size-4" />
                          <span>4.2K</span>
                        </button>
                        <div class="flex items-center gap-2">
                          <Bookmark class="hover:text-foreground size-4 cursor-pointer" />
                          <Share2 class="hover:text-foreground size-4 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <!-- TAB 2: LinkedIn Mockup -->
              <TabsContent value="linkedin" class="mt-4">
                <div class="border-border bg-card rounded-xl border p-4 shadow-xs">
                  <!-- LinkedIn Header -->
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                      <Avatar class="size-11">
                        <AvatarImage :src="author.avatar" :alt="author.name" />
                        <AvatarFallback>{{ author.initials }}</AvatarFallback>
                      </Avatar>
                      <div class="space-y-0.5">
                        <div class="flex items-center gap-1.5">
                          <span class="text-foreground text-sm font-semibold">{{ author.name }}</span>
                          <span class="text-muted-foreground text-xs">• 1st</span>
                        </div>
                        <p class="text-muted-foreground line-clamp-1 text-xs">{{ author.headline }}</p>
                        <div class="text-muted-foreground flex items-center gap-1 text-xs">
                          <span>Scheduled ({{ scheduledDate }})</span>
                          <span>•</span>
                          <Globe class="size-3" />
                        </div>
                      </div>
                    </div>
                    <MoreHorizontal class="text-muted-foreground size-4" />
                  </div>

                  <!-- LinkedIn Body -->
                  <div class="text-foreground mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                    <template v-for="(seg, idx) in formattedContentSegments" :key="idx">
                      <span
                        v-if="seg.isHashtag"
                        class="cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >{{ seg.text }}</span
                      >
                      <span v-else>{{ seg.text }}</span>
                    </template>
                    <span v-if="!content" class="text-muted-foreground italic">Post body is empty...</span>
                  </div>

                  <!-- LinkedIn Media -->
                  <div v-if="mediaUrl" class="border-border mt-3 overflow-hidden rounded-lg border">
                    <img :src="mediaUrl" alt="Post preview image" class="max-h-72 w-full object-cover" />
                  </div>

                  <!-- LinkedIn Reaction Metrics -->
                  <div class="text-muted-foreground flex items-center justify-between pt-3 text-xs">
                    <div class="flex items-center gap-1.5">
                      <div class="flex -space-x-1">
                        <span
                          class="flex size-4 items-center justify-center rounded-full bg-blue-600 text-xs text-white"
                          >👍</span
                        >
                        <span
                          class="flex size-4 items-center justify-center rounded-full bg-rose-500 text-xs text-white"
                          >❤️</span
                        >
                        <span
                          class="flex size-4 items-center justify-center rounded-full bg-amber-500 text-xs text-white"
                          >💡</span
                        >
                      </div>
                      <span class="font-medium">89</span>
                    </div>
                    <span>14 comments · 6 reposts</span>
                  </div>

                  <Separator class="my-2" />

                  <!-- LinkedIn Action Buttons -->
                  <div class="text-muted-foreground grid grid-cols-4 gap-1 text-center text-xs font-medium">
                    <button
                      type="button"
                      class="hover:bg-muted hover:text-foreground flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors"
                      :class="isLikedInPreview ? 'font-semibold text-blue-600 dark:text-blue-400' : ''"
                      @click="isLikedInPreview = !isLikedInPreview"
                    >
                      <ThumbsUp class="size-4" />
                      <span>Like</span>
                    </button>
                    <button
                      type="button"
                      class="hover:bg-muted hover:text-foreground flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors"
                    >
                      <MessageSquare class="size-4" />
                      <span>Comment</span>
                    </button>
                    <button
                      type="button"
                      class="hover:bg-muted hover:text-foreground flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors"
                    >
                      <Repeat2 class="size-4" />
                      <span>Repost</span>
                    </button>
                    <button
                      type="button"
                      class="hover:bg-muted hover:text-foreground flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors"
                    >
                      <Send class="size-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </TabsContent>

              <!-- TAB 3: Instagram Mockup -->
              <TabsContent value="instagram" class="mt-4">
                <div class="border-border bg-card mx-auto max-w-md overflow-hidden rounded-xl border shadow-xs">
                  <!-- IG Header -->
                  <div class="flex items-center justify-between p-3">
                    <div class="flex flex-wrap items-center gap-2.5">
                      <div class="rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                        <Avatar class="border-background size-8 border-2">
                          <AvatarImage :src="author.avatar" :alt="author.name" />
                          <AvatarFallback>{{ author.initials }}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div class="text-foreground text-xs font-semibold">{{ author.instagramHandle }}</div>
                        <div class="text-muted-foreground text-xs">San Francisco, California</div>
                      </div>
                    </div>
                    <MoreHorizontal class="text-muted-foreground size-4" />
                  </div>

                  <!-- IG Media Container -->
                  <div class="border-border/60 bg-muted/40 relative aspect-square w-full border-y">
                    <img v-if="mediaUrl" :src="mediaUrl" alt="Instagram post preview" class="size-full object-cover" />
                    <div
                      v-else
                      class="text-muted-foreground flex size-full flex-col items-center justify-center gap-2 p-6 text-center"
                    >
                      <ImageIcon class="size-10 stroke-[1.5]" />
                      <p class="text-xs">Attach an image on the left to see Instagram photo preview</p>
                    </div>
                  </div>

                  <!-- IG Actions & Caption -->
                  <div class="space-y-2 p-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <Heart
                          class="size-5 cursor-pointer transition-colors"
                          :class="
                            isLikedInPreview ? 'fill-rose-500 text-rose-500' : 'text-foreground hover:text-rose-500'
                          "
                          @click="isLikedInPreview = !isLikedInPreview"
                        />
                        <MessageCircle class="text-foreground hover:text-muted-foreground size-5 cursor-pointer" />
                        <Send class="text-foreground hover:text-muted-foreground size-5 cursor-pointer" />
                      </div>
                      <Bookmark class="text-foreground hover:text-muted-foreground size-5 cursor-pointer" />
                    </div>

                    <div class="text-foreground text-xs font-semibold">
                      {{ isLikedInPreview ? '343 likes' : '342 likes' }}
                    </div>

                    <!-- IG Caption Text -->
                    <div class="text-foreground text-xs leading-relaxed">
                      <span class="mr-1.5 font-semibold">{{ author.instagramHandle }}</span>
                      <template v-for="(seg, idx) in formattedContentSegments" :key="idx">
                        <span
                          v-if="seg.isHashtag"
                          class="cursor-pointer font-medium text-sky-600 hover:underline dark:text-sky-400"
                          >{{ seg.text }}</span
                        >
                        <span v-else>{{ seg.text }}</span>
                      </template>
                    </div>

                    <div class="text-muted-foreground cursor-pointer text-xs">View all 28 comments</div>
                    <div class="text-muted-foreground text-xs tracking-wider uppercase">
                      SCHEDULED FOR {{ scheduledDate }} · {{ scheduledTime }}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <!-- TAB 4: Threads Mockup -->
              <TabsContent value="threads" class="mt-4">
                <div class="border-border bg-card rounded-xl border p-4 shadow-xs">
                  <div class="flex items-start gap-3">
                    <div class="flex flex-col items-center">
                      <Avatar class="size-10">
                        <AvatarImage :src="author.avatar" :alt="author.name" />
                        <AvatarFallback>{{ author.initials }}</AvatarFallback>
                      </Avatar>
                      <div class="bg-border mt-2 h-20 w-0.5 rounded-full" />
                    </div>

                    <div class="flex-1 space-y-2">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1.5">
                          <span class="text-foreground text-sm font-semibold">{{ author.threadsHandle }}</span>
                          <svg class="size-3.5 shrink-0 fill-sky-500 text-sky-500" viewBox="0 0 24 24">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.004 6.308a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            />
                          </svg>
                          <span class="text-muted-foreground text-xs">· Scheduled</span>
                        </div>
                        <MoreHorizontal class="text-muted-foreground size-4" />
                      </div>

                      <div class="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        <template v-for="(seg, idx) in formattedContentSegments" :key="idx">
                          <span
                            v-if="seg.isHashtag"
                            class="text-foreground cursor-pointer font-semibold hover:underline"
                            >{{ seg.text }}</span
                          >
                          <span v-else>{{ seg.text }}</span>
                        </template>
                        <span v-if="!content" class="text-muted-foreground italic">Post body is empty...</span>
                      </div>

                      <div v-if="mediaUrl" class="border-border mt-3 overflow-hidden rounded-xl border">
                        <img :src="mediaUrl" alt="Post preview image" class="max-h-72 w-full object-cover" />
                      </div>

                      <div class="flex items-center gap-4 pt-2">
                        <Heart
                          class="size-4 cursor-pointer transition-colors"
                          :class="
                            isLikedInPreview
                              ? 'fill-rose-500 text-rose-500'
                              : 'text-muted-foreground hover:text-foreground'
                          "
                          @click="isLikedInPreview = !isLikedInPreview"
                        />
                        <MessageCircle class="text-muted-foreground hover:text-foreground size-4 cursor-pointer" />
                        <Repeat2 class="text-muted-foreground hover:text-foreground size-4 cursor-pointer" />
                        <Send class="text-muted-foreground hover:text-foreground size-4 cursor-pointer" />
                      </div>

                      <div class="text-muted-foreground pt-1 text-xs">48 replies · 312 likes</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter
            class="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-4 text-xs"
          >
            <span>Synchronized with Buffer & Hootsuite OAuth queues</span>
            <div class="flex items-center gap-1.5">
              <span class="size-2 rounded-full bg-emerald-500" />
              <span>4 channels ready</span>
            </div>
          </CardFooter>
        </Card>
      </section>
    </div>
  </div>
</template>
