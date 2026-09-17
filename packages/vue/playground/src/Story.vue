<script setup lang="ts">
import { ref, computed, inject, type Ref } from "vue";
import { Check, Copy, Code2, Eye, Maximize2, Minimize2 } from "lucide-vue-next";

const props = defineProps<{
  title: string;
  description?: string;
  code?: string;
}>();

const codeMap = inject<Ref<Record<string, string>>>("story:codeMap", ref({}));
const activeTab = ref<"preview" | "code">("preview");
const isFullscreen = ref(false);
const copied = ref(false);

const sourceCode = computed(() => {
  if (props.code) return props.code;
  return codeMap.value[props.title] || "";
});

const copyCode = async () => {
  if (!sourceCode.value) return;
  try {
    await navigator.clipboard.writeText(sourceCode.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1500);
  } catch (err) {
    console.error("Failed to copy code:", err);
  }
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};
</script>

<template>
  <section
    :id="title.toLowerCase().replace(/[^a-z0-9]+/g, '-')"
    class="group relative mb-8 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs transition-all duration-200"
    :class="[
      isFullscreen
        ? 'fixed inset-4 z-50 flex flex-col bg-background/95 backdrop-blur-md shadow-2xl overflow-hidden'
        : '',
    ]"
  >
    <!-- Story Header Bar -->
    <div
      class="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3 sm:px-5"
    >
      <div class="flex flex-col gap-0.5 min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-semibold tracking-tight text-foreground">
            {{ title }}
          </h3>
          <span
            v-if="isFullscreen"
            class="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
          >
            Focused View
          </span>
        </div>
        <p
          v-if="description"
          class="text-xs text-muted-foreground line-clamp-2"
        >
          {{ description }}
        </p>
      </div>

      <!-- Action Controls -->
      <div class="flex items-center gap-1.5 shrink-0">
        <!-- Preview / Code Tab Switcher -->
        <div
          class="flex items-center rounded-lg border border-border bg-background/80 p-0.5 text-xs shadow-xs"
        >
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors"
            :class="
              activeTab === 'preview'
                ? 'bg-muted text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="activeTab = 'preview'"
          >
            <Eye class="size-3.5" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors"
            :class="
              activeTab === 'code'
                ? 'bg-muted text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="activeTab = 'code'"
          >
            <Code2 class="size-3.5" />
            <span>Code</span>
          </button>
        </div>

        <!-- Copy Code Button -->
        <button
          v-if="sourceCode"
          type="button"
          class="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition shadow-xs"
          :title="copied ? 'Copied!' : 'Copy source code'"
          @click="copyCode"
        >
          <Check v-if="copied" class="size-3.5 text-emerald-500" />
          <Copy v-else class="size-3.5" />
        </button>

        <!-- Maximize / Focus Button -->
        <button
          type="button"
          class="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition shadow-xs"
          :title="isFullscreen ? 'Exit full screen' : 'Focus story'"
          @click="toggleFullscreen"
        >
          <Minimize2 v-if="isFullscreen" class="size-3.5" />
          <Maximize2 v-else class="size-3.5" />
        </button>
      </div>
    </div>

    <!-- Story Canvas / Preview Content -->
    <div
      v-show="activeTab === 'preview'"
      class="relative overflow-x-auto p-6 sm:p-8"
      :class="[isFullscreen ? 'flex-1 overflow-y-auto' : '']"
    >
      <slot />
    </div>

    <!-- Story Source Code View -->
    <div
      v-show="activeTab === 'code'"
      class="relative bg-muted/40 p-4 sm:p-5"
      :class="[isFullscreen ? 'flex-1 overflow-y-auto' : '']"
    >
      <div v-if="sourceCode" class="relative">
        <pre
          class="code-block rounded-lg border border-border bg-card p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed"
        ><code>{{ sourceCode }}</code></pre>
      </div>
      <div
        v-else
        class="py-12 text-center text-xs font-mono text-muted-foreground"
      >
        Source code available in inspector tab below.
      </div>
    </div>
  </section>
</template>
