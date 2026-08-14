<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  Github,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

defineProps<Props>()

const authMethod = ref<'password' | 'passkey' | 'sso'>('password')
const email = ref('')
const password = ref('')
const ssoDomain = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)

const emit = defineEmits<{
  (e: 'submit', payload: { method: string; email: string; password?: string; domain?: string }): void
  (e: 'forgot-password'): void
  (e: 'sign-up'): void
  (e: 'oauth', provider: 'github' | 'google'): void
}>()

const isEnterpriseEmail = computed(() => {
  const parts = email.value.split('@')
  if (parts.length < 2) return false
  const domain = parts[1].toLowerCase()
  return (
    domain &&
    !['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'].includes(domain) &&
    domain.includes('.')
  )
})

function handleSubmit() {
  if (isLoading.value) return
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    isSubmitted.value = true
    emit('submit', {
      method: authMethod.value,
      email: email.value,
      password: password.value,
      domain: ssoDomain.value,
    })
  }, 800)
}
</script>

<template>
  <div
    data-slot="login-01"
    :class="cn('bg-background grid min-h-screen w-full grid-cols-1 lg:grid-cols-12', $props.class)"
  >
    <!-- Left Hero Brand & Proof Pane (Desktop) -->
    <div
      class="border-border bg-muted/30 relative hidden flex-col justify-between overflow-hidden border-r p-12 lg:col-span-6 lg:flex xl:col-span-7"
    >
      <!-- Background Ambient Glow -->
      <div class="bg-primary/10 pointer-events-none absolute -top-24 -left-24 size-96 rounded-full blur-3xl" />
      <div class="bg-primary/5 pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full blur-3xl" />

      <div class="relative z-10 flex items-center gap-2.5">
        <div
          class="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg font-bold shadow-xs"
        >
          <Zap class="size-5 fill-current" />
        </div>
        <span class="text-foreground text-lg font-bold tracking-tight">UIPKGE Studio</span>
      </div>

      <!-- Live Code/Terminal Showcase Widget -->
      <div class="relative z-10 my-auto max-w-xl space-y-6">
        <div class="space-y-3">
          <div
            class="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-semibold"
          >
            <Sparkles class="size-3.5" />
            <span>Developer Cloud Console v4.8</span>
          </div>
          <h1 class="text-foreground text-3xl leading-tight font-bold tracking-tight xl:text-4xl">
            The dual-framework UI registry for mission-critical software.
          </h1>
          <p class="text-muted-foreground text-sm leading-relaxed">
            Own your source code without runtime dependency lock-in. Built with Tailwind CSS v4, OKLCH color spaces, and
            headless accessibility primitives.
          </p>
        </div>

        <!-- Terminal Widget -->
        <div class="border-border bg-card overflow-hidden rounded-xl border shadow-lg">
          <div class="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2.5">
            <div class="flex items-center gap-2">
              <span class="bg-destructive/60 size-2.5 rounded-full" />
              <span class="size-2.5 rounded-full bg-amber-500/60" />
              <span class="bg-success/60 size-2.5 rounded-full" />
              <span class="text-muted-foreground ml-2 font-mono text-xs">auth-session-init.ts</span>
            </div>
            <Badge variant="outline" class="font-mono text-xs">mTLS Encrypted</Badge>
          </div>
          <div class="bg-card/90 space-y-1 p-4 font-mono text-xs leading-relaxed">
            <p class="text-muted-foreground">// Validating SAML 2.0 / WebAuthn identity assertion</p>
            <p class="text-foreground">
              <span class="text-primary font-bold">const</span> session =
              <span class="text-primary font-bold">await</span> auth.<span class="text-foreground font-semibold"
                >verifyCredentials</span
              >({
            </p>
            <p class="text-foreground pl-4">tenant: <span class="text-success">'cyberdyne-systems.internal'</span>,</p>
            <p class="text-foreground pl-4">
              protocols: [<span class="text-success">'webauthn-fido2'</span>,
              <span class="text-success">'saml2-okta'</span>]
            </p>
            <p class="text-foreground">});</p>
            <p class="text-success flex items-center gap-1.5 pt-1 font-medium">
              <CheckCircle2 class="size-3.5" />
              <span>✓ Cryptographic identity handshaking verified (0.8ms)</span>
            </p>
          </div>
        </div>

        <!-- Metric Badges -->
        <div class="border-border grid grid-cols-3 gap-4 border-t pt-4 text-xs">
          <div>
            <p class="text-foreground font-mono text-lg font-bold">99.999%</p>
            <p class="text-muted-foreground">Auth Uptime SLA</p>
          </div>
          <div>
            <p class="text-foreground font-mono text-lg font-bold">FIDO2</p>
            <p class="text-muted-foreground">Passkey Standard</p>
          </div>
          <div>
            <p class="text-foreground font-mono text-lg font-bold">SOC 2 Type II</p>
            <p class="text-muted-foreground">Certified Cloud</p>
          </div>
        </div>
      </div>

      <div class="text-muted-foreground relative z-10 flex items-center justify-between text-xs">
        <span>© 2026 UIPKGE Inc.</span>
        <div class="flex gap-4">
          <a href="#" class="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" class="hover:text-foreground transition-colors">Trust Center</a>
        </div>
      </div>
    </div>

    <!-- Right Login Workbench Pane -->
    <div class="flex flex-col items-center justify-center p-6 sm:p-12 lg:col-span-6 xl:col-span-5">
      <div class="w-full max-w-md space-y-6">
        <!-- Brand on mobile -->
        <div class="mb-4 flex items-center gap-2 lg:hidden">
          <div
            class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg font-bold shadow-xs"
          >
            <Zap class="size-4 fill-current" />
          </div>
          <span class="text-foreground font-bold tracking-tight">UIPKGE Studio</span>
        </div>

        <div class="space-y-2">
          <h2 class="text-foreground text-2xl font-bold tracking-tight">Sign in to console</h2>
          <p class="text-muted-foreground text-xs">Enter your credentials, passkey or company Single Sign-On.</p>
        </div>

        <!-- Social / Fast Auth Buttons -->
        <div class="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            type="button"
            class="border-border hover:bg-muted h-10 gap-2 text-xs font-semibold"
            @click="emit('oauth', 'github')"
          >
            <Github class="size-4" />
            <span>GitHub</span>
          </Button>
          <Button
            variant="outline"
            type="button"
            class="border-border hover:bg-muted h-10 gap-2 text-xs font-semibold"
            @click="emit('oauth', 'google')"
          >
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
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </Button>
        </div>

        <div class="relative">
          <Separator />
          <span
            class="bg-background text-muted-foreground absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 font-mono text-xs tracking-wider uppercase"
          >
            Or continue with
          </span>
        </div>

        <!-- Auth Method Tabs -->
        <Tabs v-model="authMethod" class="w-full">
          <TabsList class="grid h-9 w-full grid-cols-3">
            <TabsTrigger value="password" class="text-xs font-medium">Password</TabsTrigger>
            <TabsTrigger value="passkey" class="text-xs font-medium">Passkey</TabsTrigger>
            <TabsTrigger value="sso" class="text-xs font-medium">SAML SSO</TabsTrigger>
          </TabsList>

          <!-- Password Tab -->
          <TabsContent value="password" class="mt-4 space-y-4">
            <form class="space-y-4" @submit.prevent="handleSubmit">
              <div class="space-y-1.5">
                <Label for="email-input" class="text-xs font-medium">Work Email</Label>
                <div class="relative">
                  <Mail class="text-muted-foreground absolute top-2.5 left-3 size-4" />
                  <Input
                    id="email-input"
                    v-model="email"
                    type="email"
                    placeholder="alex@company.com"
                    autocomplete="email"
                    required
                    class="h-9 pl-9 text-xs"
                  />
                </div>
                <!-- Enterprise domain detected badge -->
                <div v-if="isEnterpriseEmail" class="text-primary mt-1 flex items-center gap-1.5 text-xs font-medium">
                  <ShieldCheck class="size-3.5" />
                  <span>Enterprise domain detected. Single Sign-On available.</span>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <Label for="pass-input" class="text-xs font-medium">Password</Label>
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    @click="emit('forgot-password')"
                  >
                    Forgot password?
                  </button>
                </div>
                <div class="relative">
                  <Lock class="text-muted-foreground absolute top-2.5 left-3 size-4" />
                  <Input
                    id="pass-input"
                    v-model="password"
                    type="password"
                    placeholder="••••••••••••"
                    autocomplete="current-password"
                    required
                    class="h-9 pl-9 text-xs"
                  />
                </div>
              </div>

              <Button type="submit" class="h-10 w-full gap-2 text-xs font-semibold shadow-xs" :disabled="isLoading">
                <span
                  v-if="isLoading"
                  class="border-primary-foreground size-3.5 animate-spin rounded-full border-2 border-t-transparent"
                />
                <span v-else>Continue with Password</span>
                <ArrowRight class="size-3.5" />
              </Button>
            </form>
          </TabsContent>

          <!-- Passkey Tab -->
          <TabsContent value="passkey" class="mt-4 space-y-4">
            <div class="border-border bg-card space-y-4 rounded-xl border p-6 text-center">
              <div class="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-full">
                <Fingerprint class="size-6" />
              </div>
              <div class="space-y-1">
                <p class="text-foreground text-sm font-semibold">Passwordless Biometric Login</p>
                <p class="text-muted-foreground text-xs">
                  Use Touch ID, Face ID, or a FIDO2 hardware security key for zero-friction sign in.
                </p>
              </div>
              <Button
                type="button"
                class="h-10 w-full gap-2 text-xs font-semibold shadow-xs"
                :disabled="isLoading"
                @click="handleSubmit"
              >
                <Fingerprint class="size-4" />
                <span>{{ isLoading ? 'Authenticating...' : 'Sign in with Passkey' }}</span>
              </Button>
            </div>
          </TabsContent>

          <!-- SSO Tab -->
          <TabsContent value="sso" class="mt-4 space-y-4">
            <form class="space-y-4" @submit.prevent="handleSubmit">
              <div class="space-y-1.5">
                <Label for="sso-domain" class="text-xs font-medium">Enterprise Domain</Label>
                <Input
                  id="sso-domain"
                  v-model="ssoDomain"
                  type="text"
                  placeholder="company.okta.com or domain.com"
                  required
                  class="h-9 font-mono text-xs"
                />
                <p class="text-muted-foreground text-xs">
                  Redirects to your corporate Identity Provider (Okta, Azure AD, Ping Identity).
                </p>
              </div>

              <Button type="submit" class="h-10 w-full gap-2 text-xs font-semibold shadow-xs" :disabled="isLoading">
                <KeyRound class="size-3.5" />
                <span>Continue with SAML SSO</span>
                <ArrowRight class="size-3.5" />
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div class="text-muted-foreground text-center text-xs">
          Don't have a workspace account?
          <button type="button" class="text-primary ml-1 font-semibold hover:underline" @click="emit('sign-up')">
            Create free trial
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
