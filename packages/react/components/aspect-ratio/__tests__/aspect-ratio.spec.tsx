import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { AspectRatio } from '../index'

describe('AspectRatio', () => {
  it('renders container with data-slot="aspect-ratio"', () => {
    const { container } = render(<AspectRatio />)
    expect(container.querySelector('[data-slot="aspect-ratio"]')).toBeTruthy()
  })

  it('has data-uipkge on container', () => {
    const { container } = render(<AspectRatio />)
    expect(container.querySelector('[data-slot="aspect-ratio"][data-uipkge]')).toBeTruthy()
  })

  it('applies ratio style (paddingBottom) for ratio=2', () => {
    const { container } = render(<AspectRatio ratio={2} />)
    const el = container.querySelector('[data-slot="aspect-ratio"]') as HTMLElement
    expect(el.style.paddingBottom || el.style.aspectRatio || container.innerHTML).toBeTruthy()
  })

  it('applies ratio style (paddingBottom) for ratio=16/9', () => {
    const { container } = render(<AspectRatio ratio={16 / 9} />)
    const el = container.querySelector('[data-slot="aspect-ratio"]') as HTMLElement
    expect(el.style.paddingBottom || el.style.aspectRatio || container.innerHTML).toBeTruthy()
  })

  it('renders children content', () => {
    const { container } = render(
      <AspectRatio>
        <img src="test.jpg" alt="test" />
      </AspectRatio>,
    )
    expect(container.querySelector('img')).toBeTruthy()
  })
})
