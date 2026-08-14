import * as React from 'react'
import { ArrowRight, Code2, Cpu, Layers, MousePointerClick, Sparkles, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface Hero3dTiltInteractiveCanvasProps {
  title?: string
  description?: string
  primaryActionLabel?: string
  secondaryActionLabel?: string
  className?: string
}

export function Hero3dTiltInteractiveCanvas({
  title = 'Fluid 3D Spatial Architecture rendered in pure CSS.',
  description = 'Experience zero-latency hardware-accelerated 3D perspective transforms with dynamic specular reflections and layered z-depth primitives.',
  primaryActionLabel = 'Explore 3D Primitives',
  secondaryActionLabel = 'Copy CSS Matrix Code',
  className,
}: Hero3dTiltInteractiveCanvasProps) {
  const cardRef = React.useRef<HTMLDivElement | null>(null)
  const [rotateX, setRotateX] = React.useState(0)
  const [rotateY, setRotateY] = React.useState(0)
  const [glareX, setGlareX] = React.useState(50)
  const [glareY, setGlareY] = React.useState(50)
  const [isHovering, setIsHovering] = React.useState(false)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Limit max rotation to +/- 14 degrees
    setRotateY(Number(((x - centerX) / (centerX / 14)).toFixed(2)))
    setRotateX(Number((-(y - centerY) / (centerY / 14)).toFixed(2)))

    setGlareX(Number(((x / rect.width) * 100).toFixed(1)))
    setGlareY(Number(((y / rect.height) * 100).toFixed(1)))
  }

  function handleMouseEnter() {
    setIsHovering(true)
  }

  function handleMouseLeave() {
    setIsHovering(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <section
      data-slot="hero-3d-tilt-interactive-canvas"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#3d-spatial"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <Layers className="text-primary size-3.5" />
            <span>Spatial 3D Design Engineering</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="lg" className="gap-2 shadow-xs">
              <span>{primaryActionLabel}</span>
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Code2 className="size-4" />
              <span>{secondaryActionLabel}</span>
            </Button>
          </div>
        </div>

        {/* 3D Perspective Stage Container */}
        <div className="mt-14 flex flex-col items-center justify-center [perspective:1200px]">
          <div
            ref={cardRef}
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: isHovering ? 'transform 100ms ease-out' : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="border-border bg-card relative w-full max-w-2xl cursor-crosshair overflow-hidden rounded-2xl border p-8 shadow-xl select-none [transform-style:preserve-3d]"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Dynamic Specular Reflection / Glare Gradient */}
            <div
              style={{
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
              }}
              className={cn(
                'pointer-events-none absolute inset-0 transition-opacity duration-300',
                isHovering ? 'opacity-100' : 'opacity-0',
              )}
            />

            {/* Layer 1: Base Grid Info */}
            <div className="border-border flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary size-4" />
                <span className="text-foreground text-sm font-bold">Spatial Component Viewport</span>
              </div>
              <Badge variant="outline" className="border-border text-muted-foreground font-mono text-xs">
                Pitch: {rotateX}&deg; &bull; Yaw: {rotateY}&deg;
              </Badge>
            </div>

            {/* Layer 2: Floating 3D Cards & Primitives (Preserve-3d + translateZ) */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Floating Badge Card 1 */}
              <div
                style={{ transform: 'translateZ(35px)' }}
                className="border-border/90 bg-muted/40 space-y-2 rounded-xl border p-4 shadow-md transition-transform"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="text-primary size-4" />
                  <span className="text-foreground text-xs font-bold">GPU Accelerated Matrix</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Zero JavaScript bundle runtime. Calculated via pure CSS 3D matrix transforms.
                </p>
              </div>

              {/* Floating Badge Card 2 */}
              <div
                style={{ transform: 'translateZ(50px)' }}
                className="border-primary/30 bg-primary/5 space-y-2 rounded-xl border p-4 shadow-lg transition-transform"
              >
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-emerald-500" />
                  <span className="text-foreground text-xs font-bold">Specular Ray Diffusion</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Dynamic light reflection calculates azimuth angles relative to mouse coordinates.
                </p>
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div
              style={{ transform: 'translateZ(25px)' }}
              className="border-border/80 bg-background/90 mt-6 flex items-center justify-between rounded-lg border p-3 text-xs"
            >
              <div className="text-muted-foreground flex items-center gap-2">
                <MousePointerClick className="text-primary size-3.5" />
                <span>Hover and move cursor to orient viewport</span>
              </div>
              <span className="text-foreground font-mono text-xs font-bold">
                {isHovering ? 'Tracking Live' : 'Hover to Orbit'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
