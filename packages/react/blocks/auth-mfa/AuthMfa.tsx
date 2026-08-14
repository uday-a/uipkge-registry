'use client'

import * as React from 'react'
import { ShieldCheck, RotateCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PinInput, PinInputGroup, PinInputSlot } from '@/components/ui/pin-input'

export interface AuthMfaProps {
  title?: string
  description?: string
  continueHref?: string
  recoveryHref?: string
  demoCode?: string
  onVerify?: (code: string) => void
  onResend?: () => void
  onContinue?: () => void
}

export function AuthMfa({
  title = 'Two-step verification',
  description = 'Enter the 6-digit code from your authenticator app.',
  continueHref = '/',
  recoveryHref = '#',
  demoCode = '123456',
  onVerify,
  onResend,
  onContinue,
}: AuthMfaProps) {
  const [code, setCode] = React.useState('')
  const [verifying, setVerifying] = React.useState(false)
  const [verified, setVerified] = React.useState(false)
  const [error, setError] = React.useState('')
  const [resendIn, setResendIn] = React.useState(0)

  React.useEffect(() => {
    if (code.length === 6) {
      setError('')
      setVerifying(true)
      onVerify?.(code)
      const timer = setTimeout(() => {
        setVerifying(false)
        if (code === demoCode) setVerified(true)
        else {
          setError(`Invalid code. Try ${demoCode} for the demo.`)
          setCode('')
        }
      }, 700)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  function startResendCooldown() {
    setResendIn(30)
    onResend?.()
    const t = setInterval(() => {
      setResendIn((prev) => {
        if (prev <= 1) {
          clearInterval(t)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div data-slot="auth-mfa" className="bg-background flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        {!verified ? (
          <>
            <CardHeader className="text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
                <ShieldCheck className="size-6" />
              </div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <PinInput value={code} onChange={setCode} disabled={verifying}>
                  <PinInputGroup>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <PinInputSlot key={i} index={i} />
                    ))}
                  </PinInputGroup>
                </PinInput>
              </div>
              {verifying && <p className="text-muted-foreground text-center text-sm">Verifying…</p>}
              {error && <p className="text-destructive text-center text-sm">{error}</p>}
              <div className="text-center">
                {resendIn === 0 ? (
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs underline-offset-4 hover:underline"
                    onClick={startResendCooldown}
                  >
                    <RotateCw className="size-3" />
                    Resend code
                  </button>
                ) : (
                  <p className="text-muted-foreground text-xs">Resend available in {resendIn}s</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-muted-foreground text-xs">
                Lost your device?{' '}
                <a href={recoveryHref} className="text-foreground underline-offset-4 hover:underline">
                  Use a recovery code
                </a>
              </p>
            </CardFooter>
          </>
        ) : (
          <CardContent className="space-y-4 pt-6 text-center">
            <div className="bg-success/10 text-success mx-auto flex size-12 items-center justify-center rounded-full">
              <ShieldCheck className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Verified</h3>
              <p className="text-muted-foreground text-sm">You&apos;re all set. Continuing to your dashboard…</p>
            </div>
            <a href={continueHref} onClick={() => onContinue?.()}>
              <Button className="w-full">Continue</Button>
            </a>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
