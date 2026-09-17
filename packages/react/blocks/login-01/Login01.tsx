'use client'

import * as React from 'react'
import { ArrowRight, CheckCircle2, Fingerprint, KeyRound, Lock, Mail, ShieldCheck, Sparkles, Zap } from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 016 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  )
}
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Login01Props {
  className?: string
  onSubmit?: (payload: { method: string; email: string; password?: string; domain?: string }) => void
  onForgotPassword?: () => void
  onSignUp?: () => void
  onOAuth?: (provider: 'github' | 'google') => void
}

export function Login01({ className, onSubmit, onForgotPassword, onSignUp, onOAuth }: Login01Props) {
  const [authMethod, setAuthMethod] = React.useState<'password' | 'passkey' | 'sso'>('password')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [ssoDomain, setSsoDomain] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const isEnterpriseEmail = React.useMemo(() => {
    const parts = email.split('@')
    if (parts.length < 2) return false
    const domain = parts[1].toLowerCase()
    return (
      domain &&
      !['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'].includes(domain) &&
      domain.includes('.')
    )
  }, [email])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isLoading) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onSubmit?.({
        method: authMethod,
        email,
        password,
        domain: ssoDomain,
      })
    }, 800)
  }

  return (
    <div
      data-slot="login-01"
      className={cn('bg-background grid min-h-screen w-full grid-cols-1 lg:grid-cols-12', className)}
    >
      {/* Left Hero Brand & Proof Pane (Desktop) */}
      <div className="border-border bg-muted/30 relative hidden flex-col justify-between overflow-hidden border-r p-12 lg:col-span-6 lg:flex xl:col-span-7">
        {/* Background Ambient Glow */}
        <div className="bg-primary/10 pointer-events-none absolute -top-24 -left-24 size-96 rounded-full blur-3xl" />
        <div className="bg-primary/5 pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg font-bold shadow-xs">
            <Zap className="size-5 fill-current" />
          </div>
          <span className="text-foreground text-lg font-bold tracking-tight">UIPKGE Studio</span>
        </div>

        {/* Live Code/Terminal Showcase Widget */}
        <div className="relative z-10 my-auto max-w-xl space-y-6">
          <div className="space-y-3">
            <div className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>Developer Cloud Console v4.8</span>
            </div>
            <h1 className="text-foreground text-3xl leading-tight font-bold tracking-tight xl:text-4xl">
              The dual-framework UI registry for mission-critical software.
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Own your source code without runtime dependency lock-in. Built with Tailwind CSS v4, OKLCH color spaces,
              and headless accessibility primitives.
            </p>
          </div>

          {/* Terminal Widget */}
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-lg">
            <div className="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="bg-destructive/60 size-2.5 rounded-full" />
                <span className="size-2.5 rounded-full bg-amber-500/60" />
                <span className="bg-success/60 size-2.5 rounded-full" />
                <span className="text-muted-foreground ml-2 font-mono text-xs">auth-session-init.ts</span>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                mTLS Encrypted
              </Badge>
            </div>
            <div className="bg-card/90 space-y-1 p-4 font-mono text-xs leading-relaxed">
              <p className="text-muted-foreground">// Validating SAML 2.0 / WebAuthn identity assertion</p>
              <p className="text-foreground">
                <span className="text-primary font-bold">const</span> session ={' '}
                <span className="text-primary font-bold">await</span> auth.
                <span className="text-foreground font-semibold">verifyCredentials</span>({'{'}
              </p>
              <p className="text-foreground pl-4">
                tenant: <span className="text-success">'cyberdyne-systems.internal'</span>,
              </p>
              <p className="text-foreground pl-4">
                protocols: [<span className="text-success">'webauthn-fido2'</span>,{' '}
                <span className="text-success">'saml2-okta'</span>]
              </p>
              <p className="text-foreground">{'}'});</p>
              <p className="text-success flex items-center gap-1.5 pt-1 font-medium">
                <CheckCircle2 className="size-3.5" />
                <span>✓ Cryptographic identity handshaking verified (0.8ms)</span>
              </p>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="border-border grid grid-cols-3 gap-4 border-t pt-4 text-xs">
            <div>
              <p className="text-foreground font-mono text-lg font-bold">99.999%</p>
              <p className="text-muted-foreground">Auth Uptime SLA</p>
            </div>
            <div>
              <p className="text-foreground font-mono text-lg font-bold">FIDO2</p>
              <p className="text-muted-foreground">Passkey Standard</p>
            </div>
            <div>
              <p className="text-foreground font-mono text-lg font-bold">SOC 2 Type II</p>
              <p className="text-muted-foreground">Certified Cloud</p>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground relative z-10 flex items-center justify-between text-xs">
          <span>© 2026 UIPKGE Inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Trust Center
            </a>
          </div>
        </div>
      </div>

      {/* Right Login Workbench Pane */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:col-span-6 xl:col-span-5">
        <div className="w-full max-w-md space-y-6">
          {/* Brand on mobile */}
          <div className="mb-4 flex items-center gap-2 lg:hidden">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg font-bold shadow-xs">
              <Zap className="size-4 fill-current" />
            </div>
            <span className="text-foreground font-bold tracking-tight">UIPKGE Studio</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">Sign in to console</h2>
            <p className="text-muted-foreground text-xs">Enter your credentials, passkey or company Single Sign-On.</p>
          </div>

          {/* Social / Fast Auth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              className="border-border hover:bg-muted h-10 gap-2 text-xs font-semibold"
              onClick={() => onOAuth?.('github')}
            >
              <GithubIcon className="size-4" />
              <span>GitHub</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              className="border-border hover:bg-muted h-10 gap-2 text-xs font-semibold"
              onClick={() => onOAuth?.('google')}
            >
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.32z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="bg-background text-muted-foreground absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 font-mono text-xs tracking-wider uppercase">
              Or continue with
            </span>
          </div>

          {/* Auth Method Tabs */}
          <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as any)} className="w-full">
            <TabsList className="grid h-9 w-full grid-cols-3">
              <TabsTrigger value="password" className="text-xs font-medium">
                Password
              </TabsTrigger>
              <TabsTrigger value="passkey" className="text-xs font-medium">
                Passkey
              </TabsTrigger>
              <TabsTrigger value="sso" className="text-xs font-medium">
                SAML SSO
              </TabsTrigger>
            </TabsList>

            {/* Password Tab */}
            <TabsContent value="password" className="mt-4 space-y-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <Label htmlFor="react-email-input" className="text-xs font-medium">
                    Work Email
                  </Label>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                    <Input
                      id="react-email-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="alex@company.com"
                      autoComplete="email"
                      required
                      className="h-9 pl-9 text-xs"
                    />
                  </div>
                  {/* Enterprise domain detected badge */}
                  {isEnterpriseEmail && (
                    <div className="text-primary mt-1 flex items-center gap-1.5 text-xs font-medium">
                      <ShieldCheck className="size-3.5" />
                      <span>Enterprise domain detected. Single Sign-On available.</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="react-pass-input" className="text-xs font-medium">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                      onClick={onForgotPassword}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                    <Input
                      id="react-pass-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      required
                      className="h-9 pl-9 text-xs"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-10 w-full gap-2 text-xs font-semibold shadow-xs"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="border-primary-foreground size-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                  ) : (
                    <span>Continue with Password</span>
                  )}
                  <ArrowRight className="size-3.5" />
                </Button>
              </form>
            </TabsContent>

            {/* Passkey Tab */}
            <TabsContent value="passkey" className="mt-4 space-y-4">
              <div className="border-border bg-card space-y-4 rounded-xl border p-6 text-center">
                <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-full">
                  <Fingerprint className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-foreground text-sm font-semibold">Passwordless Biometric Login</p>
                  <p className="text-muted-foreground text-xs">
                    Use Touch ID, Face ID, or a FIDO2 hardware security key for zero-friction sign in.
                  </p>
                </div>
                <Button
                  type="button"
                  className="h-10 w-full gap-2 text-xs font-semibold shadow-xs"
                  disabled={isLoading}
                  onClick={handleSubmit as any}
                >
                  <Fingerprint className="size-4" />
                  <span>{isLoading ? 'Authenticating...' : 'Sign in with Passkey'}</span>
                </Button>
              </div>
            </TabsContent>

            {/* SSO Tab */}
            <TabsContent value="sso" className="mt-4 space-y-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <Label htmlFor="react-sso-domain" className="text-xs font-medium">
                    Enterprise Domain
                  </Label>
                  <Input
                    id="react-sso-domain"
                    value={ssoDomain}
                    onChange={(e) => setSsoDomain(e.target.value)}
                    type="text"
                    placeholder="company.okta.com or domain.com"
                    required
                    className="h-9 font-mono text-xs"
                  />
                  <p className="text-muted-foreground text-xs">
                    Redirects to your corporate Identity Provider (Okta, Azure AD, Ping Identity).
                  </p>
                </div>

                <Button
                  type="submit"
                  className="h-10 w-full gap-2 text-xs font-semibold shadow-xs"
                  disabled={isLoading}
                >
                  <KeyRound className="size-3.5" />
                  <span>Continue with SAML SSO</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-muted-foreground text-center text-xs">
            Don't have a workspace account?
            <button type="button" className="text-primary ml-1 font-semibold hover:underline" onClick={onSignUp}>
              Create free trial
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
