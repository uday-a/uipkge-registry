import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  UiHoverCardComponent,
  UiHoverCardContentComponent,
  UiHoverCardTriggerComponent,
} from '@/ui/hover-card/hover-card.component'
import { UiAvatarComponent, UiAvatarFallbackComponent, UiAvatarImageComponent } from '@/ui/avatar/avatar.component'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'

/**
 * Angular port of UIPKGE MentionTag, 1:1 with the React component: an inline chip (an
 * `<a>` when `href` is set, else a `<span>`) showing `trigger` + name, which reveals a
 * Twitter/X-style profile HoverCard (avatar, Follow toggle, name + verified badge, handle,
 * email, bio, joined date, following / followers) after `openDelay`. `popover=false`
 * renders the bare chip; `popupContent` replaces the card body. Projected content replaces
 * the default chip text (React `children`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-mention-tag, [ui-mention-tag]',
  standalone: true,
  imports: [
    UiHoverCardComponent,
    UiHoverCardTriggerComponent,
    UiHoverCardContentComponent,
    UiAvatarComponent,
    UiAvatarImageComponent,
    UiAvatarFallbackComponent,
    UiRenderTemplateDirective,
  ],
  // React renders the chip itself (no wrapper element).
  host: { '[class]': '"contents"' },
  template: `
    <ng-template #chipContent>
      <ng-content>
        <span class="text-primary font-semibold">{{ trigger }}</span>
        <span>{{ name || handle || email }}</span>
      </ng-content>
    </ng-template>

    @if (popover) {
      <ui-hover-card [openDelay]="openDelay" [closeDelay]="closeDelay">
        @if (href) {
          <a ui-hover-card-trigger [attr.href]="href" data-uipkge="" data-slot="mention-tag" [class]="chipClass"
            ><ng-container [uiRenderTemplate]="chipContent"
          /></a>
        } @else {
          <span ui-hover-card-trigger data-uipkge="" data-slot="mention-tag" [class]="chipClass"
            ><ng-container [uiRenderTemplate]="chipContent"
          /></span>
        }
        <ui-hover-card-content align="start" [sideOffset]="6" class="border-border/80 w-80 rounded-xl p-4 shadow-lg">
          @if (popupContent) {
            <ng-container [uiRenderTemplate]="popupContent" />
          } @else {
            <div class="space-y-3">
              <div class="flex items-start justify-between gap-3">
                <ui-avatar class="ring-border/50 size-12 ring-2">
                  @if (avatar) {
                    <ui-avatar-image [src]="avatar" [alt]="name || handle || ''" />
                  }
                  <ui-avatar-fallback class="text-sm font-semibold">{{ initials }}</ui-avatar-fallback>
                </ui-avatar>
                <button
                  type="button"
                  [class]="followClass"
                  (click)="$event.stopPropagation(); isFollowing.set(!isFollowing())"
                >
                  {{ isFollowing() ? 'Following' : 'Follow' }}
                </button>
              </div>

              <div>
                <div class="flex items-center gap-1">
                  <span class="text-foreground text-sm font-bold tracking-tight">{{ name || handle }}</span>
                  @if (verified) {
                    <span class="text-primary inline-flex" title="Verified">
                      <svg class="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </span>
                  }
                </div>
                <p class="text-muted-foreground font-mono text-xs">{{ formattedHandle }}</p>
                @if (email) {
                  <p class="text-muted-foreground mt-0.5 text-xs">{{ email }}</p>
                }
              </div>

              @if (bio) {
                <p class="text-foreground/90 text-xs leading-relaxed">{{ bio }}</p>
              }

              @if (joined || location) {
                <div class="text-muted-foreground flex items-center gap-4 text-xs">
                  @if (joined) {
                    <div class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-calendar size-3.5 opacity-70"
                        aria-hidden="true"
                      >
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M3 10h18" />
                      </svg>
                      <span>Joined {{ joined }}</span>
                    </div>
                  }
                </div>
              }

              @if (following !== undefined || followers !== undefined) {
                <div class="border-border/50 flex items-center gap-4 border-t pt-1 text-xs">
                  @if (following !== undefined) {
                    <div>
                      <span class="text-foreground font-bold">{{ following }}</span>
                      <span class="text-muted-foreground ml-1">Following</span>
                    </div>
                  }
                  @if (followers !== undefined) {
                    <div>
                      <span class="text-foreground font-bold">{{ followers }}</span>
                      <span class="text-muted-foreground ml-1">Followers</span>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </ui-hover-card-content>
      </ui-hover-card>
    } @else if (href) {
      <a [attr.href]="href" data-uipkge="" data-slot="mention-tag" [class]="chipClass"
        ><ng-container [uiRenderTemplate]="chipContent"
      /></a>
    } @else {
      <span data-uipkge="" data-slot="mention-tag" [class]="chipClass"
        ><ng-container [uiRenderTemplate]="chipContent"
      /></span>
    }
  `,
})
export class UiMentionTagComponent implements AfterViewChecked {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input() trigger = '@'
  @Input() name?: string
  @Input() handle?: string
  @Input() email?: string
  @Input() avatar?: string
  @Input() bio?: string
  @Input() joined?: string
  @Input() location?: string
  @Input() following?: number | string
  @Input() followers?: number | string
  @Input({ transform: booleanAttribute }) verified = false
  @Input() href?: string
  @Input({ transform: booleanAttribute }) popover = true
  @Input() openDelay = 150
  @Input() closeDelay = 100
  /** Replaces the default profile card body (React `popupContent` node). */
  @Input() popupContent?: TemplateRef<unknown> | null
  @Input('class') className?: string

  readonly isFollowing = signal(false)

  ngAfterViewChecked(): void {
    // Radix Slot: the chip's data-slot wins over HoverCardTrigger's (Angular host bindings would win).
    const chip = this.el.querySelector(':scope > ui-hover-card > [data-slot="hover-card-trigger"]')
    chip?.setAttribute('data-slot', 'mention-tag')
  }

  get formattedHandle(): string {
    if (!this.handle && !this.name) return ''
    const h = this.handle || this.name || ''
    return h.startsWith(this.trigger) ? h : `${this.trigger}${h}`
  }

  get initials(): string {
    return (this.name || this.handle || 'U').slice(0, 2).toUpperCase()
  }

  get chipClass(): string {
    return cn(
      'inline-flex cursor-pointer items-center gap-0.5 rounded px-1.5 py-0.5 text-sm font-medium transition-colors select-none',
      'bg-muted/70 text-foreground hover:bg-accent hover:text-accent-foreground',
      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
      this.className,
    )
  }

  get followClass(): string {
    return cn(
      'h-8 rounded-full px-3.5 text-xs font-semibold transition-[transform,background-color] duration-150 active:scale-95',
      this.isFollowing()
        ? 'border-border text-foreground hover:bg-muted border bg-transparent'
        : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
    )
  }
}
