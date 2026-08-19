<script setup lang="ts">
import { ref } from "vue";
import { Clipboard } from "@/components/ui/clipboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const lastCopied = ref("");
const log = ref<string[]>([]);

function onCopy(t: string) {
  lastCopied.value = t;
  log.value.unshift(
    `Copied "${t.slice(0, 40)}${t.length > 40 ? "…" : ""}" at ${new Date().toLocaleTimeString()}`,
  );
}
</script>

<template>
  <Story
    title="Install command"
    description="The most common pattern — a copy icon next to an install or CLI command."
  >
    <div
      class="bg-muted flex max-w-md items-center justify-between rounded-md p-3"
    >
      <code class="text-sm">npm install @uipkge/ui</code>
      <Clipboard text="npm install @uipkge/ui" @copy="onCopy" />
    </div>
  </Story>

  <Story
    title="API key & secrets"
    description="Copy a generated API key with a label and a longer timeout so users can confirm it landed in their clipboard."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Live API key</CardTitle>
        <CardDescription
          >Use this key in your server-side code. Keep it
          secret.</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="bg-muted flex items-center justify-between rounded-md p-3">
          <code class="text-sm">mock_key_a1b2c3d4e5f6g7h8i9j0</code>
          <Clipboard
            text="mock_key_a1b2c3d4e5f6g7h8i9j0"
            label="Copy key"
            :timeout="3000"
            @copy="onCopy"
          />
        </div>
        <div
          class="bg-muted/50 flex items-center justify-between rounded-md p-3"
        >
          <code class="text-muted-foreground text-sm"
            >sk_test_z9y8x7w6v5u4t3s2r1</code
          >
          <Clipboard
            text="sk_test_z9y8x7w6v5u4t3s2r1"
            label="Copy test key"
            @copy="onCopy"
          />
        </div>
      </CardContent>
    </Card>
  </Story>

  <Story
    title="Code snippets"
    description="A copy button anchored to a git clone command and a config snippet — the docs-site staple."
  >
    <div class="max-w-md space-y-3">
      <div class="bg-muted flex items-center justify-between rounded-md p-3">
        <code class="text-sm"
          >git clone https://github.com/uday-a/nuxt-boilerplate.git</code
        >
        <Clipboard
          text="git clone https://github.com/uday-a/nuxt-boilerplate.git"
          @copy="onCopy"
        />
      </div>
      <div class="bg-muted flex items-center justify-between rounded-md p-3">
        <code class="text-sm">VITE_API_URL=https://api.example.com</code>
        <Clipboard text="VITE_API_URL=https://api.example.com" @copy="onCopy" />
      </div>
    </div>
  </Story>

  <Story
    title="Contact details"
    description="Copy an email or URL with a custom tooltip so users know exactly what they are copying."
  >
    <div class="flex max-w-md flex-wrap items-center gap-4">
      <Clipboard
        text="support@uipkge.dev"
        tooltip="Copy email"
        success-text="Email copied!"
        label="support@uipkge.dev"
        @copy="onCopy"
      />
      <Clipboard
        text="https://uipkge.dev/docs/getting-started"
        tooltip="Copy link"
        success-text="Link copied!"
        label="Copy docs link"
        @copy="onCopy"
      />
    </div>
  </Story>

  <Story
    title="Label-only & custom slot"
    description="hideIcon shows just the label; the default slot lets you render fully custom copy UI."
  >
    <div class="flex max-w-md flex-wrap items-center gap-4">
      <Clipboard
        text="label-only-text"
        label="Copy this text"
        hide-icon
        @copy="onCopy"
      />
      <Clipboard text="slot-demo" @copy="onCopy">
        <template #default="{ state }">
          <span
            :class="
              state === 'success' ? 'text-emerald-500' : 'text-muted-foreground'
            "
            class="text-xs font-medium"
          >
            {{ state === "success" ? "Done!" : "Copy me" }}
          </span>
        </template>
      </Clipboard>
    </div>
  </Story>

  <Story
    title="Button-styled"
    description="Apply button classes via the class prop for a prominent copy action in toolbars."
  >
    <Clipboard
      text="npx shadcn-vue@latest add https://uipkge.dev/r/vue/button.json"
      class="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground px-3 py-1.5"
      label="Copy install command"
      @copy="onCopy"
    />
  </Story>

  <Story
    title="Event log"
    description="copy / success / error events fire at each stage — the log below updates live as you copy."
  >
    <div class="max-w-md space-y-3">
      <div class="flex flex-wrap items-center gap-3">
        <Clipboard text="event-demo-1" @copy="onCopy" />
        <Clipboard text="event-demo-2" label="Copy second" @copy="onCopy" />
        <Clipboard text="cannot-copy" disabled tooltip="Disabled" />
      </div>
      <div class="bg-muted/40 rounded-md p-3 text-xs">
        <p v-if="!log.length" class="text-muted-foreground">
          No copies yet — click a button above.
        </p>
        <ul v-else class="space-y-1">
          <li
            v-for="(line, i) in log.slice(0, 5)"
            :key="i"
            class="text-foreground"
          >
            {{ line }}
          </li>
        </ul>
      </div>
    </div>
  </Story>
</template>
