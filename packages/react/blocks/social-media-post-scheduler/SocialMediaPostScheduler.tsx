'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

// Hardcoded Author Profile Data
const AUTHOR = {
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
const SAMPLE_IMAGES = [
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
const SUGGESTED_HASHTAGS = [
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
const QUICK_EMOJIS = ['🚀', '✨', '💡', '🔥', '📊', '🧵', '🎉', '⚡', '👇', '🎯']

// Recommended Time Slots
const TIME_SLOTS = ['09:00 AM EST', '10:00 AM EST', '01:30 PM EST', '05:00 PM EST']

// Platform Limits
const PLATFORM_LIMITS: Record<string, { name: string; limit: number; color: string }> = {
  twitter: { name: 'X (Twitter)', limit: 280, color: 'text-sky-500' },
  threads: { name: 'Threads', limit: 500, color: 'text-foreground' },
  instagram: { name: 'Instagram', limit: 2200, color: 'text-pink-500' },
  linkedin: { name: 'LinkedIn', limit: 3000, color: 'text-blue-600' },
}

export function SocialMediaPostScheduler({
  initialContent = 'Excited to announce the new component release for our open source design system! 🚀 Built with accessible keyboard ergonomics, fluid motion, and crisp token hierarchy out of the box.\n\n#UI #Developer #OpenSource',
  initialChannels = ['twitter', 'linkedin', 'instagram', 'threads'],
  initialMediaUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  initialDate = '2026-08-25',
  initialTime = '10:00 AM EST',
  initialAutoRepost = true,
}: SocialMediaPostSchedulerProps) {
  // State
  const [content, setContent] = React.useState(initialContent)
  const [selectedChannels, setSelectedChannels] = React.useState<string[]>(initialChannels)
  const [activeTab, setActiveTab] = React.useState('twitter')
  const [mediaUrl, setMediaUrl] = React.useState<string | null>(initialMediaUrl)
  const [scheduledDate, setScheduledDate] = React.useState(initialDate)
  const [scheduledTime, setScheduledTime] = React.useState(initialTime)
  const [autoRepost, setAutoRepost] = React.useState(initialAutoRepost)
  const [firstCommentThread, setFirstCommentThread] = React.useState(true)
  const [isLikedInPreview, setIsLikedInPreview] = React.useState(false)
  const [notificationMessage, setNotificationMessage] = React.useState<string | null>(null)
  const [notificationType, setNotificationType] = React.useState<'success' | 'draft'>('success')

  // Channel Toggle Logic
  const toggleChannel = React.useCallback((channelId: string) => {
    setSelectedChannels((prev) => {
      if (prev.includes(channelId)) {
        if (prev.length > 1) return prev.filter((c) => c !== channelId)
        return prev
      }
      return [...prev, channelId]
    })
  }, [])

  const isChannelSelected = React.useCallback(
    (channelId: string) => selectedChannels.includes(channelId),
    [selectedChannels],
  )

  // Hashtag & Emoji Insertion
  const insertHashtag = React.useCallback((tag: string) => {
    setContent((prev) => {
      if (prev.includes(tag)) return prev
      if (!prev.trim()) return tag
      return `${prev.trim()} ${tag}`
    })
  }, [])

  const insertEmoji = React.useCallback((emoji: string) => {
    setContent((prev) => `${prev}${emoji}`)
  }, [])

  const polishWithAi = React.useCallback(() => {
    setContent(
      '🚀 Excited to announce our newest UI component release! Built with zero-dependency headless primitives, fluid spring physics, and full OKLCH dark mode tokens.\n\nExplore the interactive playground & let us know your thoughts below! 👇\n\n#UI #Developer #OpenSource #DesignSystem',
    )
  }, [])

  const saveDraft = React.useCallback(() => {
    setNotificationType('draft')
    setNotificationMessage(
      'Post draft saved locally. All changes, media attachments, and channel targets are up to date.',
    )
  }, [])

  const schedulePost = React.useCallback(() => {
    setNotificationType('success')
    setNotificationMessage(
      `Post scheduled for ${scheduledDate} at ${scheduledTime} across ${selectedChannels.length} connected channels!`,
    )
  }, [scheduledDate, scheduledTime, selectedChannels.length])

  // Character Limit Computed
  const currentLength = content.length
  const currentPlatformLimit = PLATFORM_LIMITS[activeTab]?.limit ?? 280
  const isOverLimit = currentLength > currentPlatformLimit
  const isWarningLimit = currentLength > currentPlatformLimit - 40 && !isOverLimit

  // Text tokens parsing for hashtag highlighting in preview
  const formattedContentSegments = React.useMemo(() => {
    if (!content) return []
    const words = content.split(/(\s+)/)
    return words.map((word) => ({
      text: word,
      isHashtag: word.startsWith('#') && word.length > 1,
      isMention: word.startsWith('@') && word.length > 1,
    }))
  }, [content])

  return (
    <div data-slot="social-media-post-scheduler" className="bg-background text-foreground flex w-full flex-col gap-6">
      {/* Top Global Header */}
      <header className="bg-card border-border flex flex-col gap-4 rounded-xl border p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Calendar className="size-4" />
            </div>
            <h1 className="text-foreground text-lg font-semibold tracking-tight">Social Post Composer & Scheduler</h1>
            <Badge variant="secondary" className="font-mono text-xs">
              {selectedChannels.length} / 4 Networks
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Compose, calibrate, and orchestrate cross-platform social broadcasts with live authentic previews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={saveDraft}>
            <Bookmark className="mr-1.5 size-3.5" />
            Save Draft
          </Button>
          <Button size="sm" onClick={schedulePost}>
            <Calendar className="mr-1.5 size-3.5" />
            Schedule Post
          </Button>
        </div>
      </header>

      {/* Feedback Notification Toast Banner */}
      {notificationMessage && (
        <div
          className={cn(
            'flex items-center justify-between rounded-lg border p-3.5 text-sm shadow-xs transition-all',
            notificationType === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'bg-primary/10 border-primary/20 text-primary',
          )}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            {notificationType === 'success' ? (
              <CheckCircle2 className="size-4 shrink-0" />
            ) : (
              <Bookmark className="size-4 shrink-0" />
            )}
            <span>{notificationMessage}</span>
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded p-1 focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => setNotificationMessage(null)}
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* 2-Column Composer & Live Preview Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Composer, Channels, Media, Schedule Settings */}
        <section className="space-y-6 lg:col-span-6">
          {/* Target Channels Selection Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Publishing Channels</CardTitle>
                <span className="text-muted-foreground text-xs font-medium">Select all target feeds</span>
              </div>
              <CardDescription className="text-xs">
                Toggle the target social accounts for this scheduled broadcast.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {/* X (Twitter) Pill */}
                <button
                  type="button"
                  className={cn(
                    'group focus-visible:ring-ring relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                    isChannelSelected('twitter')
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'border-border bg-card hover:bg-accent/50 opacity-65',
                  )}
                  onClick={() => toggleChannel('twitter')}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="bg-foreground text-background flex size-6 items-center justify-center rounded-md">
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-full text-xs',
                        isChannelSelected('twitter') ? 'bg-primary text-primary-foreground' : 'border-border border',
                      )}
                    >
                      {isChannelSelected('twitter') && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold">X / Twitter</div>
                    <div className="text-muted-foreground text-xs">280 chars</div>
                  </div>
                </button>

                {/* LinkedIn Pill */}
                <button
                  type="button"
                  className={cn(
                    'group focus-visible:ring-ring relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                    isChannelSelected('linkedin')
                      ? 'border-blue-600 bg-blue-600/5 ring-1 ring-blue-600'
                      : 'border-border bg-card hover:bg-accent/50 opacity-65',
                  )}
                  onClick={() => toggleChannel('linkedin')}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex size-6 items-center justify-center rounded-md bg-[#0077B5] text-white">
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.4 9.74v-8.37H5.06v8.37z" />
                      </svg>
                    </div>
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-full text-xs',
                        isChannelSelected('linkedin') ? 'bg-blue-600 text-white' : 'border-border border',
                      )}
                    >
                      {isChannelSelected('linkedin') && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold">LinkedIn</div>
                    <div className="text-muted-foreground text-xs">3,000 chars</div>
                  </div>
                </button>

                {/* Instagram Pill */}
                <button
                  type="button"
                  className={cn(
                    'group focus-visible:ring-ring relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                    isChannelSelected('instagram')
                      ? 'border-pink-500 bg-pink-500/5 ring-1 ring-pink-500'
                      : 'border-border bg-card hover:bg-accent/50 opacity-65',
                  )}
                  onClick={() => toggleChannel('instagram')}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex size-6 items-center justify-center rounded-md bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white">
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-full text-xs',
                        isChannelSelected('instagram') ? 'bg-pink-500 text-white' : 'border-border border',
                      )}
                    >
                      {isChannelSelected('instagram') && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Instagram</div>
                    <div className="text-muted-foreground text-xs">2,200 chars</div>
                  </div>
                </button>

                {/* Threads Pill */}
                <button
                  type="button"
                  className={cn(
                    'group focus-visible:ring-ring relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                    isChannelSelected('threads')
                      ? 'border-foreground bg-foreground/5 ring-foreground ring-1'
                      : 'border-border bg-card hover:bg-accent/50 opacity-65',
                  )}
                  onClick={() => toggleChannel('threads')}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="bg-foreground text-background flex size-6 items-center justify-center rounded-md">
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12.186 24C5.454 24 0 18.618 0 12.016 0 5.414 5.454.032 12.186.032c6.64 0 11.966 5.228 12.004 11.758a12.08 12.08 0 0 1-3.69 8.643 11.85 11.85 0 0 1-8.314 3.567zm0-2.352a9.66 9.66 0 0 0 6.84-2.88 9.77 9.77 0 0 0 2.83-6.978c-.03-5.263-4.3-9.458-9.67-9.458-5.438 0-9.845 4.343-9.845 9.684 0 5.342 4.407 9.632 9.845 9.632z" />
                      </svg>
                    </div>
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-full text-xs',
                        isChannelSelected('threads') ? 'bg-foreground text-background' : 'border-border border',
                      )}
                    >
                      {isChannelSelected('threads') && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Threads</div>
                    <div className="text-muted-foreground text-xs">500 chars</div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Post Content Composer Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Post Content</CardTitle>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-primary hover:text-primary gap-1"
                  onClick={polishWithAi}
                >
                  <Sparkles className="size-3.5" />
                  <span>AI Polish</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Textarea */}
              <div className="space-y-2">
                <Textarea
                  value={content}
                  onValueChange={setContent}
                  rows={6}
                  placeholder="What would you like to share? Write once, preview across all social platforms..."
                  className="min-h-[140px] text-sm"
                />

                {/* Bottom Bar: Emojis & Character Counter */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  {/* Quick Emojis */}
                  <div className="flex flex-wrap items-center gap-1">
                    {QUICK_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className="hover:bg-muted text-muted-foreground hover:text-foreground focus-visible:ring-ring flex size-7 items-center justify-center rounded text-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                        onClick={() => insertEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Character Counter with dynamic limits */}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isOverLimit ? 'destructive' : isWarningLimit ? 'warning' : 'secondary'}
                      className="font-mono text-xs"
                    >
                      {currentLength} / {currentPlatformLimit}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Hashtag suggestions chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-muted-foreground text-xs font-medium">Recommended Hashtags</span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_HASHTAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={cn(
                        'focus-visible:ring-ring min-h-6 rounded-md border px-2 py-0.5 text-xs font-medium transition-all focus-visible:ring-1 focus-visible:outline-none',
                        content.includes(tag)
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                      )}
                      onClick={() => insertHashtag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Attachment Dropzone Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Media Attachment</CardTitle>
                {mediaUrl ? (
                  <Badge variant="success" className="text-xs">
                    Attached
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Optional
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Active Media Preview */}
              {mediaUrl ? (
                <div className="border-border bg-muted/20 relative flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="border-border relative size-16 shrink-0 overflow-hidden rounded-md border">
                      <img src={mediaUrl} alt="Post attachment preview" className="size-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-foreground text-xs font-semibold">product-launch-graphic.png</div>
                      <div className="text-muted-foreground text-xs">1200 × 675 px · 284 KB</div>
                      <Badge variant="secondary" className="text-xs">
                        16:9 Aspect
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setMediaUrl(null)}
                    >
                      <Trash2 className="mr-1.5 size-3.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                /* Upload Dropzone (when empty) */
                <div className="border-border hover:border-primary/50 flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors">
                  <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
                    <UploadCloud className="size-5" />
                  </div>
                  <p className="text-foreground mt-2 text-xs font-semibold">Drag & drop media attachment</p>
                  <p className="text-muted-foreground text-xs">PNG, JPG, GIF or MP4 up to 25MB</p>
                </div>
              )}

              {/* Preset Sample Selector */}
              <div className="space-y-1.5 pt-1">
                <span className="text-muted-foreground text-xs font-medium">Quick Sample Media:</span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_IMAGES.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      className={cn(
                        'focus-visible:ring-ring min-h-6 rounded-md border px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-1 focus-visible:outline-none',
                        mediaUrl === sample.url
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground',
                      )}
                      onClick={() => setMediaUrl(sample.url)}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Configuration Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Schedule Settings</CardTitle>
              <CardDescription className="text-xs">
                Determine publish timing and automated amplification rules.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-medium">Publish Date</label>
                  <Input
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    type="date"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-medium">Publish Time</label>
                  <Input
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    placeholder="10:00 AM EST"
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Optimal engagement recommendation banner */}
              <div className="bg-primary/5 border-primary/20 flex items-start gap-2.5 rounded-lg border p-3 text-xs">
                <Sparkles className="text-primary mt-0.5 size-4 shrink-0" />
                <div className="space-y-1">
                  <span className="text-foreground font-semibold">Optimal window: 10:00 AM EST</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Based on your audience timezone, posting between 09:30 AM – 10:30 AM EST generates +34% higher
                    average CTR.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={cn(
                          'focus-visible:ring-ring min-h-6 rounded border px-2 py-0.5 text-xs transition-colors focus-visible:ring-1 focus-visible:outline-none',
                          scheduledTime === slot
                            ? 'border-primary bg-primary text-primary-foreground font-medium'
                            : 'border-border bg-card text-muted-foreground hover:text-foreground',
                        )}
                        onClick={() => setScheduledTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Switches */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-foreground text-xs font-medium">Auto-repost evergreen content</span>
                    <p className="text-muted-foreground text-xs">
                      Reshuffle and repost to X & Threads after 24h if initial engagement crosses 100 interactions.
                    </p>
                  </div>
                  <Switch checked={autoRepost} onCheckedChange={setAutoRepost} />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-foreground text-xs font-medium">Auto-append first comment / thread link</span>
                    <p className="text-muted-foreground text-xs">
                      Places outbound GitHub & documentation links in the first comment to avoid algorithm penalty.
                    </p>
                  </div>
                  <Switch checked={firstCommentThread} onCheckedChange={setFirstCommentThread} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Column: Live Social Feed Preview */}
        <section className="space-y-4 lg:col-span-6">
          <Card className="flex h-full flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold">Live Social Feed Preview</CardTitle>
                  <Badge
                    variant="outline"
                    className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Live Sync
                  </Badge>
                </div>
                <span className="text-muted-foreground font-mono text-xs">
                  Scheduled: {scheduledDate} · {scheduledTime}
                </span>
              </div>
              <CardDescription className="text-xs">
                Preview pixel-accurate mockups in authentic platform containers.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col space-y-4">
              {/* Platform Preview Switcher Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="twitter" className="gap-1.5 text-xs">
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>X / Twitter</span>
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" className="gap-1.5 text-xs">
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.4 9.74v-8.37H5.06v8.37z" />
                    </svg>
                    <span>LinkedIn</span>
                  </TabsTrigger>
                  <TabsTrigger value="instagram" className="gap-1.5 text-xs">
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
                  </TabsTrigger>
                  <TabsTrigger value="threads" className="gap-1.5 text-xs">
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12.186 24C5.454 24 0 18.618 0 12.016 0 5.414 5.454.032 12.186.032c6.64 0 11.966 5.228 12.004 11.758a12.08 12.08 0 0 1-3.69 8.643 11.85 11.85 0 0 1-8.314 3.567zm0-2.352a9.66 9.66 0 0 0 6.84-2.88 9.77 9.77 0 0 0 2.83-6.978c-.03-5.263-4.3-9.458-9.67-9.458-5.438 0-9.845 4.343-9.845 9.684 0 5.342 4.407 9.632 9.845 9.632z" />
                    </svg>
                    <span>Threads</span>
                  </TabsTrigger>
                </TabsList>

                {/* TAB 1: X / Twitter Mockup */}
                <TabsContent value="twitter" className="mt-4">
                  <div className="border-border bg-card rounded-xl border p-4 shadow-xs">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-10">
                        <AvatarImage src={AUTHOR.avatar} alt={AUTHOR.name} />
                        <AvatarFallback>{AUTHOR.initials}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        {/* X Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-foreground text-sm font-bold">{AUTHOR.name}</span>
                            {/* Verified blue check badge */}
                            <svg className="size-4 shrink-0 fill-sky-500 text-sky-500" viewBox="0 0 24 24">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.004 6.308a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              />
                            </svg>
                            <span className="text-muted-foreground text-xs">{AUTHOR.twitterHandle}</span>
                            <span className="text-muted-foreground text-xs">· Scheduled</span>
                          </div>
                          <MoreHorizontal className="text-muted-foreground size-4" />
                        </div>

                        {/* X Body */}
                        <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                          {formattedContentSegments.length > 0 ? (
                            formattedContentSegments.map((seg, idx) =>
                              seg.isHashtag ? (
                                <span key={idx} className="cursor-pointer font-normal text-sky-500 hover:underline">
                                  {seg.text}
                                </span>
                              ) : (
                                <span key={idx}>{seg.text}</span>
                              ),
                            )
                          ) : (
                            <span className="text-muted-foreground italic">Post body is empty...</span>
                          )}
                        </div>

                        {/* Attached Media */}
                        {mediaUrl && (
                          <div className="border-border mt-3 overflow-hidden rounded-2xl border">
                            <img
                              src={mediaUrl}
                              alt="Post preview attachment"
                              className="max-h-72 w-full object-cover"
                            />
                          </div>
                        )}

                        {/* Scheduled Metadata Stamp */}
                        <div className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                          <Clock className="size-3" />
                          <span>
                            Will publish on {scheduledDate} at {scheduledTime}
                          </span>
                        </div>

                        <Separator className="my-2" />

                        {/* X Action Bar */}
                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                          <button
                            type="button"
                            className="flex min-h-6 items-center gap-1.5 transition-colors hover:text-sky-500"
                          >
                            <MessageCircle className="size-4" />
                            <span>24</span>
                          </button>
                          <button
                            type="button"
                            className="flex min-h-6 items-center gap-1.5 transition-colors hover:text-emerald-500"
                          >
                            <Repeat2 className="size-4" />
                            <span>12</span>
                          </button>
                          <button
                            type="button"
                            className={cn(
                              'flex min-h-6 items-center gap-1.5 transition-colors hover:text-rose-500',
                              isLikedInPreview && 'text-rose-500',
                            )}
                            onClick={() => setIsLikedInPreview(!isLikedInPreview)}
                          >
                            <Heart className={cn('size-4', isLikedInPreview && 'fill-rose-500')} />
                            <span>{isLikedInPreview ? 159 : 158}</span>
                          </button>
                          <button
                            type="button"
                            className="flex min-h-6 items-center gap-1.5 transition-colors hover:text-sky-500"
                          >
                            <Eye className="size-4" />
                            <span>4.2K</span>
                          </button>
                          <div className="flex items-center gap-2">
                            <Bookmark className="hover:text-foreground size-4 cursor-pointer" />
                            <Share2 className="hover:text-foreground size-4 cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 2: LinkedIn Mockup */}
                <TabsContent value="linkedin" className="mt-4">
                  <div className="border-border bg-card rounded-xl border p-4 shadow-xs">
                    {/* LinkedIn Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="size-11">
                          <AvatarImage src={AUTHOR.avatar} alt={AUTHOR.name} />
                          <AvatarFallback>{AUTHOR.initials}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground text-sm font-semibold">{AUTHOR.name}</span>
                            <span className="text-muted-foreground text-xs">• 1st</span>
                          </div>
                          <p className="text-muted-foreground line-clamp-1 text-xs">{AUTHOR.headline}</p>
                          <div className="text-muted-foreground flex items-center gap-1 text-xs">
                            <span>Scheduled ({scheduledDate})</span>
                            <span>•</span>
                            <Globe className="size-3" />
                          </div>
                        </div>
                      </div>
                      <MoreHorizontal className="text-muted-foreground size-4" />
                    </div>

                    {/* LinkedIn Body */}
                    <div className="text-foreground mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                      {formattedContentSegments.length > 0 ? (
                        formattedContentSegments.map((seg, idx) =>
                          seg.isHashtag ? (
                            <span
                              key={idx}
                              className="cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {seg.text}
                            </span>
                          ) : (
                            <span key={idx}>{seg.text}</span>
                          ),
                        )
                      ) : (
                        <span className="text-muted-foreground italic">Post body is empty...</span>
                      )}
                    </div>

                    {/* LinkedIn Media */}
                    {mediaUrl && (
                      <div className="border-border mt-3 overflow-hidden rounded-lg border">
                        <img src={mediaUrl} alt="Post preview attachment" className="max-h-72 w-full object-cover" />
                      </div>
                    )}

                    {/* LinkedIn Reaction Metrics */}
                    <div className="text-muted-foreground flex items-center justify-between pt-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1">
                          <span className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                            👍
                          </span>
                          <span className="flex size-4 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                            ❤️
                          </span>
                          <span className="flex size-4 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                            💡
                          </span>
                        </div>
                        <span className="font-medium">89</span>
                      </div>
                      <span>14 comments · 6 reposts</span>
                    </div>

                    <Separator className="my-2" />

                    {/* LinkedIn Action Buttons */}
                    <div className="text-muted-foreground grid grid-cols-4 gap-1 text-center text-xs font-medium">
                      <button
                        type="button"
                        className={cn(
                          'hover:bg-muted hover:text-foreground flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors',
                          isLikedInPreview && 'font-semibold text-blue-600 dark:text-blue-400',
                        )}
                        onClick={() => setIsLikedInPreview(!isLikedInPreview)}
                      >
                        <ThumbsUp className="size-4" />
                        <span>Like</span>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-muted hover:text-foreground flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors"
                      >
                        <MessageSquare className="size-4" />
                        <span>Comment</span>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-muted hover:text-foreground flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors"
                      >
                        <Repeat2 className="size-4" />
                        <span>Repost</span>
                      </button>
                      <button
                        type="button"
                        className="hover:bg-muted hover:text-foreground flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors"
                      >
                        <Send className="size-4" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 3: Instagram Mockup */}
                <TabsContent value="instagram" className="mt-4">
                  <div className="border-border bg-card mx-auto max-w-md overflow-hidden rounded-xl border shadow-xs">
                    {/* IG Header */}
                    <div className="flex items-center justify-between p-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                          <Avatar className="border-background size-8 border-2">
                            <AvatarImage src={AUTHOR.avatar} alt={AUTHOR.name} />
                            <AvatarFallback>{AUTHOR.initials}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <div className="text-foreground text-xs font-semibold">{AUTHOR.instagramHandle}</div>
                          <div className="text-muted-foreground text-xs">San Francisco, California</div>
                        </div>
                      </div>
                      <MoreHorizontal className="text-muted-foreground size-4" />
                    </div>

                    {/* IG Media Container */}
                    <div className="border-border/60 bg-muted/40 relative aspect-square w-full border-y">
                      {mediaUrl ? (
                        <img src={mediaUrl} alt="Instagram post preview" className="size-full object-cover" />
                      ) : (
                        <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-2 p-6 text-center">
                          <ImageIcon className="size-10 stroke-[1.5]" />
                          <p className="text-xs">Attach an image on the left to see Instagram photo preview</p>
                        </div>
                      )}
                    </div>

                    {/* IG Actions & Caption */}
                    <div className="space-y-2 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Heart
                            className={cn(
                              'size-5 cursor-pointer transition-colors',
                              isLikedInPreview ? 'fill-rose-500 text-rose-500' : 'text-foreground hover:text-rose-500',
                            )}
                            onClick={() => setIsLikedInPreview(!isLikedInPreview)}
                          />
                          <MessageCircle className="text-foreground hover:text-muted-foreground size-5 cursor-pointer" />
                          <Send className="text-foreground hover:text-muted-foreground size-5 cursor-pointer" />
                        </div>
                        <Bookmark className="text-foreground hover:text-muted-foreground size-5 cursor-pointer" />
                      </div>

                      <div className="text-foreground text-xs font-semibold">
                        {isLikedInPreview ? '343 likes' : '342 likes'}
                      </div>

                      {/* IG Caption Text */}
                      <div className="text-foreground text-xs leading-relaxed">
                        <span className="mr-1.5 font-semibold">{AUTHOR.instagramHandle}</span>
                        {formattedContentSegments.map((seg, idx) =>
                          seg.isHashtag ? (
                            <span
                              key={idx}
                              className="cursor-pointer font-medium text-sky-600 hover:underline dark:text-sky-400"
                            >
                              {seg.text}
                            </span>
                          ) : (
                            <span key={idx}>{seg.text}</span>
                          ),
                        )}
                      </div>

                      <div className="text-muted-foreground cursor-pointer text-xs">View all 28 comments</div>
                      <div className="text-muted-foreground text-xs tracking-wider uppercase">
                        SCHEDULED FOR {scheduledDate} · {scheduledTime}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 4: Threads Mockup */}
                <TabsContent value="threads" className="mt-4">
                  <div className="border-border bg-card rounded-xl border p-4 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <Avatar className="size-10">
                          <AvatarImage src={AUTHOR.avatar} alt={AUTHOR.name} />
                          <AvatarFallback>{AUTHOR.initials}</AvatarFallback>
                        </Avatar>
                        <div className="bg-border mt-2 h-20 w-0.5 rounded-full" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground text-sm font-semibold">{AUTHOR.threadsHandle}</span>
                            <svg className="size-3.5 shrink-0 fill-sky-500 text-sky-500" viewBox="0 0 24 24">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.004 6.308a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              />
                            </svg>
                            <span className="text-muted-foreground text-xs">· Scheduled</span>
                          </div>
                          <MoreHorizontal className="text-muted-foreground size-4" />
                        </div>

                        <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                          {formattedContentSegments.length > 0 ? (
                            formattedContentSegments.map((seg, idx) =>
                              seg.isHashtag ? (
                                <span
                                  key={idx}
                                  className="text-foreground cursor-pointer font-semibold hover:underline"
                                >
                                  {seg.text}
                                </span>
                              ) : (
                                <span key={idx}>{seg.text}</span>
                              ),
                            )
                          ) : (
                            <span className="text-muted-foreground italic">Post body is empty...</span>
                          )}
                        </div>

                        {mediaUrl && (
                          <div className="border-border mt-3 overflow-hidden rounded-xl border">
                            <img
                              src={mediaUrl}
                              alt="Post preview attachment"
                              className="max-h-72 w-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-4 pt-2">
                          <Heart
                            className={cn(
                              'size-4 cursor-pointer transition-colors',
                              isLikedInPreview
                                ? 'fill-rose-500 text-rose-500'
                                : 'text-muted-foreground hover:text-foreground',
                            )}
                            onClick={() => setIsLikedInPreview(!isLikedInPreview)}
                          />
                          <MessageCircle className="text-muted-foreground hover:text-foreground size-4 cursor-pointer" />
                          <Repeat2 className="text-muted-foreground hover:text-foreground size-4 cursor-pointer" />
                          <Send className="text-muted-foreground hover:text-foreground size-4 cursor-pointer" />
                        </div>

                        <div className="text-muted-foreground pt-1 text-xs">48 replies · 312 likes</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-4 text-xs">
              <span>Synchronized with Buffer & Hootsuite OAuth queues</span>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>4 channels ready</span>
              </div>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  )
}
