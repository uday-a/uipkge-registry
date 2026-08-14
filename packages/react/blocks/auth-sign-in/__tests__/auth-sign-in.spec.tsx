import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { AuthSignIn } from '../AuthSignIn'

describe('AuthSignIn', () => {
  it('renders without crashing', () => {
    const { container } = render(<AuthSignIn />)
    expect(container.querySelector('[data-slot="card"]')).toBeTruthy()
  })

  it('renders the card with the title', () => {
    const { container } = render(<AuthSignIn title="Welcome back" />)
    expect(container.textContent).toContain('Welcome back')
  })

  it('renders the email input', () => {
    const { container } = render(<AuthSignIn />)
    const emailInput = container.querySelector('#email')
    expect(emailInput).toBeTruthy()
    expect(emailInput?.getAttribute('type')).toBe('email')
  })

  it('renders the password input', () => {
    const { container } = render(<AuthSignIn />)
    const passwordInput = container.querySelector('#password')
    expect(passwordInput).toBeTruthy()
    expect(passwordInput?.getAttribute('type')).toBe('password')
  })

  it('renders the Sign in submit button', () => {
    const { container } = render(<AuthSignIn />)
    const form = container.querySelector('form')
    const submitBtn = Array.from(form?.querySelectorAll('button') ?? []).find(
      (b) => b.textContent?.includes('Sign in') && b.getAttribute('type') === 'submit',
    )
    expect(submitBtn).toBeTruthy()
  })

  it('renders OAuth buttons for github and google', () => {
    const { container } = render(<AuthSignIn />)
    const buttons = container.querySelectorAll('button')
    const github = Array.from(buttons).find((b) => b.textContent?.includes('GitHub'))
    const google = Array.from(buttons).find((b) => b.textContent?.includes('Google'))
    expect(github).toBeTruthy()
    expect(google).toBeTruthy()
  })

  it('calls onSubmit with email, password, and remember when form is submitted', () => {
    const onSubmit = vi.fn()
    const { container } = render(<AuthSignIn onSubmit={onSubmit} />)
    const emailInput = container.querySelector('#email') as HTMLInputElement
    const passwordInput = container.querySelector('#password') as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'you@company.com' } })
    fireEvent.change(passwordInput, { target: { value: 'secret123' } })
    const form = container.querySelector('form')!
    fireEvent.submit(form)
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'you@company.com',
      password: 'secret123',
      remember: false,
    })
  })
})
