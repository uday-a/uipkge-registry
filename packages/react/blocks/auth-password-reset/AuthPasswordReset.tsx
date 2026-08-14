'use client'

import * as React from 'react'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Stage = 'request' | 'sent' | 'reset' | 'done'

export interface AuthPasswordResetProps {
  signInHref?: string
  onRequest?: (email: string) => void
  onReset?: (password: string) => void
}

export function AuthPasswordReset({ signInHref = '/login', onRequest, onReset }: AuthPasswordResetProps) {
  const [stage, setStage] = React.useState<Stage>('request')

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const passwordsMatch = !confirm || password === confirm

  function submitRequest(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    onRequest?.(email)
    setStage('sent')
  }

  function submitReset(e: React.FormEvent) {
    e.preventDefault()
    if (!password || !passwordsMatch) return
    onReset?.(password)
    setStage('done')
  }

  return (
    <div data-slot="auth-password-reset" className="bg-background flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        {stage === 'request' && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Forgot password?</CardTitle>
              <CardDescription>Enter your email and we&apos;ll send you a reset link.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={submitRequest}>
                <div className="grid gap-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send reset link
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center">
              <a
                href={signInHref}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
              >
                <ArrowLeft className="size-3" />
                Back to sign in
              </a>
            </CardFooter>
          </>
        )}

        {stage === 'sent' && (
          <CardContent className="space-y-4 pt-6 text-center">
            <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-full">
              <MailCheck className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Check your inbox</h3>
              <p className="text-muted-foreground text-sm">
                We&apos;ve sent a reset link to <span className="text-foreground font-medium">{email}</span>.
              </p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setStage('reset')}>
              Open reset form (demo)
            </Button>
            <button
              className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
              onClick={() => setStage('request')}
            >
              Wrong email?
            </button>
          </CardContent>
        )}

        {stage === 'reset' && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Set new password</CardTitle>
              <CardDescription>Pick a strong password you haven&apos;t used before.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={submitReset}>
                <div className="grid gap-2">
                  <Label htmlFor="reset-pw">New password</Label>
                  <Input
                    id="reset-pw"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reset-confirm">Confirm password</Label>
                  <Input
                    id="reset-confirm"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={!passwordsMatch}
                    required
                  />
                  {!passwordsMatch && <p className="text-destructive text-xs">Passwords don&apos;t match.</p>}
                </div>
                <Button type="submit" className="w-full">
                  Reset password
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {stage === 'done' && (
          <CardContent className="space-y-4 pt-6 text-center">
            <div className="bg-success/10 text-success mx-auto flex size-12 items-center justify-center rounded-full">
              <MailCheck className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">All set</h3>
              <p className="text-muted-foreground text-sm">
                Your password has been updated. You can now sign in with the new password.
              </p>
            </div>
            <a href={signInHref}>
              <Button className="w-full">Continue to sign in</Button>
            </a>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
