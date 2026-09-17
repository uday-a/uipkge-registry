import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatThread from '../ChatThread.vue'

describe('ChatThread', () => {
  it('renders without crashing', () => {
    const w = mount(ChatThread, { attachTo: document.body })
    expect(w.find('div').exists()).toBe(true)
    w.unmount()
  })

  it('renders message bubbles', () => {
    const w = mount(ChatThread, { attachTo: document.body })
    expect(w.text()).toContain('did you get a chance to look at the onboarding doc')
    expect(w.text()).toContain('looks solid')
    w.unmount()
  })

  it('renders composer textarea', () => {
    const w = mount(ChatThread, { attachTo: document.body })
    expect(w.find('textarea').exists()).toBe(true)
    w.unmount()
  })

  it('renders send button', () => {
    const w = mount(ChatThread, { attachTo: document.body })
    const send = w.find('button[aria-label="Send"]')
    expect(send.exists()).toBe(true)
    w.unmount()
  })

  it('renders peer header', () => {
    const w = mount(ChatThread, { attachTo: document.body })
    expect(w.text()).toContain('Marcus Rivera')
    w.unmount()
  })
})
