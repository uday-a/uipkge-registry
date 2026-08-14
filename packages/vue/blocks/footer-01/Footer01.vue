<script setup lang="ts">
import { ref } from 'vue'
import { Boxes, Github, Linkedin, Twitter } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const newsletter = ref('')
const subscribed = ref(false)

function subscribe() {
  if (!newsletter.value) return
  subscribed.value = true
  newsletter.value = ''
}
</script>

<template>
  <footer data-slot="footer-01" class="bg-background border-t">
    <div class="mx-auto max-w-6xl px-6 py-16">
      <div class="grid gap-10 lg:grid-cols-12">
        <div class="space-y-4 lg:col-span-4">
          <div class="flex items-center gap-2">
            <div class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Boxes class="size-4" />
            </div>
            <span class="text-base font-semibold">Acme</span>
          </div>
          <p class="text-muted-foreground max-w-sm text-sm">Built on shadcn-vue. Get product updates monthly.</p>
          <form class="flex max-w-sm gap-2" @submit.prevent="subscribe">
            <Input v-model="newsletter" type="email" placeholder="you@company.com" required class="flex-1" />
            <Button type="submit">Subscribe</Button>
          </form>
          <p v-if="subscribed" class="text-success text-xs">Thanks — check your inbox to confirm.</p>
        </div>

        <div class="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-8">
          <div class="space-y-3">
            <h3 class="text-sm font-semibold">Product</h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Features</a>
              </li>
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Changelog</a>
              </li>
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Roadmap</a>
              </li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="text-sm font-semibold">Company</h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">About</a>
              </li>
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="text-sm font-semibold">Resources</h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >Documentation</a
                >
              </li>
              <li><a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">API</a></li>
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >Help center</a
                >
              </li>
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Status</a>
              </li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="text-sm font-semibold">Legal</h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms</a>
              </li>
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy</a>
              </li>
              <li>
                <a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Security</a>
              </li>
              <li><a href="#" class="text-muted-foreground hover:text-foreground text-sm transition-colors">DPA</a></li>
            </ul>
          </div>
        </div>
      </div>

      <Separator class="my-10" />

      <div class="flex flex-wrap items-center justify-between gap-4">
        <p class="text-muted-foreground text-xs">© 2026 Acme. All rights reserved.</p>
        <div class="flex items-center gap-3">
          <a href="#" aria-label="GitHub" class="text-muted-foreground hover:text-foreground transition-colors">
            <Github class="size-4" />
          </a>
          <a href="#" aria-label="Twitter" class="text-muted-foreground hover:text-foreground transition-colors">
            <Twitter class="size-4" />
          </a>
          <a href="#" aria-label="LinkedIn" class="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin class="size-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
