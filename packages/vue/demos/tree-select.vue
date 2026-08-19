<script setup lang="ts">
import { ref } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TreeSelect } from "@/components/ui/tree-select";
import type { TreeSelectNode } from "@/components/ui/tree-select";

const fileValue = ref<string | null>(null);
const multiValue = ref<string[]>([]);
const smValue = ref<string | null>(null);
const lgValue = ref<string | null>(null);
const orgValue = ref<string[]>(["frontend", "backend"]);

const fileTree: TreeSelectNode[] = [
  {
    value: "src",
    label: "src",
    children: [
      {
        value: "src/components",
        label: "components",
        children: [
          { value: "src/components/Button.vue", label: "Button.vue" },
          { value: "src/components/Card.vue", label: "Card.vue" },
          { value: "src/components/Dialog.vue", label: "Dialog.vue" },
        ],
      },
      {
        value: "src/composables",
        label: "composables",
        children: [
          { value: "src/composables/useToast.ts", label: "useToast.ts" },
          { value: "src/composables/useTheme.ts", label: "useTheme.ts" },
        ],
      },
      { value: "src/App.vue", label: "App.vue" },
      { value: "src/main.ts", label: "main.ts" },
    ],
  },
  { value: "package.json", label: "package.json" },
  { value: "tsconfig.json", label: "tsconfig.json" },
];

const orgTree: TreeSelectNode[] = [
  {
    value: "engineering",
    label: "Engineering",
    children: [
      { value: "frontend", label: "Frontend Team" },
      { value: "backend", label: "Backend Team" },
      { value: "devops", label: "DevOps Team" },
    ],
  },
  {
    value: "design",
    label: "Design",
    children: [
      { value: "ux", label: "UX Team" },
      { value: "visual", label: "Visual Team" },
    ],
  },
  {
    value: "product",
    label: "Product",
    children: [
      { value: "pm", label: "Product Managers" },
      { value: "analytics", label: "Analytics" },
    ],
  },
];

const restrictedTree: TreeSelectNode[] = [
  {
    value: "folder1",
    label: "Folder 1",
    children: [
      { value: "file1", label: "file1.txt" },
      { value: "file2", label: "file2.txt", disabled: true },
    ],
  },
  { value: "locked", label: "Locked folder", disabled: true, children: [] },
];
</script>

<template>
  <Story
    title="File picker"
    description="Select a single file from a nested project tree — common in editor open-file dialogs."
  >
    <div class="max-w-md space-y-2">
      <TreeSelect
        v-model="fileValue"
        :data="fileTree"
        placeholder="Select a file..."
        class="w-full"
      />
      <p class="text-muted-foreground text-xs">
        Selected: {{ fileValue ?? "none" }}
      </p>
    </div>
  </Story>

  <Story
    title="Multi-select with checkboxes"
    description="Pick multiple files at once. Selecting a parent cascades to all leaf descendants."
  >
    <div class="max-w-md space-y-2">
      <TreeSelect
        v-model="multiValue"
        :data="fileTree"
        multiple
        placeholder="Select files..."
        class="w-full"
      />
      <p class="text-muted-foreground text-xs">
        {{ multiValue.length }} file(s) selected
      </p>
    </div>
  </Story>

  <Story
    title="Size variants"
    description="Small, default, and large triggers side by side for comparison."
  >
    <div class="max-w-md space-y-3">
      <TreeSelect
        v-model="smValue"
        :data="fileTree"
        size="sm"
        placeholder="Small..."
        class="w-full"
      />
      <TreeSelect :data="fileTree" placeholder="Default..." class="w-full" />
      <TreeSelect
        v-model="lgValue"
        :data="fileTree"
        size="lg"
        placeholder="Large..."
        class="w-full"
      />
    </div>
  </Story>

  <Story
    title="Loading & disabled states"
    description="Spinner while data loads, and a fully disabled control."
  >
    <div class="max-w-md space-y-3">
      <TreeSelect
        :data="fileTree"
        loading
        placeholder="Loading files..."
        class="w-full"
      />
      <TreeSelect
        :data="fileTree"
        disabled
        placeholder="Disabled"
        class="w-full"
      />
    </div>
  </Story>

  <Story
    title="Restricted nodes"
    description="Individual nodes can be disabled — locked folders and protected files stay non-selectable."
  >
    <div class="max-w-md">
      <TreeSelect
        :data="restrictedTree"
        placeholder="Select a file..."
        class="w-full"
      />
    </div>
  </Story>

  <Story
    title="In context: Team permissions"
    description="Assigning teams to a project inside a settings card. Pre-selected teams and multi-select with live count."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Project access</CardTitle>
        <CardDescription
          >Choose which teams can collaborate on this
          repository.</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <TreeSelect
          v-model="orgValue"
          :data="orgTree"
          multiple
          default-expand-all
          placeholder="Select teams..."
          class="w-full"
        />
        <div
          class="text-muted-foreground flex items-center justify-between text-xs"
        >
          <span>{{ orgValue.length }} team(s) granted access</span>
          <span class="text-foreground font-medium">{{
            orgValue.join(", ") || "No access"
          }}</span>
        </div>
      </CardContent>
    </Card>
  </Story>
</template>
