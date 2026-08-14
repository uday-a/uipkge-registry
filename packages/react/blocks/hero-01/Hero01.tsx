import { ArrowRight, PlayCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Hero01() {
  return (
    <section data-slot="hero-01" className="bg-background relative overflow-hidden">
      <div className="bg-primary/10 pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              The platform your team will actually use.
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg">
              One workspace for everything your team needs. Built on shadcn-vue primitives — fast, accessible, easy to
              customise.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg">
                Start free trial
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button size="lg" variant="outline">
                <PlayCircle className="mr-2 size-4" />
                Watch demo (2 min)
              </Button>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span>★★★★★ 4.9 on G2</span>
              <span>14-day free trial</span>
              <span>No credit card required</span>
            </div>
          </div>

          <div className="relative">
            <Card className="absolute -top-4 right-0 w-56 rotate-2 shadow-lg">
              <CardContent className="space-y-1 p-4">
                <p className="text-muted-foreground text-xs uppercase">Active users</p>
                <p className="text-2xl font-semibold">1,284</p>
                <p className="text-success text-xs">+8.2% MoM</p>
              </CardContent>
            </Card>
            <Card className="absolute top-32 -left-2 w-52 -rotate-3 shadow-lg">
              <CardContent className="space-y-1 p-4">
                <p className="text-muted-foreground text-xs uppercase">Uptime</p>
                <p className="text-2xl font-semibold">100%</p>
                <p className="text-muted-foreground text-xs">12 cycles, 0 misses</p>
              </CardContent>
            </Card>
            <Card className="ml-auto w-72 shadow-xl">
              <CardHeader>
                <CardTitle className="text-base">Onboarding queue</CardTitle>
                <CardDescription>3 starting Monday</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback>LW</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Lena Wei</p>
                    <p className="text-muted-foreground text-xs">Engineering</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback>JR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Joaquín Reyes</p>
                    <p className="text-muted-foreground text-xs">Engineering</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Priya Shah</p>
                    <p className="text-muted-foreground text-xs">Engineering</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
