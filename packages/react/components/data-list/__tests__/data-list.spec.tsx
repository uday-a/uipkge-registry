import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DataList, DataListItem } from '../index'

describe('DataList', () => {
  it('renders a container with data-slot="data-list"', () => {
    const { container } = render(<DataList />)
    expect(container.querySelector('[data-slot="data-list"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<DataList />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders items via children', () => {
    const { container } = render(
      <DataList>
        <DataListItem>
          <span>Label</span>
          <span>Value</span>
        </DataListItem>
      </DataList>,
    )
    expect(container.textContent).toContain('Label')
    expect(container.textContent).toContain('Value')
  })
})

describe('DataListItem', () => {
  it('renders with data-slot="data-list-item"', () => {
    const { container } = render(<DataListItem />)
    expect(container.querySelector('[data-slot="data-list-item"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<DataListItem />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders key-value pair content via children', () => {
    const { container } = render(
      <DataListItem>
        <span>Key</span>
        <span>Val</span>
      </DataListItem>,
    )
    expect(container.textContent).toContain('Key')
    expect(container.textContent).toContain('Val')
  })
})
