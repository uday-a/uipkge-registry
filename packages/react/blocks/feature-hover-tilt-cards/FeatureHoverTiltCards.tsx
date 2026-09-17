'use client'

import * as React from 'react'
import { Cpu, Eye, Layers, LayoutGrid, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface FeatureHoverTiltCardsProps {
  className?: string
}

export function FeatureHoverTiltCards({ className }: FeatureHoverTiltCardsProps) {
  const [rotations, setRotations] = React.useState<Record<number, { rx: number; ry: number }>>({
    0: { rx: 0, ry: 0 },
    1: { rx: 0, ry: 0 },
    2: { rx: 0, ry: 0 },
  })

  const [tokenScale, setTokenScale] = React.useState(100)
  const [isPulsing, setIsPulsing] = React.useState(false)
  const [activeMirror, setActiveMirror] = React.useState<'vue' | 'react'>('vue')

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -7
    const rotateY = ((x - centerX) / centerX) * 7

    setRotations((prev) => ({
      ...prev,
      [index]: { rx: rotateX, ry: rotateY },
    }))
  }

  const handleMouseLeave = (index: number) => {
    setRotations((prev) => ({
      ...prev,
      [index]: { rx: 0, ry: 0 },
    }))
  }

  const triggerSpringTest = () => {
    setIsPulsing(true)
    setTimeout(() => setIsPulsing(false), 600)
  }

  return (
    <section
      data-slot="feature-hover-tilt-cards"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <Eye className="text-primary size-3.5" />
            Tactile Physics &amp; Surface Depth
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Engineered for tactile feedback &amp; micro-interactions.
          </h2>
          <p className="text-muted-foreground text-base">
            Hover over each workbench card to experience hardware-accelerated 3D depth and live interactive physics.
          </p>
        </div>

        {/* 3D Perspective Tilt Cards Grid */}
        <div className="grid grid-cols-1 gap-6 [perspective:1200px] lg:grid-cols-3">
          {/* Card 1: Unbundled Token Inspector */}
          <div
            className="transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: `perspective(1000px) rotateX(${rotations[0].rx}deg) rotateY(${rotations[0].ry}deg)`,
            }}
            onMouseMove={(e) => handleMouseMove(e, 0)}
            onMouseLeave={() => handleMouseLeave(0)}
          >
            <Card className="border-border bg-card/95 hover:border-primary/50 relative flex h-full flex-col justify-between space-y-6 overflow-hidden rounded-2xl p-6 text-left shadow-xl transition-all hover:shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl font-mono">
                    <Layers className="size-4" />
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    Zero Bloat
                  </Badge>
                </div>

                <h3 className="text-foreground font-mono text-lg font-bold">Unbundled Code Ownership</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  AST-level code generation puts pristine component source directly in your repository.
                </p>

                {/* Interactive Token Scale Slider */}
                <div className="border-border bg-muted/30 mt-4 space-y-2 rounded-xl border p-3.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-muted-foreground">Tree-Shake Efficiency:</span>
                    <span className="font-bold text-emerald-500">{tokenScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={tokenScale}
                    onChange={(e) => setTokenScale(Number(e.target.value))}
                    className="accent-primary bg-border h-1.5 w-full cursor-pointer rounded-lg"
                  />
                  <p className="text-muted-foreground font-mono text-xs">
                    Unused variants automatically pruned at compile time.
                  </p>
                </div>
              </div>

              <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-4 font-mono text-xs">
                <span>0 dependencies added</span>
                <span className="text-primary font-semibold">&check; Pure Source</span>
              </div>
            </Card>
          </div>

          {/* Card 2: Spring Velocity Simulator */}
          <div
            className="transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: `perspective(1000px) rotateX(${rotations[1].rx}deg) rotateY(${rotations[1].ry}deg)`,
            }}
            onMouseMove={(e) => handleMouseMove(e, 1)}
            onMouseLeave={() => handleMouseLeave(1)}
          >
            <Card className="border-border bg-card/95 hover:border-primary/50 relative flex h-full flex-col justify-between space-y-6 overflow-hidden rounded-2xl p-6 text-left shadow-xl transition-all hover:shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 font-mono text-amber-500">
                    <Zap className="size-4" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-amber-500/20 bg-amber-500/10 font-mono text-xs text-amber-500"
                  >
                    Fluid Motion
                  </Badge>
                </div>

                <h3 className="text-foreground font-mono text-lg font-bold">Spring Physics Engine</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Calibrated cubic-bezier curves for tactile, zero-overshoot micro-interactions.
                </p>

                {/* Interactive Spring Trigger Box */}
                <div className="border-border bg-muted/30 mt-4 space-y-3 rounded-xl border p-3.5 text-center">
                  <div
                    className={cn(
                      'bg-primary text-primary-foreground mx-auto flex size-12 items-center justify-center rounded-2xl font-mono text-sm font-bold shadow-md transition-all duration-300',
                      isPulsing ? 'scale-125 rotate-12 bg-emerald-500 ring-4 ring-emerald-500/30' : 'scale-100',
                    )}
                  >
                    <Cpu className="size-5" />
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-full font-mono text-xs"
                    onClick={triggerSpringTest}
                  >
                    Trigger Spring Impulse
                  </Button>
                </div>
              </div>

              <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-4 font-mono text-xs">
                <span>Duration: 180ms</span>
                <span className="font-semibold text-emerald-500">&check; 60fps Native</span>
              </div>
            </Card>
          </div>

          {/* Card 3: Dual-Framework Mirror Comparator */}
          <div
            className="transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: `perspective(1000px) rotateX(${rotations[2].rx}deg) rotateY(${rotations[2].ry}deg)`,
            }}
            onMouseMove={(e) => handleMouseMove(e, 2)}
            onMouseLeave={() => handleMouseLeave(2)}
          >
            <Card className="border-border bg-card/95 hover:border-primary/50 relative flex h-full flex-col justify-between space-y-6 overflow-hidden rounded-2xl p-6 text-left shadow-xl transition-all hover:shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 font-mono text-blue-500">
                    <LayoutGrid className="size-4" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-blue-500/20 bg-blue-500/10 font-mono text-xs text-blue-500"
                  >
                    1:1 Parity
                  </Badge>
                </div>

                <h3 className="text-foreground font-mono text-lg font-bold">Dual-Framework Compiler</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Identical DOM attributes, variants, and keyboard ergonomics across Vue 3.5 &amp; React 19.
                </p>

                {/* Interactive Framework Switcher */}
                <div className="border-border bg-muted/30 mt-4 space-y-2 rounded-xl border p-3 font-mono text-xs">
                  <div className="bg-background border-border flex items-center gap-1 rounded-lg border p-1">
                    <button
                      type="button"
                      className={cn(
                        'flex-1 rounded py-1 text-center transition-all',
                        activeMirror === 'vue'
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'text-muted-foreground',
                      )}
                      onClick={() => setActiveMirror('vue')}
                    >
                      Vue 3.5 SFC
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'flex-1 rounded py-1 text-center transition-all',
                        activeMirror === 'react'
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'text-muted-foreground',
                      )}
                      onClick={() => setActiveMirror('react')}
                    >
                      React 19 JSX
                    </button>
                  </div>
                  <p className="text-muted-foreground pt-1 text-xs">
                    {activeMirror === 'vue' ? '<script setup lang="ts"> + Reka UI' : "'use client' + Radix UI"}
                  </p>
                </div>
              </div>

              <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-4 font-mono text-xs">
                <span>AST Verified</span>
                <span className="text-primary font-semibold">&check; 100% Match</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
export default FeatureHoverTiltCards
