import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core'
import { UiInfiniteScrollComponent } from '../../../../../packages/registry-angular/components/infinite-scroll'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button'
import {
  UiCardComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
  UiCardDescriptionComponent,
  UiCardContentComponent,
} from '../../../../../packages/registry-angular/components/card'

interface FeedItem {
  id: number
  title: string
  author: string
  time: string
}

interface ChatMsg {
  id: number
  author: string
  text: string
}

const titles = [
  'Shipping rate cards v2',
  'New onboarding flow is live',
  'Q3 retention deep-dive',
  'Design system tokens audit',
  'Customer feedback summary',
  'Pricing experiment results',
  'Mobile app crash report',
  'Hiring pipeline update',
]
const authors = ['Sarah Chen', 'Marcus Webb', 'Priya Patel', 'Tom Garcia', 'Lisa Wong']

function makePage(n: number): FeedItem[] {
  return Array.from({ length: 6 }, (_, i) => {
    const id = (n - 1) * 6 + i + 1
    return {
      id,
      title: titles[(id - 1) % titles.length],
      author: authors[(id - 1) % authors.length],
      time: `${2 + ((id * 7) % 50)} min ago`,
    }
  })
}

// In React, all stories live inside one shared InfiniteScrollDemo component instance,
// so items and messages are shared across stories on the demo page.
let sharedItems: FeedItem[] = makePage(1)
let sharedLoading = false
let sharedHasMore = true
let sharedPage = 1
let sharedIsLoading = false

let sharedMessages: ChatMsg[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  author: i % 2 === 0 ? 'You' : 'Maya',
  text: ['Hey, did you see the new deploy?', 'Yeah, looks great!', 'Pushing the fix now', 'LGTM 👍'][i % 4],
}))
let sharedReverseLoading = false
let sharedReverseHasMore = true
let sharedReverseCount = 8
let sharedIsReverseLoading = false

const instances = new Set<InfiniteScrollDemoComponent>()

function notifyAll(): void {
  for (const inst of instances) {
    inst.syncFromShared()
  }
}

@Component({
  selector: 'ui-infinite-scroll-demo',
  standalone: true,
  imports: [
    UiInfiniteScrollComponent,
    UiButtonComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Activity feed') {
        <div class="w-full max-w-md">
          @for (item of items; track item.id) {
            <div class="border-border/60 flex items-start justify-between gap-3 border-b px-4 py-3">
              <div class="space-y-0.5">
                <p class="text-sm font-medium">{{ item.title }}</p>
                <p class="text-muted-foreground text-xs">{{ item.author }} · {{ item.time }}</p>
              </div>
              <span class="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs tabular-nums">
                #{{ item.id }}
              </span>
            </div>
          }
          <ui-infinite-scroll [hasMore]="hasMore" [loading]="loading" [distance]="200" (load)="load()" />
          @if (!hasMore) {
            <button ui-button size="sm" variant="ghost" class="mt-2" (click)="reset()">Reset feed</button>
          }
        </div>
      }

      @case ('Custom loading & end slots') {
        <div class="w-full max-w-md">
          @for (item of items; track 'c-' + item.id) {
            <div class="border-border/60 flex items-start justify-between gap-3 border-b px-4 py-3">
              <div class="space-y-0.5">
                <p class="text-sm font-medium">{{ item.title }}</p>
                <p class="text-muted-foreground text-xs">{{ item.author }}</p>
              </div>
            </div>
          }
          <ui-infinite-scroll [hasMore]="hasMore" [loading]="loading" [distance]="200" (load)="load()" />
        </div>
      }

      @case ('Chat timeline (reverse)') {
        <div class="border-border/60 max-h-80 w-full max-w-md overflow-y-auto rounded-md border">
          <ui-infinite-scroll
            [hasMore]="reverseHasMore"
            [loading]="reverseLoading"
            [distance]="50"
            [reverse]="true"
            (load)="loadReverse()"
          >
            @for (msg of messages; track 'r-' + msg.id) {
              <div class="border-border/60 flex gap-2 border-b px-4 py-2.5 text-sm">
                <span class="text-muted-foreground w-12 shrink-0 text-xs">{{ msg.author }}</span>
                <span>{{ msg.text }}</span>
              </div>
            }
          </ui-infinite-scroll>
        </div>
      }

      @case ('Scrollable container target') {
        <div id="inf-scroll-box" class="border-border/60 max-h-64 w-full max-w-md overflow-y-auto rounded-md border">
          @for (item of items; track 'el-' + item.id) {
            <div class="border-border/60 flex items-start justify-between gap-3 border-b px-4 py-3">
              <div class="space-y-0.5">
                <p class="text-sm font-medium">{{ item.title }}</p>
                <p class="text-muted-foreground text-xs">{{ item.author }}</p>
              </div>
            </div>
          }
          <ui-infinite-scroll
            [hasMore]="hasMore"
            [loading]="loading"
            [distance]="50"
            scrollTarget="#inf-scroll-box"
            (load)="load()"
          />
        </div>
      }

      @case ('In a card') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <div ui-card-title>Recent activity</div>
            <div ui-card-description>Updates from your team this week</div>
          </div>
          <div ui-card-content>
            @for (item of items; track 'card-' + item.id; let last = $last) {
              <div
                class="border-border/60 flex items-start justify-between gap-3 border-b py-2.5"
                [class.border-b-0]="last"
              >
                <div class="space-y-0.5">
                  <p class="text-sm font-medium">{{ item.title }}</p>
                  <p class="text-muted-foreground text-xs">{{ item.author }} · {{ item.time }}</p>
                </div>
              </div>
            }
            <ui-infinite-scroll [hasMore]="hasMore" [loading]="loading" [distance]="100" (load)="load()" />
          </div>
        </div>
      }
    }
  `,
})
export class InfiniteScrollDemoComponent implements OnInit, OnDestroy {
  @Input() story?: string

  private cdr = inject(ChangeDetectorRef)

  items: FeedItem[] = sharedItems
  loading = sharedLoading
  hasMore = sharedHasMore

  messages: ChatMsg[] = sharedMessages
  reverseLoading = sharedReverseLoading
  reverseHasMore = sharedReverseHasMore

  ngOnInit(): void {
    instances.add(this)
    this.syncFromShared()
  }

  ngOnDestroy(): void {
    instances.delete(this)
  }

  syncFromShared(): void {
    this.items = sharedItems
    this.loading = sharedLoading
    this.hasMore = sharedHasMore
    this.messages = sharedMessages
    this.reverseLoading = sharedReverseLoading
    this.reverseHasMore = sharedReverseHasMore
    this.cdr.markForCheck()
  }

  async load(): Promise<void> {
    if (sharedIsLoading || !sharedHasMore) return
    sharedIsLoading = true
    sharedLoading = true
    notifyAll()
    await new Promise((r) => setTimeout(r, 800))
    sharedPage += 1
    sharedItems = [...sharedItems, ...makePage(sharedPage)]
    if (sharedPage >= 5) sharedHasMore = false
    sharedLoading = false
    sharedIsLoading = false
    notifyAll()
  }

  reset(): void {
    sharedPage = 1
    sharedIsLoading = false
    sharedItems = makePage(1)
    sharedHasMore = true
    sharedLoading = false
    notifyAll()
  }

  async loadReverse(): Promise<void> {
    if (sharedIsReverseLoading || !sharedReverseHasMore) return
    sharedIsReverseLoading = true
    sharedReverseLoading = true
    notifyAll()
    await new Promise((r) => setTimeout(r, 800))
    const next = Array.from({ length: 4 }, (_, i) => ({
      id: sharedReverseCount + i + 1,
      author: (sharedReverseCount + i) % 2 === 0 ? 'You' : 'Maya',
      text: ['Older message', 'From earlier today', 'Re: the deploy', 'Got it'][i % 4],
    }))
    sharedReverseCount += 4
    sharedMessages = [...next, ...sharedMessages]
    if (sharedReverseCount >= 20) sharedReverseHasMore = false
    sharedReverseLoading = false
    sharedIsReverseLoading = false
    notifyAll()
  }
}
