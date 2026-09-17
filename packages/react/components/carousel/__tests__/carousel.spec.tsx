import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../carousel'

describe('Carousel', () => {
  it('Carousel renders with data-slot="carousel"', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    )
    expect(container.querySelector('[data-slot="carousel"]')).toBeTruthy()
  })

  it('Carousel has data-uipkge', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    )
    expect(container.querySelector('[data-slot="carousel"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('Carousel has role="region"', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    )
    expect(container.querySelector('[data-slot="carousel"]')?.getAttribute('role')).toBe('region')
  })

  it('CarouselContent renders with data-slot="carousel-content"', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    )
    expect(container.querySelector('[data-slot="carousel-content"]')).toBeTruthy()
  })

  it('CarouselItem renders with data-slot="carousel-item"', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    )
    expect(container.querySelector('[data-slot="carousel-item"]')).toBeTruthy()
  })

  it('Carousel renders all slides', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
      </Carousel>,
    )
    expect(container.querySelectorAll('[data-slot="carousel-item"]').length).toBe(3)
  })

  it('CarouselPrevious renders a button', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
      </Carousel>,
    )
    const prev = container.querySelector('[aria-label="Previous slide"]')
    expect(prev).toBeTruthy()
    expect(prev?.tagName.toLowerCase()).toBe('button')
  })

  it('CarouselNext renders a button', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselNext />
      </Carousel>,
    )
    const next = container.querySelector('[aria-label="Next slide"]')
    expect(next).toBeTruthy()
    expect(next?.tagName.toLowerCase()).toBe('button')
  })

  it('Carousel applies orientation', () => {
    const { container } = render(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    )
    expect(container.querySelector('[data-slot="carousel-content"]')?.getAttribute('aria-orientation')).toBe('vertical')
  })

  it('CarouselItem has role="group"', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    )
    expect(container.querySelector('[data-slot="carousel-item"]')?.getAttribute('role')).toBe('group')
  })

  it('CarouselPrevious has aria-label', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
      </Carousel>,
    )
    expect(container.querySelector('[aria-label="Previous slide"]')).toBeTruthy()
  })

  it('CarouselNext has aria-label', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselNext />
      </Carousel>,
    )
    expect(container.querySelector('[aria-label="Next slide"]')).toBeTruthy()
  })
})
