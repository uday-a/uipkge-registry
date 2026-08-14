<script setup lang="ts">
import { computed, ref } from 'vue'
import { Github, Chrome } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    signInHref?: string
    termsHref?: string
    privacyHref?: string
    oauthProviders?: Array<'github' | 'google'>
  }>(),
  {
    title: 'Create your account',
    description: 'Start your 14-day free trial. No credit card required.',
    signInHref: '/login',
    termsHref: '#',
    privacyHref: '#',
    oauthProviders: () => ['github', 'google'],
  },
)

const emit = defineEmits<{
  (e: 'submit', payload: { name: string; email: string; password: string }): void
  (e: 'oauth', provider: 'github' | 'google'): void
}>()

const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const accept = ref(false)

const passwordsMatch = computed(() => !confirm.value || password.value === confirm.value)
const canSubmit = computed(() => name.value && email.value && password.value && passwordsMatch.value && accept.value)

function onSubmit() {
  if (!canSubmit.value) return
  emit('submit', { name: name.value, email: email.value, password: password.value })
}
</script>

<template>
  <div data-slot="auth-sign-up" class="bg-background flex min-h-svh items-center justify-center p-6">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">{{ title }}</CardTitle>
        <CardDescription>{{ description }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="grid gap-2">
            <Label for="signup-name">Full name</Label>
            <Input id="signup-name" v-model="name" autocomplete="name" required />
          </div>
          <div class="grid gap-2">
            <Label for="signup-email">Email</Label>
            <Input
              id="signup-email"
              v-model="email"
              type="email"
              placeholder="you@company.com"
              autocomplete="email"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="signup-password">Password</Label>
            <Input id="signup-password" v-model="password" type="password" autocomplete="new-password" required />
            <p class="text-muted-foreground text-xs">8+ characters, mix of letters, numbers and symbols.</p>
          </div>
          <div class="grid gap-2">
            <Label for="signup-confirm">Confirm password</Label>
            <Input
              id="signup-confirm"
              v-model="confirm"
              type="password"
              autocomplete="new-password"
              :aria-invalid="!passwordsMatch"
              required
            />
            <p v-if="!passwordsMatch" class="text-destructive text-xs">Passwords don't match.</p>
          </div>
          <div class="flex items-start gap-2">
            <Checkbox id="signup-accept" v-model="accept" />
            <Label for="signup-accept" class="text-sm leading-snug font-normal">
              I agree to the
              <a :href="termsHref" class="text-foreground underline-offset-4 hover:underline">Terms of Service</a>
              and
              <a :href="privacyHref" class="text-foreground underline-offset-4 hover:underline">Privacy Policy</a>.
            </Label>
          </div>
          <Button type="submit" class="w-full" :disabled="!canSubmit">Create account</Button>
        </form>

        <template v-if="oauthProviders.length > 0">
          <div class="my-6 flex items-center gap-3">
            <Separator class="flex-1" />
            <span class="text-muted-foreground text-xs uppercase">or continue with</span>
            <Separator class="flex-1" />
          </div>
          <div class="grid gap-2" :class="oauthProviders.length > 1 ? 'sm:grid-cols-2' : ''">
            <Button
              v-if="oauthProviders.includes('github')"
              variant="outline"
              type="button"
              @click="emit('oauth', 'github')"
            >
              <Github class="mr-2 size-4" />GitHub
            </Button>
            <Button
              v-if="oauthProviders.includes('google')"
              variant="outline"
              type="button"
              @click="emit('oauth', 'google')"
            >
              <Chrome class="mr-2 size-4" />Google
            </Button>
          </div>
        </template>
      </CardContent>
      <CardFooter class="justify-center">
        <p class="text-muted-foreground text-sm">
          Already have an account?
          <a :href="signInHref" class="text-foreground font-medium underline-offset-4 hover:underline">Sign in</a>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
