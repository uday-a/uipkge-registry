<script setup lang="ts">
import ContractRedlineDiff from '@/components/blocks/contract-redline-diff/ContractRedlineDiff.vue'
import type { CommentItem } from '@/components/blocks/contract-redline-diff/ContractRedlineDiff.vue'

const enterpriseDpaComments: CommentItem[] = [
  {
    id: 'dpa-1',
    clauseId: 'clause-4-2',
    clauseTitle: 'Section 4.2 · Breach Notification & Incident Escalation',
    authorName: 'Claire Beaumont',
    authorRole: 'EU Privacy Counsel, Latham & Watkins LLP',
    authorInitials: 'CB',
    timestamp: '1 hour ago',
    commentText:
      'GDPR Article 33 mandates notice without undue delay and where feasible within 72 hours. We require vendor notification to Customer within 24 hours of confirmation.',
    proposedChange: '24 hours written notice of confirmed security incident (was 72 hours)',
    status: 'pending',
    severity: 'critical',
  },
  {
    id: 'dpa-2',
    clauseId: 'clause-8-1',
    clauseTitle: 'Section 8.1 · Regulatory Fines & Super-Cap Allocation',
    authorName: 'Jonathan Rivera',
    authorRole: 'Chief Legal Officer, Global FinTech Group',
    authorInitials: 'JR',
    timestamp: '3 hours ago',
    commentText:
      'We require uncapped liability for intentional misconduct and 3x total contract value super-cap for regulatory investigations resulting from vendor sub-processor breach.',
    proposedChange: '3.0x aggregate fee super-cap for Data Protection and Security Breaches',
    status: 'pending',
    severity: 'critical',
  },
  {
    id: 'dpa-3',
    clauseId: 'clause-12-3',
    clauseTitle: 'Section 12.3 · International Data Transfer & SCCs',
    authorName: 'Marcus Vance',
    authorRole: 'VP Legal & AGC, Acme Enterprise Corp',
    authorInitials: 'MV',
    timestamp: 'Yesterday at 16:20',
    commentText:
      'Standard Contractual Clauses (Module 2 Controller-to-Processor) must govern cross-border transfers to US servers. Mandatory EU audit inspection rights retained.',
    proposedChange: 'EU Commission Standard Contractual Clauses (2021/914) incorporated by reference',
    status: 'resolved',
    severity: 'moderate',
  },
]
</script>

<template>
  <Story
    title="Default"
    description="Ironclad and DocuSign CLM style legal contract redline diff viewer with clause additions, deletions, liability super-cap shift metrics, interactive clause navigation, and counsel comments negotiations sidebar."
  >
    <ContractRedlineDiff />
  </Story>

  <Story
    title="Enterprise Data Protection Addendum (DPA)"
    description="Cross-border GDPR compliance review highlighting expedited 24-hour incident notification windows, regulatory liability super-caps, and international transfer mechanisms."
  >
    <ContractRedlineDiff
      contract-title="Enterprise Data Protection Addendum · Redline Review v4.0 vs v3.8"
      counterparty="Global FinTech Holdings Ltd"
      counsel-firm="Latham & Watkins LLP"
      version-comparison="v4.0 (EU GDPR Mark) vs v3.8 (Executed Standard)"
      :initial-comments="enterpriseDpaComments"
    />
  </Story>
</template>
