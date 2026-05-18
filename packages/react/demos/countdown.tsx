import { useState } from 'react'
import Story from '../../components/story/Story'
import { Countdown } from '@react-registry/countdown'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@react-registry/card'
import { Button } from '@react-registry/button'

export default function CountdownDemo() {
  const [flashSaleEnd] = useState(() => Date.now() + 3_600_000 * 5 + 42_000)
  const [auctionEnd, setAuctionEnd] = useState(() => Date.now() + 10_000)
  const [eventStart] = useState(() => Date.now() + 86_400_000 * 2 + 3_600_000 * 4 + 60_000 * 30)
  const [newYear] = useState(() => new Date(new Date().getFullYear() + 1, 0, 1).getTime())
  const [pausedTarget] = useState(() => Date.now() + 120_000)
  const [isPaused, setIsPaused] = useState(false)
  const [auctionFinished, setAuctionFinished] = useState(false)
  const [auctionTick, setAuctionTick] = useState(0)

  function resetAuction() {
    setAuctionEnd(Date.now() + 10_000)
    setAuctionFinished(false)
  }

  return (
    <>
      <Story
        title="Flash sale"
        description="A 5-hour countdown on a promotional banner — the classic e-commerce urgency pattern."
      >
        <div className="bg-primary text-primary-foreground max-w-md rounded-lg px-5 py-4">
          <p className="text-sm font-medium opacity-90">Flash sale — 40% off all plans</p>
          <Countdown
            target={flashSaleEnd}
            label="Ends in"
            className="[&_.text-foreground]:text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70 mt-2"
          />
        </div>
      </Story>

      <Story
        title="Auction ending"
        description="Seconds-only countdown that fires finish when the bidding window closes. Reset to watch it again."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Vintage camera lot</CardTitle>
            <CardDescription>Highest bid: $1,240 · 3 bidders active</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Countdown
              target={auctionEnd}
              format="SS"
              label="Bidding closes in"
              onFinish={() => setAuctionFinished(true)}
              onTick={(v) => setAuctionTick(v)}
            />
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" onClick={resetAuction}>
                Reset timer
              </Button>
              <span className="text-muted-foreground text-xs">
                {auctionFinished ? 'Auction ended!' : `Ticking… ${Math.ceil(auctionTick / 1000)}s left`}
              </span>
            </div>
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Event countdown"
        description="Full DD:HH:MM:SS display for a conference or product launch two days away."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>UIPKGE Summit 2025</CardTitle>
            <CardDescription>Doors open in 2 days, 4 hours, 30 minutes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Countdown target={eventStart} label="Starts in" />
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Format variants"
        description="DD:HH:MM:SS, HH:MM:SS, MM:SS, and SS — choose the precision your scenario needs."
      >
        <div className="grid max-w-lg gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">DD:HH:MM:SS</p>
            <Countdown target={eventStart} />
          </div>
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">HH:MM:SS</p>
            <Countdown target={eventStart} format="HH:MM:SS" />
          </div>
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">MM:SS</p>
            <Countdown target={flashSaleEnd} format="MM:SS" />
          </div>
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">SS</p>
            <Countdown target={auctionEnd} format="SS" />
          </div>
        </div>
      </Story>

      <Story
        title="Custom unit cards"
        description="Render props let you render each unit as a tile — perfect for hero countdowns and launch pages."
      >
        <Countdown
          target={eventStart}
          separator=""
          renderDays={(days) => (
            <div className="flex flex-col items-center">
              <span className="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums">
                {String(days).padStart(2, '0')}
              </span>
              <span className="text-muted-foreground text-xs tracking-wide uppercase">days</span>
            </div>
          )}
          renderHours={(hours) => (
            <div className="flex flex-col items-center">
              <span className="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums">
                {String(hours).padStart(2, '0')}
              </span>
              <span className="text-muted-foreground text-xs tracking-wide uppercase">hrs</span>
            </div>
          )}
          renderMinutes={(minutes) => (
            <div className="flex flex-col items-center">
              <span className="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums">
                {String(minutes).padStart(2, '0')}
              </span>
              <span className="text-muted-foreground text-xs tracking-wide uppercase">min</span>
            </div>
          )}
          renderSeconds={(seconds) => (
            <div className="flex flex-col items-center">
              <span className="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums">
                {String(seconds).padStart(2, '0')}
              </span>
              <span className="text-muted-foreground text-xs tracking-wide uppercase">sec</span>
            </div>
          )}
        />
      </Story>

      <Story
        title="Paused & styling"
        description="paused freezes the countdown; a custom separator and no-pad give it a distinct look."
      >
        <div className="max-w-md space-y-3">
          <Countdown target={pausedTarget} paused={isPaused} label="Paused demo" separator="—" />
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={() => setIsPaused((p) => !p)}>
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Countdown target={eventStart} pad={false} label="No leading zeros" />
          </div>
        </div>
      </Story>

      <Story title="New year" description="Countdown to January 1st of next year — a perennial landing-page fixture.">
        <Countdown target={newYear} label="New Year" />
      </Story>
    </>
  )
}
