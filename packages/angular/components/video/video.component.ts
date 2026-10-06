import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  booleanAttribute,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

/**
 * Angular port of UIPKGE Video — native video element with a custom controls
 * overlay (play/pause, skip, volume, rate, fullscreen, progress).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-video, [ui-video]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"video"',
    '[attr.data-uipkge]': '""',
    '[attr.data-playing]': 'playing',
    role: 'region',
    'aria-label': 'Video player',
    tabindex: '0',
    '[class]': 'hostClass',
    '[style.aspectRatio]': 'aspectRatio',
    '(mousemove)': 'onMouseMove()',
    '(mouseleave)': 'onMouseLeave()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <video
      #videoEl
      data-slot="video-element"
      class="size-full object-contain"
      [src]="src"
      [attr.poster]="poster ? poster : null"
      [autoplay]="autoplay"
      [loop]="loop"
      [muted]="muted"
      [controls]="nativeControls"
      playsinline
      (play)="onPlay()"
      (pause)="onPause()"
      (ended)="ended.emit()"
      (timeupdate)="onTimeUpdate()"
      (loadedmetadata)="onLoadedMetadata()"
      (volumechange)="onVolumeChange()"
      (click)="togglePlay()"
      (error)="playbackFailed = true"
      (loadstart)="playbackFailed = false"
    ></video>

    @if (playbackFailed) {
      <p role="alert" class="bg-background text-foreground absolute inset-x-3 top-3 z-10 rounded-md p-3 text-sm">
        Unable to play this video. Check the source or try again.
      </p>
    }

    @if (!nativeControls) {
      <div data-slot="video-controls" [class]="controlsClass">
        <div class="flex-1" (click)="togglePlay()"></div>

        <div class="bg-gradient-to-t from-black/80 to-transparent px-3 pt-6 pb-2">
          <div class="mb-2 flex items-center gap-2">
            <span class="text-xs text-white/80 tabular-nums">{{ formatTime(current) }}</span>
            <input
              type="range"
              min="0"
              [max]="duration || 0"
              step="0.1"
              [value]="current"
              aria-label="Seek"
              class="accent-primary [&::-webkit-slider-thumb]:bg-primary h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/30 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
              (input)="seek($event)"
            />
            <span class="text-xs text-white/80 tabular-nums">{{ formatTime(duration) }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="text-white/90 transition-colors hover:text-white"
              [attr.aria-label]="playing ? 'Pause' : 'Play'"
              (click)="togglePlay()"
            >
              @if (playing) {
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-5"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              } @else {
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-5"
                >
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              }
            </button>

            <button
              type="button"
              class="text-white/90 transition-colors hover:text-white"
              aria-label="Rewind 10s"
              (click)="skip(-10)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-4"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>

            <button
              type="button"
              class="text-white/90 transition-colors hover:text-white"
              aria-label="Forward 10s"
              (click)="skip(10)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-4"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>

            <div class="group/volume flex items-center gap-1.5">
              <button
                type="button"
                class="text-white/90 transition-colors hover:text-white"
                [attr.aria-label]="isMuted ? 'Unmute' : 'Mute'"
                (click)="toggleMute()"
              >
                @if (isMuted || volume === 0) {
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="22" x2="16" y1="9" y2="15" />
                    <line x1="16" x2="22" y1="9" y2="15" />
                  </svg>
                } @else {
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                }
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                [value]="isMuted ? 0 : volume"
                aria-label="Volume"
                class="accent-primary [&::-webkit-slider-thumb]:bg-primary h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/30 transition-[width] duration-200 group-hover/volume:w-16 motion-reduce:transition-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
                (input)="onVolumeSlider($event)"
              />
            </div>

            <div class="flex-1"></div>

            <button
              type="button"
              class="text-white/90 transition-colors hover:text-white"
              [attr.aria-label]="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
              (click)="toggleFullscreen()"
            >
              @if (isFullscreen) {
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-4"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                  <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              } @else {
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-4"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class UiVideoComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  private hostEl?: HTMLElement

  constructor() {
    try {
      this.hostEl = inject(ElementRef, { optional: true })?.nativeElement
    } catch {
      // Instantiated outside injection context (e.g. unit tests)
    }
  }

  @Input({ required: true }) src = ''
  @Input() poster?: string
  @Input({ transform: booleanAttribute }) autoplay = false
  @Input({ transform: booleanAttribute }) loop = false
  @Input({ transform: booleanAttribute }) muted = false
  @Input({ transform: booleanAttribute }) nativeControls = false
  @Input() playbackRate = 1
  @Input() aspectRatio = '16/9'
  @Input('class') hostClassAttr?: string
  @Input() className?: string

  @Output() play = new EventEmitter<void>()
  @Output() pause = new EventEmitter<void>()
  @Output() ended = new EventEmitter<void>()
  @Output() timeUpdate = new EventEmitter<number>()

  @ViewChild('videoEl') videoElRef?: ElementRef<HTMLVideoElement>

  playing = false
  playbackFailed = false
  current = 0
  duration = 0
  volume = 1
  isMuted = false
  isFullscreen = false
  showControls = true
  private hideTimer: ReturnType<typeof setTimeout> | null = null

  get hostClass(): string {
    return cn(
      'block w-full group focus-visible:ring-ring relative overflow-hidden rounded-lg bg-black outline-none focus-visible:ring-2',
      this.hostClassAttr,
      this.className,
    )
  }

  get controlsClass(): string {
    return cn(
      'absolute inset-0 flex flex-col justify-between transition-opacity duration-200 motion-reduce:transition-none',
      this.showControls || !this.playing ? 'opacity-100' : 'pointer-events-none opacity-0',
    )
  }

  ngOnInit(): void {
    if (this.muted) {
      this.volume = 0
      this.isMuted = true
    }
  }

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', this.handleFullscreenChange)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const v = this.videoElRef?.nativeElement
    if (v && changes['playbackRate']) v.playbackRate = this.playbackRate
  }

  ngOnDestroy(): void {
    if (this.hideTimer) clearTimeout(this.hideTimer)
    if (typeof document !== 'undefined') {
      document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
    }
  }

  private handleFullscreenChange = (): void => {
    if (typeof document !== 'undefined') {
      this.isFullscreen = !!document.fullscreenElement
    }
  }

  onPlay(): void {
    this.playbackFailed = false
    this.playing = true
    this.play.emit()
  }

  onPause(): void {
    this.playing = false
    this.pause.emit()
  }

  onTimeUpdate(): void {
    const v = this.videoElRef?.nativeElement
    if (!v) return
    this.current = v.currentTime
    this.timeUpdate.emit(this.current)
  }

  onLoadedMetadata(): void {
    const v = this.videoElRef?.nativeElement
    if (!v) return
    this.duration = v.duration || 0
    v.playbackRate = this.playbackRate
    v.volume = this.volume
  }

  onVolumeChange(): void {
    const v = this.videoElRef?.nativeElement
    if (!v) return
    this.volume = v.volume
    this.isMuted = v.muted
  }

  togglePlay(): void {
    const v = this.videoElRef?.nativeElement
    if (v) {
      if (v.paused) {
        v.play().catch(() => {
          this.playing = false
          this.playbackFailed = true
        })
      } else {
        v.pause()
      }
    } else {
      this.playing = !this.playing
      if (this.playing) this.play.emit()
      else this.pause.emit()
    }
  }

  toggleMute(): void {
    const v = this.videoElRef?.nativeElement
    if (v) {
      v.muted = !v.muted
    } else {
      this.isMuted = !this.isMuted
      this.volume = this.isMuted ? 0 : 1
    }
  }

  setVolume(v: number): void {
    this.volume = Math.min(1, Math.max(0, v))
    this.isMuted = this.volume === 0
    const el = this.videoElRef?.nativeElement
    if (el) {
      el.volume = this.volume
      el.muted = this.isMuted
    }
  }

  onVolumeSlider(e: Event): void {
    const target = e.target as HTMLInputElement
    this.setVolume(Number(target.value))
  }

  seek(e: Event): void {
    const target = e.target as HTMLInputElement
    this.seekTo(Number(target.value))
  }

  seekTo(t: number): void {
    const max = this.duration > 0 ? this.duration : Number.POSITIVE_INFINITY
    this.current = Math.min(max, Math.max(0, t))
    const v = this.videoElRef?.nativeElement
    if (v) v.currentTime = this.current
    this.timeUpdate.emit(this.current)
  }

  skip(seconds: number): void {
    this.seekTo(this.current + seconds)
  }

  setRate(r: number): void {
    if (r > 0) {
      this.playbackRate = r
      const v = this.videoElRef?.nativeElement
      if (v) v.playbackRate = r
    }
  }

  toggleFullscreen(): void {
    const el = this.hostEl
    if (!el || typeof document === 'undefined') return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }

  progress(): number {
    if (!this.duration) return 0
    return Math.min(1, Math.max(0, this.current / this.duration))
  }

  formatTime(s: number): string {
    const total = Math.max(0, Math.floor(s))
    const m = Math.floor(total / 60)
    const sec = total % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  onMouseMove(): void {
    this.showControls = true
    if (this.hideTimer) clearTimeout(this.hideTimer)
    if (this.playing) {
      this.hideTimer = setTimeout(() => {
        this.showControls = false
      }, 2500)
    }
  }

  onMouseLeave(): void {
    if (this.playing) this.showControls = false
  }

  onKeydown(e: KeyboardEvent): void {
    if (this.nativeControls) return
    const target = e.target as HTMLElement | null
    if ((e.key === ' ' || e.key === 'Enter') && target?.closest('button')) return
    if (target instanceof HTMLInputElement && target.type === 'range' && e.key.startsWith('Arrow')) return

    const key = e.key
    if (key === ' ' || key === 'k' || key === 'K') {
      e.preventDefault()
      this.togglePlay()
    } else if (key === 'm' || key === 'M') {
      e.preventDefault()
      this.toggleMute()
    } else if (key === 'f' || key === 'F') {
      e.preventDefault()
      this.toggleFullscreen()
    } else if (key === 'ArrowLeft') {
      e.preventDefault()
      this.skip(-5)
    } else if (key === 'ArrowRight') {
      e.preventDefault()
      this.skip(5)
    } else if (key === 'ArrowUp') {
      e.preventDefault()
      this.setVolume(this.volume + 0.05)
    } else if (key === 'ArrowDown') {
      e.preventDefault()
      this.setVolume(this.volume - 0.05)
    }
  }
}
