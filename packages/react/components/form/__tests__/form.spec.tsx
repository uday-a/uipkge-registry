import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Form, FormItem, FormStatus } from '../index'

afterEach(cleanup)

describe('Form', () => {
  it('Form (FormProvider) renders children', () => {
    const { container } = render(
      <Form>
        <div className="form-child">Content</div>
      </Form>,
    )
    expect(container.querySelector('.form-child')?.textContent).toBe('Content')
  })

  it('FormItem has data-slot="form-item" and data-uipkge', () => {
    const { container } = render(
      <Form>
        <FormItem>
          <input />
        </FormItem>
      </Form>,
    )
    const el = container.querySelector('[data-slot="form-item"]')
    expect(el).toBeTruthy()
    expect(el?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('FormItem renders slot content (children)', () => {
    const { container } = render(
      <Form>
        <FormItem>
          <input className="my-input" />
        </FormItem>
      </Form>,
    )
    expect(container.querySelector('.my-input')).toBeTruthy()
  })

  it('FormItem renders label text', () => {
    const { container } = render(
      <Form>
        <FormItem label="Username">
          <input />
        </FormItem>
      </Form>,
    )
    expect(container.textContent).toContain('Username')
  })

  it('FormItem shows required indicator when required', () => {
    const { container } = render(
      <Form>
        <FormItem label="Email" required>
          <input />
        </FormItem>
      </Form>,
    )
    expect(container.textContent).toContain('*')
  })

  it('FormItem applies custom class', () => {
    const { container } = render(
      <Form>
        <FormItem className="custom-item">
          <input />
        </FormItem>
      </Form>,
    )
    expect(container.querySelector('.custom-item')).toBeTruthy()
  })

  it('FormStatus renders message with data-slot="form-status"', () => {
    const { container } = render(
      <Form>
        <FormStatus status="error" message="Something went wrong" />
      </Form>,
    )
    const el = container.querySelector('[data-slot="form-status"]')
    expect(el).toBeTruthy()
    expect(el?.textContent).toContain('Something went wrong')
  })
})
