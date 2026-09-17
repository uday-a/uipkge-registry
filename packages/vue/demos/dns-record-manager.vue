<script setup lang="ts">
import DnsRecordManager, { type DnsRecord } from '@/components/blocks/dns-record-manager/DnsRecordManager.vue'

const enterpriseRecords: DnsRecord[] = [
  {
    id: 'ent-1',
    type: 'A',
    name: '@',
    content: '104.21.48.92',
    ttl: 'Auto',
    proxied: true,
    comment: 'Cloudflare enterprise edge gateway',
  },
  {
    id: 'ent-2',
    type: 'CNAME',
    name: 'app',
    content: 'ingress.k8s.enterprise.io',
    ttl: '300s',
    proxied: true,
    comment: 'Production Kubernetes ingress cluster',
  },
  {
    id: 'ent-3',
    type: 'CNAME',
    name: 'assets',
    content: 'enterprise-assets.s3-cdn.net',
    ttl: 'Auto',
    proxied: true,
    comment: 'Global static assets bucket CDN',
  },
  {
    id: 'ent-4',
    type: 'MX',
    name: '@',
    content: 'smtp.enterprise.io',
    ttl: '3600s',
    proxied: false,
    priority: 5,
    comment: 'Primary corporate mail exchange',
  },
  {
    id: 'ent-5',
    type: 'TXT',
    name: '@',
    content: 'v=spf1 ip4:104.21.48.92 -all',
    ttl: '3600s',
    proxied: false,
    comment: 'Strict SPF authentication policy',
  },
  {
    id: 'ent-6',
    type: 'TXT',
    name: 'k1._domainkey',
    content: 'k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0...',
    ttl: '3600s',
    proxied: false,
    comment: 'DKIM 2048-bit cryptographic signature key',
  },
  {
    id: 'ent-7',
    type: 'CAA',
    name: '@',
    content: '0 issue "digicert.com"',
    ttl: 'Auto',
    proxied: false,
    comment: 'Enterprise EV SSL provider restriction',
  },
]

const emailRecords: DnsRecord[] = [
  {
    id: 'em-1',
    type: 'MX',
    name: 'mail',
    content: 'inbound.postmarkapp.com',
    ttl: '3600s',
    proxied: false,
    priority: 10,
    comment: 'Postmark transactional inbound',
  },
  {
    id: 'em-2',
    type: 'TXT',
    name: '202608pm._domainkey',
    content: 'k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...',
    ttl: '3600s',
    proxied: false,
    comment: 'DKIM signing key 1',
  },
  {
    id: 'em-3',
    type: 'TXT',
    name: '_dmarc',
    content: 'v=DMARC1; p=reject; rua=mailto:dmarc-reports@uipkge.dev; pct=100',
    ttl: '3600s',
    proxied: false,
    comment: 'Strict DMARC rejection policy with aggregate telemetry',
  },
  {
    id: 'em-4',
    type: 'TXT',
    name: '@',
    content: 'v=spf1 include:spf.postmarkapp.com ~all',
    ttl: '3600s',
    proxied: false,
    comment: 'Outbound relay authorization',
  },
]
</script>

<template>
  <Story
    title="Default"
    description="Cloudflare/Vercel style DNS records management table with 6 DNS record types, nameserver inspector, and proxy controls."
  >
    <DnsRecordManager />
  </Story>

  <Story
    title="Add Record Form Opened"
    description="The add record drawer / form pre-opened for entering new DNS configuration."
  >
    <DnsRecordManager :initial-add-open="true" />
  </Story>

  <Story
    title="Enterprise Domain & Custom Nameservers"
    description="Managing DNS routing for enterprise.io with production Kubernetes ingress, DKIM keys, and DigiCert CAA."
  >
    <DnsRecordManager
      domain="enterprise.io"
      :nameservers="['ns1.enterprise.cloudflare.com', 'ns2.enterprise.cloudflare.com']"
      :initial-records="enterpriseRecords"
    />
  </Story>

  <Story
    title="Email Deliverability & Security Records"
    description="MX exchangers, DKIM 2048-bit signature tags, SPF relay rules, and strict DMARC rejection policy."
  >
    <DnsRecordManager domain="mail.uipkge.dev" :initial-records="emailRecords" />
  </Story>

  <Story
    title="DNSSEC Inactive"
    description="Status badge warning when DNSSEC validation is not enabled on the registrar."
  >
    <DnsRecordManager :dnssec-enabled="false" />
  </Story>

  <Story title="Empty State" description="Clean empty state when a newly delegated domain has no records yet.">
    <DnsRecordManager :initial-records="[]" />
  </Story>
</template>
