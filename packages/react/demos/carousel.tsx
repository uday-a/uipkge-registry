import Story from '../../components/story/Story'
import { Card, CardContent } from '@react-registry/card'
import {
  Carousel,
  CarouselContent,
  CarouselFooter,
  CarouselHeader,
  CarouselIndicators,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@react-registry/carousel'
import { Quote, Star } from 'lucide-react'

const slides = [
  { id: 1, color: 'bg-rose-100 dark:bg-rose-950/40', label: 'Mountains' },
  { id: 2, color: 'bg-sky-100 dark:bg-sky-950/40', label: 'Ocean' },
  { id: 3, color: 'bg-emerald-100 dark:bg-emerald-950/40', label: 'Forest' },
  { id: 4, color: 'bg-amber-100 dark:bg-amber-950/40', label: 'Desert' },
  { id: 5, color: 'bg-violet-100 dark:bg-violet-950/40', label: 'Aurora' },
]

const testimonials = [
  { quote: 'Shipped our dashboard in two days flat.', author: 'Lena · Acme' },
  { quote: 'Cleanest registry I have used. Period.', author: 'Marcus · Northwind' },
  { quote: 'Tokens, blocks, components — all sane defaults.', author: 'Priya · Globex' },
]

export default function CarouselDemo() {
  return (
    <>
      <Story title="Default" description="Five-slide horizontal carousel with previous and next controls.">
        <Carousel className="max-w-md">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, i) => (
              <CarouselItem key={i}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-bold">{i + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Story>

      <Story title="Vertical orientation" description="Stacks slides top-to-bottom with controls on the vertical axis.">
        <Carousel orientation="vertical" className="h-[280px] max-w-xs">
          <CarouselContent className="h-[280px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <CarouselItem key={i}>
                <Card className="h-[260px]">
                  <CardContent className="flex h-full items-center justify-center p-6">
                    <span className="text-3xl font-bold">Slide {i + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Story>

      <Story title="With loop" description="Wraps from the last slide back to the first when navigating past the end.">
        <Carousel opts={{ loop: true }} className="max-w-md">
          <CarouselContent>
            {Array.from({ length: 4 }).map((_, i) => (
              <CarouselItem key={i}>
                <Card>
                  <CardContent className="flex aspect-[16/9] items-center justify-center p-6">
                    <span className="text-2xl font-semibold">Loop · Slide {i + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Story>

      <Story
        title="With indicators"
        description="Dot navigation rendered in the footer keeps the active slide visible at a glance."
      >
        <Carousel className="max-w-md">
          <CarouselContent>
            {slides.map((s) => (
              <CarouselItem key={s.id}>
                <div className={['flex aspect-[16/9] items-center justify-center rounded-lg', s.color].join(' ')}>
                  <span className="text-2xl font-semibold tracking-tight">{s.label}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselFooter className="justify-center">
            <CarouselIndicators />
          </CarouselFooter>
        </Carousel>
      </Story>

      <Story
        title="Header and footer"
        description="Caption layout with a titled header and grouped controls in the footer."
      >
        <Carousel className="max-w-lg">
          <CarouselHeader>
            <div>
              <p className="text-sm font-semibold">What people say</p>
              <p className="text-muted-foreground text-xs">Recent testimonials</p>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-amber-500 text-amber-500" />
              ))}
            </div>
          </CarouselHeader>
          <CarouselContent>
            {testimonials.map((t, i) => (
              <CarouselItem key={i}>
                <Card>
                  <CardContent className="space-y-3 p-6">
                    <Quote className="text-primary/60 size-5" />
                    <p className="text-sm leading-relaxed">{t.quote}</p>
                    <p className="text-muted-foreground text-xs">{t.author}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselFooter>
            <CarouselIndicators />
            <div className="flex gap-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </CarouselFooter>
        </Carousel>
      </Story>

      <Story
        title="Image cards"
        description="Image-based slide content with overlay caption inside each carousel item."
      >
        <Carousel opts={{ loop: true }} className="max-w-md">
          <CarouselContent>
            {slides.map((s) => (
              <CarouselItem key={s.id}>
                <div className="relative overflow-hidden rounded-lg">
                  <div className={['flex aspect-[4/3] items-end p-4', s.color].join(' ')}>
                    <div>
                      <p className="text-xs font-medium tracking-wider uppercase opacity-70">Landscape</p>
                      <p className="text-lg font-semibold">{s.label}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselFooter className="justify-center">
            <CarouselIndicators />
          </CarouselFooter>
        </Carousel>
      </Story>
    </>
  )
}
