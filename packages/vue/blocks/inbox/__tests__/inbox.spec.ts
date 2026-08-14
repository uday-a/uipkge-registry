import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Inbox from '../Inbox.vue'

describe('Inbox', () => {
  it('renders without crashing', () => {
    const w = mount(Inbox, { attachTo: document.body })
    expect(w.find('div').exists()).toBe(true)
    w.unmount()
  })

  it('renders folder list', () => {
    const w = mount(Inbox, { attachTo: document.body })
    expect(w.text()).toContain('Inbox')
    expect(w.text()).toContain('Starred')
    expect(w.text()).toContain('Sent')
    expect(w.text()).toContain('Drafts')
    w.unmount()
  })

  it('renders mail list', () => {
    const w = mount(Inbox, { attachTo: document.body })
    expect(w.text()).toContain('Q2 OKR draft')
    w.unmount()
  })

  it('renders search input', () => {
    const w = mount(Inbox, { attachTo: document.body })
    const search = w.find('input[placeholder="Search mail"]')
    expect(search.exists()).toBe(true)
    w.unmount()
  })
})
