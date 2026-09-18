<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'

const signupValue = ref('')
const loginValue = ref('')
const smValue = ref('')
const lgValue = ref('')
const filledValue = ref('')
const borderlessValue = ref('')
const readonlyValue = ref('s3cr3t-k3y')
</script>

<template>
  <Story
    title="Sign-up with strength meter"
    description="Live strength bar turns from red to green as the password meets more criteria."
  >
    <div class="max-w-md space-y-2">
      <PasswordInput
        v-model="signupValue"
        show-strength
        :min-length="8"
        placeholder="Create a password..."
        class="w-full"
      />
      <p class="text-muted-foreground text-xs">
        {{ signupValue ? `${signupValue.length} characters entered` : 'Start typing to see strength feedback' }}
      </p>
    </div>
  </Story>

  <Story
    title="Size variants"
    description="Small for dense toolbars, default for forms, large for touch-first layouts."
  >
    <div class="max-w-md space-y-3">
      <PasswordInput v-model="smValue" size="sm" placeholder="Small..." class="w-full" />
      <PasswordInput placeholder="Default..." class="w-full" />
      <PasswordInput v-model="lgValue" size="lg" placeholder="Large..." class="w-full" />
    </div>
  </Story>

  <Story
    title="Variant styles"
    description="Outlined (default), filled for subtle surfaces, and borderless for inline editing."
  >
    <div class="max-w-md space-y-3">
      <PasswordInput placeholder="Outlined" class="w-full" />
      <PasswordInput v-model="filledValue" variant="filled" placeholder="Filled" class="w-full" />
      <PasswordInput v-model="borderlessValue" variant="borderless" placeholder="Borderless" class="w-full" />
    </div>
  </Story>

  <Story
    title="States"
    description="Read-only with a pre-filled API key, and a disabled input that blocks interaction."
  >
    <div class="max-w-md space-y-3">
      <PasswordInput v-model="readonlyValue" readonly placeholder="Read-only" class="w-full" />
      <PasswordInput disabled placeholder="Disabled" class="w-full" />
    </div>
  </Story>

  <Story
    title="Without toggle"
    description="Hide the eye button for fields where revealing is not allowed, e.g. compliance-controlled inputs."
  >
    <div class="max-w-md">
      <PasswordInput :show-toggle="false" placeholder="Enter password..." class="w-full" />
    </div>
  </Story>

  <Story
    title="In context: Login card"
    description="A realistic sign-in form with email and password fields inside a card."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            class="border-input focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Password</label>
          <PasswordInput v-model="loginValue" placeholder="Enter your password" class="w-full" />
        </div>
        <Button class="w-full">Sign in</Button>
        <p class="text-muted-foreground text-center text-xs">
          {{ loginValue ? `Password length: ${loginValue.length}` : 'No password entered' }}
        </p>
      </CardContent>
    </Card>
  </Story>
</template>
