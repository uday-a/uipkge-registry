// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiBoardCardComponent,
  UiBoardComponent,
  UiBoardLaneBodyComponent,
  UiBoardLaneComponent,
  UiBoardLaneEmptyComponent,
} from './board.component'

// Behaviour parity with the React Board. If these break, users notice: lanes stop lighting
// up (or stop showing the "rejecting" tone) while a card is dragged over them, disabled
// lanes accept drops, keyboard users can't grab / move cards, cmd-click no longer builds a
// multi-selection, per-card allowed-lanes are ignored, and locked cards stay interactive.

@Component({
  standalone: true,
  imports: [
    UiBoardComponent,
    UiBoardLaneComponent,
    UiBoardLaneBodyComponent,
    UiBoardLaneEmptyComponent,
    UiBoardCardComponent,
  ],
  template: `
    <div
      ui-board
      [draggingId]="draggingId()"
      [dragOverLaneId]="overId()"
      [justMovedId]="justMovedId()"
      [selectedIds]="selected()"
      [moveItem]="moveItem"
      [toggleSelection]="toggleSelection"
      [clearSelection]="clearSelection"
      [registerAllowedLanes]="registerAllowedLanes"
      [registerLaneDisabled]="registerLaneDisabled"
      [isLaneAcceptingFor]="isLaneAcceptingFor"
    >
      @for (lane of laneIds; track lane) {
        <div
          ui-board-lane
          [id]="lane"
          [disabled]="lane === 'locked'"
          (laneDragOver)="overId.set(lane)"
          (laneDrop)="drops.push(lane)"
        >
          <div ui-board-lane-body>
            @for (id of lanes()[lane]; track id) {
              <div
                ui-board-card
                [id]="id"
                [disabled]="id === 'x'"
                [allowedLanes]="id === 'b' ? ['done'] : undefined"
                (cardClick)="clicks.push(id)"
                (dragStart)="draggingId.set(id)"
              >
                {{ id }}
              </div>
            }
          </div>
          <div ui-board-lane-empty [when]="lanes()[lane].length === 0">Empty</div>
        </div>
      }
    </div>
  `,
})
class HostComponent {
  readonly laneIds = ['todo', 'done', 'locked']
  readonly lanes = signal<Record<string, string[]>>({ todo: ['a', 'b'], done: [], locked: ['x'] })
  readonly draggingId = signal<string | null>(null)
  readonly overId = signal<string | null>(null)
  readonly justMovedId = signal<string | null>(null)
  readonly selected = signal<ReadonlySet<string>>(new Set())
  readonly allowed = new Map<string, readonly string[] | undefined>()
  readonly disabledLanes = new Map<string, boolean>()
  drops: string[] = []
  clicks: string[] = []
  moves: [string | string[], string, number | undefined][] = []

  moveItem = (id: string | string[], to: string, index?: number) => {
    this.moves.push([id, to, index])
    const ids = Array.isArray(id) ? id : [id]
    this.lanes.update((l) => {
      const next: Record<string, string[]> = {}
      for (const k of Object.keys(l)) next[k] = l[k].filter((x) => !ids.includes(x))
      next[to].splice(index ?? next[to].length, 0, ...ids)
      return next
    })
  }
  toggleSelection = (id: string) =>
    this.selected.update((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  clearSelection = () => this.selected.set(new Set())
  registerAllowedLanes = (id: string, l: readonly string[] | undefined) => this.allowed.set(id, l)
  registerLaneDisabled = (id: string, d: boolean) => this.disabledLanes.set(id, d)
  isLaneAcceptingFor = (laneId: string) => {
    if (this.disabledLanes.get(laneId)) return false
    const allow = this.draggingId() ? this.allowed.get(this.draggingId()!) : undefined
    return !allow || allow.includes(laneId)
  }
}

async function setup() {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const el = fixture.nativeElement as HTMLElement
  const lane = (id: string) => el.querySelector<HTMLElement>(`[data-lane-id="${id}"]`)!
  const card = (id: string) => el.querySelector<HTMLElement>(`[data-board-card-id="${id}"]`)!
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }
  const key = async (id: string, k: string) => {
    card(id).dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
    await settle()
  }
  const event = (type: string, target: HTMLElement) => {
    const e = new Event(type, { bubbles: true, cancelable: true })
    target.dispatchEvent(e)
    return e
  }
  return { fixture, host: fixture.componentInstance, el, lane, card, settle, key, event }
}

describe('Board (angular, 8 checks)', () => {
  it('1: cards are focusable draggable role=button items; lanes register their disabled flag', async () => {
    const t = await setup()
    const a = t.card('a')
    expect(a.getAttribute('role')).toBe('button')
    expect(a.getAttribute('tabindex')).toBe('0')
    expect(a.getAttribute('draggable')).toBe('true')
    expect(a.getAttribute('aria-roledescription')).toBe('draggable card')
    expect(a.getAttribute('data-state')).toBe('idle')
    expect(t.host.disabledLanes.get('locked')).toBe(true)
    expect(t.lane('locked').getAttribute('aria-disabled')).toBe('true')
    expect(t.host.allowed.get('b')).toEqual(['done'])
  })

  it('2: a dragged card dims; the hovered lane is "over" when accepting, "rejecting" otherwise', async () => {
    const t = await setup()
    t.event('dragstart', t.card('a'))
    await t.settle()
    expect(t.card('a').getAttribute('data-state')).toBe('dragging')
    t.event('dragover', t.lane('done'))
    await t.settle()
    expect(t.lane('done').getAttribute('data-state')).toBe('over')
    t.event('dragover', t.lane('locked'))
    await t.settle()
    expect(t.lane('locked').getAttribute('data-state')).toBe('rejecting')
    expect(t.lane('locked').className).toContain('ring-destructive/30')
  })

  it('3: the allowed-lanes list makes other lanes reject that card', async () => {
    const t = await setup()
    t.event('dragstart', t.card('b'))
    t.host.overId.set('todo')
    await t.settle()
    expect(t.lane('todo').getAttribute('data-state')).toBe('rejecting')
  })

  it('4: drop emits laneDrop, but never on a disabled lane', async () => {
    const t = await setup()
    t.event('drop', t.lane('done'))
    const e = t.event('drop', t.lane('locked'))
    expect(t.host.drops).toEqual(['done'])
    expect(e.defaultPrevented).toBe(true)
  })

  it('5: Space grabs, arrows move across lanes (skipping disabled ones) and within a lane', async () => {
    const t = await setup()
    await t.key('a', 'ArrowRight')
    expect(t.host.moves).toEqual([]) // not grabbed yet
    await t.key('a', ' ')
    expect(t.card('a').getAttribute('data-state')).toBe('dragging')
    await t.key('a', 'ArrowDown')
    expect(t.host.moves).toEqual([['a', 'todo', 1]])
    await t.key('a', 'ArrowRight')
    expect(t.host.moves[1]).toEqual(['a', 'done', undefined])
    // Like React, the card re-mounts in its new lane with local grab state reset.
    expect(t.card('a').getAttribute('data-state')).toBe('idle')
    await t.key('a', ' ')
    await t.key('a', 'ArrowRight') // wraps past the disabled lane back to todo
    expect(t.host.moves[2]).toEqual(['a', 'todo', undefined])
    await t.key('a', ' ')
    await t.key('a', 'Escape')
    expect(t.card('a').getAttribute('data-state')).toBe('idle')
  })

  it('6: Enter and plain click emit cardClick; cmd-click toggles the selection instead', async () => {
    const t = await setup()
    await t.key('a', 'Enter')
    t.card('b').click()
    t.card('a').dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }))
    await t.settle()
    expect(t.host.clicks).toEqual(['a', 'b'])
    expect(t.card('a').getAttribute('aria-pressed')).toBe('true')
    expect(t.card('a').className).toContain('ring-primary/60')
    t.card('b').click()
    await t.settle()
    expect(t.host.selected().size).toBe(0)
  })

  it('7: a disabled card is out of the tab order, not draggable and ignores keys / clicks', async () => {
    const t = await setup()
    const x = t.card('x')
    expect(x.getAttribute('tabindex')).toBe('-1')
    expect(x.getAttribute('draggable')).toBe('false')
    expect(t.event('dragstart', x).defaultPrevented).toBe(true)
    await t.key('x', 'Enter')
    x.click()
    expect(t.host.clicks).toEqual([])
    expect(x.className).toContain('grayscale')
  })

  it('8: justMovedId marks the landed card; LaneEmpty renders only while `when` is true; body wraps cards in the motion preset', async () => {
    const t = await setup()
    t.host.justMovedId.set('a')
    await t.settle()
    expect(t.card('a').getAttribute('data-state')).toBe('moved')
    const empty = (id: string) => t.lane(id).querySelector<HTMLElement>('[data-slot="board-lane-empty"]')!
    expect(empty('done').textContent).toBe('Empty')
    expect(empty('todo').style.display).toBe('none')
    expect([...t.card('a').parentElement!.classList].sort()).toEqual([
      'flex',
      'flex-col',
      'gap-2',
      'motion-list',
      'relative',
    ])
  })
})
