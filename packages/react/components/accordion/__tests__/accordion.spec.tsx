import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../accordion'

describe('Accordion', () => {
  it('renders with data-slot="accordion"', () => {
    const { container } = render(
      <Accordion defaultValue="item1">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-slot="accordion"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(
      <Accordion defaultValue="item1">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-slot="accordion"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('AccordionItem renders with data-slot="accordion-item"', () => {
    const { container } = render(
      <Accordion defaultValue="item1">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-slot="accordion-item"]')).toBeTruthy()
  })

  it('AccordionTrigger renders with data-slot="accordion-trigger"', () => {
    const { container } = render(
      <Accordion defaultValue="item1">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-slot="accordion-trigger"]')).toBeTruthy()
  })

  it('AccordionContent renders with data-slot="accordion-content"', () => {
    const { container } = render(
      <Accordion defaultValue="item1">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-slot="accordion-content"]')).toBeTruthy()
  })

  it('AccordionTrigger is a button', () => {
    const { container } = render(
      <Accordion defaultValue="item1">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    const trigger = container.querySelector('[data-slot="accordion-trigger"]')
    expect(trigger?.tagName.toLowerCase()).toBe('button')
  })

  it('AccordionTrigger shows data-state="open" when open', () => {
    const { container } = render(
      <Accordion defaultValue="item1">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-slot="accordion-trigger"]')?.getAttribute('data-state')).toBe('open')
  })

  it('AccordionTrigger shows data-state="closed" when closed', () => {
    const { container } = render(
      <Accordion defaultValue="item2">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-slot="accordion-trigger"]')?.getAttribute('data-state')).toBe('closed')
  })

  it('AccordionTrigger renders chevron icon (svg)', () => {
    const { container } = render(
      <Accordion defaultValue="item1">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-slot="accordion-trigger"] svg')).toBeTruthy()
  })

  it('AccordionContent renders children when open', () => {
    const { container } = render(
      <Accordion defaultValue="item1">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-slot="accordion-content"]')?.textContent).toContain('Content 1')
  })

  it('Accordion applies data-variant attribute', () => {
    const { container } = render(
      <Accordion defaultValue="item1" variant="separated">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-slot="accordion"]')?.getAttribute('data-variant')).toBe('separated')
  })

  it('AccordionTrigger renders children', () => {
    const { container } = render(
      <Accordion defaultValue="item1">
        <AccordionItem value="item1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    expect(container.querySelector('[data-slot="accordion-trigger"]')?.textContent).toContain('Item 1')
  })
})
