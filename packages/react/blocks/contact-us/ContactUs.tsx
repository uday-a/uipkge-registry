'use client'

/**
 * Contact section — two columns. Left: eyebrow, headline, lede, icon-prefixed
 * contact rows, and a live map pinned to your office (pass `accessToken` +
 * `location`; falls back to a styled placeholder without a token). Right: a
 * Card-wrapped form (name / email / company / subject / message) that swaps to
 * a success state after submit. Emits "submit" with the payload.
 */
import * as React from 'react'
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Map, MapMarker } from '@/components/ui/map'

export interface ContactUsProps {
  /** Mapbox token. Without it the map area shows a styled placeholder. */
  accessToken?: string
  /** Office [lng, lat]. */
  location?: [number, number]
  locationLabel?: string
  onSubmit?: (payload: { name: string; email: string; company: string; subject: string; message: string }) => void
}

export function ContactUs({
  accessToken = '',
  location = [-122.4194, 37.7749],
  locationLabel = 'San Francisco, CA',
  onSubmit,
}: ContactUsProps) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [subject, setSubject] = React.useState('sales')
  const [message, setMessage] = React.useState('')
  const [sent, setSent] = React.useState(false)

  const canSubmit = !!name && !!email && !!message

  function submit() {
    if (!canSubmit) return
    onSubmit?.({ name, email, company, subject, message })
    setSent(true)
  }

  return (
    <section data-slot="contact-us" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left: copy + contact rows + map */}
          <div className="space-y-6">
            <p className="text-primary text-sm font-medium tracking-widest uppercase">Contact</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Talk to our team</h2>
            <p className="text-muted-foreground max-w-md">
              Questions about pricing, onboarding, or a custom plan? Send a note and we'll get back within one business
              day.
            </p>

            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="bg-muted text-foreground flex size-9 items-center justify-center rounded-lg">
                  <Mail className="size-4" />
                </span>
                <span className="text-sm">hello@example.com</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-muted text-foreground flex size-9 items-center justify-center rounded-lg">
                  <Phone className="size-4" />
                </span>
                <span className="text-sm">+1 (555) 010-2030</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-muted text-foreground flex size-9 items-center justify-center rounded-lg">
                  <MapPin className="size-4" />
                </span>
                <span className="text-sm">{locationLabel}</span>
              </li>
            </ul>

            <div className="h-56 overflow-hidden rounded-xl border">
              {accessToken ? (
                <Map accessToken={accessToken} center={location} zoom={11} muted className="size-full">
                  <MapMarker longitude={location[0]} latitude={location[1]} anchor="bottom">
                    <svg viewBox="0 0 24 24" width="26" height="34" className="text-primary drop-shadow">
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                        fill="currentColor"
                        stroke="#fff"
                        strokeWidth="1.5"
                      />
                      <circle cx="12" cy="9" r="2.6" fill="#fff" />
                    </svg>
                  </MapMarker>
                </Map>
              ) : (
                <div className="bg-muted text-muted-foreground flex size-full items-center justify-center gap-2 text-sm">
                  <MapPin className="size-4" /> {locationLabel}
                </div>
              )}
            </div>
          </div>

          {/* Right: form */}
          <Card>
            {!sent ? (
              <>
                <CardHeader>
                  <CardTitle>Send a message</CardTitle>
                  <CardDescription>We'll route it to the right person.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="cu-name">Name</Label>
                      <Input
                        id="cu-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Cooper"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cu-email">Email</Label>
                      <Input
                        id="cu-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cu-company">Company</Label>
                    <Input
                      id="cu-company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cu-message">Message</Label>
                    <Textarea
                      id="cu-message"
                      value={message}
                      onValueChange={setMessage}
                      rows={4}
                      placeholder="How can we help?"
                    />
                  </div>
                  <Button className="w-full" disabled={!canSubmit} onClick={submit}>
                    <Send className="size-4" /> Send message
                  </Button>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                <span className="bg-success/10 text-success flex size-12 items-center justify-center rounded-full">
                  <CheckCircle2 className="size-6" />
                </span>
                <p className="text-lg font-semibold">Message sent</p>
                <p className="text-muted-foreground max-w-xs text-sm">
                  Thanks, {name} — we'll reply to {email} within one business day.
                </p>
                <Button variant="outline" onClick={() => setSent(false)}>
                  Send another
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}
