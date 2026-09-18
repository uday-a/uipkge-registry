import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { VerticalTabs, VerticalTabsList, VerticalTabsTrigger, VerticalTabsContent } from '../index'

describe('VerticalTabs', () => {
  it('renders root with data-slot="vertical-tabs"', () => {
    const { container } = render(
      <VerticalTabs defaultValue="tab1">
        <VerticalTabsList>
          <VerticalTabsTrigger value="tab1">Tab 1</VerticalTabsTrigger>
          <VerticalTabsTrigger value="tab2">Tab 2</VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="tab1">Content 1</VerticalTabsContent>
        <VerticalTabsContent value="tab2">Content 2</VerticalTabsContent>
      </VerticalTabs>,
    )
    expect(container.querySelector('[data-slot="vertical-tabs"]')).toBeTruthy()
  })

  it('has data-uipkge on root', () => {
    const { container } = render(
      <VerticalTabs defaultValue="tab1">
        <VerticalTabsList>
          <VerticalTabsTrigger value="tab1">Tab 1</VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="tab1">Content 1</VerticalTabsContent>
      </VerticalTabs>,
    )
    expect(container.querySelector('[data-slot="vertical-tabs"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('applies data-orientation="vertical" on root', () => {
    const { container } = render(
      <VerticalTabs defaultValue="tab1">
        <VerticalTabsList>
          <VerticalTabsTrigger value="tab1">Tab 1</VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="tab1">Content 1</VerticalTabsContent>
      </VerticalTabs>,
    )
    expect(container.querySelector('[data-slot="vertical-tabs"]')?.getAttribute('data-orientation')).toBe('vertical')
  })

  it('VerticalTabsList renders with data-slot="vertical-tabs-list"', () => {
    const { container } = render(
      <VerticalTabs defaultValue="tab1">
        <VerticalTabsList>
          <VerticalTabsTrigger value="tab1">Tab 1</VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="tab1">Content 1</VerticalTabsContent>
      </VerticalTabs>,
    )
    expect(container.querySelector('[data-slot="vertical-tabs-list"]')).toBeTruthy()
  })

  it('VerticalTabsList has data-uipkge', () => {
    const { container } = render(
      <VerticalTabs defaultValue="tab1">
        <VerticalTabsList>
          <VerticalTabsTrigger value="tab1">Tab 1</VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="tab1">Content 1</VerticalTabsContent>
      </VerticalTabs>,
    )
    expect(container.querySelector('[data-slot="vertical-tabs-list"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('VerticalTabsTrigger renders with data-slot="vertical-tabs-trigger"', () => {
    const { container } = render(
      <VerticalTabs defaultValue="tab1">
        <VerticalTabsList>
          <VerticalTabsTrigger value="tab1">Tab 1</VerticalTabsTrigger>
          <VerticalTabsTrigger value="tab2">Tab 2</VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="tab1">Content 1</VerticalTabsContent>
        <VerticalTabsContent value="tab2">Content 2</VerticalTabsContent>
      </VerticalTabs>,
    )
    expect(container.querySelectorAll('[data-slot="vertical-tabs-trigger"]').length).toBe(2)
  })

  it('VerticalTabsContent renders with data-slot="vertical-tabs-content"', () => {
    const { container } = render(
      <VerticalTabs defaultValue="tab1">
        <VerticalTabsList>
          <VerticalTabsTrigger value="tab1">Tab 1</VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="tab1">Content 1</VerticalTabsContent>
      </VerticalTabs>,
    )
    expect(container.querySelector('[data-slot="vertical-tabs-content"]')).toBeTruthy()
  })

  it('active trigger has data-state="active"', () => {
    const { container } = render(
      <VerticalTabs defaultValue="tab1">
        <VerticalTabsList>
          <VerticalTabsTrigger value="tab1">Tab 1</VerticalTabsTrigger>
          <VerticalTabsTrigger value="tab2">Tab 2</VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="tab1">Content 1</VerticalTabsContent>
        <VerticalTabsContent value="tab2">Content 2</VerticalTabsContent>
      </VerticalTabs>,
    )
    const triggers = container.querySelectorAll('[data-slot="vertical-tabs-trigger"]')
    expect(triggers[0].getAttribute('data-state')).toBe('active')
  })

  it('renders active content text', () => {
    const { container } = render(
      <VerticalTabs defaultValue="tab1">
        <VerticalTabsList>
          <VerticalTabsTrigger value="tab1">Tab 1</VerticalTabsTrigger>
        </VerticalTabsList>
        <VerticalTabsContent value="tab1">Content 1</VerticalTabsContent>
      </VerticalTabs>,
    )
    expect(container.querySelector('[data-slot="vertical-tabs-content"]')?.textContent).toContain('Content 1')
  })
})
