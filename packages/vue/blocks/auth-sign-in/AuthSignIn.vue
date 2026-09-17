<script setup lang="ts">
import { ref } from 'vue'
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
    signUpHref?: string
    forgotPasswordHref?: string
    oauthProviders?: Array<'github' | 'google'>
  }>(),
  {
    title: 'Welcome back',
    description: 'Sign in to your account to continue',
    signUpHref: '/sign-up',
    forgotPasswordHref: '/forgot-password',
    oauthProviders: () => ['github', 'google'],
  },
)

const emit = defineEmits<{
  (e: 'submit', payload: { email: string; password: string; remember: boolean }): void
  (e: 'oauth', provider: 'github' | 'google'): void
}>()

const email = ref('')
const password = ref('')
const remember = ref(false)

function onSubmit() {
  emit('submit', { email: email.value, password: password.value, remember: remember.value })
}
</script>

<template>
  <div data-slot="auth-sign-in" class="bg-background flex min-h-svh items-center justify-center p-6">
    <Card class="w-full max-w-sm">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">{{ title }}</CardTitle>
        <CardDescription>{{ description }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@company.com"
              autocomplete="email"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>
              <a
                :href="forgotPasswordHref"
                class="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input id="password" v-model="password" type="password" autocomplete="current-password" required />
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="remember" v-model="remember" />
            <Label for="remember" class="text-sm font-normal">Remember me for 30 days</Label>
          </div>
          <Button type="submit" class="w-full">Sign in</Button>
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
          Don't have an account?
          <a :href="signUpHref" class="text-foreground font-medium underline-offset-4 hover:underline">Sign up</a>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
