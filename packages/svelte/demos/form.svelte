<script lang="ts">
  import { z } from 'zod'
  import {
    Form,
    FormActions,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormSection,
    FormStatus,
    createForm,
  } from '@svelte-registry/form'
  import { Input } from '@svelte-registry/input'
  import { Textarea } from '@svelte-registry/textarea'
  import { Checkbox } from '@svelte-registry/checkbox'
  import { Button } from '@svelte-registry/button'
  import { AlertCircle, CheckCircle2, Loader2 } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  // Helpers showcase
  let validationDemoStatus = $state<'error' | 'warning' | 'success' | undefined>(undefined)
  let validationDemoMessage = $state('')

  function setValidationDemo(status: 'error' | 'warning' | 'success') {
    validationDemoStatus = status
    const messages = {
      error: 'Username is already taken',
      warning: 'Username is available but similar to an existing user',
      success: 'Username is available',
    }
    validationDemoMessage = messages[status]
  }

  const helpersForm = createForm(() => ({
    defaultValues: { helperEmail: '', helperUsername: '' },
    onSubmit: () => {},
  }))

  // Horizontal layout
  const horizontalForm = createForm(() => ({
    defaultValues: { hName: '', hEmail: '' },
    onSubmit: () => {},
  }))

  // Login
  let loginError = $state('')
  let loginSuccess = $state(false)
  let loginSubmitting = $state(false)
  const loginEmailSchema = z.string().email('Enter a valid email')
  const loginPasswordSchema = z.string().min(8, 'Min 8 characters')

  const loginForm = createForm(() => ({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      loginError = ''
      loginSuccess = false
      loginSubmitting = true
      await new Promise((r) => setTimeout(r, 1500))
      loginSubmitting = false
      if (value.email === 'error@demo.com') {
        loginError = 'Invalid email or password'
      } else {
        loginSuccess = true
      }
    },
  }))

  // Sign up — 1 col
  let signupSuccess = $state(false)
  let signupSubmitting = $state(false)
  const signupForm = createForm(() => ({
    defaultValues: { fullName: '', signupEmail: '', signupPassword: '', confirmPassword: '' },
    onSubmit: async () => {
      signupSubmitting = true
      await new Promise((r) => setTimeout(r, 1500))
      signupSubmitting = false
      signupSuccess = true
    },
  }))

  // Profile — 1 col
  let profileSuccess = $state(false)
  let profileSubmitting = $state(false)
  const profileForm = createForm(() => ({
    defaultValues: {
      profileName: '',
      profileEmail: '',
      profilePhone: '',
      profileBio: '',
    },
    onSubmit: async () => {
      profileSubmitting = true
      await new Promise((r) => setTimeout(r, 1200))
      profileSubmitting = false
      profileSuccess = true
    },
  }))
</script>

{#if story === 'Form Helpers'}
  <Form form={helpersForm} class="max-w-lg space-y-6">
    <FormSection title="Account Details" description="Enter your account information below.">
      <FormField name="helperEmail">
        {#snippet children({ componentField })}
          <FormItem label="Email" required description="We'll never share your email with anyone.">
            <FormControl>
              {#snippet children(controlProps)}
                <Input type="email" placeholder="you@example.com" {...controlProps} {...componentField} />
              {/snippet}
            </FormControl>
            <FormMessage />
          </FormItem>
        {/snippet}
      </FormField>

      <FormField name="helperUsername">
        {#snippet children({ componentField })}
          <FormItem label="Username" required status={validationDemoStatus} help={validationDemoMessage}>
            <FormControl>
              {#snippet children(controlProps)}
                <Input placeholder="johndoe" {...controlProps} {...componentField} />
              {/snippet}
            </FormControl>
          </FormItem>
        {/snippet}
      </FormField>

      <div class="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onclick={() => setValidationDemo('error')}>
          <AlertCircle class="mr-1 size-3.5" /> Error
        </Button>
        <Button type="button" size="sm" variant="outline" onclick={() => setValidationDemo('warning')}>
          <AlertCircle class="mr-1 size-3.5 text-amber-500" /> Warning
        </Button>
        <Button type="button" size="sm" variant="outline" onclick={() => setValidationDemo('success')}>
          <CheckCircle2 class="mr-1 size-3.5 text-emerald-500" /> Success
        </Button>
      </div>
    </FormSection>

    <FormStatus status="error" message="Please fix the errors above before submitting." />
    <FormStatus status="warning" message="Your password is weak. Consider using a stronger one." />
    <FormStatus status="success" message="Your changes have been saved successfully." />

    <FormSection title="Button Alignment" description="FormActions supports left, center, and right alignment.">
      <div class="space-y-3">
        <FormActions align="left">
          <Button type="button" size="sm" variant="outline">Cancel</Button>
          <Button type="button" size="sm">Save</Button>
        </FormActions>
        <FormActions align="center">
          <Button type="button" size="sm" variant="outline">Cancel</Button>
          <Button type="button" size="sm">Save</Button>
        </FormActions>
        <FormActions align="right">
          <Button type="button" size="sm" variant="outline">Cancel</Button>
          <Button type="button" size="sm">Save</Button>
        </FormActions>
      </div>
    </FormSection>
  </Form>
{/if}

{#if story === 'Horizontal Layout'}
  <Form form={horizontalForm} class="max-w-lg space-y-4">
    <FormField name="hName">
      {#snippet children({ componentField })}
        <FormItem label="Full Name" layout="horizontal" required>
          <FormControl>
            {#snippet children(controlProps)}
              <Input placeholder="Jane Doe" {...controlProps} {...componentField} />
            {/snippet}
          </FormControl>
        </FormItem>
      {/snippet}
    </FormField>
    <FormField name="hEmail">
      {#snippet children({ componentField })}
        <FormItem label="Email" layout="horizontal" required>
          <FormControl>
            {#snippet children(controlProps)}
              <Input type="email" placeholder="jane@example.com" {...controlProps} {...componentField} />
            {/snippet}
          </FormControl>
        </FormItem>
      {/snippet}
    </FormField>
    <FormActions align="right">
      <Button type="button" variant="outline">Cancel</Button>
      <Button type="submit">Submit</Button>
    </FormActions>
  </Form>
{/if}

{#if story === 'Login — 1 Column'}
  <Form form={loginForm} class="max-w-sm space-y-4">
    <FormField name="email" validators={{ onSubmit: loginEmailSchema }}>
      {#snippet children({ componentField })}
        <FormItem label="Email">
          <FormControl>
            {#snippet children(controlProps)}
              <Input type="email" placeholder="you@example.com" {...controlProps} {...componentField} />
            {/snippet}
          </FormControl>
          <FormMessage />
        </FormItem>
      {/snippet}
    </FormField>

    <FormField name="password" validators={{ onSubmit: loginPasswordSchema }}>
      {#snippet children({ componentField })}
        <FormItem label="Password">
          <FormControl>
            {#snippet children(controlProps)}
              <Input type="password" placeholder="••••••••" {...controlProps} {...componentField} />
            {/snippet}
          </FormControl>
          <FormMessage />
        </FormItem>
      {/snippet}
    </FormField>

    <div class="flex items-center justify-between">
      <label class="flex items-center gap-2 text-sm">
        <Checkbox checked={false} />
        Remember me
      </label>
      <a href="#forgot-password" class="text-primary text-sm hover:underline">Forgot password?</a>
    </div>

    {#if loginError}
      <FormStatus status="error" message={loginError} />
    {/if}
    {#if loginSuccess}
      <FormStatus status="success" message="Login successful! Redirecting..." />
    {/if}

    <Button type="submit" class="w-full" disabled={loginSubmitting}>
      {#if loginSubmitting}
        <Loader2 class="mr-2 size-4 animate-spin" />
      {/if}
      {loginSubmitting ? 'Signing in...' : 'Sign in'}
    </Button>
  </Form>
{/if}

{#if story === 'Sign Up — 1 Column'}
  {#if !signupSuccess}
    <Form form={signupForm} class="max-w-sm space-y-4">
      <FormField name="fullName">
        {#snippet children({ componentField })}
          <FormItem label="Full Name" required>
            <FormControl>
              {#snippet children(controlProps)}
                <Input placeholder="Jane Doe" {...controlProps} {...componentField} />
              {/snippet}
            </FormControl>
          </FormItem>
        {/snippet}
      </FormField>
      <FormField name="signupEmail">
        {#snippet children({ componentField })}
          <FormItem label="Email" required>
            <FormControl>
              {#snippet children(controlProps)}
                <Input type="email" placeholder="jane@example.com" {...controlProps} {...componentField} />
              {/snippet}
            </FormControl>
          </FormItem>
        {/snippet}
      </FormField>
      <FormField name="signupPassword">
        {#snippet children({ componentField })}
          <FormItem
            label="Password"
            required
            description="Must contain at least 8 characters, one number and one symbol."
          >
            <FormControl>
              {#snippet children(controlProps)}
                <Input type="password" placeholder="Min 8 characters" {...controlProps} {...componentField} />
              {/snippet}
            </FormControl>
          </FormItem>
        {/snippet}
      </FormField>
      <FormField name="confirmPassword">
        {#snippet children({ componentField })}
          <FormItem label="Confirm Password" required>
            <FormControl>
              {#snippet children(controlProps)}
                <Input type="password" placeholder="Repeat password" {...controlProps} {...componentField} />
              {/snippet}
            </FormControl>
          </FormItem>
        {/snippet}
      </FormField>
      <label class="flex items-start gap-2 text-sm">
        <Checkbox checked={false} class="mt-0.5" />
        <span
          >I agree to the <a href="#terms" class="text-primary hover:underline">Terms of Service</a> and
          <a href="#privacy" class="text-primary hover:underline">Privacy Policy</a></span
        >
      </label>
      <FormActions>
        <Button type="submit" class="w-full" disabled={signupSubmitting}>
          {#if signupSubmitting}
            <Loader2 class="mr-2 size-4 animate-spin" />
          {/if}
          {signupSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </FormActions>
    </Form>
  {:else}
    <div class="flex max-w-sm flex-col items-center gap-3 rounded-lg border p-6 text-center">
      <CheckCircle2 class="size-10 text-emerald-500" />
      <h3 class="text-lg font-semibold">Account created</h3>
      <p class="text-muted-foreground text-sm">Check your email to verify your account.</p>
      <Button variant="outline" size="sm" onclick={() => (signupSuccess = false)}>Back to form</Button>
    </div>
  {/if}
{/if}

{#if story === 'Profile Edit — 1 Column'}
  <Form form={profileForm} class="max-w-sm space-y-4">
    <FormField name="profileName">
      {#snippet children({ componentField })}
        <FormItem label="Full Name" required>
          <FormControl>
            {#snippet children(controlProps)}
              <Input placeholder="Jane Doe" {...controlProps} {...componentField} />
            {/snippet}
          </FormControl>
        </FormItem>
      {/snippet}
    </FormField>
    <FormField name="profileEmail">
      {#snippet children({ componentField })}
        <FormItem label="Email" required>
          <FormControl>
            {#snippet children(controlProps)}
              <Input type="email" placeholder="jane@example.com" {...controlProps} {...componentField} />
            {/snippet}
          </FormControl>
        </FormItem>
      {/snippet}
    </FormField>
    <FormField name="profilePhone">
      {#snippet children({ componentField })}
        <FormItem label="Phone">
          <FormControl>
            {#snippet children(controlProps)}
              <Input type="tel" placeholder="+1 (555) 000-0000" {...controlProps} {...componentField} />
            {/snippet}
          </FormControl>
        </FormItem>
      {/snippet}
    </FormField>
    <FormField name="profileBio">
      {#snippet children({ componentField })}
        <FormItem label="Bio">
          <FormControl>
            {#snippet children(controlProps)}
              <Textarea placeholder="Tell us about yourself" {...controlProps} {...componentField} />
            {/snippet}
          </FormControl>
        </FormItem>
      {/snippet}
    </FormField>
    {#if profileSuccess}
      <FormStatus status="success" message="Profile updated successfully." />
    {/if}
    <FormActions>
      <Button type="submit" class="w-full" disabled={profileSubmitting}>
        {#if profileSubmitting}
          <Loader2 class="mr-2 size-4 animate-spin" />
        {/if}
        {profileSubmitting ? 'Saving...' : 'Save changes'}
      </Button>
    </FormActions>
  </Form>
{/if}
