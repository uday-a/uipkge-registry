'use client'

import * as React from 'react'
const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 016 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
  </svg>
)
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export interface Register01Props {
  onSubmit?: (payload: { name: string; email: string; password: string }) => void
  onSignIn?: () => void
  onOauth?: (provider: 'github' | 'google') => void
  onViewTerms?: () => void
  onViewPrivacy?: () => void
}

export function Register01({ onSubmit, onSignIn, onOauth, onViewTerms, onViewPrivacy }: Register01Props) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [acceptTerms, setAcceptTerms] = React.useState(false)

  const passwordsMatch = !confirmPassword || password === confirmPassword

  const canSubmit = name.length > 0 && email.length > 0 && password.length >= 8 && passwordsMatch && acceptTerms

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit?.({ name, email, password })
  }

  // ----- Optional: zod validation -----
  // The `canSubmit` flag already guards basic shape (lengths +
  // matching passwords + terms checked), but for typed parsing,
  // regex-driven password rules, or shared schema with the backend,
  // drop in zod. Add `zod` to your project and uncomment below.
  //
  // import { z } from 'zod'
  // const registerSchema = z
  //   .object({
  //     name: z.string().min(1, 'Name is required'),
  //     email: z.string().email('Enter a valid email'),
  //     password: z
  //       .string()
  //       .min(8, 'At least 8 characters')
  //       .regex(/[A-Z]/, 'One uppercase letter')
  //       .regex(/[0-9]/, 'One number'),
  //     confirmPassword: z.string(),
  //     acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
  //   })
  //   .refine((d) => d.password === d.confirmPassword, {
  //     path: ['confirmPassword'],
  //     message: "Passwords don't match",
  //   })
  // function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault()
  //   const parsed = registerSchema.safeParse({
  //     name, email, password, confirmPassword, acceptTerms,
  //   })
  //   if (!parsed.success) {
  //     // parsed.error.flatten().fieldErrors -> { email: [...], password: [...], ... }
  //     return
  //   }
  //   onSubmit?.({
  //     name: parsed.data.name,
  //     email: parsed.data.email,
  //     password: parsed.data.password,
  //   })
  // }

  return (
    <div data-slot="register-01" className="bg-muted/30 flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Free for personal projects. No credit card.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="r-name">Full name</Label>
              <Input
                id="r-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Ada Lovelace"
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-email">Email</Label>
              <Input
                id="r-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-password">Password</Label>
              <Input
                id="r-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <p className="text-muted-foreground text-xs">Minimum 8 characters.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-confirm">Confirm password</Label>
              <Input
                id="r-confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                required
              />
              {!passwordsMatch && (
                <p className="text-destructive text-xs" role="alert">
                  Passwords don't match.
                </p>
              )}
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <Checkbox
                id="r-terms"
                checked={acceptTerms}
                onCheckedChange={(value) => setAcceptTerms(value === true)}
              />
              <Label
                htmlFor="r-terms"
                className="text-muted-foreground cursor-pointer text-xs leading-relaxed font-normal"
              >
                I agree to the
                <button
                  type="button"
                  className="text-foreground mx-0.5 hover:underline"
                  onClick={() => onViewTerms?.()}
                >
                  Terms of Service
                </button>
                and
                <button
                  type="button"
                  className="text-foreground mx-0.5 hover:underline"
                  onClick={() => onViewPrivacy?.()}
                >
                  Privacy Policy
                </button>
                .
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              Create account
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <span className="bg-card text-muted-foreground absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 text-xs tracking-wider uppercase">
              Or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onOauth?.('google')}>
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
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Google
            </Button>
            <Button type="button" variant="outline" onClick={() => onOauth?.('github')}>
              <Github className="size-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-xs">
            Already have an account?
            <button
              type="button"
              className="text-foreground ml-1 font-medium hover:underline"
              onClick={() => onSignIn?.()}
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
