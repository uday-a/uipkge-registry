'use client'

import * as React from 'react'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  FileCode,
  Flame,
  Inbox,
  Layers,
  Lock,
  Mail,
  Monitor,
  Palette,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface EmailTemplatePreviewerProps {
  className?: string
}

type ViewportMode = 'desktop' | 'mobile' | 'raw'
type ClientOption = 'all' | 'gmail' | 'apple' | 'outlook'

export function EmailTemplatePreviewer({ className }: EmailTemplatePreviewerProps) {
  const [viewport, setViewport] = React.useState<ViewportMode>('desktop')
  const [subject, setSubject] = React.useState('🚀 Introducing UIPKGE 2.0: The unbundled UI registry')
  const [previewText, setPreviewText] = React.useState(
    'Explore 300+ production components with zero npm dependencies. Native Vue 3 & React code.',
  )
  const senderName = 'UIPKGE Team'
  const senderEmail = 'updates@uipkge.dev'
  const recipientEmail = 'subscriber@example.com'

  // Test email dialog state
  const [isTestModalOpen, setIsTestModalOpen] = React.useState(false)
  const [testTargetEmail, setTestTargetEmail] = React.useState('alex.developer@company.com')
  const [selectedClient, setSelectedClient] = React.useState<ClientOption>('all')
  const [isSendingTest, setIsSendingTest] = React.useState(false)
  const [testSentSuccess, setTestSentSuccess] = React.useState(false)

  // Export copy feedback
  const [isCopied, setIsCopied] = React.useState(false)

  const subjectCharCount = subject.length
  const preheaderCharCount = previewText.length

  const emojiCount = React.useMemo(() => {
    const matches = subject.match(/\p{Extended_Pictographic}/gu)
    return matches ? matches.length : 0
  }, [subject])

  const subjectStatus = React.useMemo(() => {
    if (subjectCharCount >= 30 && subjectCharCount <= 60) {
      return { label: 'Optimal length', variant: 'success' as const }
    }
    if (subjectCharCount < 30) {
      return { label: 'Short subject', variant: 'info' as const }
    }
    return { label: 'Long subject (may truncate)', variant: 'warning' as const }
  }, [subjectCharCount])

  const rawHtmlOutput = React.useMemo(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject.replace(/"/g, '&quot;')}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin:0; padding:0; background-color:#09090b; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#fafafa; }
    table { border-collapse:collapse; }
    .email-container { max-width:600px; margin:0 auto; background-color:#18181b; border:1px solid #27272a; border-radius:12px; overflow:hidden; }
    .cta-btn { display:inline-block; background-color:#ffffff; color:#09090b; font-weight:600; padding:12px 28px; border-radius:8px; text-decoration:none; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#09090b; color:#fafafa;">
  <!-- Preheader text snippet -->
  <div style="display:none; max-height:0px; overflow:hidden; font-size:1px; line-height:1px; color:#fff; opacity:0;">
    ${previewText.replace(/"/g, '&quot;')}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#09090b;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#18181b; border:1px solid #27272a; border-radius:12px; overflow:hidden;">
          <!-- Header Logo Banner -->
          <tr>
            <td style="padding:24px 32px; border-bottom:1px solid #27272a;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" style="font-weight:700; font-size:18px; color:#ffffff; letter-spacing:-0.02em;">
                    ⚡ UIPKGE
                  </td>
                  <td align="right" style="font-size:12px; color:#a1a1aa;">
                    Changelog #24
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td style="padding:36px 32px 20px 32px;">
              <span style="display:inline-block; padding:4px 10px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; background-color:rgba(255,255,255,0.08); color:#a1a1aa; border-radius:9999px; margin-bottom:16px;">
                Major Release
              </span>
              <h1 style="margin:0 0 16px 0; font-size:26px; font-weight:700; line-height:1.25; color:#ffffff; letter-spacing:-0.03em;">
                Ship polished UIs in minutes
              </h1>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#a1a1aa;">
                We completely rebuilt the registry engine. Zero npm dependencies, 100% code ownership, and full native support for Vue 3 and React with modern OKLCH tokens.
              </p>
            </td>
          </tr>

          <!-- Code Snippet Card -->
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#09090b; border:1px solid #27272a; border-radius:8px;">
                <tr>
                  <td style="padding:10px 16px; border-bottom:1px solid #27272a; font-family:monospace; font-size:11px; color:#71717a;">
                    Terminal &bull; Quick Install
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 16px; font-family:monospace; font-size:13px; color:#38bdf8;">
                    npx shadcn-vue add @uipkge/button
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary CTA Button -->
          <tr>
            <td align="center" style="padding:12px 32px 32px 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius:8px; background-color:#ffffff;">
                    <a href="https://uipkge.dev" target="_blank" style="font-size:14px; font-weight:600; color:#09090b; text-decoration:none; padding:12px 32px; display:inline-block; border-radius:8px;">
                      Explore Components &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Highlights List -->
          <tr>
            <td style="padding:24px 32px; border-top:1px solid #27272a; background-color:rgba(255,255,255,0.02);">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding:8px 0;">
                    <strong style="color:#ffffff; font-size:14px;">⚡ Zero Dependency Footprint:</strong>
                    <span style="color:#a1a1aa; font-size:14px;"> Components live directly in your code.</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <strong style="color:#ffffff; font-size:14px;">🎨 OKLCH Dark Mode Tokens:</strong>
                    <span style="color:#a1a1aa; font-size:14px;"> Fluid WCAG AA contrast calibrated for all themes.</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <strong style="color:#ffffff; font-size:14px;">🧩 Dual-Framework Registry:</strong>
                    <span style="color:#a1a1aa; font-size:14px;"> Full TypeScript parity for Vue 3 and React.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 32px; border-top:1px solid #27272a; text-align:center;">
              <p style="margin:0 0 10px 0; font-size:12px; color:#71717a;">
                UIPKGE Inc. &bull; 548 Market St, Suite 29314, San Francisco, CA 94104
              </p>
              <p style="margin:0; font-size:12px; color:#71717a;">
                <a href="https://uipkge.dev" style="color:#a1a1aa; text-decoration:underline;">Docs</a> &bull;
                <a href="https://github.com/uipkge" style="color:#a1a1aa; text-decoration:underline;">GitHub</a> &bull;
                <a href="#unsubscribe" style="color:#a1a1aa; text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  }, [subject, previewText])

  const copyHtmlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rawHtmlOutput)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy HTML: ', err)
    }
  }

  const handleSendTest = () => {
    if (!testTargetEmail) return
    setIsSendingTest(true)
    setTestSentSuccess(false)

    setTimeout(() => {
      setIsSendingTest(false)
      setTestSentSuccess(true)
      setTimeout(() => {
        setTestSentSuccess(false)
        setIsTestModalOpen(false)
      }, 2000)
    }, 700)
  }

  return (
    <div data-slot="email-template-previewer" className={cn('w-full space-y-6', className)}>
      {/* Top Toolbar Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold tracking-tight">Marketing Email Designer</CardTitle>
                <Badge variant="outline" className="text-muted-foreground gap-1 border-dashed">
                  <Sparkles className="text-primary size-3" />
                  Resend Engine
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Live viewport rendering, deliverability telemetry, and RFC-compliant HTML generator.
              </CardDescription>
            </div>

            {/* Viewport Switcher & Primary Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Viewport Switcher */}
              <div className="bg-muted/80 border-border inline-flex max-w-full items-center overflow-x-auto rounded-lg border p-1 shadow-xs">
                <Button
                  type="button"
                  size="xs"
                  variant={viewport === 'desktop' ? 'default' : 'ghost'}
                  className="gap-1.5 text-xs font-medium"
                  onClick={() => setViewport('desktop')}
                >
                  <Monitor className="size-3.5" />
                  <span>Desktop 600px</span>
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant={viewport === 'mobile' ? 'default' : 'ghost'}
                  className="gap-1.5 text-xs font-medium"
                  onClick={() => setViewport('mobile')}
                >
                  <Smartphone className="size-3.5" />
                  <span>Mobile 375px</span>
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant={viewport === 'raw' ? 'default' : 'ghost'}
                  className="gap-1.5 text-xs font-medium"
                  onClick={() => setViewport('raw')}
                >
                  <Code2 className="size-3.5" />
                  <span>Raw HTML</span>
                </Button>
              </div>

              {/* Send Test Dialog Modal */}
              <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Send className="text-primary size-3.5" />
                    <span>Send Test Email</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                      <Mail className="text-primary size-4" />
                      Dispatch Test Preview
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      Send a live test message to your inbox to inspect rendering across email clients.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground text-xs font-medium">Recipient Address</label>
                      <Input
                        value={testTargetEmail}
                        onChange={(e) => setTestTargetEmail(e.target.value)}
                        type="email"
                        placeholder="you@company.com"
                        className="text-xs"
                        disabled={isSendingTest}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-muted-foreground text-xs font-medium">Target Preview Profile</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          size="xs"
                          variant={selectedClient === 'all' ? 'default' : 'outline'}
                          className="justify-start text-xs"
                          onClick={() => setSelectedClient('all')}
                        >
                          🌐 All Clients
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant={selectedClient === 'gmail' ? 'default' : 'outline'}
                          className="justify-start text-xs"
                          onClick={() => setSelectedClient('gmail')}
                        >
                          ✉️ Gmail (Web)
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant={selectedClient === 'apple' ? 'default' : 'outline'}
                          className="justify-start text-xs"
                          onClick={() => setSelectedClient('apple')}
                        >
                          🍏 Apple Mail (iOS)
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant={selectedClient === 'outlook' ? 'default' : 'outline'}
                          className="justify-start text-xs"
                          onClick={() => setSelectedClient('outlook')}
                        >
                          💼 Outlook 365
                        </Button>
                      </div>
                    </div>

                    {testSentSuccess && (
                      <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span>Test email dispatched to {testTargetEmail}!</span>
                      </div>
                    )}
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isSendingTest}
                      onClick={() => setIsTestModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" className="gap-1.5" disabled={isSendingTest} onClick={handleSendTest}>
                      <Send className="size-3.5" />
                      <span>{isSendingTest ? 'Sending...' : 'Send Test'}</span>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Export HTML Button */}
              <Button variant="default" size="sm" className="gap-1.5 text-xs" onClick={copyHtmlToClipboard}>
                {isCopied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{isCopied ? 'Copied HTML!' : 'Export HTML'}</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        {/* Subject & Preheader Inputs with Character & Emoji Analyzers */}
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Subject Line Section */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-foreground font-medium">Subject Line</label>
                <div className="flex items-center gap-1.5">
                  <Badge variant={subjectStatus.variant} className="h-5 px-1.5 text-xs font-normal">
                    {subjectCharCount}/60 chars
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground h-5 gap-1 px-1.5 text-xs font-normal">
                    <Flame className="size-3 text-amber-500" />
                    <span>{emojiCount} emoji</span>
                  </Badge>
                </div>
              </div>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-xs"
                placeholder="Enter campaign subject line..."
              />
            </div>

            {/* Preheader Section */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-foreground font-medium">Preview Text / Preheader</label>
                <Badge variant="secondary" className="text-muted-foreground h-5 px-1.5 text-xs font-normal">
                  {preheaderCharCount}/90 chars
                </Badge>
              </div>
              <Input
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="text-xs"
                placeholder="Secondary snippet shown in mail list..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2-Column Preview Workspace */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Email Canvas Container */}
        <div className="flex flex-col items-center lg:col-span-8">
          <div className="border-border bg-muted/30 relative flex min-h-[720px] w-full flex-col items-center justify-start overflow-hidden rounded-xl border p-4 sm:p-6">
            {/* RAW HTML VIEW */}
            {viewport === 'raw' ? (
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="text-muted-foreground size-4" />
                    <span className="text-foreground font-mono text-xs font-semibold">template.compiled.html</span>
                    <Badge variant="secondary" className="h-4.5 text-xs">
                      14.2 KB
                    </Badge>
                  </div>
                  <Button variant="outline" size="xs" className="gap-1 text-xs" onClick={copyHtmlToClipboard}>
                    {isCopied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy Source'}</span>
                  </Button>
                </div>
                <pre className="border-border bg-muted/70 text-foreground max-h-[640px] overflow-auto rounded-lg border p-4 font-mono text-xs leading-relaxed">
                  <code>{rawHtmlOutput}</code>
                </pre>
              </div>
            ) : (
              /* DESKTOP / MOBILE EMAIL PREVIEW CANVAS */
              <div
                className={cn(
                  'w-full transition-[max-width] duration-300 ease-in-out',
                  viewport === 'desktop' ? 'max-w-[600px]' : 'max-w-[375px]',
                )}
              >
                {/* Email Window Envelope Frame */}
                <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
                  {/* Window Chrome Bar */}
                  <div className="border-border bg-muted/50 flex items-center justify-between border-b px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full bg-red-500/80" />
                      <div className="size-2.5 rounded-full bg-amber-500/80" />
                      <div className="size-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                      <Inbox className="size-3" />
                      <span>UIPKGE Inbox Preview · {viewport === 'desktop' ? '600px' : '375px'}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border text-muted-foreground h-4.5 gap-1 px-1.5 text-xs font-normal"
                    >
                      <Lock className="size-2.5 text-emerald-500" />
                      TLS 1.3
                    </Badge>
                  </div>

                  {/* Envelope Metadata Readout */}
                  <div className="border-border bg-card/60 space-y-2 border-b p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full font-bold">
                          U
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground font-semibold">{senderName}</span>
                            <span className="text-muted-foreground">&lt;{senderEmail}&gt;</span>
                          </div>
                          <div className="text-muted-foreground text-xs">To: {recipientEmail}</div>
                        </div>
                      </div>
                      <span className="text-muted-foreground text-xs">Aug 21, 2026, 10:00 AM</span>
                    </div>

                    <div className="pt-1">
                      <div className="text-foreground text-sm font-semibold tracking-tight">{subject}</div>
                      <div className="text-muted-foreground line-clamp-1 text-xs">{previewText}</div>
                    </div>
                  </div>

                  {/* Rendered Email Body */}
                  <div className="bg-card space-y-6 p-6 sm:p-8">
                    {/* Header Logo Banner */}
                    <div className="border-border flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                          <Zap className="size-3.5 fill-current" />
                        </div>
                        <span className="text-foreground text-sm font-bold tracking-tight">UIPKGE</span>
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium">
                        Changelog #24
                      </Badge>
                    </div>

                    {/* Hero Section */}
                    <div className="space-y-3">
                      <Badge
                        variant="outline"
                        className="text-primary border-primary/30 text-xs font-semibold tracking-wider uppercase"
                      >
                        Major Release
                      </Badge>
                      <h1 className="text-foreground text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                        Ship polished UIs in minutes
                      </h1>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        We completely rebuilt the registry engine. Zero npm dependencies, 100% code ownership, and full
                        native support for Vue 3 and React with modern OKLCH tokens.
                      </p>
                    </div>

                    {/* Featured Screenshot / Product Mock Card */}
                    <div className="border-border bg-muted/40 overflow-hidden rounded-lg border">
                      <div className="border-border bg-muted/60 flex items-center justify-between gap-2 border-b px-3.5 py-2">
                        <div className="text-muted-foreground flex min-w-0 items-center gap-1.5 font-mono text-xs">
                          <Terminal className="text-primary size-3 shrink-0" />
                          <span className="truncate">components/ui/button.tsx</span>
                        </div>
                        <span className="shrink-0 font-mono text-xs font-medium text-emerald-500">TypeScript</span>
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="border-border bg-background text-muted-foreground rounded-md border p-2.5 font-mono text-xs">
                          <span className="text-primary font-semibold">$</span> npx shadcn add @uipkge/button
                        </div>

                        {/* Mini UI Preview inside email */}
                        <div className="bg-card border-border flex flex-wrap items-center justify-center gap-2 rounded-md border p-3">
                          <Button size="xs" variant="default">
                            Primary
                          </Button>
                          <Button size="xs" variant="secondary">
                            Secondary
                          </Button>
                          <Button size="xs" variant="outline">
                            Outline
                          </Button>
                          <Button size="xs" variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Primary CTA Button */}
                    <div className="flex flex-col items-center justify-center space-y-2 pt-2 text-center">
                      <Button size="lg" className="w-full px-8 font-semibold shadow-xs sm:w-auto">
                        <span>Explore Components</span>
                        <ArrowRight className="size-4" />
                      </Button>
                      <p className="text-muted-foreground text-xs">
                        Free & open source · MIT License · 300+ Primitives & Blocks
                      </p>
                    </div>

                    <Separator />

                    {/* 3 Highlight Bullet Points with Icons */}
                    <div className="space-y-3.5">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                          <Zap className="size-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-foreground text-xs font-semibold">Zero Dependency Footprint</h4>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            Every component lives directly in your codebase. No semver conflicts or registry lock-in.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                          <Palette className="size-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-foreground text-xs font-semibold">OKLCH Dark Mode Tokens</h4>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            Calibrated light & dark surfaces with verified WCAG AA contrast and fluid spring physics.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                          <Layers className="size-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-foreground text-xs font-semibold">Dual-Framework Registry</h4>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            First-class TypeScript support for both Vue 3 (Reka UI) and React (Radix UI).
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Email Footer */}
                    <div className="text-muted-foreground space-y-3 pt-2 text-center text-xs">
                      <div className="flex flex-wrap items-center justify-center gap-3 font-medium">
                        <span className="hover:text-foreground cursor-pointer transition-colors">Documentation</span>
                        <span>·</span>
                        <span className="hover:text-foreground cursor-pointer transition-colors">GitHub</span>
                        <span>·</span>
                        <span className="hover:text-foreground cursor-pointer transition-colors">Discord</span>
                        <span>·</span>
                        <span className="hover:text-foreground cursor-pointer transition-colors">Preferences</span>
                      </div>
                      <p className="text-xs">UIPKGE Inc. · 548 Market St, Suite 29314, San Francisco, CA 94104</p>
                      <p className="text-xs">
                        You received this email because you subscribed to UIPKGE updates.{' '}
                        <span className="hover:text-foreground cursor-pointer underline">Unsubscribe anytime</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quality & Deliverability Inspector (w-72 / col-span-4) */}
        <div className="space-y-4 lg:col-span-4">
          {/* Card 1: Spam Score Analyzer */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold tracking-tight">Spam Score Analyzer</CardTitle>
                <ShieldCheck className="size-4 text-emerald-500" />
              </div>
              <CardDescription className="text-xs">
                Predictive inbox delivery rating based on content heuristics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {/* Score Meter Display */}
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                  <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">0.4</span>
                  <span className="text-muted-foreground text-xs font-medium">/ 10.0 scale</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  <span>Excellent inbox probability</span>
                </div>
                {/* Gauge Meter Bar */}
                <div className="bg-muted mt-2.5 h-1.5 w-full overflow-hidden rounded-full">
                  <div className="h-full w-[96%] rounded-full bg-emerald-500" />
                </div>
              </div>

              {/* Checklist checks */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-500" />
                    Spam trigger words
                  </span>
                  <span className="text-foreground font-medium">0 detected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-500" />
                    Text-to-image ratio
                  </span>
                  <span className="text-foreground font-medium">92% text (Safe)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-500" />
                    RFC 8058 Unsubscribe
                  </span>
                  <span className="text-foreground font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-500" />
                    Valid HTTPS links
                  </span>
                  <span className="text-foreground font-medium">6 links checked</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Domain Authentication Badges */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold tracking-tight">Domain Authentication</CardTitle>
              <CardDescription className="text-xs">Security headers verified against DNS records.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">SPF Record</span>
                <Badge variant="success" className="h-5 px-2 text-xs">
                  Pass
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">DKIM Signature</span>
                <Badge variant="success" className="h-5 px-2 text-xs">
                  Pass (2048-bit)
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">DMARC Policy</span>
                <Badge variant="success" className="h-5 px-2 text-xs">
                  Pass (p=reject)
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">TLS Handshake</span>
                <Badge variant="outline" className="text-foreground h-5 px-2 text-xs">
                  TLS 1.3 Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Dark Mode & Accessibility */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold tracking-tight">Contrast & Dark Mode</CardTitle>
              <CardDescription className="text-xs">Client dark mode and WCAG contrast conformance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dark Mode Contrast</span>
                <Badge variant="success" className="h-5 px-2 text-xs">
                  100% WCAG AA
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Text Contrast Ratio</span>
                <span className="text-foreground font-semibold">14.8:1 (AAA)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plaintext Fallback</span>
                <span className="text-foreground font-medium">Auto-generated</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Email Telemetry */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold tracking-tight">Email Telemetry</CardTitle>
              <CardDescription className="text-xs">Reading metrics and payload optimization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estimated Reading Time</span>
                <span className="text-foreground font-medium">45 sec · 185 words</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payload Size</span>
                <span className="text-foreground font-medium">14.2 KB (102 KB safe)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Inline Assets</span>
                <span className="text-foreground font-medium">1 Vector SVG</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EmailTemplatePreviewer
