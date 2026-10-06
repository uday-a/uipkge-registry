<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface VideoProps extends HTMLAttributes<HTMLDivElement> {
    /** Video source URL. */
    src: string
    /** Poster image shown before playback. */
    poster?: string
    /** Autoplay on mount. Note: browsers may block autoplay with sound. */
    autoplay?: boolean
    /** Loop playback. */
    loop?: boolean
    /** Muted audio. */
    muted?: boolean
    /** Use native browser controls instead of the custom overlay. Default false. */
    nativeControls?: boolean
    /** Initial playback rate. Default 1. */
    playbackRate?: number
    /** Aspect ratio class or inline style value. Default '16/9'. */
    aspectRatio?: string
  }
</script>

<script lang="ts">
  import { Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let {
    src,
    poster,
    autoplay = false,
    loop = false,
    muted = false,
    nativeControls = false,
    playbackRate = 1,
    aspectRatio = '16/9',
    class: className,
    ...restProps
  }: VideoProps = $props()

  let videoRef: HTMLVideoElement | null = $state(null)
  let containerRef: HTMLDivElement | null = $state(null)

  let playing = $state(false)
  let playbackFailed = $state(false)
  let current = $state(0)
  let duration = $state(0)
  let volume = $state(muted ? 0 : 1)
  let isMuted = $state(muted)
  let isFullscreen = $state(false)
  let showControls = $state(true)
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  function togglePlay() {
    const v = videoRef
    if (!v) return
    if (v.paused) {
      void v.play().catch(() => {
        playing = false
        playbackFailed = true
      })
    } else v.pause()
  }

  function adjustVolume(delta: number) {
    const v = videoRef
    if (!v) return
    const next = Math.min(1, Math.max(0, (v.muted ? 0 : v.volume) + delta))
    v.volume = next
    v.muted = next === 0
  }

  /** Keyboard shortcuts when the player (or its controls) is focused. */
  function onKeydown(e: KeyboardEvent) {
    if (nativeControls) return
    const target = e.target as HTMLElement | null
    // Don't steal Space/Enter from native button activation.
    if ((e.key === ' ' || e.key === 'Enter') && target?.closest('button')) return
    // Let range inputs handle their own arrow keys.
    if (target instanceof HTMLInputElement && target.type === 'range' && e.key.startsWith('Arrow')) return

    const key = e.key
    if (key === ' ' || key === 'k' || key === 'K') {
      e.preventDefault()
      togglePlay()
      return
    }
    if (key === 'm' || key === 'M') {
      e.preventDefault()
      toggleMute()
      return
    }
    if (key === 'f' || key === 'F') {
      e.preventDefault()
      toggleFullscreen()
      return
    }
    if (key === 'ArrowLeft') {
      e.preventDefault()
      skip(-5)
      return
    }
    if (key === 'ArrowRight') {
      e.preventDefault()
      skip(5)
      return
    }
    if (key === 'ArrowUp') {
      e.preventDefault()
      adjustVolume(0.05)
      return
    }
    if (key === 'ArrowDown') {
      e.preventDefault()
      adjustVolume(-0.05)
    }
  }

  function onPlay() {
    playbackFailed = false
    playing = true
  }
  function onPause() {
    playing = false
  }
  function onTimeUpdate() {
    const v = videoRef
    if (!v) return
    current = v.currentTime
  }
  function onLoadedMetadata() {
    const v = videoRef
    if (!v) return
    duration = v.duration || 0
    v.playbackRate = playbackRate
    v.volume = volume
  }
  function onVolumeChange() {
    const v = videoRef
    if (!v) return
    volume = v.volume
    isMuted = v.muted
  }

  function seek(e: Event) {
    const v = videoRef
    if (!v) return
    const target = e.target as HTMLInputElement
    v.currentTime = Number(target.value)
  }

  function setVolume(e: Event) {
    const v = videoRef
    if (!v) return
    const target = e.target as HTMLInputElement
    v.volume = Number(target.value)
    v.muted = Number(target.value) === 0
  }

  function toggleMute() {
    const v = videoRef
    if (!v) return
    v.muted = !v.muted
  }

  function skip(seconds: number) {
    const v = videoRef
    if (!v) return
    v.currentTime = Math.min(Math.max(v.currentTime + seconds, 0), v.duration || 0)
  }

  function toggleFullscreen() {
    const el = containerRef
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }

  function onFullscreenChange() {
    isFullscreen = !!document.fullscreenElement
  }

  function onMouseMove() {
    showControls = true
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      if (playing) showControls = false
    }, 2500)
  }

  function onMouseLeave() {
    if (hideTimer) clearTimeout(hideTimer)
    if (playing) showControls = false
  }

  function formatTime(s: number): string {
    if (!s || !isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  $effect(() => {
    if (videoRef) videoRef.playbackRate = playbackRate
  })

  $effect(() => {
    if (videoRef) videoRef.muted = muted
  })

  $effect(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      if (hideTimer) clearTimeout(hideTimer)
    }
  })
</script>

<div
  bind:this={containerRef}
  data-uipkge
  data-slot="video"
  role="region"
  aria-label="Video player"
  tabindex="0"
  class={cn(
    'group focus-visible:ring-ring relative overflow-hidden rounded-lg bg-black outline-none focus-visible:ring-2',
    className,
  )}
  style:aspect-ratio={aspectRatio}
  onmousemove={onMouseMove}
  onmouseleave={onMouseLeave}
  onkeydown={onKeydown}
  {...restProps}
>
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={videoRef}
    data-slot="video-element"
    class="size-full object-contain"
    {src}
    {poster}
    {autoplay}
    {loop}
    {muted}
    controls={nativeControls}
    playsinline
    onplay={onPlay}
    onerror={() => (playbackFailed = true)}
    onloadstart={() => (playbackFailed = false)}
    onpause={onPause}
    ontimeupdate={onTimeUpdate}
    onloadedmetadata={onLoadedMetadata}
    onvolumechange={onVolumeChange}
    onclick={togglePlay}
  ></video>

  {#if playbackFailed}
    <p role="alert" class="bg-background text-foreground absolute inset-x-3 top-3 z-10 rounded-md p-3 text-sm">
      Unable to play this video. Check the source or try again.
    </p>
  {/if}

  <!-- Custom controls overlay -->
  {#if !nativeControls}
    <div
      data-slot="video-controls"
      class={cn(
        'absolute inset-0 flex flex-col justify-between transition-opacity duration-200 motion-reduce:transition-none',
        showControls || !playing ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <!-- Top spacer / click target (keeps play toggle when controls visible).
        Keyboard users drive the player through the focused container's shortcuts. -->
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <div class="flex-1" onclick={togglePlay}></div>

      <!-- Bottom controls bar -->
      <div class="bg-gradient-to-t from-black/80 to-transparent px-3 pt-6 pb-2">
        <!-- Progress bar -->
        <div class="mb-2 flex items-center gap-2">
          <span class="text-xs text-white/80 tabular-nums">{formatTime(current)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={current}
            aria-label="Seek"
            class="accent-primary [&::-webkit-slider-thumb]:bg-primary h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/30 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
            oninput={seek}
          />
          <span class="text-xs text-white/80 tabular-nums">{formatTime(duration)}</span>
        </div>

        <!-- Buttons row -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="text-white/90 transition-colors hover:text-white"
            aria-label={playing ? 'Pause' : 'Play'}
            onclick={togglePlay}
          >
            {#if playing}
              <Pause class="size-5" />
            {:else}
              <Play class="size-5" />
            {/if}
          </button>
          <button
            type="button"
            class="text-white/90 transition-colors hover:text-white"
            aria-label="Rewind 10s"
            onclick={() => skip(-10)}
          >
            <RotateCcw class="size-4" />
          </button>
          <button
            type="button"
            class="text-white/90 transition-colors hover:text-white"
            aria-label="Forward 10s"
            onclick={() => skip(10)}
          >
            <RotateCw class="size-4" />
          </button>

          <!-- Volume -->
          <div class="group/volume flex items-center gap-1.5">
            <button
              type="button"
              class="text-white/90 transition-colors hover:text-white"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              onclick={toggleMute}
            >
              {#if isMuted || volume === 0}
                <VolumeX class="size-4" />
              {:else}
                <Volume2 class="size-4" />
              {/if}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              aria-label="Volume"
              class="accent-primary [&::-webkit-slider-thumb]:bg-primary h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/30 transition-[width] duration-200 group-hover/volume:w-16 motion-reduce:transition-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
              oninput={setVolume}
            />
          </div>

          <div class="flex-1"></div>

          <button
            type="button"
            class="text-white/90 transition-colors hover:text-white"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            onclick={toggleFullscreen}
          >
            {#if isFullscreen}
              <Minimize class="size-4" />
            {:else}
              <Maximize class="size-4" />
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
