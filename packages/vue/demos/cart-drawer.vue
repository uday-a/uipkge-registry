<script setup lang="ts">
import CartDrawer from '@/components/blocks/cart-drawer/CartDrawer.vue'
</script>

<template>
  <Story
    title="Slide-Over Drawer View (Default)"
    description="Slide-over modal cart drawer featuring interactive stepper counters, free shipping meter, promo code input, trust badges, and sticky checkout action."
  >
    <CartDrawer variant="drawer" />
  </Story>

  <Story
    title="Applied Coupon Code"
    description="Cart drawer with pre-applied SUMMER20 coupon discount tag, updated taxes, and remaining balance."
  >
    <CartDrawer variant="drawer" initial-promo-code="SUMMER20" />
  </Story>

  <Story
    title="Full Cart Page Layout"
    description="Full e-commerce cart page layout with 2-column responsive grid, expanded line item details, guarantees banner, and sticky summary card."
  >
    <CartDrawer variant="page" />
  </Story>

  <Story
    title="Empty Cart State"
    description="Empty state when all line items have been removed, with one-click restore button to explore products."
  >
    <CartDrawer :items="[]" />
  </Story>
</template>
