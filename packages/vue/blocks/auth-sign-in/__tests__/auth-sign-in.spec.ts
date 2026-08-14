import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthSignIn from '../AuthSignIn.vue'

describe('AuthSignIn', () => {
  it('renders without crashing', () => {
    const w = mount(AuthSignIn, { attachTo: document.body })
    expect(w.find('[data-slot="card"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders card with title', () => {
    const w = mount(AuthSignIn, { attachTo: document.body })
    expect(w.text()).toContain('Welcome back')
    w.unmount()
  })

  it('renders email input', () => {
    const w = mount(AuthSignIn, { attachTo: document.body })
    expect(w.find('input[type="email"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders password input', () => {
    const w = mount(AuthSignIn, { attachTo: document.body })
    expect(w.find('input[type="password"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders sign in button', () => {
    const w = mount(AuthSignIn, { attachTo: document.body })
    const buttons = w.findAll('button')
    expect(buttons.some((b) => b.text().includes('Sign in'))).toBe(true)
    w.unmount()
  })

  it('renders OAuth buttons', () => {
    const w = mount(AuthSignIn, { attachTo: document.body })
    expect(w.text()).toContain('GitHub')
    expect(w.text()).toContain('Google')
    w.unmount()
  })

  it('renders sign up link', () => {
    const w = mount(AuthSignIn, { attachTo: document.body })
    expect(w.text()).toContain("Don't have an account?")
    expect(w.text()).toContain('Sign up')
    w.unmount()
  })

  it('emits submit when form is submitted', async () => {
    const w = mount(AuthSignIn, { attachTo: document.body })
    await w.find('input[type="email"]').setValue('test@example.com')
    await w.find('input[type="password"]').setValue('password123')
    await w.find('form').trigger('submit.prevent')
    expect(w.emitted('submit')).toBeTruthy()
    const payload = w.emitted('submit')![0][0] as any
    expect(payload.email).toBe('test@example.com')
    expect(payload.password).toBe('password123')
    w.unmount()
  })
})
