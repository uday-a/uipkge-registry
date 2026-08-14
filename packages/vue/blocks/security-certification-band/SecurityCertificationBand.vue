<script setup lang="ts">
import { ref } from 'vue'
import { ShieldCheck } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

// Issuing body and audit date are what make a certification claim checkable;
// a bare logo row is decoration.
const certifications = [
  { name: 'SOC 2 Type II', body: 'Prescient Assurance', audited: 'Mar 2026' },
  { name: 'ISO 27001', body: 'BSI Group', audited: 'Jan 2026' },
  { name: 'GDPR', body: 'Self-attested · DPA available', audited: 'Ongoing' },
  { name: 'HIPAA', body: 'Third-party assessed', audited: 'Nov 2025' },
]

const region = ref('eu')
</script>

<template>
  <section data-slot="security-certification-band" class="border-border bg-muted/40 border-y">
    <div class="mx-auto max-w-6xl px-6 py-8">
      <div class="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div class="flex items-center gap-2">
          <ShieldCheck class="text-muted-foreground size-4" aria-hidden="true" />
          <span class="text-sm font-medium">Audited, not asserted</span>
        </div>

        <Separator orientation="vertical" class="hidden h-8 sm:block" />

        <dl class="flex min-w-0 flex-1 flex-wrap gap-x-8 gap-y-3">
          <div v-for="certification in certifications" :key="certification.name">
            <dt class="text-sm font-semibold">{{ certification.name }}</dt>
            <dd class="text-muted-foreground text-xs">{{ certification.body }} · {{ certification.audited }}</dd>
          </div>
        </dl>

        <div class="flex items-center gap-2">
          <Select v-model="region">
            <SelectTrigger class="h-8 w-44 text-xs" aria-label="Data residency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eu">EU residency</SelectItem>
              <SelectItem value="us">US residency</SelectItem>
              <SelectItem value="au">AU residency</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">Trust centre</Button>
        </div>
      </div>
    </div>
  </section>
</template>
