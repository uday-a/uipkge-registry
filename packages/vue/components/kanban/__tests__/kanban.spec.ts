import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Kanban from '../Kanban.vue'
import KanbanBoard from '../KanbanBoard.vue'
import KanbanColumn from '../KanbanColumn.vue'
import KanbanColumnHeader from '../KanbanColumnHeader.vue'
import KanbanColumnTitle from '../KanbanColumnTitle.vue'
import KanbanColumnCount from '../KanbanColumnCount.vue'
import KanbanColumnBody from '../KanbanColumnBody.vue'
import KanbanCard from '../KanbanCard.vue'
import KanbanCardTitle from '../KanbanCardTitle.vue'

/** Two-column board with `cards` laid out per column, attached to the document
 *  so the card's DOM queries (closest / querySelectorAll) resolve. */
function mountBoard(cards: Record<string, string[]> = { todo: ['card-1'], done: ['card-2'] }, cardProps = {}) {
  return mount(Kanban, {
    attachTo: document.body,
    slots: {
      default: () =>
        h(KanbanBoard, {}, () =>
          Object.entries(cards).map(([columnId, ids]) =>
            h(KanbanColumn, { id: columnId, label: columnId === 'todo' ? 'To do' : 'Done' }, () => [
              h(KanbanColumnHeader, {}, () => [
                h(KanbanColumnTitle, {}, () => columnId),
                h(KanbanColumnCount, { count: ids.length }),
              ]),
              h(KanbanColumnBody, {}, () =>
                ids.map((id) => h(KanbanCard, { id, ...cardProps }, () => [h(KanbanCardTitle, {}, () => id)])),
              ),
            ]),
          ),
        ),
    },
  })
}

describe('Kanban Primitive (Vue)', () => {
  it('renders without crashing and applies custom class', () => {
    const wrapper = mount(Kanban, {
      props: { class: 'custom-kanban' },
    })
    expect(wrapper.find('[data-slot="kanban"]').exists()).toBe(true)
    expect(wrapper.find('[data-slot="kanban"]').classes()).toContain('custom-kanban')
    wrapper.unmount()
  })

  it('renders compound Kanban elements properly', () => {
    const wrapper = mountBoard({ todo: ['card-1'] })

    expect(wrapper.find('[data-slot="kanban"]').exists()).toBe(true)
    expect(wrapper.find('[data-slot="kanban-board"]').exists()).toBe(true)
    expect(wrapper.find('[data-slot="kanban-column"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('todo')
    expect(wrapper.text()).toContain('card-1')
    wrapper.unmount()
  })

  // A mouse-only board excludes keyboard and screen-reader users from the
  // primitive's only real interaction, so these cover the whole grab cycle.
  it('exposes each draggable card to assistive tech as a focusable grab target', () => {
    const wrapper = mountBoard()
    const card = wrapper.find('[data-card-id="card-1"]')

    expect(card.attributes('role')).toBe('button')
    expect(card.attributes('tabindex')).toBe('0')
    expect(card.attributes('aria-roledescription')).toBe('draggable card')
    expect(card.attributes('aria-pressed')).toBe('false')
    expect(wrapper.find('[data-slot="kanban-live-region"]').attributes('aria-live')).toBe('polite')
    wrapper.unmount()
  })

  it('names each column for screen readers, falling back to the id', () => {
    const wrapper = mountBoard()
    const [todo, done] = wrapper.findAll('[data-slot="kanban-column"]')

    expect(todo.attributes('role')).toBe('group')
    expect(todo.attributes('aria-label')).toBe('To do')
    expect(done.attributes('aria-label')).toBe('Done')
    wrapper.unmount()
  })

  it('picks a card up on Space and announces how to move it', async () => {
    const wrapper = mountBoard()
    const card = wrapper.find('[data-card-id="card-1"]')

    await card.trigger('keydown', { key: ' ' })

    expect(card.attributes('aria-pressed')).toBe('true')
    expect(card.attributes('data-state')).toBe('grabbed')
    expect(wrapper.find('[data-slot="kanban-live-region"]').text()).toContain('Picked up card')
    wrapper.unmount()
  })

  it('moves a grabbed card to the next column on ArrowRight', async () => {
    const wrapper = mountBoard()
    const card = wrapper.find('[data-card-id="card-1"]')

    await card.trigger('keydown', { key: ' ' })
    await card.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('card-move')?.[0]).toEqual([{ cardId: 'card-1', fromColumnId: 'todo', toColumnId: 'done' }])
    expect(wrapper.find('[data-slot="kanban-live-region"]').text()).toContain('Moved to Done')
    wrapper.unmount()
  })

  it('reorders within a column on ArrowDown, reporting the new position', async () => {
    const wrapper = mountBoard({ todo: ['card-1', 'card-2'], done: [] })
    const card = wrapper.find('[data-card-id="card-1"]')

    await card.trigger('keydown', { key: ' ' })
    await card.trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('card-move')?.[0]).toEqual([
      { cardId: 'card-1', fromColumnId: 'todo', toColumnId: 'todo', toIndex: 1 },
    ])
    expect(wrapper.find('[data-slot="kanban-live-region"]').text()).toContain('Position 2 of 2')
    wrapper.unmount()
  })

  it('stops at the ends of the board instead of wrapping around', async () => {
    const wrapper = mountBoard()
    const card = wrapper.find('[data-card-id="card-1"]')

    await card.trigger('keydown', { key: ' ' })
    await card.trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('card-move')).toBeUndefined()
    wrapper.unmount()
  })

  it('ignores arrow keys until the card is grabbed', async () => {
    const wrapper = mountBoard()
    const card = wrapper.find('[data-card-id="card-1"]')

    await card.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('card-move')).toBeUndefined()
    wrapper.unmount()
  })

  it('releases the card on Escape and on blur so it cannot get stuck held', async () => {
    const wrapper = mountBoard()
    const card = wrapper.find('[data-card-id="card-1"]')

    await card.trigger('keydown', { key: ' ' })
    await card.trigger('keydown', { key: 'Escape' })
    expect(card.attributes('aria-pressed')).toBe('false')
    expect(wrapper.find('[data-slot="kanban-live-region"]').text()).toContain('Move cancelled')

    await card.trigger('keydown', { key: ' ' })
    await card.trigger('blur')
    expect(card.attributes('aria-pressed')).toBe('false')
    wrapper.unmount()
  })

  it('drops the card on a second Space', async () => {
    const wrapper = mountBoard()
    const card = wrapper.find('[data-card-id="card-1"]')

    await card.trigger('keydown', { key: ' ' })
    await card.trigger('keydown', { key: ' ' })

    expect(card.attributes('aria-pressed')).toBe('false')
    expect(wrapper.find('[data-slot="kanban-live-region"]').text()).toContain('Card dropped')
    wrapper.unmount()
  })

  it('keeps disabled cards out of the tab order and unmovable', async () => {
    const wrapper = mountBoard({ todo: ['card-1'], done: [] }, { disabled: true })
    const card = wrapper.find('[data-card-id="card-1"]')

    expect(card.attributes('tabindex')).toBeUndefined()
    expect(card.attributes('aria-disabled')).toBe('true')
    expect(card.attributes('draggable')).toBe('false')

    await card.trigger('keydown', { key: ' ' })
    await card.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('card-move')).toBeUndefined()
    wrapper.unmount()
  })

  it('leaves pointer dragging intact when keyboardDraggable is off', async () => {
    const wrapper = mountBoard({ todo: ['card-1'], done: [] }, { keyboardDraggable: false })
    const card = wrapper.find('[data-card-id="card-1"]')

    expect(card.attributes('tabindex')).toBeUndefined()
    expect(card.attributes('draggable')).toBe('true')

    await card.trigger('keydown', { key: ' ' })
    expect(card.attributes('data-state')).toBe('idle')
    wrapper.unmount()
  })
})
