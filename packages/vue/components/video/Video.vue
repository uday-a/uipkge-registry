<script setup lang="ts">
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-vue-next";
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type HTMLAttributes,
} from "vue";
import { cn } from "@/lib/utils";

interface Props {
  /** Video source URL. */
  src: string;
  /** Poster image shown before playback. */
  poster?: string;
  /** Autoplay on mount. Note: browsers may block autoplay with sound. */
  autoplay?: boolean;
  /** Loop playback. */
  loop?: boolean;
  /** Muted audio. */
  muted?: boolean;
  /** Use native browser controls instead of the custom overlay. Default false. */
  nativeControls?: boolean;
  /** Initial playback rate. Default 1. */
  playbackRate?: number;
  /** Aspect ratio class or inline style value. Default '16/9'. */
  aspectRatio?: string;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  loop: false,
  muted: false,
  nativeControls: false,
  playbackRate: 1,
  aspectRatio: "16/9",
});

const videoRef = ref<HTMLVideoElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);

const playing = ref(false);
const playbackFailed = ref(false);
const current = ref(0);
const duration = ref(0);
const volume = ref(props.muted ? 0 : 1);
const isMuted = ref(props.muted);
const isFullscreen = ref(false);
const showControls = ref(true);
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function togglePlay() {
  const v = videoRef.value;
  if (!v) return;
  if (v.paused) {
    void v.play().catch(() => {
      playing.value = false;
      playbackFailed.value = true;
    });
  } else v.pause();
}

function adjustVolume(delta: number) {
  const v = videoRef.value;
  if (!v) return;
  const next = Math.min(1, Math.max(0, (v.muted ? 0 : v.volume) + delta));
  v.volume = next;
  v.muted = next === 0;
}

/** Keyboard shortcuts when the player (or its controls) is focused. */
function onKeydown(e: KeyboardEvent) {
  if (props.nativeControls) return;
  const target = e.target as HTMLElement | null;
  // Don't steal Space/Enter from native button activation.
  if ((e.key === " " || e.key === "Enter") && target?.closest("button")) return;
  // Let range inputs handle their own arrow keys.
  if (
    target instanceof HTMLInputElement &&
    target.type === "range" &&
    e.key.startsWith("Arrow")
  )
    return;

  const key = e.key;
  if (key === " " || key === "k" || key === "K") {
    e.preventDefault();
    togglePlay();
    return;
  }
  if (key === "m" || key === "M") {
    e.preventDefault();
    toggleMute();
    return;
  }
  if (key === "f" || key === "F") {
    e.preventDefault();
    toggleFullscreen();
    return;
  }
  if (key === "ArrowLeft") {
    e.preventDefault();
    skip(-5);
    return;
  }
  if (key === "ArrowRight") {
    e.preventDefault();
    skip(5);
    return;
  }
  if (key === "ArrowUp") {
    e.preventDefault();
    adjustVolume(0.05);
    return;
  }
  if (key === "ArrowDown") {
    e.preventDefault();
    adjustVolume(-0.05);
  }
}

function onPlay() {
  playbackFailed.value = false;
  playing.value = true;
}
function onPause() {
  playing.value = false;
}
function onTimeUpdate() {
  const v = videoRef.value;
  if (!v) return;
  current.value = v.currentTime;
}
function onLoadedMetadata() {
  const v = videoRef.value;
  if (!v) return;
  duration.value = v.duration || 0;
  v.playbackRate = props.playbackRate;
  v.volume = volume.value;
}
function onVolumeChange() {
  const v = videoRef.value;
  if (!v) return;
  volume.value = v.volume;
  isMuted.value = v.muted;
}

function seek(e: Event) {
  const v = videoRef.value;
  if (!v) return;
  const target = e.target as HTMLInputElement;
  v.currentTime = Number(target.value);
}

function setVolume(e: Event) {
  const v = videoRef.value;
  if (!v) return;
  const target = e.target as HTMLInputElement;
  v.volume = Number(target.value);
  v.muted = Number(target.value) === 0;
}

function toggleMute() {
  const v = videoRef.value;
  if (!v) return;
  v.muted = !v.muted;
}

function skip(seconds: number) {
  const v = videoRef.value;
  if (!v) return;
  v.currentTime = Math.min(
    Math.max(v.currentTime + seconds, 0),
    v.duration || 0,
  );
}

function toggleFullscreen() {
  const el = containerRef.value;
  if (!el) return;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    el.requestFullscreen();
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

function onMouseMove() {
  showControls.value = true;
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (playing.value) showControls.value = false;
  }, 2500);
}

function onMouseLeave() {
  if (hideTimer) clearTimeout(hideTimer);
  if (playing.value) showControls.value = false;
}

function formatTime(s: number): string {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

watch(
  () => props.playbackRate,
  (rate) => {
    if (videoRef.value) videoRef.value.playbackRate = rate;
  },
);

watch(
  () => props.muted,
  (m) => {
    if (videoRef.value) videoRef.value.muted = m;
  },
);

onMounted(() => {
  document.addEventListener("fullscreenchange", onFullscreenChange);
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", onFullscreenChange);
  if (hideTimer) clearTimeout(hideTimer);
});
</script>

<template>
  <div
    ref="containerRef"
    data-uipkge
    data-slot="video"
    role="region"
    aria-label="Video player"
    tabindex="0"
    :class="
      cn(
        'group focus-visible:ring-ring relative overflow-hidden rounded-lg bg-black outline-none focus-visible:ring-2',
        props.class,
      )
    "
    :style="{ aspectRatio: aspectRatio }"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @keydown="onKeydown"
  >
    <video
      ref="videoRef"
      data-slot="video-element"
      class="size-full object-contain"
      :src="src"
      :poster="poster"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :controls="nativeControls"
      playsinline
      @play="onPlay"
      @error="playbackFailed = true"
      @loadstart="playbackFailed = false"
      @pause="onPause"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @volumechange="onVolumeChange"
      @click="togglePlay"
    />

    <p
      v-if="playbackFailed"
      role="alert"
      class="bg-background text-foreground absolute inset-x-3 top-3 z-10 rounded-md p-3 text-sm"
    >
      Unable to play this video. Check the source or try again.
    </p>

    <!-- Custom controls overlay -->
    <div
      v-if="!nativeControls"
      data-slot="video-controls"
      :class="
        cn(
          'absolute inset-0 flex flex-col justify-between transition-opacity duration-200 motion-reduce:transition-none',
          showControls || !playing
            ? 'opacity-100'
            : 'pointer-events-none opacity-0',
        )
      "
    >
      <!-- Top spacer / click target (keeps play toggle when controls visible) -->
      <div class="flex-1" @click="togglePlay" />

      <!-- Bottom controls bar -->
      <div class="bg-gradient-to-t from-black/80 to-transparent px-3 pt-6 pb-2">
        <!-- Progress bar -->
        <div class="mb-2 flex items-center gap-2">
          <span class="text-xs text-white/80 tabular-nums">{{
            formatTime(current)
          }}</span>
          <input
            type="range"
            min="0"
            :max="duration || 0"
            step="0.1"
            :value="current"
            aria-label="Seek"
            class="accent-primary [&::-webkit-slider-thumb]:bg-primary h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/30 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
            @input="seek"
          />
          <span class="text-xs text-white/80 tabular-nums">{{
            formatTime(duration)
          }}</span>
        </div>

        <!-- Buttons row -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="text-white/90 transition-colors hover:text-white"
            :aria-label="playing ? 'Pause' : 'Play'"
            @click="togglePlay"
          >
            <component :is="playing ? Pause : Play" class="size-5" />
          </button>
          <button
            type="button"
            class="text-white/90 transition-colors hover:text-white"
            aria-label="Rewind 10s"
            @click="skip(-10)"
          >
            <RotateCcw class="size-4" />
          </button>
          <button
            type="button"
            class="text-white/90 transition-colors hover:text-white"
            aria-label="Forward 10s"
            @click="skip(10)"
          >
            <RotateCw class="size-4" />
          </button>

          <!-- Volume -->
          <div class="group/volume flex items-center gap-1.5">
            <button
              type="button"
              class="text-white/90 transition-colors hover:text-white"
              :aria-label="isMuted ? 'Unmute' : 'Mute'"
              @click="toggleMute"
            >
              <component
                :is="isMuted || volume === 0 ? VolumeX : Volume2"
                class="size-4"
              />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              :value="isMuted ? 0 : volume"
              aria-label="Volume"
              class="accent-primary [&::-webkit-slider-thumb]:bg-primary h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/30 transition-all duration-200 group-hover/volume:w-16 motion-reduce:transition-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
              @input="setVolume"
            />
          </div>

          <div class="flex-1" />

          <button
            type="button"
            class="text-white/90 transition-colors hover:text-white"
            :aria-label="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
            @click="toggleFullscreen"
          >
            <component
              :is="isFullscreen ? Minimize : Maximize"
              class="size-4"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
