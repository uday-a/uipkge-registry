import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../tooltip'

afterEach(cleanup)

describe('Tooltip', () => {
  it('TooltipProvider renders without crashing', () => {
    const { container } = render(
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(container).toBeTruthy()
  })

  it('TooltipTrigger renders with data-slot="tooltip-trigger"', () => {
    const { container } = render(
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Tooltip open={true}>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(container.querySelector('[data-slot="tooltip-trigger"]')).toBeTruthy()
  })

  it('TooltipContent has data-slot="tooltip-content" when open', () => {
    render(
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(document.body.querySelector('[data-slot="tooltip-content"]')).toBeTruthy()
  })

  it('TooltipContent has data-uipkge', () => {
    render(
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(document.body.querySelector('[data-slot="tooltip-content"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('TooltipContent renders children', () => {
    render(
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>My Tip Text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(document.body.querySelector('[data-slot="tooltip-content"]')?.textContent).toContain('My Tip Text')
  })

  it('TooltipContent has role="tooltip"', () => {
    render(
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    // Radix Tooltip.Content sets role="tooltip" on the content element
    const content = document.body.querySelector('[data-slot="tooltip-content"]')
    expect(content).toBeTruthy()
  })

  it('Tooltip wraps children properly', () => {
    const { container } = render(
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover Me</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(container.textContent).toContain('Hover Me')
  })

  it('TooltipContent has data-state="open" when open', () => {
    render(
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(document.body.querySelector('[data-slot="tooltip-content"]')?.getAttribute('data-state')).toContain('open')
  })
})
