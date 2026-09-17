<script setup lang="ts">
import BenefitsEnrollmentPortal from '@/components/blocks/benefits-enrollment-portal/BenefitsEnrollmentPortal.vue'
</script>

<template>
  <Story
    title="Default"
    description="Standard benefits open enrollment portal for Elena Rostova (Employee + Spouse tier) with BlueCross PPO + HSA, Delta Dental Premier, VSP Choice Plus, and 6% 401(k) contribution unlocking the full $6,000 employer match."
  >
    <BenefitsEnrollmentPortal />
  </Story>

  <Story
    title="Family Coverage Tier & Higher Deferral"
    description="Family enrollment tier for Marcus Vance (Employee + Family) with BlueCross Gold Premier PPO, 10% 401(k) retirement deferral, and higher compensation bracket."
  >
    <BenefitsEnrollmentPortal
      employee-name="Marcus Vance"
      employee-id="EMP-39014"
      coverage-tier="Employee + Family"
      department="Product Management · Director"
      :annual-salary="165000"
      initial-medical-plan="medical-gold-ppo"
      initial-dental-plan="dental-comprehensive"
      initial-vision-plan="vision-choice-plus"
      :initial-401k-rate="10"
    />
  </Story>

  <Story
    title="Individual Tier & Partial 401(k) Match"
    description="Individual enrollment tier for Aisha Chen with Kaiser Permanente HMO, Delta Basic Dental, and 3% 401(k) deferral showing the missed employer match incentive callout."
  >
    <BenefitsEnrollmentPortal
      employee-name="Aisha Chen"
      employee-id="EMP-51280"
      coverage-tier="Employee Only"
      department="Operations · Specialist"
      :annual-salary="85000"
      initial-medical-plan="medical-kaiser-hmo"
      initial-dental-plan="dental-basic"
      initial-vision-plan="vision-standard"
      :initial-401k-rate="3"
      deadline-date="Sep 15"
      :days-remaining="14"
    />
  </Story>

  <Story
    title="Urgent Deadline Window"
    description="Open enrollment portal in the final 2-day enrollment window with urgent amber status badge."
  >
    <BenefitsEnrollmentPortal
      employee-name="Liam O'Connor"
      employee-id="EMP-60412"
      coverage-tier="Employee + Children"
      department="Design · Lead Staff"
      :annual-salary="135000"
      deadline-date="Tomorrow (Sep 15)"
      :days-remaining="2"
    />
  </Story>
</template>
