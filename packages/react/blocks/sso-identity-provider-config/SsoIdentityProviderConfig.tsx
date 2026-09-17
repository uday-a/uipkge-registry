'use client'

import * as React from 'react'
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
} from 'lucide-react'
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
import { cn } from '@/lib/utils'

export type IdpPresetId = 'okta' | 'entra' | 'google' | 'custom'

export interface IdpPreset {
  id: IdpPresetId
  name: string
  subtitle: string
  badge: string
  defaultSsoUrl: string
  defaultEntityId: string
  domain: string
  defaultCert: string
}

export interface ClaimAttribute {
  samlAttribute: string
  mappedField: string
  sampleValue: string
}

export interface SsoIdentityProviderConfigProps {
  initialSsoEnabled?: boolean
  initialPreset?: IdpPresetId
  initialEnforceDomain?: boolean
  className?: string
}

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
const spMetadataXmlUrl = 'https://auth.uipkge.dev/sso/saml/metadata.xml'
const spCertificatePem = `-----BEGIN CERTIFICATE-----
MIIDODCCAiCgAwIBAgIUW0Qz0K7VzN8XlP4wQ6k9J1vYgLAwDQYJKoZIhvcNAQEL
BQAwMzEXMBUGA1UEAwwNYXV0aC51aXBrZ2UuZGV2MRgwFgYDVQQKDA9VSVBLR0Ug
QXV0aCBTU08wHhcNMjYwODIxMTQzMDAwWhcNMzEwODIxMTQzMDAwWjAzMRcwFQYD
VQQDDA5hdXRoLnVpcGtnZS5kZXYxGDAWBgNVBAoMD1VJUEtHRSBBdXRoIFNTTzCC
ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL1K9sU3FvX+7nQ6m2W4j1k9
-----END CERTIFICATE-----`

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

export function SsoIdentityProviderConfig({
  initialSsoEnabled = true,
  initialPreset = 'okta',
  initialEnforceDomain = true,
  className,
}: SsoIdentityProviderConfigProps) {
  const [ssoEnabled, setSsoEnabled] = React.useState(initialSsoEnabled)
  const [selectedPresetId, setSelectedPresetId] = React.useState<IdpPresetId>(initialPreset)
  const [enforceDomain, setEnforceDomain] = React.useState(initialEnforceDomain)

  const currentPreset = React.useMemo(() => {
    return idpPresets.find((p) => p.id === selectedPresetId) ?? idpPresets[0]
  }, [selectedPresetId])

  const [idpSsoUrl, setIdpSsoUrl] = React.useState(currentPreset.defaultSsoUrl)
  const [idpEntityId, setIdpEntityId] = React.useState(currentPreset.defaultEntityId)
  const [idpCertPem, setIdpCertPem] = React.useState(currentPreset.defaultCert)

  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const [isDraggingXml, setIsDraggingXml] = React.useState(false)
  const [xmlUploadedNotice, setXmlUploadedNotice] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveSuccessNotice, setSaveSuccessNotice] = React.useState(false)
  const [testModalOpen, setTestModalOpen] = React.useState(false)

  const copyTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const copyText = React.useCallback((text: string, key: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedKey(key)
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    copyTimerRef.current = setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev))
    }, 2000)
  }, [])

  const handleSelectPreset = React.useCallback((presetId: IdpPresetId) => {
    setSelectedPresetId(presetId)
    const preset = idpPresets.find((p) => p.id === presetId)
    if (preset) {
      setIdpSsoUrl(preset.defaultSsoUrl)
      setIdpEntityId(preset.defaultEntityId)
      setIdpCertPem(preset.defaultCert)
      setXmlUploadedNotice(false)
    }
  }, [])

  const downloadSpCertificate = React.useCallback(() => {
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
  }, [])

  const simulateXmlUpload = React.useCallback(() => {
    const preset = currentPreset
    setIdpSsoUrl(preset.defaultSsoUrl)
    setIdpEntityId(preset.defaultEntityId)
    setIdpCertPem(preset.defaultCert)
    setXmlUploadedNotice(true)
    setTimeout(() => {
      setXmlUploadedNotice(false)
    }, 4000)
  }, [currentPreset])

  const handleSaveConfig = React.useCallback(() => {
    if (isSaving) return
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccessNotice(true)
      setTimeout(() => {
        setSaveSuccessNotice(false)
      }, 3500)
    }, 600)
  }, [isSaving])

  const openTestModal = React.useCallback(() => {
    setTestModalOpen(true)
  }, [])

  return (
    <div data-slot="sso-identity-provider-config" className={cn('w-full space-y-6', className)}>
      {/* Header Banner & Top Controls */}
      <Card className="border-border bg-card/80 shadow-xs backdrop-blur-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                  <KeyRound className="size-4" />
                </div>
                <CardTitle className="text-base font-semibold">Single Sign-On (SSO) & SAML 2.0 Configuration</CardTitle>
                {ssoEnabled ? (
                  <Badge variant="success" className="font-mono text-xs">
                    <span className="bg-success mr-1.5 inline-block size-2 animate-pulse rounded-full" />
                    SSO Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground border-border font-mono text-xs">
                    Disabled
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                Connect your enterprise IdP (Okta, Azure AD / Entra, Google Workspace, OneLogin) for federated SAML
                authentication.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border px-3 py-1.5">
                <div className="text-right">
                  <p className="text-foreground text-xs font-medium">SSO Status</p>
                  <p className="text-muted-foreground text-xs">
                    {ssoEnabled ? 'Enabled for @company.com' : 'Disabled'}
                  </p>
                </div>
                <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} aria-label="Toggle Single Sign-On" />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-medium"
                disabled={!ssoEnabled}
                onClick={openTestModal}
              >
                <Play className="size-3.5" />
                <span>Test SAML Login</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Save Success Banner */}
      {saveSuccessNotice && (
        <div
          className="border-success/30 bg-success/10 text-success flex items-center justify-between rounded-lg border px-4 py-3 text-xs"
          role="status"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>
              SSO configuration saved successfully. All assertions will validate against {currentPreset.name}.
            </span>
          </div>
          <button
            type="button"
            className="text-success cursor-pointer hover:opacity-75"
            aria-label="Dismiss alert"
            onClick={() => setSaveSuccessNotice(false)}
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* IdP Preset Picker Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-foreground text-xs font-semibold tracking-tight uppercase">
              Identity Provider Presets
            </h3>
            <p className="text-muted-foreground text-xs">
              Choose your identity platform to load SAML endpoints and formatting defaults
            </p>
          </div>
          <Badge variant="outline" className="border-border font-mono text-xs">
            SAML 2.0 / Web SSO
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {idpPresets.map((preset) => {
            const isSelected = selectedPresetId === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                className={cn(
                  'group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-150',
                  'focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-primary shadow-xs ring-1'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-accent/40',
                )}
                onClick={() => handleSelectPreset(preset.id)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        'flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-colors',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary',
                      )}
                    >
                      {preset.id === 'okta' && <span>O</span>}
                      {preset.id === 'entra' && <span>⊞</span>}
                      {preset.id === 'google' && <span>G</span>}
                      {preset.id === 'custom' && <Globe className="size-4" />}
                    </div>
                    <Badge variant={isSelected ? 'default' : 'secondary'} className="font-mono text-xs">
                      {preset.badge}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-foreground text-sm font-semibold">{preset.name}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">{preset.subtitle}</p>
                  </div>
                </div>

                <div className="border-border/60 mt-4 flex items-center justify-between border-t pt-2 text-xs">
                  <span className="text-muted-foreground max-w-[140px] truncate font-mono text-xs">
                    {preset.domain}
                  </span>
                  {isSelected ? (
                    <span className="text-primary flex items-center gap-1 text-xs font-medium">
                      <Check className="size-3" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground group-hover:text-foreground text-xs">Select →</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2-Column Configuration Form */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Service Provider (SP) Credentials */}
        <div className="space-y-6 lg:col-span-6">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Service Provider (SP) Credentials</CardTitle>
                    <CardDescription className="text-xs">
                      Copy these values into your Identity Provider's SAML setup
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  Our Endpoints
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {/* ACS URL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="sp-acs-url-react" className="text-foreground text-xs font-medium">
                    Assertion Consumer Service (ACS) URL
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                    onClick={() => copyText(spAcsUrl, 'acs')}
                  >
                    {copiedKey === 'acs' ? (
                      <Check className="text-success mr-1 size-3" />
                    ) : (
                      <Copy className="mr-1 size-3" />
                    )}
                    <span>{copiedKey === 'acs' ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
                <Input
                  id="sp-acs-url-react"
                  value={spAcsUrl}
                  readOnly
                  className="bg-muted/30 font-mono text-xs select-all"
                />
                <p className="text-muted-foreground text-xs">
                  The callback URL where your IdP transmits HTTP-POST SAML assertion responses.
                </p>
              </div>

              {/* Entity ID / Audience */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="sp-entity-id-react" className="text-foreground text-xs font-medium">
                    SP Entity ID / Audience URI
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                    onClick={() => copyText(spEntityId, 'entity-id')}
                  >
                    {copiedKey === 'entity-id' ? (
                      <Check className="text-success mr-1 size-3" />
                    ) : (
                      <Copy className="mr-1 size-3" />
                    )}
                    <span>{copiedKey === 'entity-id' ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
                <Input
                  id="sp-entity-id-react"
                  value={spEntityId}
                  readOnly
                  className="bg-muted/30 font-mono text-xs select-all"
                />
                <p className="text-muted-foreground text-xs">
                  The unique audience restriction URI identifying our service to your IdP.
                </p>
              </div>

              {/* Protocol Specifications Summary */}
              <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-3">
                <p className="text-foreground text-xs font-medium">Protocol & Binding Requirements</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-xs">NameID Format</span>
                    <span className="text-foreground font-mono text-xs font-medium">EmailAddress (urn:oasis:...)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">SAML Binding</span>
                    <span className="text-foreground font-mono text-xs font-medium">HTTP-POST</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Signing Algorithm</span>
                    <span className="text-foreground font-mono text-xs font-medium">RSA-SHA256</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Assertion Encryption</span>
                    <span className="text-foreground font-mono text-xs font-medium">Optional (AES-256-GCM)</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* SP Public Certificate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-foreground text-xs font-medium">SP X.509 Public Certificate</label>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                      onClick={() => copyText(spCertificatePem, 'sp-cert')}
                    >
                      {copiedKey === 'sp-cert' ? (
                        <Check className="text-success mr-1 size-3" />
                      ) : (
                        <Copy className="mr-1 size-3" />
                      )}
                      <span>{copiedKey === 'sp-cert' ? 'Copied' : 'Copy PEM'}</span>
                    </Button>
                    <Button
                      aria-label="Download attachment"
                      variant="outline"
                      size="sm"
                      className="h-6 gap-1 px-2 text-xs"
                      onClick={downloadSpCertificate}
                    >
                      <Download className="size-3" />
                      <span>Download .crt</span>
                    </Button>
                  </div>
                </div>

                <pre className="border-border bg-muted/40 text-foreground max-h-[140px] overflow-x-auto rounded-md border p-3 font-mono text-xs leading-relaxed select-all">
                  <code>{spCertificatePem}</code>
                </pre>
                <p className="text-muted-foreground text-xs">
                  Import this certificate into your IdP if assertion signing or encryption is required.
                </p>
              </div>
            </CardContent>

            <CardFooter className="border-border text-muted-foreground flex items-center justify-between border-t pt-3 text-xs">
              <span className="flex items-center gap-1.5">
                <FileCode className="size-3.5" />
                <span>SP Metadata XML Endpoint</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80 h-6 gap-1 px-2 text-xs"
                onClick={() => copyText(spMetadataXmlUrl, 'meta-url')}
              >
                <span>{copiedKey === 'meta-url' ? 'Copied URL' : 'Copy metadata.xml URL'}</span>
                <ExternalLink className="size-3" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Identity Provider (IdP) Metadata Form */}
        <div className="space-y-6 lg:col-span-6">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                    <Lock className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Identity Provider (IdP) Metadata</CardTitle>
                    <CardDescription className="text-xs">
                      Configure SAML endpoints and credentials provided by {currentPreset.name}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  {currentPreset.name}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {/* XML Upload Dropzone */}
              <div
                className={cn(
                  'border-border relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center transition-colors',
                  isDraggingXml
                    ? 'border-primary bg-primary/10'
                    : 'bg-muted/20 hover:border-primary/50 hover:bg-muted/40',
                )}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDraggingXml(true)
                }}
                onDragLeave={() => setIsDraggingXml(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDraggingXml(false)
                  simulateXmlUpload()
                }}
                onClick={simulateXmlUpload}
              >
                <div className="bg-primary/10 text-primary mb-2 grid size-9 place-items-center rounded-full">
                  <UploadCloud className="size-4" />
                </div>
                <p className="text-foreground text-xs font-semibold">
                  Drag & drop IdP <span className="font-mono">metadata.xml</span> to auto-fill
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Or click here to simulate parsing your Identity Provider metadata file
                </p>
              </div>

              {/* XML Notice */}
              {xmlUploadedNotice && (
                <div className="border-success/30 bg-success/10 text-success flex items-center gap-2 rounded-lg border p-2.5 text-xs">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Parsed SSO URL, Entity ID, and X.509 Certificate from metadata XML.</span>
                </div>
              )}

              {/* IdP SSO URL */}
              <div className="space-y-1.5">
                <label htmlFor="idp-sso-url-react" className="text-foreground text-xs font-medium">
                  IdP Single Sign-On (SSO) URL
                </label>
                <Input
                  id="idp-sso-url-react"
                  value={idpSsoUrl}
                  onChange={(e) => setIdpSsoUrl(e.target.value)}
                  placeholder="https://company.okta.com/app/sso/saml"
                  className="font-mono text-xs"
                />
                <p className="text-muted-foreground text-xs">
                  The HTTP-POST endpoint at your IdP where users are redirected for authentication.
                </p>
              </div>

              {/* IdP Entity ID / Issuer */}
              <div className="space-y-1.5">
                <label htmlFor="idp-entity-id-react" className="text-foreground text-xs font-medium">
                  IdP Entity ID / Issuer URI
                </label>
                <Input
                  id="idp-entity-id-react"
                  value={idpEntityId}
                  onChange={(e) => setIdpEntityId(e.target.value)}
                  placeholder="http://www.okta.com/exk849201"
                  className="font-mono text-xs"
                />
                <p className="text-muted-foreground text-xs">
                  The unique issuer string provided in your IdP metadata document.
                </p>
              </div>

              {/* X.509 Certificate PEM Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="idp-cert-pem-react" className="text-foreground text-xs font-medium">
                    IdP X.509 Signing Certificate (PEM)
                  </label>
                  <Badge variant="outline" className="border-success/40 text-success font-mono text-xs">
                    Valid (Expires Oct 2028)
                  </Badge>
                </div>
                <Textarea
                  id="idp-cert-pem-react"
                  value={idpCertPem}
                  onValueChange={setIdpCertPem}
                  rows={5}
                  noResize
                  className="border-border/70 font-mono text-xs leading-relaxed"
                  placeholder="-----BEGIN CERTIFICATE-----..."
                />
                <p className="text-muted-foreground text-xs">
                  Public X.509 certificate used by our SP to verify the cryptographic signature on SAML assertions.
                </p>
              </div>

              <Separator />

              {/* Domain Enforcement Switch */}
              <div className="border-border bg-muted/20 flex items-start justify-between gap-3 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="text-primary size-4" />
                    <p className="text-foreground text-xs font-semibold">Enforce SSO for all domain emails</p>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Require all users with <span className="text-foreground font-mono font-medium">@company.com</span>{' '}
                    email addresses to log in via SSO. Password logins will be blocked.
                  </p>
                </div>
                <Switch
                  checked={enforceDomain}
                  onCheckedChange={setEnforceDomain}
                  className="mt-1"
                  aria-label="Enforce SSO for domain"
                />
              </div>
            </CardContent>

            <CardFooter className="border-border flex flex-wrap items-center justify-between gap-2 border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground text-xs"
                onClick={() => handleSelectPreset(selectedPresetId)}
              >
                Reset to Defaults
              </Button>
              <Button
                size="sm"
                className="gap-1.5 text-xs font-medium shadow-xs"
                disabled={isSaving || !idpSsoUrl.trim() || !idpEntityId.trim()}
                onClick={handleSaveConfig}
              >
                {isSaving ? <RotateCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                <span>{isSaving ? 'Saving...' : 'Save SSO Configuration'}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Test SAML Login Diagnostic Dialog */}
      <Dialog open={testModalOpen} onOpenChange={setTestModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <UserCheck className="size-4" />
              </div>
              <div>
                <DialogTitle>SAML 2.0 Authentication Diagnostic</DialogTitle>
                <DialogDescription>Live assertion handshake simulation with {currentPreset.name}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Handshake Status Banner */}
            <div className="border-success/30 bg-success/10 text-success flex items-center justify-between rounded-lg border p-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <div>
                  <p className="font-semibold">HTTP 200 OK — SAML Handshake Validated</p>
                  <p className="text-xs opacity-90">All signature envelopes matched X.509 certificate</p>
                </div>
              </div>
              <Badge variant="success" className="font-mono text-xs">
                Success
              </Badge>
            </div>

            {/* Step Verification Checklist */}
            <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-3 text-xs">
              <h4 className="text-foreground font-semibold">Verification Pipeline</h4>
              <div className="space-y-1.5">
                <div className="text-foreground flex items-center gap-2">
                  <Check className="text-success size-3.5 shrink-0" />
                  <span>
                    1. AuthnRequest dispatched with SP signature to{' '}
                    <code className="font-mono text-xs">{idpSsoUrl}</code>
                  </span>
                </div>
                <div className="text-foreground flex items-center gap-2">
                  <Check className="text-success size-3.5 shrink-0" />
                  <span>2. SAMLResponse assertion received and verified with RSA-SHA256 signature</span>
                </div>
                <div className="text-foreground flex items-center gap-2">
                  <Check className="text-success size-3.5 shrink-0" />
                  <span>
                    3. AudienceRestriction matched <code className="font-mono text-xs">{spEntityId}</code>
                  </span>
                </div>
                <div className="text-foreground flex items-center gap-2">
                  <Check className="text-success size-3.5 shrink-0" />
                  <span>4. Assertion timestamp valid within 300s clock-skew tolerance window</span>
                </div>
              </div>
            </div>

            {/* Asserted Claims Table */}
            <div className="space-y-1.5">
              <h4 className="text-foreground text-xs font-semibold">Asserted Identity Claims & Attributes</h4>
              <div className="border-border bg-muted/10 overflow-hidden rounded-md border text-xs">
                <table className="w-full">
                  <thead>
                    <tr className="border-border bg-muted/40 text-muted-foreground border-b text-left font-medium">
                      <th className="p-2 text-xs">Field</th>
                      <th className="p-2 text-xs">Sample Claim Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border divide-y font-mono text-xs">
                    {simulatedClaims.map((claim) => (
                      <tr key={claim.mappedField} className="hover:bg-muted/20">
                        <td className="text-primary p-2 font-semibold">{claim.mappedField}</td>
                        <td className="text-foreground max-w-[240px] truncate p-2">{claim.sampleValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setTestModalOpen(false)}>
              Close
            </Button>
            <Button size="sm" className="gap-1.5" onClick={openTestModal}>
              <RotateCw className="size-3.5" />
              <span>Re-test Handshake</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SsoIdentityProviderConfig
