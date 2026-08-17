<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  Layers,
  FileCode,
  Package,
  Activity,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Sliders,
  Terminal,
  Code2,
} from "lucide-vue-next";
import type { PropMeta } from "../lib/extract-props";
import type { TypeDecl } from "../lib/extract-meta";

export interface LoggedEvent {
  id: string;
  timestamp: string;
  type: string;
  target: string;
  detail?: string;
}

const props = defineProps<{
  componentId: string;
  componentName: string;
  componentType: string;
  propsList: PropMeta[];
  typeDecls: TypeDecl[];
  files: Array<{ path: string; target: string; content?: string }>;
  dependencies: string[];
  registryDependencies: string[];
  events: LoggedEvent[];
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "selectComponent", id: string): void;
  (e: "clearEvents"): void;
}>();

type TabKey = "props" | "files" | "manifest" | "events";
const activeTab = ref<TabKey>("props");
const selectedFileIdx = ref(0);
const copied = ref(false);
const copiedSnippet = ref(false);

// Interactive controls state
const interactiveValues = ref<Record<string, any>>({});
const customSlotText = ref("Test Action");

// Initialize interactive values when propsList changes
watch(
  () => props.propsList,
  (newProps) => {
    const vals: Record<string, any> = {};
    for (const p of newProps) {
      if (p.values && p.values.length > 0) {
        vals[p.name] = p.default ? p.default.replace(/['"]/g, "") : p.values[0];
      } else if (p.type.includes("boolean")) {
        vals[p.name] = p.default === "true";
      } else if (p.name === "label" || p.name === "title") {
        vals[p.name] = p.default
          ? p.default.replace(/['"]/g, "")
          : "Example Label";
      }
    }
    interactiveValues.value = vals;
  },
  { immediate: true },
);

// Generate interactive code snippet
const generatedSnippet = computed(() => {
  const compTag = props.componentId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  const attrs: string[] = [];
  for (const [key, val] of Object.entries(interactiveValues.value)) {
    if (val === undefined || val === "") continue;
    if (typeof val === "boolean") {
      if (val) attrs.push(key);
    } else {
      attrs.push(`${key}="${val}"`);
    }
  }

  const attrStr = attrs.length ? " " + attrs.join(" ") : "";
  return `<${compTag}${attrStr}>\n  ${customSlotText.value}\n</${compTag}>`;
});

const copyGeneratedSnippet = async () => {
  try {
    await navigator.clipboard.writeText(generatedSnippet.value);
    copiedSnippet.value = true;
    setTimeout(() => (copiedSnippet.value = false), 1500);
  } catch (err) {
    console.error("Failed to copy snippet:", err);
  }
};

const currentFileContent = computed(() => {
  return props.files[selectedFileIdx.value]?.content || "";
});

const copyCurrentFile = async () => {
  if (!currentFileContent.value) return;
  try {
    await navigator.clipboard.writeText(currentFileContent.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch (err) {
    console.error("Failed to copy file:", err);
  }
};

const copyJsonManifest = async () => {
  const manifest = {
    name: props.componentId,
    type: props.componentType,
    dependencies: props.dependencies,
    registryDependencies: props.registryDependencies,
    files: props.files.map((f) => ({ target: f.target })),
  };
  try {
    await navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch (err) {
    console.error("Failed to copy manifest:", err);
  }
};

const parseDepName = (depUrl: string) => {
  return depUrl.replace(/.*\//, "").replace(/\.json$/, "");
};
</script>

<template>
  <div
    class="flex flex-col border-t border-border bg-card transition-all duration-200 shadow-lg z-30"
    :class="[isOpen ? 'h-80 sm:h-96' : 'h-11']"
  >
    <!-- Drawer Header Bar -->
    <div
      class="flex h-11 shrink-0 items-center justify-between border-b border-border bg-muted/30 px-4 cursor-pointer select-none"
      @click="emit('update:isOpen', !isOpen)"
    >
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <Sliders class="size-4 text-primary" />
          <span class="text-xs font-semibold tracking-tight text-foreground"
            >Test Bench & Inspector</span
          >
        </div>

        <div class="h-3 w-px bg-border" />

        <!-- Tab Controls (Only shown when expanded) -->
        <div v-if="isOpen" class="flex items-center gap-1" @click.stop>
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
            :class="
              activeTab === 'props'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            "
            @click="activeTab = 'props'"
          >
            <Layers class="size-3.5" />
            <span>Props & Workbench</span>
            <span
              v-if="propsList.length"
              class="ml-1 rounded-full bg-muted px-1.5 py-0.2 font-mono text-[10px]"
            >
              {{ propsList.length }}
            </span>
          </button>

          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
            :class="
              activeTab === 'files'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            "
            @click="activeTab = 'files'"
          >
            <FileCode class="size-3.5" />
            <span>Source Files</span>
            <span
              class="ml-1 rounded-full bg-muted px-1.5 py-0.2 font-mono text-[10px]"
            >
              {{ files.length }}
            </span>
          </button>

          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
            :class="
              activeTab === 'manifest'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            "
            @click="activeTab = 'manifest'"
          >
            <Package class="size-3.5" />
            <span>Dependencies</span>
            <span
              v-if="dependencies.length || registryDependencies.length"
              class="ml-1 rounded-full bg-muted px-1.5 py-0.2 font-mono text-[10px]"
            >
              {{ dependencies.length + registryDependencies.length }}
            </span>
          </button>

          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
            :class="
              activeTab === 'events'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            "
            @click="activeTab = 'events'"
          >
            <Activity class="size-3.5" />
            <span>Action Log</span>
            <span
              v-if="events.length"
              class="ml-1 rounded-full bg-primary/10 text-primary px-1.5 py-0.2 font-mono text-[10px]"
            >
              {{ events.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Right controls -->
      <div class="flex items-center gap-2" @click.stop>
        <button
          type="button"
          class="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition"
          @click="emit('update:isOpen', !isOpen)"
        >
          <span class="text-[11px]">{{
            isOpen ? "Collapse" : "Expand Inspector"
          }}</span>
          <ChevronDown v-if="isOpen" class="size-3.5" />
          <ChevronUp v-else class="size-3.5" />
        </button>
      </div>
    </div>

    <!-- Drawer Body -->
    <div v-if="isOpen" class="flex-1 overflow-hidden bg-background">
      <!-- 1. Props & Schema Tab -->
      <div
        v-if="activeTab === 'props'"
        class="h-full overflow-y-auto p-4 sm:p-6 space-y-6"
      >
        <!-- Interactive Workbench Control Card -->
        <div
          v-if="
            propsList.some(
              (p) => p.values?.length || p.type.includes('boolean'),
            )
          "
          class="rounded-xl border border-border bg-card p-4 shadow-xs"
        >
          <div
            class="flex items-center justify-between mb-3 border-b border-border pb-2"
          >
            <div class="flex items-center gap-2">
              <Code2 class="size-4 text-primary" />
              <h4 class="text-xs font-semibold text-foreground tracking-tight">
                Interactive Props Bench & Code Generator
              </h4>
            </div>
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs"
              @click="copyGeneratedSnippet"
            >
              <Check v-if="copiedSnippet" class="size-3 text-emerald-500" />
              <Copy v-else class="size-3" />
              <span>Copy Component JSX</span>
            </button>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
          >
            <!-- Render controls for each customizable prop -->
            <div
              v-for="prop in propsList.filter(
                (p) => p.values?.length || p.type.includes('boolean'),
              )"
              :key="prop.name"
              class="space-y-1.5"
            >
              <label
                class="text-[11px] font-mono font-medium text-foreground flex items-center justify-between"
              >
                <span>{{ prop.name }}</span>
                <span class="text-[10px] text-muted-foreground">{{
                  prop.required ? "required" : "optional"
                }}</span>
              </label>

              <!-- Enum / Union dropdown -->
              <select
                v-if="prop.values?.length"
                v-model="interactiveValues[prop.name]"
                class="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono shadow-xs"
              >
                <option v-for="val in prop.values" :key="val" :value="val">
                  {{ val }}
                </option>
              </select>

              <!-- Boolean toggle -->
              <div
                v-else-if="prop.type.includes('boolean')"
                class="flex items-center gap-2 pt-1"
              >
                <input
                  :id="`toggle-${prop.name}`"
                  v-model="interactiveValues[prop.name]"
                  type="checkbox"
                  class="size-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  :for="`toggle-${prop.name}`"
                  class="text-xs text-muted-foreground cursor-pointer select-none"
                >
                  {{ interactiveValues[prop.name] ? "Enabled" : "Disabled" }}
                </label>
              </div>
            </div>

            <!-- Custom Slot Text input -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-mono font-medium text-foreground">
                Slot Children / Text
              </label>
              <input
                v-model="customSlotText"
                type="text"
                placeholder="Button label..."
                class="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              />
            </div>
          </div>

          <!-- Generated Code Preview -->
          <pre
            class="code-block rounded-lg border border-border bg-muted/30 p-3 text-[11px] font-mono text-foreground overflow-x-auto leading-relaxed"
          ><code>{{ generatedSnippet }}</code></pre>
        </div>

        <!-- Full Props Specification Table -->
        <div v-if="propsList.length > 0">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-semibold text-foreground tracking-tight">
              Component Props & Slots Specification
            </h4>
            <span class="text-[11px] text-muted-foreground font-mono"
              >{{ propsList.length }} declared properties</span
            >
          </div>

          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-border text-muted-foreground">
                <th class="pb-2 font-medium font-mono">Prop</th>
                <th class="pb-2 font-medium font-mono">Type</th>
                <th class="pb-2 font-medium font-mono">Default</th>
                <th class="pb-2 font-medium font-mono">Required</th>
                <th class="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/60">
              <tr
                v-for="prop in propsList"
                :key="prop.name"
                class="hover:bg-muted/20"
              >
                <td class="py-2.5 font-mono font-medium text-foreground pr-3">
                  {{ prop.name }}
                </td>
                <td class="py-2.5 pr-3 font-mono text-muted-foreground">
                  <span class="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                    {{ prop.type }}
                  </span>
                </td>
                <td class="py-2.5 pr-3 font-mono text-muted-foreground">
                  <span
                    v-if="prop.default"
                    class="text-foreground/80 font-medium"
                  >
                    {{ prop.default }}
                  </span>
                  <span v-else class="text-muted-foreground/40">—</span>
                </td>
                <td class="py-2.5 pr-3 font-mono text-xs">
                  <span v-if="prop.required" class="text-rose-500 font-semibold"
                    >Yes</span
                  >
                  <span v-else class="text-muted-foreground">No</span>
                </td>
                <td class="py-2.5 text-muted-foreground leading-relaxed">
                  {{ prop.doc || "—" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="py-12 text-center text-xs text-muted-foreground">
          <p>No declared props extracted for this component.</p>
          <p class="mt-1 text-[11px]">
            This component may forward props directly to headless slots or
            children.
          </p>
        </div>

        <!-- Exported Types / Schemas -->
        <div v-if="typeDecls.length > 0" class="border-t border-border pt-4">
          <h4 class="text-xs font-semibold text-foreground mb-3">
            Exported Types & Schemas
          </h4>
          <div class="space-y-3">
            <div
              v-for="decl in typeDecls"
              :key="decl.name"
              class="rounded-lg border border-border bg-card p-3"
            >
              <div class="text-xs font-mono font-bold text-foreground mb-1.5">
                {{ decl.name }}
              </div>
              <pre
                class="code-block text-[11px] text-muted-foreground font-mono overflow-x-auto"
              ><code>{{ decl.body }}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Source Files Tab -->
      <div v-else-if="activeTab === 'files'" class="flex h-full flex-col">
        <!-- File switcher pills -->
        <div
          class="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-2"
        >
          <div class="flex items-center gap-1.5 overflow-x-auto">
            <button
              v-for="(f, idx) in files"
              :key="f.path"
              type="button"
              class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono transition"
              :class="
                selectedFileIdx === idx
                  ? 'bg-card border border-border text-foreground shadow-xs font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              "
              @click="selectedFileIdx = idx"
            >
              <FileCode class="size-3" />
              <span>{{ f.path.split("/").pop() }}</span>
            </button>
          </div>

          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs"
            @click="copyCurrentFile"
          >
            <Check v-if="copied" class="size-3 text-emerald-500" />
            <Copy v-else class="size-3" />
            <span>Copy file</span>
          </button>
        </div>

        <!-- Code viewer -->
        <div class="flex-1 overflow-y-auto p-4 bg-muted/10">
          <pre
            class="code-block rounded-lg border border-border bg-card p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed"
          ><code>{{ currentFileContent || '// Content loading...' }}</code></pre>
        </div>
      </div>

      <!-- 3. Manifest & Dependencies Tab -->
      <div
        v-else-if="activeTab === 'manifest'"
        class="h-full overflow-y-auto p-5"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left: Dependencies -->
          <div class="space-y-5">
            <div>
              <h4
                class="text-xs font-semibold text-foreground mb-2 flex items-center gap-2"
              >
                <span>NPM Dependencies</span>
                <span
                  class="rounded bg-muted px-1.5 py-0.2 font-mono text-[10px]"
                >
                  {{ dependencies.length }}
                </span>
              </h4>
              <div
                v-if="dependencies.length > 0"
                class="flex flex-wrap gap-1.5"
              >
                <span
                  v-for="dep in dependencies"
                  :key="dep"
                  class="rounded-md border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                >
                  {{ dep }}
                </span>
              </div>
              <p v-else class="text-xs text-muted-foreground">
                No third-party npm packages required.
              </p>
            </div>

            <div>
              <h4
                class="text-xs font-semibold text-foreground mb-2 flex items-center gap-2"
              >
                <span>Registry Dependencies</span>
                <span
                  class="rounded bg-muted px-1.5 py-0.2 font-mono text-[10px]"
                >
                  {{ registryDependencies.length }}
                </span>
              </h4>
              <div
                v-if="registryDependencies.length > 0"
                class="flex flex-wrap gap-1.5"
              >
                <button
                  v-for="dep in registryDependencies"
                  :key="dep"
                  type="button"
                  class="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 font-mono text-xs text-foreground hover:bg-muted transition"
                  @click="emit('selectComponent', parseDepName(dep))"
                >
                  <span>@uipkge/{{ parseDepName(dep) }}</span>
                  <ExternalLink class="size-2.5 opacity-60" />
                </button>
              </div>
              <p v-else class="text-xs text-muted-foreground">
                No internal registry dependencies.
              </p>
            </div>

            <div>
              <h4 class="text-xs font-semibold text-foreground mb-2">
                Target Installation Paths
              </h4>
              <div class="space-y-1">
                <div
                  v-for="f in files"
                  :key="f.target"
                  class="rounded border border-border/80 bg-muted/20 px-2.5 py-1.5 font-mono text-xs text-muted-foreground"
                >
                  {{ f.target }}
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Manifest JSON Preview -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-semibold text-foreground">
                Registry Item Manifest
              </h4>
              <button
                type="button"
                class="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs"
                @click="copyJsonManifest"
              >
                <Check v-if="copied" class="size-3 text-emerald-500" />
                <Copy v-else class="size-3" />
                <span>Copy JSON</span>
              </button>
            </div>
            <pre
              class="code-block rounded-lg border border-border bg-card p-3 text-[11px] font-mono text-foreground overflow-x-auto leading-relaxed"
            ><code>{{ JSON.stringify({
  name: componentId,
  type: componentType,
  dependencies,
  registryDependencies,
  files: files.map(f => ({ path: f.path, target: f.target }))
}, null, 2) }}</code></pre>
          </div>
        </div>
      </div>

      <!-- 4. Action & Event Logger Tab -->
      <div v-else-if="activeTab === 'events'" class="flex h-full flex-col">
        <div
          class="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-2"
        >
          <div class="text-xs text-muted-foreground">
            Capturing user interactions dispatched from the live component
            canvas.
          </div>
          <button
            type="button"
            class="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs"
            @click="emit('clearEvents')"
          >
            <Trash2 class="size-3" />
            <span>Clear Events</span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-1.5 font-mono text-xs">
          <div
            v-for="ev in events"
            :key="ev.id"
            class="flex items-center justify-between rounded-md border border-border bg-card px-3 py-1.5"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-muted-foreground text-[11px]">{{
                ev.timestamp
              }}</span>
              <span
                class="rounded bg-primary/10 px-1.5 py-0.5 font-bold text-primary text-[10px] uppercase"
              >
                {{ ev.type }}
              </span>
              <span class="text-foreground">{{ ev.target }}</span>
            </div>
            <div
              v-if="ev.detail"
              class="text-muted-foreground text-[11px] truncate max-w-xs"
            >
              {{ ev.detail }}
            </div>
          </div>

          <div
            v-if="events.length === 0"
            class="py-12 text-center text-muted-foreground font-sans text-xs"
          >
            No events logged yet. Interact with the component above (click,
            type, toggle) to see actions stream here!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
