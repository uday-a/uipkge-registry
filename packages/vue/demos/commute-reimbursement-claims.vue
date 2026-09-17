<script setup lang="ts">
import CommuteReimbursementClaims from '@/components/blocks/commute-reimbursement-claims/CommuteReimbursementClaims.vue'
</script>

<template>
  <Story
    title="Commute & Transit Expense Claims Portal"
    description="Monthly commuter transit pass, mileage, and EV charging expense claim reimbursement portal with IRS pre-tax allowance metrics, claim submission card with receipt dropzone, and claims history ledger."
  >
    <CommuteReimbursementClaims />
  </Story>

  <Story
    title="Custom Policy & Period"
    description="Portal with custom claim period and corporate commuter benefit policy parameters."
  >
    <CommuteReimbursementClaims
      title="Q3 Commuter & Mobility Portal"
      policy-text="Executive Commute Program · Up to $315.00/mo Transit, Parking & EV Subsidy"
      claim-period="September 2026"
    />
  </Story>
</template>
