<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@/components/ui/label'
import { MaskedInput } from '@/components/ui/masked-input'
const phone = ref('')
const date = ref('')
const ssn = ref('')
const card = ref('')
const custom = ref('')
const rawOnly = ref('')
const otp = ref('')
</script>

<template>
  <Story title="Phone" description="US phone format: (###) ###-####">
    <div class="max-w-sm">
      <Label>Phone Number</Label>
      <MaskedInput v-model="phone" mask="(###) ###-####" class="mt-1.5" />
      <p class="text-muted-foreground mt-1 text-xs">
        Value: <code class="text-foreground">{{ phone || '—' }}</code>
      </p>
    </div>
  </Story>

  <Story title="Date" description="Date format: ##/##/####">
    <div class="max-w-sm">
      <Label>Date of Birth</Label>
      <MaskedInput v-model="date" mask="##/##/####" placeholder-char="0" class="mt-1.5" />
      <p class="text-muted-foreground mt-1 text-xs">
        Value: <code class="text-foreground">{{ date || '—' }}</code>
      </p>
    </div>
  </Story>

  <Story title="SSN" description="Social Security format: ###-##-####">
    <div class="max-w-sm">
      <Label>SSN</Label>
      <MaskedInput v-model="ssn" mask="###-##-####" class="mt-1.5" />
      <p class="text-muted-foreground mt-1 text-xs">
        Value: <code class="text-foreground">{{ ssn || '—' }}</code>
      </p>
    </div>
  </Story>

  <Story title="Credit Card" description="Card format: #### #### #### ####">
    <div class="max-w-sm">
      <Label>Credit Card</Label>
      <MaskedInput v-model="card" mask="#### #### #### ####" class="mt-1.5" />
      <p class="text-muted-foreground mt-1 text-xs">
        Value: <code class="text-foreground">{{ card || '—' }}</code>
      </p>
    </div>
  </Story>

  <Story title="Custom Pattern" description="License plate format: AAA-####">
    <div class="max-w-sm">
      <Label>License Plate</Label>
      <MaskedInput v-model="custom" mask="AAA-####" replacement="A" class="mt-1.5" />
      <p class="text-muted-foreground mt-1 text-xs">
        Value: <code class="text-foreground">{{ custom || '—' }}</code>
      </p>
    </div>
  </Story>

  <Story title="Without Mask Display" description="Only shows typed characters, no placeholder underscores.">
    <div class="max-w-sm">
      <Label>Phone (no mask display)</Label>
      <MaskedInput v-model="rawOnly" mask="(###) ###-####" :show-mask="false" class="mt-1.5" />
      <p class="text-muted-foreground mt-1 text-xs">
        Value: <code class="text-foreground">{{ rawOnly || '—' }}</code>
      </p>
    </div>
  </Story>

  <Story title="Completed Event" description="Emits 'complete' when the mask is fully filled.">
    <div class="max-w-sm">
      <Label>OTP Code</Label>
      <MaskedInput
        v-model="otp"
        mask="######"
        :show-mask="false"
        placeholder-char=""
        @complete="(v) => alert('Completed: ' + v)"
        class="mt-1.5"
      />
      <p class="text-muted-foreground mt-1 text-xs">Type 6 digits to trigger complete event</p>
    </div>
  </Story>

  <Story
    title="Native Placeholder"
    description="Shows standard placeholder when empty and unfocused, then guides with mask on focus."
  >
    <div class="max-w-sm">
      <Label>Phone with Placeholder</Label>
      <MaskedInput mask="(###) ###-####" placeholder="(555) 000-0000" class="mt-1.5" />
    </div>
  </Story>

  <Story
    title="Validation & Error State"
    description="Shows validation error message and invalid styling when input is incomplete or fails a rule."
  >
    <div class="max-w-sm">
      <Label>Required Phone Number</Label>
      <MaskedInput
        mask="(###) ###-####"
        model-value="(555) 12"
        invalid
        error-message="Please enter a complete 10-digit phone number."
        class="mt-1.5"
      />
    </div>
  </Story>

  <Story
    title="Strict Character Blocking"
    description="Letters are rejected in numeric slots (#) and numbers are rejected in letter slots (A)."
  >
    <div class="max-w-sm space-y-3">
      <div>
        <Label>Numeric Only (tries typing letters are blocked)</Label>
        <MaskedInput mask="###-###" placeholder="123-456" class="mt-1.5" />
      </div>
      <div>
        <Label>Letters Only (tries typing numbers are blocked)</Label>
        <MaskedInput mask="AAA-AAA" replacement="A" placeholder="ABC-DEF" class="mt-1.5" />
      </div>
    </div>
  </Story>

  <Story title="Disabled & Readonly" description="Non-interactive states.">
    <div class="max-w-sm space-y-2">
      <MaskedInput mask="(###) ###-####" model-value="(555) 123-4567" disabled />
      <MaskedInput mask="(###) ###-####" model-value="(555) 999-8888" readonly />
    </div>
  </Story>
</template>
