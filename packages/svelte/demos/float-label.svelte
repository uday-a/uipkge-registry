<script lang="ts">
  import { FloatLabel } from '@svelte-registry/float-label'
  import { Input } from '@svelte-registry/input'
  import { Textarea } from '@svelte-registry/textarea'
  import { Button } from '@svelte-registry/button'
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@svelte-registry/card'

  let { story }: { story: string } = $props()

  let nameValue = $state('')
  let emailValue = $state('')
  let preselectedValue = $state('John Doe')
  let messageValue = $state('')
  let firstNameValue = $state('')
  let lastNameValue = $state('')
  let profileName = $state('Jane Smith')
  let profileEmail = $state('jane.smith@example.com')
  let profileBio = $state('Product designer passionate about design systems.')
</script>

{#if story === 'Basic input'}
  <div class="max-w-md space-y-2">
    <FloatLabel label="Full Name" class="w-full">
      <Input bind:value={nameValue} placeholder=" " class="h-11" />
    </FloatLabel>
    <p class="text-muted-foreground text-xs">Value: {nameValue || 'empty'}</p>
  </div>
{/if}

{#if story === 'Pre-filled & required'}
  <div class="max-w-md space-y-4">
    <FloatLabel label="Full Name" class="w-full">
      <Input bind:value={preselectedValue} placeholder=" " class="h-11" />
    </FloatLabel>
    <FloatLabel label="Email" required class="w-full">
      <Input bind:value={emailValue} type="email" placeholder=" " class="h-11" />
    </FloatLabel>
  </div>
{/if}

{#if story === 'Input types'}
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
      <Textarea bind:value={messageValue} placeholder=" " class="min-h-24" />
    </FloatLabel>
  </div>
{/if}

{#if story === 'Disabled'}
  <div class="max-w-md">
    <FloatLabel label="Username" disabled class="w-full">
      <Input disabled placeholder=" " class="h-11" />
    </FloatLabel>
  </div>
{/if}

{#if story === 'Side by side'}
  <div class="flex max-w-md gap-4">
    <FloatLabel label="First Name" class="flex-1">
      <Input bind:value={firstNameValue} placeholder=" " class="h-11" />
    </FloatLabel>
    <FloatLabel label="Last Name" class="flex-1">
      <Input bind:value={lastNameValue} placeholder=" " class="h-11" />
    </FloatLabel>
  </div>
{/if}

{#if story === 'In context: Profile form'}
  <Card class="max-w-md">
    <CardHeader>
      <CardTitle>Edit profile</CardTitle>
      <CardDescription>Update your personal information below.</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="flex gap-4">
        <FloatLabel label="First Name" class="flex-1">
          <Input bind:value={profileName} placeholder=" " class="h-11" />
        </FloatLabel>
        <FloatLabel label="Last Name" class="flex-1">
          <Input placeholder=" " class="h-11" />
        </FloatLabel>
      </div>
      <FloatLabel label="Email" required class="w-full">
        <Input bind:value={profileEmail} type="email" placeholder=" " class="h-11" />
      </FloatLabel>
      <FloatLabel label="Bio" class="w-full">
        <Textarea bind:value={profileBio} placeholder=" " class="min-h-20" />
      </FloatLabel>
      <Button class="w-full">Save changes</Button>
    </CardContent>
  </Card>
{/if}
