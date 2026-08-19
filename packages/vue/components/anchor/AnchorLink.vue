<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, useSlots } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { ANCHOR_INJECTION_KEY } from "./context";

const props = defineProps<{
  href: string;
  title: string;
  class?: HTMLAttributes["class"];
}>();

const _maybeCtx = inject(ANCHOR_INJECTION_KEY, null);
if (!_maybeCtx) throw new Error("AnchorLink must be used inside <Anchor>.");
const ctx: NonNullable<typeof _maybeCtx> = _maybeCtx;

const isActive = computed(() => ctx.activeHref.value === props.href);
const slots = useSlots();

onMounted(() => ctx.register(props.href));
onBeforeUnmount(() => ctx.unregister(props.href));

function onClick(e: MouseEvent) {
  e.preventDefault();
  const el = document.querySelector(props.href) as HTMLElement | null;
  if (!el) return;
  const offset = ctx.offsetTop.value;
  const container = ctx.scrollContainer.value;
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = smooth ? "smooth" : "auto";
  if (container === window) {
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior });
  } else {
    const c = container as HTMLElement;
    const top =
      el.getBoundingClientRect().top -
      c.getBoundingClientRect().top +
      c.scrollTop -
      offset;
    c.scrollTo({ top, behavior });
  }
  history.replaceState(null, "", props.href);
  ctx.setActive(props.href);
}
</script>

<template>
  <div data-uipkge data-slot="anchor-link" class="flex flex-col">
    <a
      :href="href"
      :aria-current="isActive ? 'location' : undefined"
      :class="
        cn(
          'text-muted-foreground -ml-px block border-l-2 border-transparent py-2 pl-3 transition-colors',
          'hover:text-foreground',
          'focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          isActive && 'border-primary text-foreground font-medium',
          props.class,
        )
      "
      @click="onClick"
    >
      {{ title }}
    </a>
    <div v-if="slots.default" class="ml-3">
      <slot />
    </div>
  </div>
</template>
