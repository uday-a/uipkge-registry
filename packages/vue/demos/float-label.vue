<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FloatLabel } from '@/components/ui/float-label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const nameValue = ref('')
const emailValue = ref('')
const preselectedValue = ref('John Doe')
const messageValue = ref('')
const firstNameValue = ref('')
const lastNameValue = ref('')
const profileName = ref('Jane Smith')
const profileEmail = ref('jane.smith@example.com')
const profileBio = ref('Product designer passionate about design systems.')
</script>

<template>
  <Story
    title="Basic input"
    description="Label floats up on focus or when a value is present. Use a single-space placeholder to keep the label centered."
  >
    <div class="max-w-md space-y-2">
      <FloatLabel label="Full Name" class="w-full">
        <Input v-model="nameValue" placeholder=" " class="h-11" />
      </FloatLabel>
      <p class="text-muted-foreground text-xs">Value: {{ nameValue || 'empty' }}</p>
    </div>
  </Story>

  <Story
    title="Pre-filled & required"
    description="Label stays floated when the input has a value. Required fields show a red asterisk."
  >
    <div class="max-w-md space-y-4">
      <FloatLabel label="Full Name" class="w-full">
        <Input v-model="preselectedValue" placeholder=" " class="h-11" />
      </FloatLabel>
      <FloatLabel label="Email" required class="w-full">
        <Input v-model="emailValue" type="email" placeholder=" " class="h-11" />
      </FloatLabel>
    </div>
  </Story>

  <Story title="Input types" description="Floating labels work across email, number, password, and textarea inputs.">
    <div class="max-w-md space-y-4">
      <FloatLabel label="Email Address" required class="w-full">
        <Input type="email" placeholder=" " class="h-11" />
      </FloatLabel>
      <FloatLabel label="Age" class="w-full">
        <Input type="number" placeholder=" " class="h-11" />
      </FloatLabel>
      <FloatLabel label="Password" required class="w-full">
        <Input type="password" placeholder=" " class="h-11" />
      </FloatLabel>
      <FloatLabel label="Message" class="w-full">
        <Textarea v-model="messageValue" placeholder=" " class="min-h-24" />
      </FloatLabel>
    </div>
  </Story>

  <Story
    title="Disabled"
    description="The wrapper and input are both disabled — label stays floated, interaction is blocked."
  >
    <div class="max-w-md">
      <FloatLabel label="Username" disabled class="w-full">
        <Input disabled placeholder=" " class="h-11" />
      </FloatLabel>
    </div>
  </Story>

  <Story title="Side by side" description="Two float-label inputs in a row — common in name fields and date ranges.">
    <div class="flex max-w-md gap-4">
      <FloatLabel label="First Name" class="flex-1">
        <Input v-model="firstNameValue" placeholder=" " class="h-11" />
      </FloatLabel>
      <FloatLabel label="Last Name" class="flex-1">
        <Input v-model="lastNameValue" placeholder=" " class="h-11" />
      </FloatLabel>
    </div>
  </Story>

  <Story
    title="In context: Profile form"
    description="A realistic edit-profile card with multiple float-label fields and a save button."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Edit profile</CardTitle>
        <CardDescription>Update your personal information below.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex gap-4">
          <FloatLabel label="First Name" class="flex-1">
            <Input v-model="profileName" placeholder=" " class="h-11" />
          </FloatLabel>
          <FloatLabel label="Last Name" class="flex-1">
            <Input placeholder=" " class="h-11" />
          </FloatLabel>
        </div>
        <FloatLabel label="Email" required class="w-full">
          <Input v-model="profileEmail" type="email" placeholder=" " class="h-11" />
        </FloatLabel>
        <FloatLabel label="Bio" class="w-full">
          <Textarea v-model="profileBio" placeholder=" " class="min-h-20" />
        </FloatLabel>
        <Button class="w-full">Save changes</Button>
      </CardContent>
    </Card>
  </Story>
</template>
