'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

// Stating the model beneath the number is what stops this reading as a toy.
// Every figure below is derived from the three inputs and nothing else.
const DAYS_SAVED_SHARE = 0.55
const CLOSES_PER_YEAR = 12

export function RoiCalculatorInputs() {
  const [analysts, setAnalysts] = useState([6])
  const [closeDays, setCloseDays] = useState([9])
  const [rate, setRate] = useState([520])

  const daysSaved = Math.round(closeDays[0] * DAYS_SAVED_SHARE * 10) / 10
  const annualSaving = Math.round(daysSaved * CLOSES_PER_YEAR * analysts[0] * rate[0])
  const formatted = `£${annualSaving.toLocaleString('en-GB')}`

  const inputs = [
    {
      id: 'analysts',
      label: 'People involved in close',
      value: analysts,
      set: setAnalysts,
      min: 1,
      max: 40,
      step: 1,
      display: `${analysts[0]}`,
    },
    {
      id: 'days',
      label: 'Days the close takes today',
      value: closeDays,
      set: setCloseDays,
      min: 2,
      max: 20,
      step: 1,
      display: `${closeDays[0]} days`,
    },
    {
      id: 'rate',
      label: 'Fully-loaded day rate',
      value: rate,
      set: setRate,
      min: 200,
      max: 1200,
      step: 20,
      display: `£${rate[0]}`,
    },
  ]

  return (
    <section data-slot="roi-calculator-inputs" className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Estimate</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">What the close currently costs you</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Three inputs, one arithmetic model, stated in full underneath. Adjust anything that looks wrong.
          </p>
        </div>

        <Card className="mt-10">
          <CardContent className="grid gap-8 p-6 sm:grid-cols-[1.2fr_1fr] sm:p-8">
            <div className="space-y-6">
              {inputs.map((input) => (
                <div key={input.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <label htmlFor={input.id} className="text-sm font-medium">
                      {input.label}
                    </label>
                    <span className="font-mono text-sm tabular-nums">{input.display}</span>
                  </div>
                  <Slider
                    id={input.id}
                    value={input.value}
                    onValueChange={input.set}
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    className="mt-3"
                    aria-label={input.label}
                  />
                </div>
              ))}
            </div>

            <div className="border-border bg-muted/30 flex flex-col justify-center rounded-lg border p-6 text-center">
              <p className="text-muted-foreground text-xs tracking-wide uppercase">Estimated annual saving</p>
              <p className="font-display mt-2 text-4xl font-bold tracking-tight tabular-nums">{formatted}</p>
              <p className="text-muted-foreground mt-2 text-xs">
                {daysSaved} days saved per close, {CLOSES_PER_YEAR} closes a year
              </p>
              <Button className="mt-5">
                Check it against your numbers
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>

          <Separator />

          <div className="px-6 py-4 sm:px-8">
            <p className="text-muted-foreground text-xs leading-relaxed">
              <span className="font-medium">The model. </span>
              Saving = days saved × closes per year × people × day rate, where days saved assumes{' '}
              {Math.round(DAYS_SAVED_SHARE * 100)}% of close time is reconciliation that certified definitions remove.
              That share is the median across 240 rollouts; yours will differ, and the figure is only as good as that
              assumption.
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
