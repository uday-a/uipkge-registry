<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckCircle2, Image as ImageIcon, PenLine, Star, ThumbsUp, X } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Rating } from '@/components/ui/rating'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ReviewItem {
  id: string
  author: string
  initials: string
  avatar?: string
  rating: number
  date: string
  title: string
  body: string
  variant: string
  verified: boolean
  helpfulCount: number
  isHelpful?: boolean
  photos?: string[]
}

interface RatingBar {
  stars: number
  percentage: number
  count: number
}

interface PhotoGalleryItem {
  id: string
  url: string
  alt: string
  author: string
}

const ratingBreakdowns: RatingBar[] = [
  { stars: 5, percentage: 78, count: 267 },
  { stars: 4, percentage: 14, count: 48 },
  { stars: 3, percentage: 5, count: 17 },
  { stars: 2, percentage: 2, count: 7 },
  { stars: 1, percentage: 1, count: 3 },
]

const customerPhotos: PhotoGalleryItem[] = [
  {
    id: 'p1',
    url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80',
    alt: 'Customer photo of matte navy headphones on wood desk',
    author: 'Marcus V.',
  },
  {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    alt: 'Customer photo of headphones studio unboxing',
    author: 'Elena R.',
  },
  {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&auto=format&fit=crop&q=80',
    alt: 'Customer photo of cushioned earpads close up',
    author: 'Devon C.',
  },
  {
    id: 'p4',
    url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop&q=80',
    alt: 'Customer photo wearing headphones in coffee shop',
    author: 'Amara D.',
  },
  {
    id: 'p5',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
    alt: 'Customer photo of travel case and cable accessories',
    author: 'Liam G.',
  },
  {
    id: 'p6',
    url: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&auto=format&fit=crop&q=80',
    alt: 'Customer photo wearing silver headphones while working',
    author: 'Sophia M.',
  },
]

const initialReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Marcus Vance',
    initials: 'MV',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2 days ago',
    title: 'Exceeded all my expectations — best studio acoustic fidelity',
    body: 'The soundstage is remarkably wide and bass response is tight without overpowering the mids. Build quality is aerospace-grade, and the memory foam ear cushions remain comfortable even through 8-hour mixing sessions. Multi-device Bluetooth pairing switches directly between MacBook and phone.',
    variant: 'Color: Matte Navy · Size: L',
    verified: true,
    helpfulCount: 24,
    isHelpful: false,
    photos: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'rev-2',
    author: 'Elena Rostova',
    initials: 'ER',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    date: '1 week ago',
    title: 'ANC handles subway roar with zero pressure sensation',
    body: 'Active noise cancellation on these is sublime. Unlike other flagships that create an uncomfortable eardrum suction pressure, this feels completely natural. Battery life easily stretches across 4 days of heavy commuting without a recharge.',
    variant: 'Color: Silver Frost · Size: M',
    verified: true,
    helpfulCount: 19,
    isHelpful: false,
    photos: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop&q=80'],
  },
  {
    id: 'rev-3',
    author: 'Devon Chen',
    initials: 'DC',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    rating: 4,
    date: '2 weeks ago',
    title: 'Fantastic sound and ergonomics, case could be slightly slimmer',
    body: 'Everything about audio reproduction is 10/10. The companion app EQ presets are actually tuned well instead of gimmicky. Only minor critique is the hard-shell travel case is a bit bulky for slim laptop bags, but the protection is undisputed.',
    variant: 'Color: Matte Navy · Size: L',
    verified: true,
    helpfulCount: 12,
    isHelpful: false,
    photos: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&auto=format&fit=crop&q=80'],
  },
  {
    id: 'rev-4',
    author: 'Amara Diallo',
    initials: 'AD',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    date: '3 weeks ago',
    title: 'Crystal-clear microphone quality for all-day client calls',
    body: 'I purchased these primarily for conference calls in a busy open-plan studio. The beamforming microphones filter out nearby background conversations so callers only hear my voice. Lightweight headband design does not induce fatigue.',
    variant: 'Color: Space Black · Size: L',
    verified: true,
    helpfulCount: 8,
    isHelpful: false,
  },
]

const extraReviews: ReviewItem[] = [
  {
    id: 'rev-5',
    author: 'Liam Gallagher',
    initials: 'LG',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    date: '1 month ago',
    title: 'Premium finish that justifies every single penny',
    body: 'The anodized aluminum arms and tactile physical dials feel so much better than finicky touch controls in cold weather. Fast USB-C charging gave me 6 hours of playback from a 15-minute coffee break charge.',
    variant: 'Color: Space Black · Size: L',
    verified: true,
    helpfulCount: 15,
    isHelpful: false,
    photos: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80'],
  },
  {
    id: 'rev-6',
    author: 'Sophia Martinez',
    initials: 'SM',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    rating: 4,
    date: '1 month ago',
    title: 'Great balanced frequency response for classical and jazz',
    body: 'Instruments have pinpoint positional separation in spatial mode. The high frequencies are crisp without ever becoming sibilant or harsh at high volume.',
    variant: 'Color: Silver Frost · Size: M',
    verified: false,
    helpfulCount: 6,
    isHelpful: false,
  },
]

const reviews = ref<ReviewItem[]>([...initialReviews])
const selectedRating = ref<number | null>(null)
const withPhotosOnly = ref(false)
const verifiedOnly = ref(false)
const sortBy = ref<'recent' | 'highest' | 'lowest' | 'helpful'>('recent')
const isWritingReview = ref(false)
const hasLoadedMore = ref(false)
const activePhotoUrl = ref<string | null>(null)

// Write a review form states
const newRating = ref(5)
const newAuthor = ref('')
const newVariant = ref('Color: Matte Navy · Size: L')
const newTitle = ref('')
const newBody = ref('')

function toggleRatingFilter(stars: number) {
  if (selectedRating.value === stars) {
    selectedRating.value = null
  } else {
    selectedRating.value = stars
  }
}

function resetFilters() {
  selectedRating.value = null
  withPhotosOnly.value = false
  verifiedOnly.value = false
}

function toggleHelpful(reviewId: string) {
  const rev = reviews.value.find((r) => r.id === reviewId)
  if (!rev) return
  if (rev.isHelpful) {
    rev.helpfulCount -= 1
    rev.isHelpful = false
  } else {
    rev.helpfulCount += 1
    rev.isHelpful = true
  }
}

function loadMore() {
  reviews.value = [...reviews.value, ...extraReviews]
  hasLoadedMore.value = true
}

function submitReview() {
  if (!newTitle.value.trim() || !newBody.value.trim() || newRating.value === 0) return
  const authorName = newAuthor.value.trim() || 'Anonymous User'
  const initials = authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const created: ReviewItem = {
    id: `rev-${Date.now()}`,
    author: authorName,
    initials,
    rating: newRating.value,
    date: 'Just now',
    title: newTitle.value.trim(),
    body: newBody.value.trim(),
    variant: newVariant.value.trim() || 'Color: Matte Navy · Size: L',
    verified: true,
    helpfulCount: 0,
    isHelpful: false,
  }

  reviews.value = [created, ...reviews.value]
  newTitle.value = ''
  newBody.value = ''
  newAuthor.value = ''
  newRating.value = 5
  isWritingReview.value = false
}

const filteredReviews = computed(() => {
  let result = [...reviews.value]

  if (selectedRating.value !== null) {
    result = result.filter((r) => r.rating === selectedRating.value)
  }

  if (withPhotosOnly.value) {
    result = result.filter((r) => r.photos && r.photos.length > 0)
  }

  if (verifiedOnly.value) {
    result = result.filter((r) => r.verified)
  }

  if (sortBy.value === 'highest') {
    result.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'lowest') {
    result.sort((a, b) => a.rating - b.rating)
  } else if (sortBy.value === 'helpful') {
    result.sort((a, b) => b.helpfulCount - a.helpfulCount)
  }

  return result
})
</script>

<template>
  <section data-slot="customer-reviews" class="w-full space-y-8">
    <!-- Section Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">Customer Reviews</h2>
        <p class="text-muted-foreground mt-1 text-sm">Real feedback from verified purchasers</p>
      </div>
      <Button
        aria-label="Close review form"
        type="button"
        class="h-9 gap-2 text-xs font-medium sm:text-sm"
        @click="isWritingReview = !isWritingReview"
      >
        <PenLine class="size-4" />
        Write a Review
      </Button>
    </div>

    <!-- Ratings Overview Card (3-column layout on md+) -->
    <Card class="border-border bg-card p-6 shadow-xs">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center lg:gap-8">
        <!-- Col 1: Big Rating Display -->
        <div
          class="border-border flex flex-col items-center justify-center space-y-2 border-b pb-6 text-center md:col-span-4 md:items-start md:border-r md:border-b-0 md:pr-6 md:pb-0 md:text-left lg:col-span-3"
        >
          <div class="flex items-baseline gap-2">
            <span class="text-foreground text-4xl font-bold tracking-tight">4.8</span>
            <span class="text-muted-foreground text-sm font-medium">out of 5</span>
          </div>
          <Rating :model-value="4.8" readonly half-increments size="medium" />
          <p class="text-muted-foreground text-xs">Based on 342 reviews</p>
          <Badge
            variant="secondary"
            class="mt-1 gap-1.5 border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 class="size-3.5" />
            96% recommend
          </Badge>
        </div>

        <!-- Col 2: Rating Distribution Bars -->
        <div
          class="border-border space-y-2 border-b pb-6 md:col-span-5 md:border-r md:border-b-0 md:pr-6 md:pb-0 lg:col-span-5"
        >
          <button
            v-for="bar in ratingBreakdowns"
            :key="bar.stars"
            type="button"
            class="group hover:bg-muted/60 focus-visible:ring-ring flex w-full items-center gap-3 rounded-md px-2 py-1 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
            :class="selectedRating === bar.stars ? 'bg-muted ring-primary/30 font-semibold ring-1' : ''"
            @click="toggleRatingFilter(bar.stars)"
          >
            <span class="text-foreground flex w-12 items-center gap-1 font-medium">
              {{ bar.stars }} <Star class="size-3 fill-amber-400 text-amber-400" />
            </span>
            <Progress :model-value="bar.percentage" class="h-2 flex-1" />
            <span class="text-muted-foreground group-hover:text-foreground w-10 text-right font-mono">
              {{ bar.percentage }}%
            </span>
          </button>
        </div>

        <!-- Col 3: Customer Photos / Videos Gallery -->
        <div class="space-y-3 md:col-span-3 lg:col-span-4">
          <div class="flex items-center justify-between">
            <h4 class="text-foreground text-sm font-semibold">Customer Photos (48)</h4>
            <span class="text-muted-foreground text-xs">Recent</span>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="(photo, index) in customerPhotos"
              :key="photo.id"
              type="button"
              class="group border-border bg-muted focus-visible:ring-ring relative aspect-square cursor-pointer overflow-hidden rounded-lg border focus-visible:ring-2 focus-visible:outline-none"
              :aria-label="photo.alt"
              @click="activePhotoUrl = photo.url"
            >
              <img
                :src="photo.url"
                :alt="photo.alt"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div
                v-if="index === 5"
                class="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-semibold text-white transition-colors group-hover:bg-black/70"
              >
                +43 more
              </div>
            </button>
          </div>
        </div>
      </div>
    </Card>

    <!-- Write a Review Expandable Panel -->
    <Card v-if="isWritingReview" class="border-primary/30 bg-card p-6 shadow-sm">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-foreground text-base font-semibold">Write Your Review</h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            class="text-muted-foreground hover:text-foreground size-8"
            aria-label="Close review form"
            @click="isWritingReview = false"
          >
            <X class="size-4" />
          </Button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="text-foreground mb-1.5 block text-xs font-medium">Overall Rating</label>
            <Rating v-model="newRating" size="medium" hover />
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div>
              <label class="text-foreground mb-1.5 block text-xs font-medium">Your Name</label>
              <input
                v-model="newAuthor"
                type="text"
                placeholder="e.g. Alex Morgan"
                class="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-xs shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div>
              <label class="text-foreground mb-1.5 block text-xs font-medium">Purchased Option</label>
              <input
                v-model="newVariant"
                type="text"
                placeholder="e.g. Color: Space Black · Size: L"
                class="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-xs shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="text-foreground mb-1.5 block text-xs font-medium">Review Headline</label>
            <input
              v-model="newTitle"
              type="text"
              placeholder="Summarize your experience in one sentence"
              class="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-xs shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>

          <div>
            <label class="text-foreground mb-1.5 block text-xs font-medium">Detailed Feedback</label>
            <textarea
              v-model="newBody"
              rows="3"
              placeholder="What did you like or dislike? How does it perform?"
              class="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-xs shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <Button
              aria-label="Close review form"
              type="button"
              variant="outline"
              size="sm"
              class="h-8 text-xs"
              @click="isWritingReview = false"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              class="h-8 text-xs"
              :disabled="!newTitle.trim() || !newBody.trim() || newRating === 0"
              @click="submitReview"
            >
              Submit Review
            </Button>
          </div>
        </div>
      </div>
    </Card>

    <!-- Review Filters & Sort Toolbar -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <!-- Filter chips -->
      <div class="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          :variant="selectedRating === null && !withPhotosOnly && !verifiedOnly ? 'default' : 'outline'"
          class="h-8 rounded-full text-xs"
          @click="resetFilters"
        >
          All Ratings
        </Button>
        <Button
          type="button"
          size="sm"
          :variant="selectedRating === 5 ? 'default' : 'outline'"
          class="h-8 gap-1 rounded-full text-xs"
          @click="toggleRatingFilter(5)"
        >
          <Star class="size-3" :class="selectedRating === 5 ? 'fill-current' : 'fill-amber-400 text-amber-400'" />
          5 Stars
        </Button>
        <Button
          type="button"
          size="sm"
          :variant="withPhotosOnly ? 'default' : 'outline'"
          class="h-8 gap-1.5 rounded-full text-xs"
          @click="withPhotosOnly = !withPhotosOnly"
        >
          <ImageIcon class="size-3.5" />
          With Photos
        </Button>
        <Button
          type="button"
          size="sm"
          :variant="verifiedOnly ? 'default' : 'outline'"
          class="h-8 gap-1.5 rounded-full text-xs"
          @click="verifiedOnly = !verifiedOnly"
        >
          <CheckCircle2 class="size-3.5" />
          Verified Only
        </Button>
      </div>

      <!-- Sort Dropdown -->
      <div class="flex items-center gap-2">
        <span class="text-muted-foreground text-xs font-medium">Sort by:</span>
        <Select v-model="sortBy">
          <SelectTrigger class="h-8 w-36 text-xs sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="space-y-4">
      <div v-if="filteredReviews.length === 0" class="border-border bg-card rounded-xl border p-12 text-center">
        <p class="text-foreground text-sm font-medium">No reviews match the selected filters</p>
        <p class="text-muted-foreground mt-1 text-xs">Try clearing your filters to view all customer feedback</p>
        <Button type="button" variant="outline" size="sm" class="mt-4 h-8 text-xs" @click="resetFilters">
          Reset Filters
        </Button>
      </div>

      <Card v-for="rev in filteredReviews" :key="rev.id" class="border-border bg-card p-5 shadow-xs">
        <div class="space-y-4">
          <!-- Header Row -->
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <Avatar class="border-border size-10 border">
                <AvatarImage v-if="rev.avatar" :src="rev.avatar" :alt="rev.author" />
                <AvatarFallback class="text-xs font-medium">{{ rev.initials }}</AvatarFallback>
              </Avatar>
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">{{ rev.author }}</span>
                  <Badge
                    v-if="rev.verified"
                    variant="secondary"
                    class="text-muted-foreground h-5 gap-1 px-1.5 text-xs font-normal"
                  >
                    <CheckCircle2 class="size-3 text-emerald-500" />
                    Verified Buyer
                  </Badge>
                </div>
                <time class="text-muted-foreground text-xs">{{ rev.date }}</time>
              </div>
            </div>
            <Rating :model-value="rev.rating" readonly size="small" />
          </div>

          <!-- Review Content -->
          <div class="space-y-2">
            <h5 class="text-foreground text-sm font-semibold sm:text-base">{{ rev.title }}</h5>
            <p class="text-muted-foreground text-xs leading-relaxed sm:text-sm">{{ rev.body }}</p>
          </div>

          <!-- Product Variant -->
          <div
            v-if="rev.variant"
            class="bg-muted/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
          >
            <span>{{ rev.variant }}</span>
          </div>

          <!-- Attached Photos -->
          <div v-if="rev.photos && rev.photos.length > 0" class="flex flex-wrap gap-2 pt-1">
            <button
              v-for="(photoUrl, pIdx) in rev.photos"
              :key="pIdx"
              type="button"
              class="group border-border bg-muted focus-visible:ring-ring relative size-16 cursor-pointer overflow-hidden rounded-lg border focus-visible:ring-2 focus-visible:outline-none sm:size-20"
              :aria-label="`Review photo ${pIdx + 1} by ${rev.author}`"
              @click="activePhotoUrl = photoUrl"
            >
              <img
                :src="photoUrl"
                :alt="`Review photo ${pIdx + 1} by ${rev.author}`"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          </div>

          <!-- Helpful Action Button -->
          <div class="border-border flex items-center justify-between border-t pt-3">
            <p class="text-muted-foreground text-xs">Was this review helpful?</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              class="h-8 gap-1.5 text-xs transition-colors"
              :class="rev.isHelpful ? 'border-primary/40 bg-primary/10 text-primary font-medium' : ''"
              @click="toggleHelpful(rev.id)"
            >
              <ThumbsUp class="size-3.5" :class="rev.isHelpful ? 'fill-primary' : ''" />
              Helpful ({{ rev.helpfulCount }})
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Pagination / Load More -->
    <div class="border-border flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
      <p class="text-muted-foreground text-xs">Showing 1-{{ filteredReviews.length }} of 342 reviews</p>
      <Button
        v-if="!hasLoadedMore"
        type="button"
        variant="outline"
        size="sm"
        class="h-9 px-4 text-xs font-medium"
        @click="loadMore"
      >
        Load More Reviews
      </Button>
    </div>

    <!-- Photo Modal / Lightbox -->
    <div
      v-if="activePhotoUrl"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
      @click="activePhotoUrl = null"
    >
      <div
        class="border-border bg-card relative max-h-[85vh] max-w-2xl overflow-hidden rounded-xl border p-3 shadow-sm"
        @click.stop
      >
        <img
          :src="activePhotoUrl"
          alt="Customer review photo preview"
          class="max-h-[75vh] w-auto rounded-lg object-contain"
        />
        <div class="flex items-center justify-between p-2 pt-3">
          <span class="text-muted-foreground text-xs">Customer Review Photo</span>
          <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="activePhotoUrl = null">
            Close
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
