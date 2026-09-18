import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Countdown from '../Countdown.vue'

/** Fixed "now" so every assertion below is about the formatting, not the clock. */
const NOW = new Date('2026-01-01T00:00:00.000Z').getTime()
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Countdown (Vue)', () => {
  it('renders container with data-slot="countdown"', () => {
    const wrapper = mount(Countdown, { props: { target: NOW + MINUTE } })
    expect(wrapper.find('[data-slot="countdown"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders custom label and unit separator', () => {
    const wrapper = mount(Countdown, {
      props: { target: NOW + MINUTE, label: 'Sale Ends In', separator: ':' },
    })
    expect(wrapper.text()).toContain('Sale Ends In')
    expect(wrapper.text()).toContain(':')
    wrapper.unmount()
  })

  // The remaining time is the whole point of the component: a wrong roll-up
  // ("1 day left" shown as "01" hours) misleads on exactly the deadline the
  // consumer is counting down to.
  it('splits the remaining time into days, hours, minutes and seconds', () => {
    const wrapper = mount(Countdown, {
      props: { target: NOW + 2 * DAY + 3 * HOUR + 4 * MINUTE + 5 * SECOND },
    })
    expect(wrapper.text()).toContain('02')
    expect(wrapper.text()).toContain('03')
    expect(wrapper.text()).toContain('04')
    expect(wrapper.text()).toContain('05')
    wrapper.unmount()
  })

  it('rolls days into hours for HH:MM:SS and into minutes for MM:SS', () => {
    const hhmmss = mount(Countdown, {
      props: { target: NOW + DAY + 2 * HOUR, format: 'HH:MM:SS' },
    })
    // 1 day + 2 hours reported as 26 hours, not "01" days and "02" hours.
    expect(hhmmss.text()).toContain('26')
    hhmmss.unmount()

    const mmss = mount(Countdown, { props: { target: NOW + 2 * HOUR + MINUTE, format: 'MM:SS' } })
    expect(mmss.text()).toContain('121')
    mmss.unmount()
  })

  it('honours pad=false so single digits are not zero-padded', () => {
    const padded = mount(Countdown, { props: { target: NOW + 5 * SECOND, format: 'SS' } })
    expect(padded.text()).toContain('05')
    padded.unmount()

    const bare = mount(Countdown, { props: { target: NOW + 5 * SECOND, format: 'SS', pad: false } })
    expect(bare.text()).toContain('5')
    expect(bare.text()).not.toContain('05')
    bare.unmount()
  })

  it('ticks down once per second and emits the remaining milliseconds', async () => {
    const wrapper = mount(Countdown, { props: { target: NOW + 10 * SECOND, format: 'SS' } })
    expect(wrapper.text()).toContain('10')

    vi.advanceTimersByTime(3 * SECOND)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('07')
    const ticks = wrapper.emitted('tick') ?? []
    expect(ticks).toHaveLength(3)
    expect(ticks.at(-1)?.[0]).toBe(7 * SECOND)
    wrapper.unmount()
  })

  it('emits finish once when it reaches zero and then stops ticking', async () => {
    const wrapper = mount(Countdown, { props: { target: NOW + 2 * SECOND, format: 'SS' } })

    vi.advanceTimersByTime(5 * SECOND)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('finish')).toHaveLength(1)
    expect(wrapper.text()).toContain('00')

    const ticksAtFinish = (wrapper.emitted('tick') ?? []).length
    vi.advanceTimersByTime(5 * SECOND)
    expect((wrapper.emitted('tick') ?? []).length).toBe(ticksAtFinish)
    wrapper.unmount()
  })

  it('emits finish immediately for a target already in the past', () => {
    const wrapper = mount(Countdown, { props: { target: NOW - MINUTE, format: 'SS' } })
    expect(wrapper.emitted('finish')).toHaveLength(1)
    expect(wrapper.text()).toContain('00')
    wrapper.unmount()
  })

  it('stops while paused and resumes from the current time', async () => {
    const wrapper = mount(Countdown, { props: { target: NOW + 60 * SECOND, format: 'SS', paused: true } })

    vi.advanceTimersByTime(5 * SECOND)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('tick')).toBeUndefined()
    expect(wrapper.text()).toContain('60')

    await wrapper.setProps({ paused: false })
    vi.advanceTimersByTime(2 * SECOND)
    await wrapper.vm.$nextTick()
    // Wall-clock, not paused-time: 7s of real time have passed since mount.
    expect(wrapper.text()).toContain('53')
    wrapper.unmount()
  })

  it('accepts a Date and an ISO string as well as epoch milliseconds', () => {
    const fromDate = mount(Countdown, { props: { target: new Date(NOW + 30 * SECOND), format: 'SS' } })
    expect(fromDate.text()).toContain('30')
    fromDate.unmount()

    const fromIso = mount(Countdown, {
      props: { target: new Date(NOW + 45 * SECOND).toISOString(), format: 'SS' },
    })
    expect(fromIso.text()).toContain('45')
    fromIso.unmount()
  })

  it('renders only the units named by the format', () => {
    const wrapper = mount(Countdown, { props: { target: NOW + DAY + HOUR, format: 'HH:MM' } })
    expect(wrapper.find('[data-slot="countdown-hours"]').exists()).toBe(true)
    expect(wrapper.find('[data-slot="countdown-minutes"]').exists()).toBe(true)
    expect(wrapper.find('[data-slot="countdown-days"]').exists()).toBe(false)
    expect(wrapper.find('[data-slot="countdown-seconds"]').exists()).toBe(false)
    wrapper.unmount()
  })

  // The default markup paints one span per unit, so literal characters in a
  // custom format only reach the DOM through the slot's `display` string.
  it('hands the slot a display string with DD/HH/MM/SS tokens substituted', () => {
    const wrapper = mount(Countdown, {
      props: { target: NOW + DAY + HOUR, format: 'DDd HHh MMm' },
      slots: { default: `<template #default="{ display }"><span class="custom">{{ display }}</span></template>` },
    })
    expect(wrapper.find('.custom').text()).toBe('01d 01h 00m')
    wrapper.unmount()
  })

  it('clears its interval on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    const wrapper = mount(Countdown, { props: { target: NOW + MINUTE } })
    wrapper.unmount()
    expect(clearSpy).toHaveBeenCalled()
    clearSpy.mockRestore()
  })
})
