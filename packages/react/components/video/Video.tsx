import * as React from 'react'
import { Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface VideoProps extends React.HTMLAttributes<HTMLDivElement> {
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

const Video = React.forwardRef<HTMLDivElement, VideoProps>(
  (
    {
      src,
      poster,
      autoplay = false,
      loop = false,
      muted = false,
      nativeControls = false,
      playbackRate = 1,
      aspectRatio = '16/9',
      className,
      ...props
    },
    ref,
  ) => {
    const videoRef = React.useRef<HTMLVideoElement | null>(null)
    const containerRef = React.useRef<HTMLDivElement | null>(null)

    const [playing, setPlaying] = React.useState(false)
    const [playbackFailed, setPlaybackFailed] = React.useState(false)
    const [current, setCurrent] = React.useState(0)
    const [duration, setDuration] = React.useState(0)
    const [volume, setVolume] = React.useState(muted ? 0 : 1)
    const [isMuted, setIsMuted] = React.useState(muted)
    const [isFullscreen, setIsFullscreen] = React.useState(false)
    const [showControls, setShowControls] = React.useState(true)
    const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    const togglePlay = React.useCallback(() => {
      const v = videoRef.current
      if (!v) return
      if (v.paused) {
        void v.play().catch(() => {
          setPlaying(false)
          setPlaybackFailed(true)
        })
      } else v.pause()
    }, [])

    const onPlay = React.useCallback(() => {
      setPlaybackFailed(false)
      setPlaying(true)
    }, [])
    const onPause = React.useCallback(() => setPlaying(false), [])
    const onTimeUpdate = React.useCallback(() => {
      const v = videoRef.current
      if (!v) return
      setCurrent(v.currentTime)
    }, [])
    const onLoadedMetadata = React.useCallback(() => {
      const v = videoRef.current
      if (!v) return
      setDuration(v.duration || 0)
      v.playbackRate = playbackRate
      v.volume = volume
    }, [playbackRate, volume])
    const onVolumeChange = React.useCallback(() => {
      const v = videoRef.current
      if (!v) return
      setVolume(v.volume)
      setIsMuted(v.muted)
    }, [])

    const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = videoRef.current
      if (!v) return
      v.currentTime = Number(e.target.value)
    }

    const setVolumeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = videoRef.current
      if (!v) return
      v.volume = Number(e.target.value)
      v.muted = Number(e.target.value) === 0
    }

    const toggleMute = React.useCallback(() => {
      const v = videoRef.current
      if (!v) return
      v.muted = !v.muted
    }, [])

    const skip = React.useCallback((seconds: number) => {
      const v = videoRef.current
      if (!v) return
      v.currentTime = Math.min(Math.max(v.currentTime + seconds, 0), v.duration || 0)
    }, [])

    const toggleFullscreen = React.useCallback(() => {
      const el = containerRef.current
      if (!el) return
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        el.requestFullscreen()
      }
    }, [])

    const adjustVolume = React.useCallback((delta: number) => {
      const v = videoRef.current
      if (!v) return
      const next = Math.min(1, Math.max(0, (v.muted ? 0 : v.volume) + delta))
      v.volume = next
      v.muted = next === 0
    }, [])

    /** Keyboard shortcuts when the player (or its controls) is focused. */
    const onKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
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
      },
      [nativeControls, togglePlay, toggleMute, toggleFullscreen, skip, adjustVolume],
    )

    const onFullscreenChange = React.useCallback(() => {
      setIsFullscreen(!!document.fullscreenElement)
    }, [])

    const onMouseMove = () => {
      setShowControls(true)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      hideTimerRef.current = setTimeout(() => {
        setPlaying((p) => {
          if (p) setShowControls(false)
          return p
        })
      }, 2500)
    }

    const onMouseLeave = () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      if (videoRef.current && !videoRef.current.paused) setShowControls(false)
    }

    const formatTime = (s: number): string => {
      if (!s || !isFinite(s)) return '0:00'
      const m = Math.floor(s / 60)
      const sec = Math.floor(s % 60)
      return `${m}:${sec.toString().padStart(2, '0')}`
    }

    React.useEffect(() => {
      document.addEventListener('fullscreenchange', onFullscreenChange)
      return () => {
        document.removeEventListener('fullscreenchange', onFullscreenChange)
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      }
    }, [onFullscreenChange])

    React.useEffect(() => {
      const v = videoRef.current
      if (v) v.playbackRate = playbackRate
    }, [playbackRate])

    React.useEffect(() => {
      const v = videoRef.current
      if (v) v.muted = muted
    }, [muted])

    return (
      <div
        ref={containerRef}
        data-uipkge=""
        data-slot="video"
        role="region"
        aria-label="Video player"
        tabIndex={0}
        className={cn(
          'group focus-visible:ring-ring relative overflow-hidden rounded-lg bg-black outline-none focus-visible:ring-2',
          className,
        )}
        style={{ aspectRatio }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onKeyDown={onKeyDown}
        {...props}
      >
        <video
          ref={videoRef}
          data-slot="video-element"
          className="size-full object-contain"
          src={src}
          poster={poster}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={nativeControls}
          playsInline
          onPlay={onPlay}
          onError={() => setPlaybackFailed(true)}
          onLoadStart={() => setPlaybackFailed(false)}
          onPause={onPause}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onVolumeChange={onVolumeChange}
          onClick={togglePlay}
        />

        {playbackFailed && (
          <p
            role="alert"
            className="bg-background text-foreground absolute inset-x-3 top-3 z-10 rounded-md p-3 text-sm"
          >
            Unable to play this video. Check the source or try again.
          </p>
        )}

        {!nativeControls && (
          <div
            data-slot="video-controls"
            className={cn(
              'absolute inset-0 flex flex-col justify-between transition-opacity duration-200 motion-reduce:transition-none',
              showControls || !playing ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            {/* Top spacer / click target (keeps play toggle when controls visible) */}
            <div className="flex-1" onClick={togglePlay} />

            {/* Bottom controls bar */}
            <div className="bg-gradient-to-t from-black/80 to-transparent px-3 pt-6 pb-2">
              {/* Progress bar */}
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-white/80 tabular-nums">{formatTime(current)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={current}
                  aria-label="Seek"
                  className="accent-primary [&::-webkit-slider-thumb]:bg-primary h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/30 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
                  onChange={seek}
                />
                <span className="text-xs text-white/80 tabular-nums">{formatTime(duration)}</span>
              </div>

              {/* Buttons row */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-white/90 transition-colors hover:text-white"
                  aria-label={playing ? 'Pause' : 'Play'}
                  onClick={togglePlay}
                >
                  {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
                </button>
                <button
                  type="button"
                  className="text-white/90 transition-colors hover:text-white"
                  aria-label="Rewind 10s"
                  onClick={() => skip(-10)}
                >
                  <RotateCcw className="size-4" />
                </button>
                <button
                  type="button"
                  className="text-white/90 transition-colors hover:text-white"
                  aria-label="Forward 10s"
                  onClick={() => skip(10)}
                >
                  <RotateCw className="size-4" />
                </button>

                {/* Volume */}
                <div className="group/volume flex items-center gap-1.5">
                  <button
                    type="button"
                    className="text-white/90 transition-colors hover:text-white"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    aria-label="Volume"
                    className="accent-primary [&::-webkit-slider-thumb]:bg-primary h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/30 transition-all duration-200 group-hover/volume:w-16 motion-reduce:transition-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
                    onChange={setVolumeInput}
                  />
                </div>

                <div className="flex-1" />

                <button
                  type="button"
                  className="text-white/90 transition-colors hover:text-white"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  },
)
Video.displayName = 'Video'

export { Video }
