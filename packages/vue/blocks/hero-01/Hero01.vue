<script setup lang="ts">
import { ArrowRight, PlayCircle } from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <section data-slot="hero-01" class="bg-background relative overflow-hidden">
    <div
      class="bg-primary/10 pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full blur-3xl"
    />

    <div class="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
      <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div class="space-y-6">
          <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            The platform your team will actually use.
          </h1>
          <p class="text-muted-foreground max-w-xl text-lg">
            One workspace for everything your team needs. Built on shadcn-vue primitives — fast, accessible, easy to
            customise.
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <Button size="lg">
              Start free trial
              <ArrowRight class="ml-2 size-4" />
            </Button>
            <Button size="lg" variant="outline">
              <PlayCircle class="mr-2 size-4" />
              Watch demo (2 min)
            </Button>
          </div>
          <div class="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span>★★★★★ 4.9 on G2</span>
            <span>14-day free trial</span>
            <span>No credit card required</span>
          </div>
        </div>

        <div class="relative">
          <Card class="absolute -top-4 right-0 w-56 rotate-2 shadow-lg">
            <CardContent class="space-y-1 p-4">
              <p class="text-muted-foreground text-xs uppercase">Active users</p>
              <p class="text-2xl font-semibold">1,284</p>
              <p class="text-success text-xs">+8.2% MoM</p>
            </CardContent>
          </Card>
          <Card class="absolute top-32 -left-2 w-52 -rotate-3 shadow-lg">
            <CardContent class="space-y-1 p-4">
              <p class="text-muted-foreground text-xs uppercase">Uptime</p>
              <p class="text-2xl font-semibold">100%</p>
              <p class="text-muted-foreground text-xs">12 cycles, 0 misses</p>
            </CardContent>
          </Card>
          <Card class="ml-auto w-72 shadow-xl">
            <CardHeader>
              <CardTitle class="text-base">Onboarding queue</CardTitle>
              <CardDescription>3 starting Monday</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="flex items-center gap-3">
                <Avatar class="size-8">
                  <AvatarFallback>LW</AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <p class="text-sm font-medium">Lena Wei</p>
                  <p class="text-muted-foreground text-xs">Engineering</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <div class="flex items-center gap-3">
                <Avatar class="size-8">
                  <AvatarFallback>JR</AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <p class="text-sm font-medium">Joaquín Reyes</p>
                  <p class="text-muted-foreground text-xs">Engineering</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <div class="flex items-center gap-3">
                <Avatar class="size-8">
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <p class="text-sm font-medium">Priya Shah</p>
                  <p class="text-muted-foreground text-xs">Engineering</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
