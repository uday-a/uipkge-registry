// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiMentionsComponent, type MentionOption } from './mentions.component'
import { UiMentionTagComponent } from './mention-tag.component'

// Behaviour parity with the React Mentions + MentionTag. If these break, users notice:
// typing "@" no longer opens suggestions (or opens them mid-word), the list ignores the
// query, arrows / Enter do not pick, the token is appended at the end instead of replacing
// "@query" at the caret, each trigger does not get its own list, async results never show,
// or the mention chip loses its profile card / renders as a plain link.

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const people: MentionOption[] = [
  { value: 'ada', label: 'Ada Lovelace', email: 'ada@computing.org' },
  { value: 'bob', label: 'Bob Stone', disabled: true },
  { value: 'grace', label: 'Grace Hopper' },
]

@Component({
  standalone: true,
  imports: [UiMentionsComponent, UiMentionTagComponent],
  template: `
    <ui-mentions
      [value]="text()"
      (valueChange)="text.set($event)"
      (mentionSelect)="picked.push($event.value)"
      [options]="options()"
      [triggers]="triggers()"
      [loadOptions]="loader()"
    />
    <p>
      <ui-mention-tag name="Ada Lovelace" handle="adalovelace" />
      <ui-mention-tag trigger="#" name="v2" [popover]="false" href="/tags/v2" />
    </p>
  `,
})
class HostComponent {
  readonly text = signal('')
  readonly options = signal<MentionOption[] | Record<string, MentionOption[]>>(people)
  readonly triggers = signal(['@'])
  readonly loader = signal<((q: string) => Promise<MentionOption[]>) | undefined>(undefined)
  picked: string[] = []
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const ta = () => fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement
  const panel = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="popover-content"]')
  const options = () => [...(panel()?.querySelectorAll<HTMLElement>('li[role="option"]') ?? [])]
  const settle = async (ms = 0) => {
    fixture.detectChanges()
    await fixture.whenStable()
    await tick(ms)
    fixture.detectChanges()
  }
  const type = async (text: string) => {
    ta().value = text
    ta().setSelectionRange(text.length, text.length)
    ta().dispatchEvent(new Event('input'))
    await settle()
  }
  const key = async (k: string) => {
    ta().dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
    await settle()
  }
  return { fixture, host: fixture.componentInstance, ta, panel, options, settle, type, key }
}

describe('Mentions (angular, 8 checks)', () => {
  it('1: textarea is a closed combobox with the React classes', async () => {
    const { ta, panel, fixture } = await setup()
    expect(ta().getAttribute('role')).toBe('combobox')
    expect(ta().getAttribute('aria-expanded')).toBe('false')
    expect(ta().className).toContain('border-input bg-background')
    expect(fixture.nativeElement.querySelector('ui-mentions').getAttribute('data-slot')).toBe('mentions')
    expect(panel()).toBeNull()
  })

  it('2: "@" at a word start opens the list; a mid-word "@" does not', async () => {
    const { ta, panel, type } = await setup()
    await type('mail me@x')
    expect(panel()).toBeNull()
    await type('hi @')
    expect(panel()).not.toBeNull()
    expect(ta().getAttribute('aria-expanded')).toBe('true')
  })

  it('3: the query filters by label, value and email', async () => {
    const { options, type } = await setup()
    await type('@comp')
    expect(options().map((o) => o.textContent!.trim())).toEqual(['Ada Lovelaceada@computing.org'])
    await type('@zzz')
    expect(options().length).toBe(0)
  })

  it('4: ArrowDown skips disabled options; Enter replaces "@query" with the token at the caret', async () => {
    const { host, key, type, options } = await setup()
    await type('Hi @')
    expect(options()[0].getAttribute('aria-selected')).toBe('true')
    await key('ArrowDown')
    // Bob is disabled: the highlight jumps to Grace.
    expect(options()[2].getAttribute('aria-selected')).toBe('true')
    await key('Enter')
    expect(host.text()).toBe('Hi @grace ')
    expect(host.picked).toEqual(['grace'])
  })

  it('5: Escape closes the list; mousedown on an option inserts it', async () => {
    const { host, key, type, panel, options, settle, fixture } = await setup()
    await type('@a')
    await key('Escape')
    await tick(250)
    fixture.detectChanges()
    expect(panel()).toBeNull()
    await type('@a')
    options()[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))
    await settle()
    expect(host.text()).toBe('@ada ')
  })

  it('6: per-trigger option maps use the list for the typed trigger', async () => {
    const { options, type } = await setup((h) => {
      h.triggers.set(['@', '#'])
      h.options.set({ '@': people, '#': [{ value: 'v2', label: 'v2-launch' }] })
    })
    await type('#')
    expect(options().map((o) => o.textContent!.trim())).toEqual(['v2-launch'])
  })

  it('7: loadOptions is debounced and its results replace the static list', async () => {
    const calls: string[] = []
    const { options, type, settle, panel } = await setup((h) =>
      h.loader.set(async (q) => {
        calls.push(q)
        return [{ value: 'async', label: `Async ${q}` }]
      }),
    )
    await type('@g')
    await type('@gr')
    expect(panel()!.textContent).toContain('No matches')
    await settle(260)
    expect(calls).toEqual(['gr'])
    expect(options().map((o) => o.textContent!.trim())).toEqual(['Async gr'])
  })

  it('8: MentionTag renders the React chip (span / a) and a hover card trigger when popover', async () => {
    const { fixture } = await setup()
    const chips = fixture.nativeElement.querySelectorAll('[data-slot="mention-tag"]')
    expect(chips.length).toBe(2)
    expect(chips[0].tagName).toBe('SPAN')
    expect(chips[0].textContent!.replace(/\s+/g, '')).toBe('@AdaLovelace')
    expect(chips[0].getAttribute('data-state')).toBe('closed')
    expect(chips[0].className).toContain('bg-muted/70')
    expect(chips[1].tagName).toBe('A')
    expect(chips[1].getAttribute('href')).toBe('/tags/v2')
    expect(chips[1].hasAttribute('data-state')).toBe(false)
  })
})
