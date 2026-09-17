'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const customers = [
  'Northwind',
  'Halden',
  'Verity',
  'Calder',
  'Ridgeway',
  'Ashford',
  'Brightmoor',
  'Kesteven',
  'Marlowe',
  'Thornbury',
  'Wexley',
  'Alderton',
]

export function LogoCloudGrayscale() {
  return (
    <section data-slot="logo-cloud-grayscale" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <Badge variant="secondary">Customers</Badge>
          <p className="mt-4 text-lg font-medium">Running the close at 240 companies</p>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Freight, healthcare, retail, and manufacturing · median 1,100 staff
          </p>
        </div>

        {/* Muted by default, full contrast on hover: the wall reads as texture
            until someone looks for a specific name. */}
        <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {customers.map((customer) => (
            <li key={customer} className="flex items-center justify-center">
              <span className="text-muted-foreground/60 hover:text-foreground cursor-default text-sm font-semibold tracking-[0.18em] uppercase transition-colors">
                {customer}
              </span>
            </li>
          ))}
        </ul>

        <Separator className="my-10" />

        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          <p className="text-muted-foreground text-sm">Six of the ten largest UK freight forwarders.</p>
          <Button variant="link" className="h-auto p-0 text-sm">
            Read their stories
          </Button>
        </div>
      </div>
    </section>
  )
}
