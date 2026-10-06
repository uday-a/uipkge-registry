// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiFileUploadComponent,
  UiFileUploadContentComponent,
  UiFileUploadItemComponent,
  UiFileUploadItemNameComponent,
  UiFileUploadItemSizeComponent,
} from './file-upload.component'

// React FileUpload parity: clicking / Enter / Space on the dropzone opens the native picker,
// picked or dropped files become the value (first only unless multiple; multiple replaces
// the list), the drag highlight clears on leave, disabled is inert and out of the tab order,
// and the Item part shows name / size / remove. If these broke, users could not pick files
// at all, or the list would silently keep stale files.

const file = (name: string, size = 2048) => new File(['x'.repeat(size)], name)
const classes = (e: Element) => [...e.classList].sort().join(' ')
const sorted = (c: string) => c.split(' ').sort().join(' ')
const fileList = (...files: File[]) =>
  Object.assign([...files], { item: (i: number) => files[i] }) as unknown as FileList

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  const zone = () => el.querySelector<HTMLElement>('[role="button"]')!
  const input = () => el.querySelector<HTMLInputElement>('input[type=file]')!
  const pick = (...files: File[]) => {
    Object.defineProperty(input(), 'files', { value: fileList(...files), configurable: true })
    input().dispatchEvent(new Event('change'))
    fixture.detectChanges()
  }
  return { fixture, el, zone, input, pick, flush: () => fixture.detectChanges() }
}

describe('FileUpload (angular, 7 checks)', () => {
  it('1: renders React DOM: space-y-3 host, sr-only input sibling, dashed dropzone with default icon + copy', () => {
    @Component({ standalone: true, imports: [UiFileUploadComponent], template: `<ui-file-upload accept="image/*" />` })
    class Host {}
    const { el, zone, input } = render(Host)
    const host = el.querySelector('ui-file-upload')!
    expect(classes(host)).toBe(sorted('block space-y-3'))
    expect(input().nextElementSibling).toBe(zone())
    expect(classes(input())).toBe(sorted('sr-only'))
    expect(input().getAttribute('accept')).toBe('image/*')
    expect(zone().getAttribute('tabindex')).toBe('0')
    expect(zone().getAttribute('aria-label')).toBe('Upload file')
    expect(zone().hasAttribute('aria-disabled')).toBe(false)
    expect(zone().classList.contains('border-dashed')).toBe(true)
    expect(zone().querySelector('svg')!.getAttribute('class')).toBe('text-muted-foreground mb-2 size-10')
    expect(zone().textContent).toContain('Click to upload or drag and drop')
    expect(zone().querySelector('.text-muted-foreground\\/70')!.textContent).toBe('image/*')
  })

  it('2: click, Enter and Space open the native picker', () => {
    @Component({ standalone: true, imports: [UiFileUploadComponent], template: `<ui-file-upload />` })
    class Host {}
    const { zone, input } = render(Host)
    let opened = 0
    input().click = () => void opened++
    zone().click()
    for (const key of ['Enter', ' ']) {
      const e = new KeyboardEvent('keydown', { key, cancelable: true })
      zone().dispatchEvent(e)
      expect(e.defaultPrevented).toBe(true)
    }
    expect(opened).toBe(3)
  })

  it('3: single mode keeps the first file; multiple replaces the list with the new selection', () => {
    @Component({
      standalone: true,
      imports: [UiFileUploadComponent],
      template: `<ui-file-upload id="s" [(value)]="one" /><ui-file-upload id="m" multiple [(value)]="many" />`,
    })
    class Host {
      one: File[] = []
      many: File[] = []
    }
    const { fixture, el, flush } = render(Host)
    const pickInto = (id: string, ...files: File[]) => {
      const input = el.querySelector<HTMLInputElement>(`#${id} input`)!
      Object.defineProperty(input, 'files', { value: fileList(...files), configurable: true })
      input.dispatchEvent(new Event('change'))
      flush()
    }
    pickInto('s', file('a.png'), file('b.png'))
    expect(fixture.componentInstance.one.map((f) => f.name)).toEqual(['a.png'])
    pickInto('m', file('a.pdf'), file('b.pdf'))
    pickInto('m', file('c.pdf'))
    expect(fixture.componentInstance.many.map((f) => f.name)).toEqual(['c.pdf'])
    expect(el.querySelector('#m [role=button]')!.getAttribute('aria-label')).toBe('Upload files')
  })

  it('4: drag over highlights, drag leave clears, drop emits the dropped files', () => {
    const seen: string[][] = []
    @Component({
      standalone: true,
      imports: [UiFileUploadComponent],
      template: `<ui-file-upload multiple (valueChange)="seen.push($any($event).map(n))" />`,
    })
    class Host {
      seen = seen
      n = (f: File) => f.name
    }
    const { zone, flush } = render(Host)
    const over = new Event('dragover', { cancelable: true })
    zone().dispatchEvent(over)
    flush()
    expect(over.defaultPrevented).toBe(true)
    expect(zone().classList.contains('border-primary')).toBe(true)
    zone().dispatchEvent(new Event('dragleave'))
    flush()
    expect(zone().classList.contains('border-primary')).toBe(false)
    zone().dispatchEvent(
      Object.assign(new Event('drop', { cancelable: true }), { dataTransfer: { files: fileList(file('d.txt')) } }),
    )
    expect(seen).toEqual([['d.txt']])
  })

  it('5: disabled: out of tab order, aria-disabled, dimmed, picker never opens, files ignored', () => {
    @Component({
      standalone: true,
      imports: [UiFileUploadComponent],
      template: `<ui-file-upload disabled (valueChange)="n = n + 1" />`,
    })
    class Host {
      n = 0
    }
    const { fixture, zone, input, pick } = render(Host)
    let opened = 0
    input().click = () => void opened++
    expect(zone().getAttribute('tabindex')).toBe('-1')
    expect(zone().getAttribute('aria-disabled')).toBe('true')
    expect(zone().classList.contains('opacity-50')).toBe(true)
    expect(input().disabled).toBe(true)
    zone().click()
    pick(file('a'))
    expect(opened).toBe(0)
    expect(fixture.componentInstance.n).toBe(0)
  })

  it('6: slots: icon and default content replace the defaults; content renders below the dropzone', () => {
    @Component({
      standalone: true,
      imports: [UiFileUploadComponent, UiFileUploadContentComponent],
      template: `<ui-file-upload>
        <i slot="icon" class="custom-icon"></i>
        <p class="custom-copy">Drop assets</p>
        <ui-file-upload-content><span class="row">x</span></ui-file-upload-content>
      </ui-file-upload>`,
    })
    class Host {}
    const { el, zone } = render(Host)
    expect(zone().querySelector('.custom-icon')).not.toBeNull()
    expect(zone().querySelector('svg')).toBeNull()
    expect(zone().querySelector('.custom-copy')).not.toBeNull()
    expect(zone().textContent).not.toContain('Click to upload')
    const content = el.querySelector('ui-file-upload-content')!
    expect(content.previousElementSibling).toBe(zone())
    expect(classes(content)).toBe(sorted('block space-y-2'))
  })

  it('7: Item shows name, size in KB and a remove button; Name / Size parts carry React classes', () => {
    @Component({
      standalone: true,
      imports: [UiFileUploadItemComponent, UiFileUploadItemNameComponent, UiFileUploadItemSizeComponent],
      template: `<ui-file-upload-item [file]="f" (remove)="removed = true" />
        <p ui-file-upload-item-name>n</p>
        <span ui-file-upload-item-size>s</span>`,
    })
    class Host {
      f = file('report.pdf', 3072)
      removed = false
    }
    const { fixture, el } = render(Host)
    const item = el.querySelector('ui-file-upload-item')!
    expect(classes(item)).toBe(sorted('bg-muted/50 flex items-center gap-3 rounded-md border p-3'))
    expect(item.querySelector('.truncate')!.textContent).toBe('report.pdf')
    expect(item.querySelector('.text-xs')!.textContent).toBe('3.0 KB')
    item.querySelector<HTMLButtonElement>('button')!.click()
    expect(fixture.componentInstance.removed).toBe(true)
    expect(classes(el.querySelector('p[ui-file-upload-item-name]')!)).toBe(sorted('block truncate text-sm font-medium'))
    expect(classes(el.querySelector('span[ui-file-upload-item-size]')!)).toBe(sorted('text-muted-foreground text-xs'))
  })
})
