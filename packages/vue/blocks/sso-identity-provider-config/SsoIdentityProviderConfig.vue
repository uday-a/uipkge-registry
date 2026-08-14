<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  Globe,
  KeyRound,
  Lock,
  Play,
  RotateCw,
  Save,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  UserCheck,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export type IdpPresetId = 'okta' | 'entra' | 'google' | 'custom'

interface IdpPreset {
  id: IdpPresetId
  name: string
  subtitle: string
  badge: string
  defaultSsoUrl: string
  defaultEntityId: string
  domain: string
  defaultCert: string
}

interface ClaimAttribute {
  samlAttribute: string
  mappedField: string
  sampleValue: string
}

interface Props {
  initialSsoEnabled?: boolean
  initialPreset?: IdpPresetId
  initialEnforceDomain?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialSsoEnabled: true,
  initialPreset: 'okta',
  initialEnforceDomain: true,
})

const idpPresets: IdpPreset[] = [
  {
    id: 'okta',
    name: 'Okta',
    subtitle: 'SAML 2.0 & OIDC Enterprise',
    badge: 'Popular',
    defaultSsoUrl: 'https://company.okta.com/app/sso/saml',
    defaultEntityId: 'http://www.okta.com/exk849201',
    domain: 'company.okta.com',
    defaultCert: `-----BEGIN CERTIFICATE-----
MIIDpDCCAoygAwIBAgIGAX2v5L3oMA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJV
UzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsG
A1UECgwET2t0YTEUMBIGA1UECwwLU1NPIFNlcnZpY2UxGDAWBgNVBAMMD2NvbXBhbnkub2t0
YS5jb20xIDAeBgkqhkiG9w0BCQEWEWFkbWluQG9rdGEuY29tMB4XDTI2MDgyMTE0MzAwMFoX
DTI4MTAyMTE0MzAwMFowgZIxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlh
-----END CERTIFICATE-----`,
  },
  {
    id: 'entra',
    name: 'Microsoft Entra ID',
    subtitle: 'Azure AD & Microsoft 365',
    badge: 'Enterprise',
    defaultSsoUrl: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/saml2',
    defaultEntityId: 'https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/',
    domain: 'login.microsoftonline.com',
    defaultCert: `-----BEGIN CERTIFICATE-----
MIIDBTCCAe2gAwIBAgIQJn0zJk1vVbtJpZ0R4k0D1DANBgkqhkiG9w0BAQsFADAtMSsw
KQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MB4XDTI2MDgy
MTE0MzAwMFoXDTI4MTAyMTE0MzAwMFowLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNz
Y29udHJvbC53aW5kb3dzLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
-----END CERTIFICATE-----`,
  },
  {
    id: 'google',
    name: 'Google Workspace',
    subtitle: 'Google Cloud Identity SAML',
    badge: 'SAML 2.0',
    defaultSsoUrl: 'https://accounts.google.com/o/saml2/idp?idpid=C0123abcd',
    defaultEntityId: 'https://accounts.google.com/o/saml2?idpid=C0123abcd',
    domain: 'accounts.google.com',
    defaultCert: `-----BEGIN CERTIFICATE-----
MIIDdDCCAlygAwIBAgIGAY7GZpBqMA0GCSqGSIb3DQEBCwUAMHQxCzAJBgNVBAYTAlVT
MRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MR8wHQYD
VQQKExZHb29nbGUgV29ya3NwYWNlIElBTSExMB8GA1UEAxMYR29vZ2xlIElkUCBTYW1s
IFNpZ25lcjAeFw0yNjA4MjExNDMwMDBaFw0yODEwMjExNDMwMDBaMHQxCzAJBgNVBAYT
-----END CERTIFICATE-----`,
  },
  {
    id: 'custom',
    name: 'Custom SAML 2.0',
    subtitle: 'PingFederate, OneLogin, Keycloak',
    badge: 'Universal',
    defaultSsoUrl: 'https://sso.company.com/idp/profile/SAML2/POST/SSO',
    defaultEntityId: 'https://sso.company.com/idp/shibboleth',
    domain: 'sso.company.com',
    defaultCert: `-----BEGIN CERTIFICATE-----
MIIDcDCCAligAwIBAgIJAN8FpW1mG+hBMA0GCSqGSIb3DQEBCwUAMFgxCzAJBgNVBAYT
AlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMQ8wDQYDVQQKDAZDdXN0b20xIDAeBgNVBAMM
F2N1c3RvbS5pZHAucHJvdmlkZXIubGFiMB4XDTI2MDgyMTE0MzAwMFoXDTI4MTAyMTE0
MzAwMFowWDELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExDzANBgNVBAoM
-----END CERTIFICATE-----`,
  },
]

const spAcsUrl = 'https://auth.uipkge.dev/sso/saml/callback'
const spEntityId = 'https://auth.uipkge.dev/sso/saml/metadata'
const spNameIdFormat = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
const spMetadataXmlUrl = 'https://auth.uipkge.dev/sso/saml/metadata.xml'
const spCertificatePem = `-----BEGIN CERTIFICATE-----
MIIDODCCAiCgAwIBAgIUW0Qz0K7VzN8XlP4wQ6k9J1vYgLAwDQYJKoZIhvcNAQEL
BQAwMzEXMBUGA1UEAwwNYXV0aC51aXBrZ2UuZGV2MRgwFgYDVQQKDA9VSVBLR0Ug
QXV0aCBTU08wHhcNMjYwODIxMTQzMDAwWhcNMzEwODIxMTQzMDAwWjAzMRcwFQYD
VQQDDA5hdXRoLnVpcGtnZS5kZXYxGDAWBgNVBAoMD1VJUEtHRSBBdXRoIFNTTzCC
ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL1K9sU3FvX+7nQ6m2W4j1k9
-----END CERTIFICATE-----`

const ssoEnabled = ref(props.initialSsoEnabled)
const selectedPresetId = ref<IdpPresetId>(props.initialPreset)
const enforceDomain = ref(props.initialEnforceDomain)

const currentPreset = computed(() => {
  return idpPresets.find((p) => p.id === selectedPresetId.value) ?? idpPresets[0]
})

const idpSsoUrl = ref(currentPreset.value.defaultSsoUrl)
const idpEntityId = ref(currentPreset.value.defaultEntityId)
const idpCertPem = ref(currentPreset.value.defaultCert)

const copiedKey = ref<string | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | undefined

async function copyText(text: string, key: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = null
    }, 2000)
  } catch {
    // Clipboard unavailable
  }
}

function handleSelectPreset(presetId: IdpPresetId) {
  selectedPresetId.value = presetId
  const preset = idpPresets.find((p) => p.id === presetId)
  if (preset) {
    idpSsoUrl.value = preset.defaultSsoUrl
    idpEntityId.value = preset.defaultEntityId
    idpCertPem.value = preset.defaultCert
    xmlUploadedNotice.value = false
  }
}

function downloadSpCertificate() {
  if (typeof window === 'undefined') return
  const blob = new Blob([spCertificatePem], { type: 'application/x-pem-file' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'uipkge-sp-certificate.crt'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

const isDraggingXml = ref(false)
const xmlUploadedNotice = ref(false)

function handleXmlDrop(e: DragEvent) {
  e.preventDefault()
  isDraggingXml.value = false
  simulateXmlUpload()
}

function handleXmlDragOver(e: DragEvent) {
  e.preventDefault()
  isDraggingXml.value = true
}

function handleXmlDragLeave() {
  isDraggingXml.value = false
}

function simulateXmlUpload() {
  const preset = currentPreset.value
  idpSsoUrl.value = preset.defaultSsoUrl
  idpEntityId.value = preset.defaultEntityId
  idpCertPem.value = preset.defaultCert
  xmlUploadedNotice.value = true
  setTimeout(() => {
    xmlUploadedNotice.value = false
  }, 4000)
}

const isSaving = ref(false)
const saveSuccessNotice = ref(false)

function handleSaveConfig() {
  if (isSaving.value) return
  isSaving.value = true
  setTimeout(() => {
    isSaving.value = false
    saveSuccessNotice.value = true
    setTimeout(() => {
      saveSuccessNotice.value = false
    }, 3500)
  }, 600)
}

const testModalOpen = ref(false)
const isTesting = ref(false)

function openTestModal() {
  testModalOpen.value = true
  isTesting.value = true
  setTimeout(() => {
    isTesting.value = false
  }, 500)
}

const simulatedClaims: ClaimAttribute[] = [
  { samlAttribute: 'urn:oid:0.9.2342.19200300.100.1.1', mappedField: 'nameID', sampleValue: 'alex.morgan@company.com' },
  {
    samlAttribute: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    mappedField: 'email',
    sampleValue: 'alex.morgan@company.com',
  },
  {
    samlAttribute: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
    mappedField: 'firstName',
    sampleValue: 'Alex',
  },
  {
    samlAttribute: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
    mappedField: 'lastName',
    sampleValue: 'Morgan',
  },
  {
    samlAttribute: 'http://schemas.xmlsoap.org/claims/Group',
    mappedField: 'groups',
    sampleValue: '["Engineering", "IAM-Admins", "SSO-Users"]',
  },
  {
    samlAttribute: 'urn:oasis:names:tc:SAML:2.0:assertion:SessionIndex',
    mappedField: 'sessionIndex',
    sampleValue: '_sess_8f29ab0192e47',
  },
]
</script>

<template>
  <div data-slot="sso-identity-provider-config" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Banner & Top Controls -->
    <Card class="border-border bg-card/80 shadow-xs backdrop-blur-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2.5">
              <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <KeyRound class="size-4" />
              </div>
              <CardTitle class="text-base font-semibold">Single Sign-On (SSO) & SAML 2.0 Configuration</CardTitle>
              <Badge v-if="ssoEnabled" variant="success" class="font-mono text-xs">
                <span class="bg-success mr-1.5 inline-block size-2 animate-pulse rounded-full" />
                SSO Active
              </Badge>
              <Badge v-else variant="outline" class="text-muted-foreground border-border font-mono text-xs">
                Disabled
              </Badge>
            </div>
            <CardDescription class="text-xs">
              Connect your enterprise IdP (Okta, Azure AD / Entra, Google Workspace, OneLogin) for federated SAML
              authentication.
            </CardDescription>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="border-border bg-muted/30 flex items-center gap-3 rounded-lg border px-3 py-1.5">
              <div class="text-right">
                <p class="text-foreground text-xs font-medium">SSO Status</p>
                <p class="text-muted-foreground text-xs">
                  {{ ssoEnabled ? 'Enabled for @company.com' : 'Disabled' }}
                </p>
              </div>
              <Switch v-model="ssoEnabled" aria-label="Toggle Single Sign-On" />
            </div>

            <Button
              variant="outline"
              size="sm"
              class="gap-1.5 text-xs font-medium"
              :disabled="!ssoEnabled"
              @click="openTestModal"
            >
              <Play class="size-3.5" />
              <span>Test SAML Login</span>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>

    <!-- Save Success Banner -->
    <div
      v-if="saveSuccessNotice"
      class="border-success/30 bg-success/10 text-success flex items-center justify-between rounded-lg border px-4 py-3 text-xs"
      role="status"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="size-4 shrink-0" />
        <span
          >SSO configuration saved successfully. All assertions will validate against {{ currentPreset.name }}.</span
        >
      </div>
      <button
        type="button"
        class="text-success hover:opacity-75"
        aria-label="Dismiss alert"
        @click="saveSuccessNotice = false"
      >
        <X class="size-3.5" />
      </button>
    </div>

    <!-- IdP Preset Picker Grid -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="space-y-0.5">
          <h3 class="text-foreground text-xs font-semibold tracking-tight uppercase">Identity Provider Presets</h3>
          <p class="text-muted-foreground text-xs">
            Choose your identity platform to load SAML endpoints and formatting defaults
          </p>
        </div>
        <Badge variant="outline" class="border-border font-mono text-xs"> SAML 2.0 / Web SSO </Badge>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          v-for="preset in idpPresets"
          :key="preset.id"
          type="button"
          :class="
            cn(
              'group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-150',
              'focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
              selectedPresetId === preset.id
                ? 'border-primary bg-primary/5 ring-primary shadow-xs ring-1'
                : 'border-border bg-card hover:border-primary/40 hover:bg-accent/40',
            )
          "
          @click="handleSelectPreset(preset.id)"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div
                :class="
                  cn(
                    'flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-colors',
                    selectedPresetId === preset.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary',
                  )
                "
              >
                <span v-if="preset.id === 'okta'">O</span>
                <span v-else-if="preset.id === 'entra'">⊞</span>
                <span v-else-if="preset.id === 'google'">G</span>
                <Globe v-else class="size-4" />
              </div>
              <Badge :variant="selectedPresetId === preset.id ? 'default' : 'secondary'" class="font-mono text-xs">
                {{ preset.badge }}
              </Badge>
            </div>

            <div>
              <p class="text-foreground text-sm font-semibold">{{ preset.name }}</p>
              <p class="text-muted-foreground mt-0.5 text-xs">{{ preset.subtitle }}</p>
            </div>
          </div>

          <div class="border-border/60 mt-4 flex items-center justify-between border-t pt-2 text-xs">
            <span class="text-muted-foreground max-w-[140px] truncate font-mono text-xs">{{ preset.domain }}</span>
            <span
              v-if="selectedPresetId === preset.id"
              class="text-primary flex items-center gap-1 text-xs font-medium"
            >
              <Check class="size-3" />
              <span>Active</span>
            </span>
            <span v-else class="text-muted-foreground group-hover:text-foreground text-xs">Select →</span>
          </div>
        </button>
      </div>
    </div>

    <!-- 2-Column Configuration Form -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Service Provider (SP) Credentials -->
      <div class="space-y-6 lg:col-span-6">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <ShieldCheck class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Service Provider (SP) Credentials</CardTitle>
                  <CardDescription class="text-xs">
                    Copy these values into your Identity Provider's SAML setup
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" class="font-mono text-xs">Our Endpoints</Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-0">
            <!-- ACS URL -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="sp-acs-url" class="text-foreground text-xs font-medium">
                  Assertion Consumer Service (ACS) URL
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                  @click="copyText(spAcsUrl, 'acs')"
                >
                  <Check v-if="copiedKey === 'acs'" class="text-success mr-1 size-3" />
                  <Copy v-else class="mr-1 size-3" />
                  <span>{{ copiedKey === 'acs' ? 'Copied' : 'Copy' }}</span>
                </Button>
              </div>
              <Input
                id="sp-acs-url"
                :model-value="spAcsUrl"
                readonly
                class="bg-muted/30 font-mono text-xs select-all"
              />
              <p class="text-muted-foreground text-xs">
                The callback URL where your IdP transmits HTTP-POST SAML assertion responses.
              </p>
            </div>

            <!-- Entity ID / Audience -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="sp-entity-id" class="text-foreground text-xs font-medium">
                  SP Entity ID / Audience URI
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                  @click="copyText(spEntityId, 'entity-id')"
                >
                  <Check v-if="copiedKey === 'entity-id'" class="text-success mr-1 size-3" />
                  <Copy v-else class="mr-1 size-3" />
                  <span>{{ copiedKey === 'entity-id' ? 'Copied' : 'Copy' }}</span>
                </Button>
              </div>
              <Input
                id="sp-entity-id"
                :model-value="spEntityId"
                readonly
                class="bg-muted/30 font-mono text-xs select-all"
              />
              <p class="text-muted-foreground text-xs">
                The unique audience restriction URI identifying our service to your IdP.
              </p>
            </div>

            <!-- Protocol Specifications Summary -->
            <div class="border-border bg-muted/20 space-y-2 rounded-lg border p-3">
              <p class="text-foreground text-xs font-medium">Protocol & Binding Requirements</p>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span class="text-muted-foreground block text-xs">NameID Format</span>
                  <span class="text-foreground font-mono text-xs font-medium">EmailAddress (urn:oasis:...)</span>
                </div>
                <div>
                  <span class="text-muted-foreground block text-xs">SAML Binding</span>
                  <span class="text-foreground font-mono text-xs font-medium">HTTP-POST</span>
                </div>
                <div>
                  <span class="text-muted-foreground block text-xs">Signing Algorithm</span>
                  <span class="text-foreground font-mono text-xs font-medium">RSA-SHA256</span>
                </div>
                <div>
                  <span class="text-muted-foreground block text-xs">Assertion Encryption</span>
                  <span class="text-foreground font-mono text-xs font-medium">Optional (AES-256-GCM)</span>
                </div>
              </div>
            </div>

            <Separator />

            <!-- SP Public Certificate -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-foreground text-xs font-medium"> SP X.509 Public Certificate </label>
                <div class="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                    @click="copyText(spCertificatePem, 'sp-cert')"
                  >
                    <Check v-if="copiedKey === 'sp-cert'" class="text-success mr-1 size-3" />
                    <Copy v-else class="mr-1 size-3" />
                    <span>{{ copiedKey === 'sp-cert' ? 'Copied' : 'Copy PEM' }}</span>
                  </Button>
                  <Button
                    aria-label="Download attachment"
                    variant="outline"
                    size="sm"
                    class="h-6 gap-1 px-2 text-xs"
                    @click="downloadSpCertificate"
                  >
                    <Download class="size-3" />
                    <span>Download .crt</span>
                  </Button>
                </div>
              </div>

              <pre
                class="border-border bg-muted/40 text-foreground max-h-[140px] overflow-x-auto rounded-md border p-3 font-mono text-xs leading-relaxed select-all"
              ><code>{{ spCertificatePem }}</code></pre>
              <p class="text-muted-foreground text-xs">
                Import this certificate into your IdP if assertion signing or encryption is required.
              </p>
            </div>
          </CardContent>

          <CardFooter
            class="border-border text-muted-foreground flex items-center justify-between border-t pt-3 text-xs"
          >
            <span class="flex items-center gap-1.5">
              <FileCode class="size-3.5" />
              <span>SP Metadata XML Endpoint</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              class="text-primary hover:text-primary/80 h-6 gap-1 px-2 text-xs"
              @click="copyText(spMetadataXmlUrl, 'meta-url')"
            >
              <span>{{ copiedKey === 'meta-url' ? 'Copied URL' : 'Copy metadata.xml URL' }}</span>
              <ExternalLink class="size-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <!-- Right Column: Identity Provider (IdP) Metadata Form -->
      <div class="space-y-6 lg:col-span-6">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <Lock class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Identity Provider (IdP) Metadata</CardTitle>
                  <CardDescription class="text-xs">
                    Configure SAML endpoints and credentials provided by {{ currentPreset.name }}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" class="font-mono text-xs">{{ currentPreset.name }}</Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-0">
            <!-- XML Upload Dropzone -->
            <div
              :class="
                cn(
                  'border-border relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center transition-colors',
                  isDraggingXml
                    ? 'border-primary bg-primary/10'
                    : 'bg-muted/20 hover:border-primary/50 hover:bg-muted/40',
                )
              "
              @dragover="handleXmlDragOver"
              @dragleave="handleXmlDragLeave"
              @drop="handleXmlDrop"
              @click="simulateXmlUpload"
            >
              <div class="bg-primary/10 text-primary mb-2 grid size-9 place-items-center rounded-full">
                <UploadCloud class="size-4" />
              </div>
              <p class="text-foreground text-xs font-semibold">
                Drag & drop IdP <span class="font-mono">metadata.xml</span> to auto-fill
              </p>
              <p class="text-muted-foreground mt-0.5 text-xs">
                Or click here to simulate parsing your Identity Provider metadata file
              </p>
            </div>

            <!-- XML Notice -->
            <div
              v-if="xmlUploadedNotice"
              class="border-success/30 bg-success/10 text-success flex items-center gap-2 rounded-lg border p-2.5 text-xs"
            >
              <CheckCircle2 class="size-4 shrink-0" />
              <span>Parsed SSO URL, Entity ID, and X.509 Certificate from metadata XML.</span>
            </div>

            <!-- IdP SSO URL -->
            <div class="space-y-1.5">
              <label for="idp-sso-url" class="text-foreground text-xs font-medium">
                IdP Single Sign-On (SSO) URL
              </label>
              <Input
                id="idp-sso-url"
                v-model="idpSsoUrl"
                placeholder="https://company.okta.com/app/sso/saml"
                class="font-mono text-xs"
              />
              <p class="text-muted-foreground text-xs">
                The HTTP-POST endpoint at your IdP where users are redirected for authentication.
              </p>
            </div>

            <!-- IdP Entity ID / Issuer -->
            <div class="space-y-1.5">
              <label for="idp-entity-id" class="text-foreground text-xs font-medium">
                IdP Entity ID / Issuer URI
              </label>
              <Input
                id="idp-entity-id"
                v-model="idpEntityId"
                placeholder="http://www.okta.com/exk849201"
                class="font-mono text-xs"
              />
              <p class="text-muted-foreground text-xs">
                The unique issuer string provided in your IdP metadata document.
              </p>
            </div>

            <!-- X.509 Certificate PEM Textarea -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="idp-cert-pem" class="text-foreground text-xs font-medium">
                  IdP X.509 Signing Certificate (PEM)
                </label>
                <Badge variant="outline" class="border-success/40 text-success font-mono text-xs">
                  Valid (Expires Oct 2028)
                </Badge>
              </div>
              <Textarea
                id="idp-cert-pem"
                v-model="idpCertPem"
                :rows="5"
                no-resize
                class="border-border/70 font-mono text-xs leading-relaxed"
                placeholder="-----BEGIN CERTIFICATE-----..."
              />
              <p class="text-muted-foreground text-xs">
                Public X.509 certificate used by our SP to verify the cryptographic signature on SAML assertions.
              </p>
            </div>

            <Separator />

            <!-- Domain Enforcement Switch -->
            <div class="border-border bg-muted/20 flex items-start justify-between gap-3 rounded-lg border p-3">
              <div class="space-y-0.5">
                <div class="flex items-center gap-1.5">
                  <ShieldAlert class="text-primary size-4" />
                  <p class="text-foreground text-xs font-semibold">Enforce SSO for all domain emails</p>
                </div>
                <p class="text-muted-foreground text-xs">
                  Require all users with <span class="text-foreground font-mono font-medium">@company.com</span> email
                  addresses to log in via SSO. Password logins will be blocked.
                </p>
              </div>
              <Switch v-model="enforceDomain" class="mt-1" aria-label="Enforce SSO for domain" />
            </div>
          </CardContent>

          <CardFooter class="border-border flex flex-wrap items-center justify-between gap-2 border-t pt-4">
            <Button
              variant="ghost"
              size="sm"
              class="text-muted-foreground hover:text-foreground text-xs"
              @click="handleSelectPreset(selectedPresetId)"
            >
              Reset to Defaults
            </Button>
            <Button
              size="sm"
              class="gap-1.5 text-xs font-medium shadow-xs"
              :disabled="isSaving || !idpSsoUrl.trim() || !idpEntityId.trim()"
              @click="handleSaveConfig"
            >
              <RotateCw v-if="isSaving" class="size-3.5 animate-spin" />
              <Save v-else class="size-3.5" />
              <span>{{ isSaving ? 'Saving...' : 'Save SSO Configuration' }}</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>

    <!-- Test SAML Login Diagnostic Dialog -->
    <Dialog :open="testModalOpen" @update:open="testModalOpen = $event">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <UserCheck class="size-4" />
            </div>
            <div>
              <DialogTitle>SAML 2.0 Authentication Diagnostic</DialogTitle>
              <DialogDescription> Live assertion handshake simulation with {{ currentPreset.name }} </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <!-- Handshake Status Banner -->
          <div
            class="border-success/30 bg-success/10 text-success flex items-center justify-between rounded-lg border p-3 text-xs"
          >
            <div class="flex items-center gap-2">
              <CheckCircle2 class="size-4 shrink-0" />
              <div>
                <p class="font-semibold">HTTP 200 OK — SAML Handshake Validated</p>
                <p class="text-xs opacity-90">All signature envelopes matched X.509 certificate</p>
              </div>
            </div>
            <Badge variant="success" class="font-mono text-xs">Success</Badge>
          </div>

          <!-- Step Verification Checklist -->
          <div class="border-border bg-muted/20 space-y-2 rounded-lg border p-3 text-xs">
            <h4 class="text-foreground font-semibold">Verification Pipeline</h4>
            <div class="space-y-1.5">
              <div class="text-foreground flex items-center gap-2">
                <Check class="text-success size-3.5 shrink-0" />
                <span
                  >1. AuthnRequest dispatched with SP signature to
                  <code class="font-mono text-xs">{{ idpSsoUrl }}</code></span
                >
              </div>
              <div class="text-foreground flex items-center gap-2">
                <Check class="text-success size-3.5 shrink-0" />
                <span>2. SAMLResponse assertion received and verified with RSA-SHA256 signature</span>
              </div>
              <div class="text-foreground flex items-center gap-2">
                <Check class="text-success size-3.5 shrink-0" />
                <span
                  >3. AudienceRestriction matched <code class="font-mono text-xs">{{ spEntityId }}</code></span
                >
              </div>
              <div class="text-foreground flex items-center gap-2">
                <Check class="text-success size-3.5 shrink-0" />
                <span>4. Assertion timestamp valid within 300s clock-skew tolerance window</span>
              </div>
            </div>
          </div>

          <!-- Asserted Claims Table -->
          <div class="space-y-1.5">
            <h4 class="text-foreground text-xs font-semibold">Asserted Identity Claims & Attributes</h4>
            <div class="border-border bg-muted/10 overflow-hidden rounded-md border text-xs">
              <table class="w-full">
                <thead>
                  <tr class="border-border bg-muted/40 text-muted-foreground border-b text-left font-medium">
                    <th class="p-2 text-xs">Field</th>
                    <th class="p-2 text-xs">Sample Claim Value</th>
                  </tr>
                </thead>
                <tbody class="divide-border divide-y font-mono text-xs">
                  <tr v-for="claim in simulatedClaims" :key="claim.mappedField" class="hover:bg-muted/20">
                    <td class="text-primary p-2 font-semibold">{{ claim.mappedField }}</td>
                    <td class="text-foreground max-w-[240px] truncate p-2">{{ claim.sampleValue }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" @click="testModalOpen = false">Close</Button>
          <Button size="sm" class="gap-1.5" @click="openTestModal">
            <RotateCw class="size-3.5" />
            <span>Re-test Handshake</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
