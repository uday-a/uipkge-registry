import { LitElement, css, html, isServer, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

function formatTime(s: number): string {
  if (!s || !isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

/**
 * <uip-video> — Video player with custom overlay controls, keyboard shortcuts, and fullscreen support.
 */
export class UipVideo extends LitElement {
  static styles = [tailwind, css`:host { display: block; position: relative; width: 100%; }`]

  static properties = {
    src: { type: String },
    poster: { type: String },
    autoplay: { type: Boolean },
    loop: { type: Boolean },
    muted: { type: Boolean },
    nativeControls: { type: Boolean, attribute: 'native-controls' },
    playbackRate: { type: Number, attribute: 'playback-rate' },
    aspectRatio: { attribute: 'aspect-ratio' },
    playing: { state: true },
    current: { state: true },
    duration: { state: true },
    volume: { state: true },
    isMuted: { state: true },
    isFullscreen: { state: true },
    showControls: { state: true },
    playbackFailed: { state: true },
  }

  src = ''
  poster?: string
  autoplay = false
  loop = false
  muted = false
  nativeControls = false
  playbackRate = 1
  aspectRatio = '16/9'

  private playing = false
  private current = 0
  private duration = 0
  private volume = 1
  private isMuted = false
  private isFullscreen = false
  private showControls = true
  private playbackFailed = false

  private hideTimer?: ReturnType<typeof setTimeout>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'video')
    this.setAttribute('role', 'region')
    this.setAttribute('aria-label', 'Video player')
    this.setAttribute('tabindex', '0')

    this.isMuted = this.muted
    this.volume = this.muted ? 0 : 1

    document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this))
    this.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('fullscreenchange', this.onFullscreenChange.bind(this))
    if (this.hideTimer) clearTimeout(this.hideTimer)
  }

  private get videoEl(): HTMLVideoElement | null {
    return this.renderRoot?.querySelector('video') ?? null
  }

  private onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement
  }

  togglePlay() {
    const v = this.videoEl
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {
        this.playing = false
        this.playbackFailed = true
      })
    } else {
      v.pause()
    }
  }

  private onPlay() {
    this.playbackFailed = false
    this.playing = true
    this.dispatchEvent(new CustomEvent('play', { bubbles: true, composed: true }))
  }

  private onPause() {
    this.playing = false
    this.dispatchEvent(new CustomEvent('pause', { bubbles: true, composed: true }))
  }

  private onTimeUpdate() {
    const v = this.videoEl
    if (!v) return
    this.current = v.currentTime
  }

  private onLoadedMetadata() {
    const v = this.videoEl
    if (!v) return
    this.duration = v.duration || 0
    v.playbackRate = this.playbackRate
    v.volume = this.volume
  }

  private onVolumeChange() {
    const v = this.videoEl
    if (!v) return
    this.volume = v.volume
    this.isMuted = v.muted
  }

  private seek(e: Event) {
    const input = e.target as HTMLInputElement
    const v = this.videoEl
    if (!v) return
    v.currentTime = Number(input.value)
  }

  private setVolumeInput(e: Event) {
    const input = e.target as HTMLInputElement
    const v = this.videoEl
    if (!v) return
    v.volume = Number(input.value)
    v.muted = Number(input.value) === 0
  }

  toggleMute() {
    const v = this.videoEl
    if (!v) return
    v.muted = !v.muted
  }

  skip(seconds: number) {
    const v = this.videoEl
    if (!v) return
    v.currentTime = Math.min(Math.max(v.currentTime + seconds, 0), v.duration || 0)
  }

  toggleFullscreen() {
    const el = this.renderRoot?.querySelector('[data-slot="video-container"]') as HTMLElement | null
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen?.()
    }
  }

  private onMouseMove() {
    this.showControls = true
    if (this.hideTimer) clearTimeout(this.hideTimer)
    this.hideTimer = setTimeout(() => {
      if (this.playing) this.showControls = false
    }, 2500)
  }

  private onMouseLeave() {
    if (this.hideTimer) clearTimeout(this.hideTimer)
    if (this.playing) this.showControls = false
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.nativeControls) return
    const target = e.target as HTMLElement | null
    if ((e.key === ' ' || e.key === 'Enter') && target?.closest('button')) return
    if (target instanceof HTMLInputElement && target.type === 'range' && e.key.startsWith('Arrow')) return

    if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
      e.preventDefault()
      this.togglePlay()
    } else if (e.key === 'm' || e.key === 'M') {
      e.preventDefault()
      this.toggleMute()
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault()
      this.toggleFullscreen()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      this.skip(-5)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      this.skip(5)
    }
  }

  render() {
    return html`
      <div
        data-slot="video-container"
        class="group focus-visible:ring-ring relative overflow-hidden rounded-lg bg-black outline-none focus-visible:ring-2 w-full"
        style=${styleMap({ aspectRatio: this.aspectRatio })}
        @mousemove=${this.onMouseMove}
        @mouseleave=${this.onMouseLeave}
      >
        <video
          data-slot="video-element"
          class="size-full object-contain"
          src=${this.src}
          poster=${this.poster ?? nothing}
          ?autoplay=${this.autoplay}
          ?loop=${this.loop}
          ?muted=${this.muted}
          ?controls=${this.nativeControls}
          playsinline
          @play=${this.onPlay}
          @pause=${this.onPause}
          @timeupdate=${this.onTimeUpdate}
          @loadedmetadata=${this.onLoadedMetadata}
          @volumechange=${this.onVolumeChange}
          @click=${() => this.togglePlay()}
        ></video>

        ${this.playbackFailed
          ? html`
              <p
                role="alert"
                class="bg-background text-foreground absolute inset-x-3 top-3 z-10 rounded-md p-3 text-sm"
              >
                Unable to play this video. Check the source or try again.
              </p>
            `
          : nothing}

        ${!this.nativeControls
          ? html`
              <div
                part="controls"
                data-slot="video-controls"
                class=${cn(
                  'absolute inset-0 flex flex-col justify-between transition-opacity duration-200 motion-reduce:transition-none',
                  this.showControls || !this.playing ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
              >
                <!-- Top spacer / click target -->
                <div class="flex-1" @click=${() => this.togglePlay()}></div>

                <!-- Bottom controls bar -->
                <div class="bg-gradient-to-t from-black/80 to-transparent px-3 pt-6 pb-2">
                  <!-- Progress bar -->
                  <div class="mb-2 flex items-center gap-2">
                    <span class="text-xs text-white/80 tabular-nums">${formatTime(this.current)}</span>
                    <input
                      type="range"
                      min="0"
                      max=${this.duration || 0}
                      step="0.1"
                      .value=${String(this.current)}
                      aria-label="Seek"
                      class="accent-primary h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/30 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                      @input=${this.seek}
                    />
                    <span class="text-xs text-white/80 tabular-nums">${formatTime(this.duration)}</span>
                  </div>

                  <!-- Buttons row -->
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="text-white/90 transition-colors hover:text-white cursor-pointer"
                      aria-label=${this.playing ? 'Pause' : 'Play'}
                      @click=${() => this.togglePlay()}
                    >
                      ${this.playing ? icon(Pause, 'pause', 'size-5') : icon(Play, 'play', 'size-5')}
                    </button>
                    <button
                      type="button"
                      class="text-white/90 transition-colors hover:text-white cursor-pointer"
                      aria-label="Rewind 10s"
                      @click=${() => this.skip(-10)}
                    >
                      ${icon(RotateCcw, 'rotate-ccw', 'size-4')}
                    </button>
                    <button
                      type="button"
                      class="text-white/90 transition-colors hover:text-white cursor-pointer"
                      aria-label="Forward 10s"
                      @click=${() => this.skip(10)}
                    >
                      ${icon(RotateCw, 'rotate-cw', 'size-4')}
                    </button>

                    <!-- Volume -->
                    <div class="group/volume flex items-center gap-1.5">
                      <button
                        type="button"
                        class="text-white/90 transition-colors hover:text-white cursor-pointer"
                        aria-label=${this.isMuted || this.volume === 0 ? 'Unmute' : 'Mute'}
                        @click=${() => this.toggleMute()}
                      >
                        ${this.isMuted || this.volume === 0
                          ? icon(VolumeX, 'volume-x', 'size-4')
                          : icon(Volume2, 'volume-2', 'size-4')}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        .value=${String(this.isMuted ? 0 : this.volume)}
                        aria-label="Volume"
                        class="accent-primary h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/30 transition-[width] duration-200 group-hover/volume:w-16 motion-reduce:transition-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                        @input=${this.setVolumeInput}
                      />
                    </div>

                    <div class="flex-1"></div>

                    <button
                      type="button"
                      class="text-white/90 transition-colors hover:text-white cursor-pointer"
                      aria-label=${this.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                      @click=${() => this.toggleFullscreen()}
                    >
                      ${this.isFullscreen ? icon(Minimize, 'minimize', 'size-4') : icon(Maximize, 'maximize', 'size-4')}
                    </button>
                  </div>
                </div>
              </div>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-video') || customElements.define('uip-video', UipVideo)

declare global {
  interface HTMLElementTagNameMap {
    'uip-video': UipVideo
  }
}
