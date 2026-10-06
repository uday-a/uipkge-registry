// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiAvatarComponent,
  UiAvatarFallbackComponent,
  UiAvatarGroupComponent,
  UiAvatarImageComponent,
  type AvatarImageLoadingStatus,
} from './avatar.component'
import { avatarFallbackVariants, avatarVariants } from './avatar.variants'
import {
  avatarFallbackVariants as reactFallbackVariants,
  avatarVariants as reactAvatarVariants,
} from '../../../registry-react/components/avatar/avatar.variants'

// Radix Avatar parity. If these break, users see the image AND the initials side by side, a
// broken image icon instead of the fallback, initials flashing before a fast image when a
// delay was asked for, or an AvatarGroup that renders every avatar instead of max-1 + "+N".

/** Controllable stand-in for window.Image (jsdom never loads images). */
class FakeImage {
  static last: FakeImage[] = []
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  complete = false
  naturalWidth = 0
  referrerPolicy = ''
  crossOrigin: string | null = null
  src = ''
  constructor() {
    FakeImage.last.push(this)
  }
}

@Component({
  standalone: true,
  imports: [UiAvatarComponent, UiAvatarImageComponent, UiAvatarFallbackComponent, UiAvatarGroupComponent],
  template: `
    <ui-avatar id="a" class="size-12">
      <ui-avatar-image [src]="src" alt="user" (loadingStatusChange)="statuses.push($event)" />
      <ui-avatar-fallback id="fb">UI</ui-avatar-fallback>
    </ui-avatar>
    <ui-avatar id="d"><ui-avatar-fallback id="late" [delayMs]="300">LT</ui-avatar-fallback></ui-avatar>
    <ui-avatar-group id="g" [max]="3">
      @for (n of names(); track n) {
        <ui-avatar
          ><ui-avatar-fallback>{{ n }}</ui-avatar-fallback></ui-avatar
        >
      }
    </ui-avatar-group>
    <ui-avatar-group id="g2" [max]="2" [overflow]="more">
      <ui-avatar>A</ui-avatar><ui-avatar>B</ui-avatar><ui-avatar>C</ui-avatar>
    </ui-avatar-group>
    <ng-template #more let-count
      ><b id="more">{{ count }} more</b></ng-template
    >
  `,
})
class Host {
  src = 'https://example.test/a.png'
  statuses: AvatarImageLoadingStatus[] = []
  readonly names = signal(['AD', 'RM', 'PK', 'JS', 'LO'])
}

function render() {
  const fixture = TestBed.createComponent(Host)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  const q = (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
  return { fixture, host: fixture.componentInstance, q }
}

beforeEach(() => {
  FakeImage.last = []
  vi.stubGlobal('Image', FakeImage)
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('Avatar (angular, 6 checks)', () => {
  it('1: while the image loads only the fallback shows; no <img> is in the DOM', () => {
    const { q, host } = render()
    expect(q('a').querySelector('img')).toBeNull()
    expect(q('fb').classList.contains('hidden')).toBe(false)
    expect(q('fb').textContent!.trim()).toBe('UI')
    expect(host.statuses).toEqual(['loading'])
    expect(FakeImage.last[0]!.src).toBe('https://example.test/a.png')
  })

  it('2: once loaded the <img> renders (data-slot avatar-image) and the fallback disappears', async () => {
    const { q, host, fixture } = render()
    FakeImage.last[0]!.onload!()
    await fixture.whenStable()
    fixture.detectChanges()
    const img = q('a').querySelector('img')!
    expect(img.getAttribute('data-slot')).toBe('avatar-image')
    expect(img.getAttribute('alt')).toBe('user')
    expect(img.classList.contains('object-cover')).toBe(true)
    expect(q('fb').classList.contains('hidden')).toBe(true)
    expect(q('fb').textContent!.trim()).toBe('')
    expect(host.statuses).toEqual(['loading', 'loaded'])
  })

  it('3: a broken image keeps the fallback and never renders <img>', async () => {
    const { q, host, fixture } = render()
    FakeImage.last[0]!.onerror!()
    await fixture.whenStable()
    fixture.detectChanges()
    expect(q('a').querySelector('img')).toBeNull()
    expect(q('fb').classList.contains('hidden')).toBe(false)
    expect(host.statuses).toEqual(['loading', 'error'])
  })

  it('4: delayMs holds the fallback back until the delay has passed', async () => {
    vi.useFakeTimers()
    const { q, fixture } = render()
    expect(q('late').classList.contains('hidden')).toBe(true)
    vi.advanceTimersByTime(300)
    fixture.detectChanges()
    expect(q('late').classList.contains('hidden')).toBe(false)
    expect(q('late').textContent!.trim()).toBe('LT')
  })

  it('5: AvatarGroup shows max-1 avatars plus a +N chip (max includes the chip), re-counting on change', async () => {
    const { q, host, fixture } = render()
    const visible = () => [...q('g').querySelectorAll(':scope > ui-avatar')].filter((a) => !a.hasAttribute('hidden'))
    expect(visible().length).toBe(2)
    for (const a of q('g').querySelectorAll(':scope > ui-avatar'))
      expect((a as HTMLElement).style.display).toBe(a.hasAttribute('hidden') ? 'none' : '')
    expect(q('g').lastElementChild!.textContent!.trim()).toBe('+3')
    host.names.set(['AD', 'RM', 'PK'])
    fixture.detectChanges()
    await new Promise((r) => setTimeout(r))
    fixture.detectChanges()
    expect(visible().length).toBe(3)
    expect(q('g').querySelector('[data-avatar-group-overflow]')).toBeNull()
  })

  it('6: a custom overflow template receives the hidden count; variants match React', () => {
    const { q } = render()
    expect(q('more').textContent).toBe('2 more')
    expect(avatarVariants({ size: 'lg', color: 'primary', variant: 'soft' })).toBe(
      reactAvatarVariants({ size: 'lg', color: 'primary', variant: 'soft' }),
    )
    expect(avatarFallbackVariants({ size: 'xl', color: 'muted' })).toBe(
      reactFallbackVariants({ size: 'xl', color: 'muted' }),
    )
  })
})
