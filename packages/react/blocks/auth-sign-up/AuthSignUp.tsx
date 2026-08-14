'use client'

import * as React from 'react'
const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 016 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
  </svg>
)

const Chrome = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z"
    />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 010-4.2V7.06H2.18a11 11 0 000 9.88l3.66-2.84z" />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 002.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
    />
  </svg>
)
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

type OauthProvider = 'github' | 'google'

export interface AuthSignUpProps {
  title?: string
  description?: string
  signInHref?: string
  termsHref?: string
  privacyHref?: string
  oauthProviders?: OauthProvider[]
  onSubmit?: (payload: { name: string; email: string; password: string }) => void
  onOauth?: (provider: OauthProvider) => void
}

export function AuthSignUp({
  title = 'Create your account',
  description = 'Start your 14-day free trial. No credit card required.',
  signInHref = '/login',
  termsHref = '#',
  privacyHref = '#',
  oauthProviders = ['github', 'google'],
  onSubmit,
  onOauth,
}: AuthSignUpProps) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [accept, setAccept] = React.useState(false)

  const passwordsMatch = !confirm || password === confirm
  const canSubmit = Boolean(name && email && password && passwordsMatch && accept)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit?.({ name, email, password })
  }

  return (
    <div data-slot="auth-sign-up" className="bg-background flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input
                id="signup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                required
              />
              <p className="text-muted-foreground text-xs">8+ characters, mix of letters, numbers and symbols.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-confirm">Confirm password</Label>
              <Input
                id="signup-confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                autoComplete="new-password"
                aria-invalid={!passwordsMatch}
                required
              />
              {!passwordsMatch && <p className="text-destructive text-xs">Passwords don&apos;t match.</p>}
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="signup-accept"
                checked={accept}
                onCheckedChange={(checked) => setAccept(checked === true)}
              />
              <Label htmlFor="signup-accept" className="text-sm leading-snug font-normal">
                I agree to the{' '}
                <a href={termsHref} className="text-foreground underline-offset-4 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href={privacyHref} className="text-foreground underline-offset-4 hover:underline">
                  Privacy Policy
                </a>
                .
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={!canSubmit}>
              Create account
            </Button>
          </form>

          {oauthProviders.length > 0 && (
            <>
              <div className="my-6 flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-muted-foreground text-xs uppercase">or continue with</span>
                <Separator className="flex-1" />
              </div>
              <div className={`grid gap-2 ${oauthProviders.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {oauthProviders.includes('github') && (
                  <Button variant="outline" type="button" onClick={() => onOauth?.('github')}>
                    <Github className="mr-2 size-4" />
                    GitHub
                  </Button>
                )}
                {oauthProviders.includes('google') && (
                  <Button variant="outline" type="button" onClick={() => onOauth?.('google')}>
                    <Chrome className="mr-2 size-4" />
                    Google
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <a href={signInHref} className="text-foreground font-medium underline-offset-4 hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
