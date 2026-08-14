<script setup lang="ts">
import { ref } from 'vue'
import { Github, ShieldCheck, Sparkles, Zap } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const email = ref('')
const password = ref('')

const emit = defineEmits<{
  (e: 'submit', payload: { email: string; password: string }): void
  (e: 'forgot-password'): void
  (e: 'sign-up'): void
  (e: 'oauth', provider: 'github' | 'google'): void
}>()

function onSubmit() {
  emit('submit', { email: email.value, password: password.value })
}

// ----- Optional: zod validation -----
// HTML5 `type="email"` + `required` already block obviously bad input,
// but for typed parsing + custom rules drop in zod. Add `zod` to your
// project, uncomment, and route `onSubmit` through `loginSchema.parse`.
//
// import { z } from 'zod'
// const loginSchema = z.object({
//   email: z.string().email('Enter a valid email'),
//   password: z.string().min(1, 'Password is required'),
// })
// function onSubmit() {
//   const parsed = loginSchema.safeParse({
//     email: email.value, password: password.value,
//   })
//   if (!parsed.success) {
//     // surface parsed.error.flatten().fieldErrors however you want
//     return
//   }
//   emit('submit', parsed.data)
// }
</script>

<template>
  <div data-slot="login-02" class="grid min-h-svh lg:grid-cols-2">
    <!-- Brand / marketing panel -->
    <aside
      class="border-border relative hidden flex-col justify-between overflow-hidden border-r p-12 lg:flex"
      style="background: color-mix(in oklch, var(--primary) 6%, var(--card))"
    >
      <div class="text-foreground relative z-[1] flex items-center gap-2.5">
        <div
          class="text-background font-display grid size-8 place-items-center rounded-md font-bold"
          style="background: var(--primary)"
        >
          U
        </div>
        <span class="font-display text-base font-semibold">Your Product</span>
      </div>

      <div class="relative z-[1] max-w-md">
        <p class="text-muted-foreground/80 mb-3 text-xs font-medium tracking-[0.14em] uppercase">Why teams switch</p>
        <h2 class="font-display text-3xl leading-tight font-semibold tracking-tight text-balance">
          Ship features in
          <em class="font-display font-semibold not-italic" style="color: var(--primary)">hours</em>, not sprints.
        </h2>
        <p class="text-muted-foreground mt-4 text-sm leading-relaxed">
          Reusable components, opinionated defaults, and a registry that keeps your team writing product code instead of
          reinventing the same UI.
        </p>

        <ul class="mt-8 space-y-3 text-sm">
          <li class="flex items-start gap-3">
            <Zap class="mt-0.5 size-4 shrink-0" style="color: var(--primary)" />
            <span class="text-foreground">One-command install, full source ownership</span>
          </li>
          <li class="flex items-start gap-3">
            <ShieldCheck class="mt-0.5 size-4 shrink-0" style="color: var(--primary)" />
            <span class="text-foreground">SOC 2 compliant, SSO out of the box</span>
          </li>
          <li class="flex items-start gap-3">
            <Sparkles class="mt-0.5 size-4 shrink-0" style="color: var(--primary)" />
            <span class="text-foreground">Themeable tokens, dark mode, RTL ready</span>
          </li>
        </ul>
      </div>

      <p class="text-muted-foreground/70 relative z-[1] text-xs">© {{ new Date().getFullYear() }} Your Product, Inc.</p>
    </aside>

    <!-- Form panel -->
    <div class="flex items-center justify-center p-6 sm:p-12">
      <div class="w-full max-w-sm space-y-6">
        <div class="space-y-1.5 text-center lg:text-left">
          <h1 class="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p class="text-muted-foreground text-sm">Sign in to continue to your workspace.</p>
        </div>

        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>
              <button
                type="button"
                class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                @click="emit('forgot-password')"
              >
                Forgot?
              </button>
            </div>
            <Input id="password" v-model="password" type="password" autocomplete="current-password" required />
          </div>
          <Button type="submit" class="w-full">Sign in</Button>
        </form>

        <div class="relative">
          <Separator />
          <span
            class="bg-background text-muted-foreground absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 text-xs tracking-wider uppercase"
          >
            Or
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" @click="emit('oauth', 'google')">
            <svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.32z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
              />
            </svg>
            Google
          </Button>
          <Button type="button" variant="outline" @click="emit('oauth', 'github')">
            <Github class="size-4" />
            GitHub
          </Button>
        </div>

        <p class="text-muted-foreground text-center text-xs">
          Don't have an account?
          <button type="button" class="text-foreground ml-1 font-medium hover:underline" @click="emit('sign-up')">
            Sign up
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
