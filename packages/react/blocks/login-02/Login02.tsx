'use client'

import * as React from 'react'
import { ShieldCheck, Sparkles, Zap } from 'lucide-react'

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 016 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
  </svg>
)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

type OauthProvider = 'github' | 'google'

export interface Login02Props {
  onSubmit?: (payload: { email: string; password: string }) => void
  onForgotPassword?: () => void
  onSignUp?: () => void
  onOauth?: (provider: OauthProvider) => void
}

export function Login02({ onSubmit, onForgotPassword, onSignUp, onOauth }: Login02Props) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit?.({ email, password })
  }

  // ----- Optional: zod validation -----
  // HTML5 `type="email"` + `required` already block obviously bad input,
  // but for typed parsing + custom rules drop in zod. Add `zod` to your
  // project, uncomment, and route `handleSubmit` through `loginSchema.parse`.
  //
  // import { z } from 'zod'
  // const loginSchema = z.object({
  //   email: z.string().email('Enter a valid email'),
  //   password: z.string().min(1, 'Password is required'),
  // })
  // function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault()
  //   const parsed = loginSchema.safeParse({ email, password })
  //   if (!parsed.success) {
  //     // surface parsed.error.flatten().fieldErrors however you want
  //     return
  //   }
  //   onSubmit?.(parsed.data)
  // }

  return (
    <div data-slot="login-02" className="grid min-h-svh lg:grid-cols-2">
      {/* Brand / marketing panel */}
      <aside
        className="border-border relative hidden flex-col justify-between overflow-hidden border-r p-12 lg:flex"
        style={{ background: 'color-mix(in oklch, var(--primary) 6%, var(--card))' }}
      >
        <div className="text-foreground relative z-[1] flex items-center gap-2.5">
          <div
            className="text-background font-display grid size-8 place-items-center rounded-md font-bold"
            style={{ background: 'var(--primary)' }}
          >
            U
          </div>
          <span className="font-display text-base font-semibold">Your Product</span>
        </div>

        <div className="relative z-[1] max-w-md">
          <p className="text-muted-foreground/80 mb-3 text-xs font-medium tracking-[0.14em] uppercase">
            Why teams switch
          </p>
          <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance">
            Ship features in{' '}
            <em className="font-display font-semibold not-italic" style={{ color: 'var(--primary)' }}>
              hours
            </em>
            , not sprints.
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            Reusable components, opinionated defaults, and a registry that keeps your team writing product code instead
            of reinventing the same UI.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Zap className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--primary)' }} />
              <span className="text-foreground">One-command install, full source ownership</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--primary)' }} />
              <span className="text-foreground">SOC 2 compliant, SSO out of the box</span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--primary)' }} />
              <span className="text-foreground">Themeable tokens, dark mode, RTL ready</span>
            </li>
          </ul>
        </div>

        <p className="text-muted-foreground/70 relative z-[1] text-xs">
          © {new Date().getFullYear()} Your Product, Inc.
        </p>
      </aside>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1.5 text-center lg:text-left">
            <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to continue to your workspace.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  onClick={() => onForgotPassword?.()}
                >
                  Forgot?
                </button>
              </div>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <span className="bg-background text-muted-foreground absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 text-xs tracking-wider uppercase">
              Or
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

          <p className="text-muted-foreground text-center text-xs">
            Don&apos;t have an account?
            <button
              type="button"
              className="text-foreground ml-1 font-medium hover:underline"
              onClick={() => onSignUp?.()}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
