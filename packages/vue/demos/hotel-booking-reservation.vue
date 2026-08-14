<script setup lang="ts">
import HotelBookingReservation from '@/components/blocks/hotel-booking-reservation/HotelBookingReservation.vue'
</script>

<template>
  <Story
    title="Default Reservation"
    description="Standard 5-night stay at The Ritz-Carlton Bal Harbour, Miami with live date picker, guest steppers, upgrade checkboxes, and sticky instant price breakdown."
  >
    <HotelBookingReservation />
  </Story>

  <Story
    title="Weekend Getaway"
    description="3-night romantic weekend getaway preset with custom arrival dates and adult occupancy."
  >
    <HotelBookingReservation
      initial-check-in="2026-08-28"
      initial-check-out="2026-08-31"
      :initial-adults="2"
      :initial-children="0"
      :initial-rooms="1"
    />
  </Story>

  <Story
    title="Family Vacation Multi-Suite"
    description="Family vacation booking with 2 adults, 2 children, and 2 connecting suites over a 7-night summer stay."
  >
    <HotelBookingReservation
      room-title="Two-Bedroom Oceanfront Family Residence"
      :base-price="780"
      initial-check-in="2026-07-10"
      initial-check-out="2026-07-17"
      :initial-adults="2"
      :initial-children="2"
      :initial-rooms="2"
    />
  </Story>

  <Story
    title="Presidential Penthouse"
    description="High-tier presidential oceanfront penthouse with premium nightly rates and full VIP amenities."
  >
    <HotelBookingReservation
      room-title="The Grand Presidential Penthouse Suite"
      hotelName="The Ritz-Carlton Bal Harbour, Miami"
      location="Bal Harbour Top Floor, Miami Beach, FL"
      :rating="5.0"
      :reviews-count="86"
      :base-price="1450"
      initial-check-in="2026-09-01"
      initial-check-out="2026-09-05"
      :initial-adults="2"
      :initial-children="0"
      :initial-rooms="1"
    />
  </Story>
</template>
