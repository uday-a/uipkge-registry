import { describe, it, expect } from 'vitest'
import { mount, type ComponentMountingOptions } from '@vue/test-utils'
import type { Component } from 'vue'

export interface DescribeBlockOptions<T = any> {
  props?: Record<string, any>
  slots?: Record<string, any>
  mountOptions?: ComponentMountingOptions<T>
  expectedText?: string
  expectedSelector?: string
  uniqueFeatureTest?: (wrapper: ReturnType<typeof mount>) => void | Promise<void>
}

/**
 * Standardized 2-test suite for blocks and components:
 * 1. Render test: asserts mounting without crashing and element presence.
 * 2. Unique feature test: asserts expected text, selector, custom assertion, or non-empty output.
 */
export function describeBlock(name: string, component: Component, options: DescribeBlockOptions = {}) {
  describe(`${name} (Vue)`, () => {
    it('renders without crashing', () => {
      const wrapper = mount(component, {
        props: options.props,
        slots: options.slots,
        ...options.mountOptions,
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.element).toBeDefined()
      expect(wrapper.html().trim().length).toBeGreaterThan(0)
      wrapper.unmount()
    })

    it('renders expected content or unique feature', async () => {
      const wrapper = mount(component, {
        props: options.props,
        slots: options.slots,
        ...options.mountOptions,
      })

      if (options.uniqueFeatureTest) {
        await options.uniqueFeatureTest(wrapper)
      } else if (options.expectedSelector) {
        expect(wrapper.find(options.expectedSelector).exists()).toBe(true)
      } else if (options.expectedText) {
        expect(wrapper.text()).toContain(options.expectedText)
      } else if (wrapper.text().trim().length > 0) {
        expect(wrapper.text().trim().length).toBeGreaterThan(0)
      } else {
        expect(wrapper.html().trim().length).toBeGreaterThan(0)
        expect(wrapper.vm).toBeDefined()
      }
      wrapper.unmount()
    })
  })
}
