<script setup lang="ts">
import { computed, ref } from 'vue'
import { Github } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

const passwordsMatch = computed(() => !confirmPassword.value || password.value === confirmPassword.value)

const canSubmit = computed(
  () =>
    name.value.length > 0 &&
    email.value.length > 0 &&
    password.value.length >= 8 &&
    passwordsMatch.value &&
    acceptTerms.value,
)

const emit = defineEmits<{
  (e: 'submit', payload: { name: string; email: string; password: string }): void
  (e: 'sign-in'): void
  (e: 'oauth', provider: 'github' | 'google'): void
  (e: 'view-terms'): void
  (e: 'view-privacy'): void
}>()

function onSubmit() {
  if (!canSubmit.value) return
  emit('submit', { name: name.value, email: email.value, password: password.value })
}

// ----- Optional: zod validation -----
// The `canSubmit` computed already guards basic shape (lengths +
// matching passwords + terms checked), but for typed parsing,
// regex-driven password rules, or shared schema with the backend,
// drop in zod. Add `zod` to your project and uncomment below.
//
// import { z } from 'zod'
// const registerSchema = z
//   .object({
//     name: z.string().min(1, 'Name is required'),
//     email: z.string().email('Enter a valid email'),
//     password: z
//       .string()
//       .min(8, 'At least 8 characters')
//       .regex(/[A-Z]/, 'One uppercase letter')
//       .regex(/[0-9]/, 'One number'),
//     confirmPassword: z.string(),
//     acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
//   })
//   .refine((d) => d.password === d.confirmPassword, {
//     path: ['confirmPassword'],
//     message: "Passwords don't match",
//   })
// function onSubmit() {
//   const parsed = registerSchema.safeParse({
//     name: name.value,
//     email: email.value,
//     password: password.value,
//     confirmPassword: confirmPassword.value,
//     acceptTerms: acceptTerms.value,
//   })
//   if (!parsed.success) {
//     // parsed.error.flatten().fieldErrors -> { email: [...], password: [...], ... }
//     return
//   }
//   emit('submit', {
//     name: parsed.data.name,
//     email: parsed.data.email,
//     password: parsed.data.password,
//   })
// }
</script>

<template>
  <div data-slot="register-01" class="bg-muted/30 flex min-h-svh items-center justify-center p-6">
    <Card class="w-full max-w-sm">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">Create your account</CardTitle>
        <CardDescription>Free for personal projects. No credit card.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="space-y-2">
            <Label for="r-name">Full name</Label>
            <Input id="r-name" v-model="name" type="text" placeholder="Ada Lovelace" autocomplete="name" required />
          </div>
          <div class="space-y-2">
            <Label for="r-email">Email</Label>
            <Input
              id="r-email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="r-password">Password</Label>
            <Input
              id="r-password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              minlength="8"
              required
            />
            <p class="text-muted-foreground text-xs">Minimum 8 characters.</p>
          </div>
          <div class="space-y-2">
            <Label for="r-confirm">Confirm password</Label>
            <Input id="r-confirm" v-model="confirmPassword" type="password" autocomplete="new-password" required />
            <p v-if="!passwordsMatch" class="text-destructive text-xs" role="alert">Passwords don't match.</p>
          </div>

          <div class="flex items-start gap-2.5 pt-1">
            <Checkbox id="r-terms" :model-value="acceptTerms" @update:model-value="acceptTerms = $event === true" />
            <Label for="r-terms" class="text-muted-foreground cursor-pointer text-xs leading-relaxed font-normal">
              I agree to the
              <button type="button" class="text-foreground mx-0.5 hover:underline" @click="emit('view-terms')">
                Terms of Service
              </button>
              and
              <button type="button" class="text-foreground mx-0.5 hover:underline" @click="emit('view-privacy')">
                Privacy Policy</button
              >.
            </Label>
          </div>

          <Button type="submit" class="w-full" :disabled="!canSubmit">Create account</Button>
        </form>

        <div class="relative">
          <Separator />
          <span
            class="bg-card text-muted-foreground absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 text-xs tracking-wider uppercase"
          >
            Or continue with
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
      </CardContent>
      <CardFooter class="justify-center">
        <p class="text-muted-foreground text-xs">
          Already have an account?
          <button type="button" class="text-foreground ml-1 font-medium hover:underline" @click="emit('sign-in')">
            Sign in
          </button>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
