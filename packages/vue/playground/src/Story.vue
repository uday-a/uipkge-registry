<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted, type Ref } from "vue";
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

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isFullscreen.value) {
    isFullscreen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <Teleport to="body" :disabled="!isFullscreen">
    <!-- Backdrop overlay when in focused fullscreen mode -->
    <div
      v-if="isFullscreen"
      class="animate-in fade-in fixed inset-0 z-40 bg-black/60 backdrop-blur-xs duration-150"
      @click="isFullscreen = false"
    />

    <section
      :id="title.toLowerCase().replace(/[^a-z0-9]+/g, '-')"
      class="group border-border bg-card text-card-foreground overflow-hidden rounded-xl border shadow-xs transition-[border-color,box-shadow] duration-200"
      :class="[
        isFullscreen
          ? 'bg-card border-border/80 flex flex-col shadow-2xl'
          : 'relative mb-8',
      ]"
      :style="
        isFullscreen
          ? {
              position: 'fixed',
              top: '2rem',
              bottom: '2rem',
              left: '2rem',
              right: '2rem',
              zIndex: 50,
            }
          : undefined
      "
    >
      <!-- Story Header Bar -->
      <div
        class="border-border bg-muted/20 flex shrink-0 flex-col justify-between gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:px-5"
      >
        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
          <div class="flex items-center gap-2">
            <h3 class="text-foreground text-sm font-semibold tracking-tight">
              {{ title }}
            </h3>
            <span
              v-if="isFullscreen"
              class="bg-primary/10 text-primary shrink-0 rounded px-2 py-0.5 text-xs font-medium"
            >
              Focused View
            </span>
          </div>
          <p v-if="description" class="text-muted-foreground text-xs">
            {{ description }}
          </p>
        </div>

        <!-- Action Controls -->
        <div
          class="flex shrink-0 items-center justify-between gap-1.5 sm:justify-end"
        >
          <!-- Preview / Code Tab Switcher -->
          <div
            class="border-border bg-background/80 flex items-center rounded-lg border p-0.5 text-xs shadow-xs"
          >
            <button
              type="button"
              class="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors"
              :class="
                activeTab === 'preview'
                  ? 'bg-muted text-foreground border-border/80 border font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
              "
              @click="activeTab = 'preview'"
            >
              <Eye class="size-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              class="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors"
              :class="
                activeTab === 'code'
                  ? 'bg-muted text-foreground border-border/80 border font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
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
            class="border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground flex size-7 cursor-pointer items-center justify-center rounded-md border shadow-xs transition"
            :title="copied ? 'Copied!' : 'Copy source code'"
            @click="copyCode"
          >
            <Check v-if="copied" class="size-3.5 text-emerald-500" />
            <Copy v-else class="size-3.5" />
          </button>

          <!-- Maximize / Focus Button -->
          <button
            type="button"
            class="border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground flex size-7 cursor-pointer items-center justify-center rounded-md border shadow-xs transition"
            :title="isFullscreen ? 'Exit focus (Esc)' : 'Focus story'"
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
        class="relative overflow-x-auto p-4 sm:p-8"
        :class="[isFullscreen ? 'flex-1 overflow-y-auto' : '']"
      >
        <slot />
      </div>

      <!-- Story Source Code View -->
      <div
        v-show="activeTab === 'code'"
        class="bg-muted/40 relative p-4 sm:p-5"
        :class="[isFullscreen ? 'flex-1 overflow-y-auto' : '']"
      >
        <div v-if="sourceCode" class="relative">
          <pre
            class="code-block border-border bg-card text-foreground overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-relaxed"
          ><code>{{ sourceCode }}</code></pre>
        </div>
        <div
          v-else
          class="text-muted-foreground py-12 text-center font-mono text-xs"
        >
          Source code available in inspector tab below.
        </div>
      </div>
    </section>
  </Teleport>
</template>
