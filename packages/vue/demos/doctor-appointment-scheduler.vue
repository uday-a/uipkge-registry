<script setup lang="ts">
import DoctorAppointmentScheduler from '@/components/blocks/doctor-appointment-scheduler/DoctorAppointmentScheduler.vue'
</script>

<template>
  <Story
    title="Default Specialist Scheduler"
    description="Zocdoc and Epic style doctor appointment booking calendar with physician profile, visit type selection, date carousel, morning and afternoon slots, live copay estimation, and booking confirmation."
  >
    <DoctorAppointmentScheduler />
  </Story>

  <Story
    title="Cardiology Clinic"
    description="Configured with custom clinic name, specialized doctor profile, and pre-selected telehealth visit mode."
  >
    <DoctorAppointmentScheduler
      doctor-name="Dr. Marcus Thorne, MD, FACC"
      doctor-title="Chief of Clinical Cardiology · Cedars-Sinai Heart Institute"
      specialty="Interventional Cardiology"
      clinic-name="Cedars-Sinai Medical Plaza"
      clinic-address="8700 Beverly Blvd, Suite 400, Los Angeles, CA 90048"
      initial-visit-type="telehealth"
      initial-date="2026-08-28"
      initial-time="02:45 PM"
      initial-reason="annual-checkup"
    />
  </Story>
</template>
