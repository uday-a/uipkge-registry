<script lang="ts">
  import { PasswordInput } from '@svelte-registry/password-input'
  import { Button } from '@svelte-registry/button'

  let { story }: { story: string } = $props()

  let signupValue = $state('')
  let loginValue = $state('')
  let smValue = $state('')
  let lgValue = $state('')
  let filledValue = $state('')
  let borderlessValue = $state('')
  let readonlyValue = $state('s3cr3t-k3y')
</script>

{#if story === 'Sign-up with strength meter'}
  <div class="max-w-md space-y-2">
    <PasswordInput
      bind:value={signupValue}
      showStrength
      minLength={8}
      placeholder="Create a password..."
      class="w-full"
    />
    <p class="text-xs text-muted-foreground">
      {signupValue ? `${signupValue.length} characters entered` : 'Start typing to see strength feedback'}
    </p>
  </div>
{/if}

{#if story === 'Size variants'}
  <div class="max-w-md space-y-3">
    <PasswordInput bind:value={smValue} size="sm" placeholder="Small..." class="w-full" />
    <PasswordInput placeholder="Default..." class="w-full" />
    <PasswordInput bind:value={lgValue} size="lg" placeholder="Large..." class="w-full" />
  </div>
{/if}

{#if story === 'Variant styles'}
  <div class="max-w-md space-y-3">
    <PasswordInput placeholder="Outlined" class="w-full" />
    <PasswordInput bind:value={filledValue} variant="filled" placeholder="Filled" class="w-full" />
    <PasswordInput bind:value={borderlessValue} variant="borderless" placeholder="Borderless" class="w-full" />
  </div>
{/if}

{#if story === 'States'}
  <div class="max-w-md space-y-3">
    <PasswordInput bind:value={readonlyValue} readonly placeholder="Read-only" class="w-full" />
    <PasswordInput disabled placeholder="Disabled" class="w-full" />
  </div>
{/if}

{#if story === 'Without toggle'}
  <div class="max-w-md">
    <PasswordInput showToggle={false} placeholder="Enter password..." class="w-full" />
  </div>
{/if}

{#if story === 'In context: Login card'}
  <div class="max-w-md rounded-xl border bg-card text-card-foreground shadow">
    <div class="flex flex-col gap-1.5 p-6">
      <p class="font-semibold">Welcome back</p>
      <p class="text-sm text-muted-foreground">Enter your credentials to access your account.</p>
    </div>
    <div class="space-y-4 p-6 pt-0">
      <div class="space-y-2">
        <label class="text-sm font-medium" for="svelte-login-email">Email</label>
        <input
          id="svelte-login-email"
          type="email"
          placeholder="you@example.com"
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium" for="svelte-login-password">Password</label>
        <PasswordInput bind:value={loginValue} placeholder="Enter your password" class="w-full" />
      </div>
      <Button class="w-full">Sign in</Button>
      <p class="text-center text-xs text-muted-foreground">
        {loginValue ? `Password length: ${loginValue.length}` : 'No password entered'}
      </p>
    </div>
  </div>
{/if}
