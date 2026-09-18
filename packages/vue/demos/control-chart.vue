<script setup lang="ts">
import { ControlChart } from '@/components/ui/charts'

const builds = [
  { b: '#101', mins: 8.2 },
  { b: '#102', mins: 7.8 },
  { b: '#103', mins: 8.5 },
  { b: '#104', mins: 8.1 },
  { b: '#105', mins: 14.6 },
  { b: '#106', mins: 8.3 },
  { b: '#107', mins: 7.9 },
  { b: '#108', mins: 8.4 },
]
</script>

<template>
  <Story title="Build times" description="Mean ± 2σ limits auto-compute; the spike turns red.">
    <ControlChart :data="builds" x-field="b" y-field="mins" height="300" />
  </Story>

  <Story title="Fixed spec limits" description="Override with contractual UCL/LCL.">
    <ControlChart :data="builds" x-field="b" y-field="mins" :ucl="12" :lcl="6" height="300" />
  </Story>

  <Story
    title="Clearance hours"
    description="Air cargo customs clearance per AWB batch — the breach flags a documentation exception."
  >
    <ControlChart
      :data="[
        { awb: 'B1', hrs: 11.2 },
        { awb: 'B2', hrs: 13.1 },
        { awb: 'B3', hrs: 12.4 },
        { awb: 'B4', hrs: 14.0 },
        { awb: 'B5', hrs: 26.5 },
        { awb: 'B6', hrs: 12.8 },
        { awb: 'B7', hrs: 13.6 },
        { awb: 'B8', hrs: 11.9 },
      ]"
      x-field="awb"
      y-field="hrs"
      height="300"
    />
  </Story>
</template>
