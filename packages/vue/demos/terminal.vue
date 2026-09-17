<script setup lang="ts">
import { ref } from 'vue'
import { Terminal, type TerminalLine } from '@/components/ui/terminal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const installLines: TerminalLine[] = [
  {
    command: 'npm create uipkge@latest my-app',
    output:
      'Setting up project...\nInstalling dependencies...\n\n  ✓ reka-ui\n  ✓ class-variance-authority\n  ✓ tailwind-merge\n\nDone in 12.4s.',
  },
  { command: 'cd my-app', output: undefined },
  { command: 'npm run dev', output: '  ➜  Local:   http://localhost:4321/\n  ➜  Network: use --host to expose' },
]

const buildLines: TerminalLine[] = [
  {
    command: 'npm run build',
    output:
      'vite v6.0.0 building for production...\n✓ 42 modules transformed.\n\ndist/index.html          0.46 kB\ndist/assets/index.css   12.34 kB\ndist/assets/index.js   142.88 kB\n\n✓ built in 1.2s',
  },
]

const errorLines: TerminalLine[] = [
  {
    command: 'npm run test',
    output:
      'FAIL  src/utils.test.ts\n  ● utils › should parse dates\n\n    Expected: "2024-01-15"\n    Received: "15/01/2024"\n\nTests: 1 failed, 23 passed, 24 total',
  },
]

const gitLines: TerminalLine[] = [
  {
    prompt: '➜  my-app git:(main)',
    command: 'git status',
    output: 'On branch main\nYour branch is up to date with origin/main.\n\nnothing to commit, working tree clean',
  },
  {
    prompt: '➜  my-app git:(main)',
    command: 'git log --oneline -5',
    output:
      'a1b2c3d feat: add dock component\ne4f5g6h fix: magnification edge case\ni7j8k9l refactor: extract variants\nm0n1o2p docs: update AGENTS.md\nq3r4s5t chore: bump dependencies',
  },
]

const serverLines: TerminalLine[] = [
  {
    type: 'output',
    output: '[vite] connecting...\n[vite] connected.\n\nServer started on port 3000\nPress Ctrl+C to stop',
  },
]

const dynamicLines = ref<TerminalLine[]>([{ command: 'node server.js', output: 'Listening on :3000' }])

function addLog() {
  dynamicLines.value = [
    ...dynamicLines.value,
    {
      command: 'curl localhost:3000/health',
      output: `{ "status": "ok", "uptime": ${Math.floor(Math.random() * 999)} }s`,
    },
  ]
}
</script>

<template>
  <Story
    title="Project setup"
    description="The classic onboarding flow — scaffolding, installing deps, and starting the dev server."
  >
    <div class="max-w-2xl">
      <Terminal :lines="installLines" title="uipkge-setup — zsh" />
    </div>
  </Story>

  <Story title="Theme variants" description="Dark and light side by side for the same build output.">
    <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
      <Terminal :lines="buildLines" title="build — zsh" />
      <Terminal :lines="buildLines" title="build — zsh" theme="light" />
    </div>
  </Story>

  <Story title="Typing animation" description="Lines appear one-by-one at 400ms — great for hero sections and demos.">
    <div class="max-w-2xl">
      <Terminal :lines="installLines" :typing="true" :typing-speed="400" title="install — zsh" />
    </div>
  </Story>

  <Story title="Custom shell prompt" description="Per-line prompt strings mimic a real zsh theme with branch info.">
    <div class="max-w-2xl">
      <Terminal :lines="gitLines" :prompt-char="' '" title="zsh — my-app" />
    </div>
  </Story>

  <Story title="Error output" description="Failed test results render with the same monospace fidelity as success.">
    <div class="max-w-2xl">
      <Terminal :lines="errorLines" title="npm test" />
    </div>
  </Story>

  <Story title="Log stream" description="Output-only lines (no prompt) are ideal for server logs and CI tails.">
    <div class="max-w-2xl">
      <Terminal :lines="serverLines" title="server.log" max-height="160px" />
    </div>
  </Story>

  <Story
    title="Live log tail"
    description="Append lines at runtime — auto-scroll keeps the latest output pinned to the bottom."
  >
    <div class="max-w-2xl space-y-3">
      <Terminal :lines="dynamicLines" max-height="220px" title="server — live" />
      <Button size="sm" variant="outline" @click="addLog">Ping /health</Button>
    </div>
  </Story>

  <Story
    title="In a docs card"
    description="Terminal embedded inside a Card with a heading — the pattern used on landing pages and install sections."
  >
    <Card class="max-w-2xl">
      <CardHeader>
        <CardTitle>Quick start</CardTitle>
        <CardDescription>Scaffold a new UIPKGE project in under a minute.</CardDescription>
      </CardHeader>
      <CardContent>
        <Terminal :lines="installLines" title="bash" />
      </CardContent>
    </Card>
  </Story>
</template>
