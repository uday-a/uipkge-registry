import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  ScrollSpy,
  ScrollSpyTitle,
  ScrollSpyList,
  ScrollSpyItem,
  ScrollSpyLink,
  ScrollSpyIndicator,
  ScrollSpyStepper,
} from '../index'

// IntersectionObserver is not available in happy-dom; polyfill locally.
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
  root = null
  rootMargin = ''
  thresholds = []
}
// @ts-expect-error test polyfill
globalThis.IntersectionObserver = globalThis.IntersectionObserver ?? IO

describe('ScrollSpy (Vue)', () => {
  it('renders nav element with data-slot="scroll-spy"', () => {
    const w = mount(ScrollSpy, { attachTo: document.body })
    expect(w.find('[data-slot="scroll-spy"]').exists()).toBe(true)
    expect(w.find('nav[data-slot="scroll-spy"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge on nav', () => {
    const w = mount(ScrollSpy, { attachTo: document.body })
    expect(w.find('[data-slot="scroll-spy"][data-uipkge]').exists()).toBe(true)
    w.unmount()
  })

  it('renders ScrollSpyLink children from items prop', () => {
    const w = mount(ScrollSpy, {
      props: {
        items: [
          { href: '#section-1', title: 'Section 1' },
          { href: '#section-2', title: 'Section 2' },
        ],
      },
      attachTo: document.body,
    })
    const links = w.findAll('[data-slot="scroll-spy-link"]')
    expect(links.length).toBe(2)
    w.unmount()
  })

  it('renders href on scroll-spy links', () => {
    const w = mount(ScrollSpy, {
      props: { items: [{ href: '#section-1', title: 'Section 1' }] },
      attachTo: document.body,
    })
    const link = w.find('a[data-slot="scroll-spy-link"]')
    expect(link.attributes('href')).toBe('#section-1')
    w.unmount()
  })

  it('renders title text on scroll-spy links', () => {
    const w = mount(ScrollSpy, {
      props: { items: [{ href: '#sec', title: 'My Section' }] },
      attachTo: document.body,
    })
    expect(w.text()).toContain('My Section')
    w.unmount()
  })

  it('renders title when title prop is provided', () => {
    const w = mount(ScrollSpy, {
      props: {
        title: 'On this page',
        items: [{ href: '#sec', title: 'My Section' }],
      },
      attachTo: document.body,
    })
    const title = w.find('[data-slot="scroll-spy-title"]')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('On this page')
    w.unmount()
  })

  it('renders default slot when no items provided', () => {
    const w = mount(ScrollSpy, {
      slots: { default: '<div>Custom content</div>' },
      attachTo: document.body,
    })
    expect(w.text()).toContain('Custom content')
    w.unmount()
  })

  it('renders angle circuit variant with SVG track', () => {
    const w = mount(ScrollSpy, {
      props: {
        variant: 'angle',
        items: [
          {
            href: '#sec-1',
            title: 'Sec 1',
            children: [{ href: '#sec-1-1', title: 'Sec 1.1' }],
          },
          { href: '#sec-2', title: 'Sec 2' },
        ],
      },
      attachTo: document.body,
    })
    const nav = w.find('nav[data-slot="scroll-spy"]')
    expect(nav.attributes('data-variant')).toBe('angle')
    expect(nav.attributes('data-turn')).toBe('rounded')
    expect(w.find('svg').exists()).toBe(true)
    w.unmount()
  })

  it('renders rounded turn variant and fill indicator', () => {
    const w = mount(ScrollSpy, {
      props: {
        turn: 'rounded',
        indicator: 'fill',
        items: [
          { href: '#sec-1', title: 'Sec 1' },
          { href: '#sec-2', title: 'Sec 2' },
        ],
      },
      attachTo: document.body,
    })
    const nav = w.find('nav[data-slot="scroll-spy"]')
    expect(nav.attributes('data-variant')).toBe('rounded')
    expect(nav.attributes('data-turn')).toBe('rounded')
    expect(nav.attributes('data-indicator')).toBe('fill')
    expect(w.find('svg').exists()).toBe(true)
    w.unmount()
  })

  it('supports progress indicator mode for reading scroll progress', () => {
    const w = mount(ScrollSpy, {
      props: {
        indicator: 'progress',
        items: [
          { href: '#sec-1', title: 'Sec 1' },
          { href: '#sec-2', title: 'Sec 2' },
        ],
      },
      attachTo: document.body,
    })
    const nav = w.find('nav[data-slot="scroll-spy"]')
    expect(nav.attributes('data-indicator')).toBe('progress')
    w.unmount()
  })

  it('supports left side position with right-side rail', () => {
    const w = mount(ScrollSpy, {
      props: {
        position: 'left',
        railPosition: 'right',
        items: [
          { href: '#sec-1', title: 'Sec 1' },
          { href: '#sec-2', title: 'Sec 2' },
        ],
      },
      attachTo: document.body,
    })
    const nav = w.find('nav[data-slot="scroll-spy"]')
    expect(nav.attributes('data-position')).toBe('left')
    expect(nav.attributes('data-rail-position')).toBe('right')
    const list = w.find('ul[data-slot="scroll-spy-list"]')
    expect(list.classes()).toContain('border-r')
    w.unmount()
  })

  it('renders top sticky stepper mode', () => {
    const w = mount(ScrollSpy, {
      props: {
        position: 'top',
        items: [
          { href: '#step-1', title: 'Step 1' },
          { href: '#step-2', title: 'Step 2' },
        ],
      },
      attachTo: document.body,
    })
    expect(w.find('[data-slot="scroll-spy-stepper-top"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders top sticky scroll spy mode highlighting only active section', () => {
    const w = mount(ScrollSpy, {
      props: {
        position: 'top',
        variant: 'scrollspy',
        items: [
          { href: '#sec-1', title: 'Sec 1' },
          { href: '#sec-2', title: 'Sec 2' },
        ],
      },
      attachTo: document.body,
    })
    expect(w.find('[data-slot="scroll-spy-top"]').exists()).toBe(true)
    const buttons = w.findAll('[data-slot="scroll-spy-top"] button')
    expect(buttons.length).toBe(2)
    expect(buttons[0].attributes('data-active')).toBe('true')
    expect(buttons[1].attributes('data-active')).toBe('false')
    w.unmount()
  })

  it('renders bottom floating stepper mode', () => {
    const w = mount(ScrollSpy, {
      props: {
        position: 'bottom',
        items: [
          { href: '#step-1', title: 'Step 1' },
          { href: '#step-2', title: 'Step 2' },
        ],
      },
      attachTo: document.body,
    })
    expect(w.find('[data-slot="scroll-spy-stepper-bottom"]').exists()).toBe(true)
    w.unmount()
  })

  it('supports compound component composition', () => {
    const Comp = {
      components: {
        ScrollSpy,
        ScrollSpyTitle,
        ScrollSpyList,
        ScrollSpyIndicator,
        ScrollSpyItem,
        ScrollSpyLink,
      },
      template: `
        <ScrollSpy>
          <ScrollSpyTitle>On this page</ScrollSpyTitle>
          <ScrollSpyList>
            <ScrollSpyIndicator />
            <ScrollSpyItem value="#first">
              <ScrollSpyLink href="#first">First Item</ScrollSpyLink>
            </ScrollSpyItem>
            <ScrollSpyItem value="#second">
              <ScrollSpyLink href="#second">Second Item</ScrollSpyLink>
            </ScrollSpyItem>
          </ScrollSpyList>
        </ScrollSpy>
      `,
    }
    const w = mount(Comp, { attachTo: document.body })
    expect(w.find('[data-slot="scroll-spy-title"]').text()).toBe('On this page')
    expect(w.findAll('[data-slot="scroll-spy-link"]').length).toBe(2)
    w.unmount()
  })

  it('supports keepScrolled prop and sets data-keep-scrolled', () => {
    const w = mount(ScrollSpy, {
      props: {
        keepScrolled: true,
        items: [
          { href: '#sec-1', title: 'Sec 1' },
          { href: '#sec-2', title: 'Sec 2' },
        ],
      },
      attachTo: document.body,
    })
    expect(w.find('[data-slot="scroll-spy"]').attributes('data-keep-scrolled')).toBe('true')
    w.unmount()
  })

  it('supports highlightParent and marks parent link with data-parent-active', () => {
    const w = mount(ScrollSpy, {
      props: {
        modelValue: '#sub-1',
        highlightParent: true,
        items: [
          {
            href: '#parent-1',
            title: 'Parent 1',
            children: [{ href: '#sub-1', title: 'Sub 1' }],
          },
          { href: '#parent-2', title: 'Parent 2' },
        ],
      },
      attachTo: document.body,
    })
    const links = w.findAll('[data-slot="scroll-spy-link"]')
    const parentLink = links.find((l) => l.attributes('href') === '#parent-1')
    const subLink = links.find((l) => l.attributes('href') === '#sub-1')

    expect(subLink?.attributes('data-active')).toBe('true')
    expect(parentLink?.attributes('data-parent-active')).toBe('true')
    w.unmount()
  })

  it('supports lineWidth prop and sets data-line-width', () => {
    const w = mount(ScrollSpy, {
      props: {
        lineWidth: 3,
        items: [
          { href: '#sec-1', title: 'Sec 1' },
          { href: '#sec-2', title: 'Sec 2' },
        ],
      },
      attachTo: document.body,
    })
    const nav = w.find('[data-slot="scroll-spy"]')
    expect(nav.attributes('data-line-width')).toBe('3')
    w.unmount()
  })

  it('supports color prop, sets data-color, applies color only to handle and keeps link text neutral', () => {
    const w = mount(ScrollSpy, {
      props: {
        color: 'destructive',
        items: [
          { href: '#sec-1', title: 'Sec 1' },
          { href: '#sec-2', title: 'Sec 2' },
        ],
      },
      attachTo: document.body,
    })
    const nav = w.find('[data-slot="scroll-spy"]')
    expect(nav.attributes('data-color')).toBe('destructive')

    const activeLink = w.find('[data-slot="scroll-spy-link"][data-active="true"]')
    expect(activeLink.exists()).toBe(true)
    // Link text MUST be neutral foreground, NOT colored
    expect(activeLink.classes()).toContain('text-foreground')
    expect(activeLink.classes()).toContain('font-medium')
    expect(activeLink.classes()).not.toContain('text-destructive')
    expect(activeLink.classes()).not.toContain('text-primary')

    w.unmount()
  })
})
