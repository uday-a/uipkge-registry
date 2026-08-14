<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft, MailCheck } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

withDefaults(
  defineProps<{
    signInHref?: string
  }>(),
  { signInHref: '/login' },
)

const emit = defineEmits<{
  (e: 'request', email: string): void
  (e: 'reset', password: string): void
}>()

type Stage = 'request' | 'sent' | 'reset' | 'done'
const stage = ref<Stage>('request')

const email = ref('')
const password = ref('')
const confirm = ref('')
const passwordsMatch = computed(() => !confirm.value || password.value === confirm.value)

function submitRequest() {
  if (!email.value) return
  emit('request', email.value)
  stage.value = 'sent'
}

function submitReset() {
  if (!password.value || !passwordsMatch.value) return
  emit('reset', password.value)
  stage.value = 'done'
}
</script>

<template>
  <div data-slot="auth-password-reset" class="bg-background flex min-h-svh items-center justify-center p-6">
    <Card class="w-full max-w-sm">
      <template v-if="stage === 'request'">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">Forgot password?</CardTitle>
          <CardDescription>Enter your email and we'll send you a reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="submitRequest">
            <div class="grid gap-2">
              <Label for="reset-email">Email</Label>
              <Input id="reset-email" v-model="email" type="email" placeholder="you@company.com" required />
            </div>
            <Button type="submit" class="w-full">Send reset link</Button>
          </form>
        </CardContent>
        <CardFooter class="justify-center">
          <a
            :href="signInHref"
            class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
          >
            <ArrowLeft class="size-3" />Back to sign in
          </a>
        </CardFooter>
      </template>

      <template v-else-if="stage === 'sent'">
        <CardContent class="space-y-4 pt-6 text-center">
          <div class="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-full">
            <MailCheck class="size-6" />
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-semibold">Check your inbox</h3>
            <p class="text-muted-foreground text-sm">
              We've sent a reset link to <span class="text-foreground font-medium">{{ email }}</span
              >.
            </p>
          </div>
          <Button variant="outline" class="w-full" @click="stage = 'reset'">Open reset form (demo)</Button>
          <button
            class="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
            @click="stage = 'request'"
          >
            Wrong email?
          </button>
        </CardContent>
      </template>

      <template v-else-if="stage === 'reset'">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">Set new password</CardTitle>
          <CardDescription>Pick a strong password you haven't used before.</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="submitReset">
            <div class="grid gap-2">
              <Label for="reset-pw">New password</Label>
              <Input id="reset-pw" v-model="password" type="password" autocomplete="new-password" required />
            </div>
            <div class="grid gap-2">
              <Label for="reset-confirm">Confirm password</Label>
              <Input
                id="reset-confirm"
                v-model="confirm"
                type="password"
                autocomplete="new-password"
                :aria-invalid="!passwordsMatch"
                required
              />
              <p v-if="!passwordsMatch" class="text-destructive text-xs">Passwords don't match.</p>
            </div>
            <Button type="submit" class="w-full">Reset password</Button>
          </form>
        </CardContent>
      </template>

      <template v-else>
        <CardContent class="space-y-4 pt-6 text-center">
          <div class="bg-success/10 text-success mx-auto flex size-12 items-center justify-center rounded-full">
            <MailCheck class="size-6" />
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-semibold">All set</h3>
            <p class="text-muted-foreground text-sm">
              Your password has been updated. You can now sign in with the new password.
            </p>
          </div>
          <a :href="signInHref"><Button class="w-full">Continue to sign in</Button></a>
        </CardContent>
      </template>
    </Card>
  </div>
</template>
