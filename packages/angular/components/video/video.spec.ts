import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiVideoComponent } from './video.component'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, './video.component.ts'), 'utf8')

describe('Video (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(src).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (16/9, rate 1, custom controls)', () => {
    const c = new UiVideoComponent()
    expect(c.aspectRatio).toBe('16/9')
    expect(c.playbackRate).toBe(1)
    expect(c.nativeControls).toBe(false)
    expect(c.autoplay).toBe(false)
    expect(c.loop).toBe(false)
  })
  it('3: togglePlay flips + emits', () => {
    const c = new UiVideoComponent()
    let plays = 0
    c.play.subscribe(() => plays++)
    c.togglePlay()
    expect(c.playing).toBe(true)
    expect(plays).toBe(1)
    c.togglePlay()
    expect(c.playing).toBe(false)
  })
  it('4: mute parks volume at zero', () => {
    const c = new UiVideoComponent()
    c.toggleMute()
    expect(c.isMuted).toBe(true)
    expect(c.volume).toBe(0)
  })
  it('5: setVolume clamps 0..1', () => {
    const c = new UiVideoComponent()
    c.setVolume(2)
    expect(c.volume).toBe(1)
    c.setVolume(-1)
    expect(c.volume).toBe(0)
  })
  it('6: skip + seekTo clamp to duration', () => {
    const c = new UiVideoComponent()
    c.duration = 100
    c.seekTo(150)
    expect(c.current).toBe(100)
    c.seekTo(90)
    c.skip(-200)
    expect(c.current).toBe(0)
  })
  it('7: progress is a 0..1 ratio', () => {
    const c = new UiVideoComponent()
    c.duration = 100
    c.current = 25
    expect(c.progress()).toBe(0.25)
    c.duration = 0
    expect(c.progress()).toBe(0)
  })
  it('8: formatTime renders m:ss', () => {
    const c = new UiVideoComponent()
    expect(c.formatTime(65)).toBe('1:05')
    expect(c.formatTime(0)).toBe('0:00')
  })
  it('9: fullscreen uses the Fullscreen API + fullscreenchange sync like React', () => {
    expect(src).toContain('requestFullscreen')
    expect(src).toContain('exitFullscreen')
    expect(src).toContain('fullscreenchange')
    const c = new UiVideoComponent()
    expect(() => c.toggleFullscreen()).not.toThrow()
    expect(c.isFullscreen).toBe(false)
  })
  it('9b: muted input parks volume at zero on init like React', () => {
    const c = new UiVideoComponent()
    c.muted = true
    c.ngOnInit()
    expect(c.volume).toBe(0)
    expect(c.isMuted).toBe(true)
  })
  it('10: data-slot video contract + custom class', () => {
    expect(src).toContain('"video"')
    const c = new UiVideoComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})
