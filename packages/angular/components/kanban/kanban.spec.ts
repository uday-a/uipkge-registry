// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiKanbanBoardComponent,
  UiKanbanCardComponent,
  UiKanbanColumnBodyComponent,
  UiKanbanColumnComponent,
  UiKanbanColumnCountComponent,
  UiKanbanColumnEmptyComponent,
  UiKanbanComponent,
  type KanbanMoveEvent,
} from './kanban.component'

// Behaviour parity with the React Kanban. If these break, users notice: dropping a card on
// another column does nothing, keyboard users can't pick up / move / reorder / drop cards
// (or a held card stays stuck), screen readers hear nothing, locked cards can still be
// dragged, and empty columns or count badges render the wrong text.

interface Col {
  id: string
  label: string
  cards: { id: string; title: string }[]
}

@Component({
  standalone: true,
  imports: [
    UiKanbanComponent,
    UiKanbanBoardComponent,
    UiKanbanColumnComponent,
    UiKanbanColumnBodyComponent,
    UiKanbanColumnCountComponent,
    UiKanbanColumnEmptyComponent,
    UiKanbanCardComponent,
  ],
  template: `
    <div ui-kanban (cardMove)="onMove($event)">
      <div ui-kanban-board>
        @for (col of board(); track col.id) {
          <div ui-kanban-column [id]="col.id" [label]="col.label">
            <span ui-kanban-column-count [count]="col.cards.length"></span>
            <div ui-kanban-column-body>
              @for (card of col.cards; track card.id) {
                <div ui-kanban-card [id]="card.id" [disabled]="card.id === lockedId()" [keyboardDraggable]="kbd()">
                  {{ card.title }}
                </div>
              }
              @if (col.cards.length === 0) {
                <div ui-kanban-column-empty></div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
class HostComponent {
  readonly board = signal<Col[]>([
    {
      id: 'todo',
      label: 'To do',
      cards: [
        { id: 'a', title: 'A' },
        { id: 'b', title: 'B' },
      ],
    },
    { id: 'doing', label: 'Doing', cards: [{ id: 'c', title: 'C' }] },
    { id: 'done', label: 'Done', cards: [] },
  ])
  readonly lockedId = signal<string | null>(null)
  readonly kbd = signal(true)
  moves: KanbanMoveEvent[] = []

  onMove(e: KanbanMoveEvent): void {
    this.moves.push(e)
    this.board.update((b) => {
      const card = b.find((c) => c.id === e.fromColumnId)!.cards.find((c) => c.id === e.cardId)!
      return b.map((col) => {
        let cards = col.cards.filter((c) => c.id !== e.cardId || col.id !== e.fromColumnId)
        if (col.id === e.toColumnId) {
          cards = [...cards]
          cards.splice(e.toIndex ?? cards.length, 0, card)
        }
        return { ...col, cards }
      })
    })
  }
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const el = fixture.nativeElement as HTMLElement
  const card = (id: string) => el.querySelector<HTMLElement>(`[data-card-id="${id}"]`)!
  const column = (id: string) => el.querySelector<HTMLElement>(`[data-column-id="${id}"]`)!
  const cardsIn = (id: string) =>
    Array.from(column(id).querySelectorAll<HTMLElement>('[data-slot="kanban-card"]')).map((c) => c.dataset['cardId'])
  const live = () => el.querySelector('[data-slot="kanban-live-region"]')!.textContent
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    await new Promise((r) => setTimeout(r))
    fixture.detectChanges()
  }
  const key = async (id: string, k: string) => {
    card(id).dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
    await settle()
  }
  const drag = (type: string, target: HTMLElement) => {
    const e = new Event(type, { bubbles: true, cancelable: true }) as DragEvent
    Object.defineProperty(e, 'dataTransfer', { value: { setData() {}, dropEffect: '', effectAllowed: '' } })
    target.dispatchEvent(e)
    return e
  }
  return { fixture, host: fixture.componentInstance, card, column, cardsIn, live, settle, key, drag }
}

describe('Kanban (angular, 8 checks)', () => {
  it('1: columns are labelled groups; cards are keyboard-draggable buttons', async () => {
    const t = await setup()
    expect(t.column('todo').getAttribute('role')).toBe('group')
    expect(t.column('todo').getAttribute('aria-label')).toBe('To do')
    const a = t.card('a')
    expect(a.getAttribute('role')).toBe('button')
    expect(a.getAttribute('tabindex')).toBe('0')
    expect(a.getAttribute('aria-roledescription')).toBe('draggable card')
    expect(a.getAttribute('aria-pressed')).toBe('false')
    expect(a.getAttribute('draggable')).toBe('true')
    expect(a.getAttribute('data-state')).toBe('idle')
  })

  it('2: pointer drag onto another column emits cardMove and highlights the drop target', async () => {
    const t = await setup()
    t.drag('dragstart', t.card('a'))
    await t.settle()
    expect(t.card('a').getAttribute('data-state')).toBe('dragging')
    const over = t.drag('dragover', t.column('done'))
    expect(over.defaultPrevented).toBe(true)
    await t.settle()
    expect(t.column('done').hasAttribute('data-over')).toBe(true)
    expect(t.column('done').className).toContain('ring-primary/20')
    t.drag('drop', t.column('done'))
    await t.settle()
    expect(t.host.moves).toEqual([{ cardId: 'a', fromColumnId: 'todo', toColumnId: 'done' }])
    expect(t.cardsIn('done')).toEqual(['a'])
    expect(t.column('done').hasAttribute('data-over')).toBe(false)
  })

  it('3: Space grabs (announced, aria-pressed), Space again drops', async () => {
    const t = await setup()
    await t.key('a', ' ')
    expect(t.card('a').getAttribute('data-state')).toBe('grabbed')
    expect(t.card('a').getAttribute('aria-pressed')).toBe('true')
    expect(t.live()).toContain('Picked up card')
    await t.key('a', ' ')
    expect(t.card('a').getAttribute('data-state')).toBe('idle')
    expect(t.live()?.trim()).toBe('Card dropped.')
  })

  it('4: arrow right moves a held card to the next column without wrapping past the end', async () => {
    const t = await setup()
    await t.key('c', ' ')
    await t.key('c', 'ArrowRight')
    expect(t.host.moves.at(-1)).toEqual({ cardId: 'c', fromColumnId: 'doing', toColumnId: 'done' })
    expect(t.cardsIn('done')).toEqual(['c'])
    expect(t.live()?.trim()).toBe('Moved to Done.')
    await t.key('c', 'ArrowRight')
    expect(t.host.moves.length).toBe(1)
  })

  it('5: arrow down reorders within a column with toIndex', async () => {
    const t = await setup()
    await t.key('a', ' ')
    await t.key('a', 'ArrowDown')
    expect(t.host.moves).toEqual([{ cardId: 'a', fromColumnId: 'todo', toColumnId: 'todo', toIndex: 1 }])
    expect(t.cardsIn('todo')).toEqual(['b', 'a'])
    expect(t.live()?.trim()).toBe('Position 2 of 2.')
  })

  it('6: Escape and blur cancel a keyboard grab', async () => {
    const t = await setup()
    await t.key('a', ' ')
    await t.key('a', 'Escape')
    expect(t.live()?.trim()).toBe('Move cancelled.')
    expect(t.card('a').getAttribute('data-state')).toBe('idle')
    await t.key('b', ' ')
    t.card('b').dispatchEvent(new FocusEvent('blur'))
    await t.settle()
    expect(t.card('b').getAttribute('data-state')).toBe('idle')
  })

  it('7: disabled cards are out of the tab order and cannot be grabbed; keyboardDraggable=false keeps pointer drag only', async () => {
    const t = await setup((h) => h.lockedId.set('a'))
    const a = t.card('a')
    expect(a.getAttribute('tabindex')).toBeNull()
    expect(a.getAttribute('aria-disabled')).toBe('true')
    expect(a.getAttribute('draggable')).toBe('false')
    expect(t.drag('dragstart', a).defaultPrevented).toBe(true)
    await t.key('a', ' ')
    expect(a.getAttribute('data-state')).toBe('idle')

    t.host.kbd.set(false)
    await t.settle()
    expect(t.card('b').getAttribute('role')).toBeNull()
    expect(t.card('b').getAttribute('draggable')).toBe('true')
  })

  it('8: count shows the number; empty column falls back to "No cards"', async () => {
    const t = await setup()
    expect(t.column('todo').querySelector('[data-slot="kanban-column-count"]')!.textContent).toBe('2')
    expect(t.column('done').querySelector('[data-slot="kanban-column-empty"]')!.textContent).toBe('No cards')
  })
})
