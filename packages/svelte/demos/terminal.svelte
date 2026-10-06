<script lang="ts">
  import { Terminal } from '@svelte-registry/terminal'

  let { story }: { story: string } = $props()

  const setupLines = [
    { prompt: '$', command: 'npx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json -y' },
    { output: '✔ Checking registry…\n✔ Installing dependencies…\n✔ Done.' },
    { prompt: '$', command: 'bun run dev' },
    { output: 'ready in 412 ms — http://localhost:4321' },
  ]

  const typingLines = [
    { prompt: '$', command: 'bun install' },
    { output: '1184 packages installed [4.23s]' },
    { prompt: '$', command: 'bun run build:registry' },
    { output: '✔ 86 items emitted to public/r' },
    { prompt: '$', command: 'bun run deploy' },
    { output: '✔ Published https://uipkge.dev' },
  ]

  const errorLines = [
    { prompt: '$', command: 'bun run verify' },
    { output: 'check:deps … 84 passed\ncheck:parity … FAILED (2 diffs)' },
    { type: 'output' as const, output: 'error: buttonVariants mismatch in react twin' },
  ]
</script>

{#if story === 'Project setup'}
  <Terminal lines={setupLines} title="uipkge-setup — zsh" />
{/if}

{#if story === 'Typing animation'}
  <Terminal lines={typingLines} title="install — zsh" typing typingSpeed={350} />
{/if}

{#if story === 'Theme variants'}
  <div class="flex flex-col gap-4">
    <Terminal lines={setupLines} title="build — zsh" theme="dark" />
    <Terminal lines={setupLines} title="build — zsh" theme="light" />
  </div>
{/if}

{#if story === 'Custom shell prompt'}
  <Terminal lines={setupLines} title="zsh — my-app" promptChar="➜" />
{/if}

{#if story === 'Error output'}
  <Terminal lines={errorLines} title="npm test" />
{/if}
