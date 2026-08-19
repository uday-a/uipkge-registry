<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useEventListener, useMediaQuery } from "@vueuse/core";
import { TooltipProvider } from "reka-ui";
import { computed, onMounted, ref } from "vue";
import { cn } from "@/lib/utils";
import {
  provideSidebarContext,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
} from "./utils";

const props = defineProps<{
  defaultOpen?: boolean;
  open?: boolean;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  "update:open": [open: boolean];
}>();

// `useMediaQuery` returns `false` during SSR (no matchMedia) and
// re-evaluates synchronously on the client's first render. If the
// viewport is < 768px, SSR HTML has the desktop branch but the
// client wants the mobile <Sheet> branch -- Vue throws a hydration
// mismatch and the Sheet renders without its overlay (the desktop
// sidebar's div is the parent the diff lands against).
//
// Gating on `mounted` makes both the server and the client's first
// synchronous render produce the desktop branch unconditionally;
// `onMounted` then flips the flag and `Sidebar.vue`'s v-else-if
// re-runs against the real matchMedia signal. Cost: a brief
// desktop-layout flash for mobile users on first paint. That's the
// universal tradeoff for SSR-without-viewport-detection -- there is
// no clean way to know the viewport on the server.
const mediaMobile = useMediaQuery("(max-width: 768px)");
const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});
const isMobile = computed(() => mounted.value && mediaMobile.value);
const openMobile = ref(false);

// useVModel with passive:true returns a ref that appears writable but
// doesn't actually update when no parent v-model is bound. Fall back to
// a plain ref so toggleSidebar / setOpen work reliably.
const open = ref<boolean>(true);

function setOpen(value: boolean) {
  open.value = value; // emits('update:open', value)

  // This sets the cookie to keep the sidebar state.
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${open.value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
}

function setOpenMobile(value: boolean) {
  openMobile.value = value;
}

// Helper to toggle the sidebar.
function toggleSidebar() {
  return isMobile.value
    ? setOpenMobile(!openMobile.value)
    : setOpen(!open.value);
}

useEventListener("keydown", (event: KeyboardEvent) => {
  if (
    event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
    (event.metaKey || event.ctrlKey)
  ) {
    event.preventDefault();
    toggleSidebar();
  }
});

// We add a state so that we can do data-state="expanded" or "collapsed".
// This makes it easier to style the sidebar with Tailwind classes.
const state = computed(() => (open.value ? "expanded" : "collapsed"));

provideSidebarContext({
  state,
  open,
  setOpen,
  isMobile,
  openMobile,
  setOpenMobile,
  toggleSidebar,
});
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <div
      data-uipkge
      data-slot="sidebar-wrapper"
      :style="{
        '--sidebar-width': SIDEBAR_WIDTH,
        '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
      }"
      :class="
        cn(
          'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
          props.class,
        )
      "
      v-bind="$attrs"
    >
      <slot />
    </div>
  </TooltipProvider>
</template>
