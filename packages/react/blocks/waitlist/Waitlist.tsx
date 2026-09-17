'use client'

import { useState } from 'react'
import { Check, Layers, Link2, ShieldCheck, Sparkles, Zap, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const benefits: { icon: LucideIcon; title: string; copy: string }[] = [
  { icon: Zap, title: 'Ships in minutes', copy: 'Drop-in blocks and primitives, not boilerplate to rewrite.' },
  {
    icon: ShieldCheck,
    title: 'Own the code',
    copy: 'Every file is copied into your repo. Edit it freely, no lock-in.',
  },
  { icon: Layers, title: 'Dual framework', copy: 'Vue and React mirrors stay in lockstep across every component.' },
]

export function Waitlist() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [position] = useState(214)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.includes('@')) return
    setSubmitted(true)
  }

  return (
    <section data-slot="waitlist" className="bg-background grid min-h-screen lg:grid-cols-2">
      <div className="bg-muted/40 relative flex items-center px-6 py-16 lg:border-r lg:px-16">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="bg-primary/10 -top-32 left-1/3 size-[420px] rounded-full blur-3xl" />
        </div>

        <div className="max-w-lg">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-lg shadow-sm">
              <Sparkles className="size-5" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Northwind</span>
          </div>

          <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">Be first in line when we launch</h1>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg">
            We&rsquo;re onboarding a small cohort of teams each week. Join the waitlist and we&rsquo;ll save your spot.
          </p>

          <ul className="mt-10 space-y-6">
            {benefits.map((benefit) => (
              <li key={benefit.title} className="flex gap-4">
                <div className="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-lg">
                  <benefit.icon className="size-4.5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{benefit.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{benefit.copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <Card className="w-full max-w-md">
          {!submitted ? (
            <>
              <CardHeader>
                <CardTitle>Join the waitlist</CardTitle>
                <CardDescription>
                  Early access rolls out weekly. No spam &mdash; one email when it&rsquo;s your turn.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full">
                    Request access
                  </Button>
                </form>
                <p className="text-muted-foreground mt-4 text-xs">2,300+ teams already in line</p>
              </CardContent>
            </>
          ) : (
            <CardContent className="pt-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto grid size-12 place-items-center rounded-full">
                <Check className="size-6" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight">You&rsquo;re #{position} in line</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                We&rsquo;ll email {email} as soon as your spot opens up.
              </p>
              <div className="bg-muted/50 mt-6 flex items-start gap-3 rounded-lg border p-4 text-left">
                <Link2 className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <p className="text-muted-foreground text-xs">
                  Want to skip the queue? Share your invite link after launch &mdash; every friend who signs up moves
                  you up 5 spots.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </section>
  )
}
