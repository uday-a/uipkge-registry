<script setup lang="ts">
import { Link } from '@/components/ui/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, ExternalLink, FileText, Home, LifeBuoy } from 'lucide-vue-next'
</script>

<template>
  <Story
    title="Inline in body copy"
    description="Links flow naturally inside a paragraph — the most common place you'll reach for this component."
  >
    <p class="text-foreground max-w-md text-sm leading-relaxed">
      By signing up you agree to our <Link href="#" underline="always">Terms of Service</Link> and acknowledge our
      <Link href="#" underline="always">Privacy Policy</Link>. Need help? Visit our
      <Link href="#"><FileText /> support center</Link>.
    </p>
  </Story>

  <Story
    title="Color & underline"
    description="Three color tones paired with the three underline modes, so you can pick the right emphasis for the surrounding text."
  >
    <div class="max-w-md space-y-4">
      <div class="flex flex-wrap items-center gap-4 text-sm">
        <Link href="#" color="default">Default</Link>
        <Link href="#" color="primary">Primary</Link>
        <Link href="#" color="muted">Muted</Link>
      </div>
      <div class="flex flex-wrap items-center gap-4 text-sm">
        <Link href="#" underline="always">Always</Link>
        <Link href="#" underline="hover">Hover</Link>
        <Link href="#" underline="none">None</Link>
      </div>
    </div>
  </Story>

  <Story title="Sizes" description="sm, default, and lg for matching the surrounding text scale.">
    <div class="flex max-w-md flex-wrap items-baseline gap-4">
      <Link href="#" size="sm">Small link</Link>
      <Link href="#" size="default">Default link</Link>
      <Link href="#" size="lg">Large link</Link>
    </div>
  </Story>

  <Story
    title="With icons"
    description="Left and right slots for leading and trailing icons — trailing is common for external links and 'continue' affordances."
  >
    <div class="flex max-w-md flex-wrap items-center gap-4 text-sm">
      <Link href="#"><Home /> Home</Link>
      <Link href="#"><FileText /> Article</Link>
      <Link href="https://uipkge.dev">
        Visit site
        <template #right><ExternalLink /></template>
      </Link>
      <Link href="#">
        Continue
        <template #right><ArrowRight /></template>
      </Link>
    </div>
  </Story>

  <Story
    title="External vs internal"
    description="http(s) hrefs auto-open in a new tab with rel=noopener. Pass :external='false' to force same-tab, or use a relative href."
  >
    <p class="text-sm">
      External: <Link href="https://uipkge.dev">uipkge.dev</Link> opens in a new tab. Internal:
      <Link href="/about" :external="false">About page</Link> stays in-tab.
    </p>
  </Story>

  <Story title="Disabled" description="Non-interactive links are dimmed and ignore pointer events.">
    <div class="flex max-w-md flex-wrap items-center gap-4 text-sm">
      <Link href="#" disabled>Disabled link</Link>
      <Link href="#" color="muted" disabled>Disabled muted</Link>
    </div>
  </Story>

  <Story
    title="In a card footer"
    description="A realistic placement — a help card that links to docs, support, and an external status page."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Need a hand?</CardTitle>
        <CardDescription>We're here Monday through Friday, 9–5 GMT.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <Link href="#"><LifeBuoy /> Support center</Link>
        <Link href="#">Documentation</Link>
        <Link href="https://status.uipkge.dev">
          Status
          <template #right><ExternalLink /></template>
        </Link>
      </CardContent>
    </Card>
  </Story>

  <Story
    title="AsChild"
    description="Compose full link styling onto a custom element — a button, router-link, or anchor."
  >
    <Link as-child href="#">
      <button class="px-2 py-1">Button styled as link</button>
    </Link>
  </Story>
</template>
