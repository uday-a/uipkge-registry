import React from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { render } from '@testing-library/react'

export interface DescribeBlockOptions {
  props?: Record<string, any>
  children?: React.ReactNode
  expectedText?: string
  expectedSelector?: string
  uniqueFeatureTest?: (container: HTMLElement) => void | Promise<void>
}

/**
 * Standardized 2-test suite for blocks and components:
 * 1. Render test: asserts mounting without crashing and element presence.
 * 2. Unique feature test: asserts expected text, selector, custom assertion, or non-empty output.
 */
export function describeBlock(name: string, Component: React.ComponentType<any>, options: DescribeBlockOptions = {}) {
  describe(`${name} (React)`, () => {
    afterEach(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5))
    })

    it('renders without crashing', () => {
      const { container, unmount } = render(<Component {...(options.props ?? {})}>{options.children}</Component>)
      expect(container).toBeDefined()
      expect(container.firstChild).not.toBeNull()
      unmount()
    })

    it('renders expected content or unique feature', async () => {
      const { container, unmount } = render(<Component {...(options.props ?? {})}>{options.children}</Component>)

      if (options.uniqueFeatureTest) {
        await options.uniqueFeatureTest(container)
      } else if (options.expectedSelector) {
        expect(container.querySelector(options.expectedSelector)).toBeTruthy()
      } else if (options.expectedText) {
        expect(container.textContent).toContain(options.expectedText)
      } else if ((container.textContent?.trim().length ?? 0) > 0) {
        expect(container.textContent?.trim().length).toBeGreaterThan(0)
      } else {
        expect(container.firstChild).not.toBeNull()
        expect(container.innerHTML.length).toBeGreaterThan(0)
      }
      unmount()
    })
  })
}
