<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import LeadCapturePopup from '@/components/blocks/lead-capture-popup/LeadCapturePopup.vue'

const resetKey1 = ref(0)
const resetKey2 = ref(0)
const isModalOpen = ref(false)
</script>

<template>
  <Story
    title="Default Exit-Intent Popup"
    description="High-conversion lead capture container featuring live ticking urgency countdown, emerald value propositions, email form, star rating social proof, and decline link."
  >
    <div class="flex flex-col items-center gap-4 py-4">
      <LeadCapturePopup :key="resetKey1" />
      <Button variant="outline" size="sm" @click="resetKey1++">Reset Popup State</Button>
    </div>
  </Story>

  <Story
    title="Success State & Coupon Reveal"
    description="Flipped state rendered immediately upon successful email submission, presenting the WELCOME20 coupon code with one-click clipboard copying."
  >
    <div class="flex flex-col items-center gap-4 py-4">
      <LeadCapturePopup :key="resetKey2" :initial-submitted="true" />
      <Button variant="outline" size="sm" @click="resetKey2++">Reset Success State</Button>
    </div>
  </Story>

  <Story
    title="Modal Overlay Trigger"
    description="Simulate an exit-intent trigger where user movement towards window boundaries opens the popup in a full-screen blurred backdrop dialog."
  >
    <div class="flex flex-col items-center justify-center p-8 text-center">
      <Button size="lg" class="gap-2 shadow-xs" @click="isModalOpen = true">
        <Sparkles class="size-4" />
        Simulate Exit-Intent Trigger
      </Button>
      <p class="text-muted-foreground mt-2 text-xs">Click to open exit-intent modal overlay</p>

      <!-- Modal Overlay -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
            @click.self="isModalOpen = false"
          >
            <div class="w-full max-w-lg">
              <LeadCapturePopup @dismiss="isModalOpen = false" />
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </Story>

  <Story
    title="Custom 30% Flash Sale"
    description="Customized discount tier and urgency parameters for special product launches and promotional flash campaigns."
  >
    <div class="flex flex-col items-center gap-4 py-4">
      <LeadCapturePopup
        headline="Unlock 30% Off Lifetime Pro"
        subtitle="Get instant access to 100+ components, production-grade templates, and private Discord access."
        discount-code="FLASH30"
        :discount-percent="30"
        :initial-seconds="300"
        social-proof-rating="5.0/5"
        social-proof-count="2,800+ builders"
      />
    </div>
  </Story>
</template>
