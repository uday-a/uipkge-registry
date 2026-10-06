import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiRichTextEditorComponent } from './rich-text-editor.component'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, './rich-text-editor.component.ts'), 'utf8')

describe('RichTextEditor (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(src).toContain('standalone: true')
  })
  it('2: defaults mirror React (value, placeholder, 120px)', () => {
    const c = new UiRichTextEditorComponent()
    expect(c.value).toBeUndefined()
    expect(c.modelValue).toBe('')
    expect(c.placeholder).toBe('Start writing...')
    expect(c.minHeight).toBe('120px')
    expect(c.editorClass).toBeUndefined()
    expect(c.editorClassName).toBeUndefined()
    expect(c.disabled).toBe(false)
    expect(c.editor).toBeNull()
    expect(c.linkOpen).toBe(false)
    expect(c.showExtended).toBe(false)
  })
  it('3: all toolbar commands are null-editor safe', () => {
    const c = new UiRichTextEditorComponent()
    expect(() => {
      c.toggleMark('bold')
      c.toggleMark('italic')
      c.toggleMark('underline')
      c.toggleMark('strike')
      c.toggleMark('code')
      c.setBlock('h1')
      c.setBlock('h2')
      c.setBlock('bulletList')
      c.setBlock('orderedList')
      c.setBlock('blockquote')
      c.setBlock('codeBlock')
      c.setBlock('paragraph')
      c.setAlign('left')
      c.setAlign('center')
      c.setAlign('right')
      c.insertHr()
      c.toggleTaskList()
      c.clearFormatting()
      c.undo()
      c.redo()
      c.focusEditor()
      c.openLinkEditor()
      c.applyLink()
      c.removeLink()
      c.closeLinkEditor()
    }).not.toThrow()
    expect(c.isActive('bold')).toBe(false)
    expect(c.isMarkActive('italic')).toBe(false)
    expect(c.linkOpen).toBe(false)
  })
  it('4: setContent emits both outputs; disabled blocks', () => {
    const c = new UiRichTextEditorComponent()
    const values: string[] = []
    const models: string[] = []
    c.valueChange.subscribe((v: string) => values.push(v))
    c.modelValueChange.subscribe((v: string) => models.push(v))
    c.setContent('<p>hi</p>')
    expect(values).toEqual(['<p>hi</p>'])
    expect(models).toEqual(['<p>hi</p>'])
    expect(c.value).toBe('<p>hi</p>')
    const d = new UiRichTextEditorComponent()
    d.disabled = true
    let fired = false
    d.modelValueChange.subscribe(() => (fired = true))
    d.setContent('<p>x</p>')
    d.toggleMark('bold')
    d.clear()
    expect(fired).toBe(false)
    expect(d.modelValue).toBe('')
  })
  it('5: handleUpdate syncs fields and emits; clear resets', () => {
    const c = new UiRichTextEditorComponent()
    let got: string | null = null
    c.valueChange.subscribe((v: string) => (got = v))
    c.handleUpdate('<p>typed</p>')
    expect(c.value).toBe('<p>typed</p>')
    expect(c.modelValue).toBe('<p>typed</p>')
    expect(got).toBe('<p>typed</p>')
    c.clear()
    expect(c.modelValue).toBe('')
  })
  it('6: wordCount counts text words', () => {
    const c = new UiRichTextEditorComponent()
    c.modelValue = '<p>hello <strong>world</strong></p>'
    expect(c.wordCount()).toBe(2)
    c.modelValue = ''
    expect(c.wordCount()).toBe(0)
  })
  it('7: extend toggle flips; link popover guards without editor', () => {
    const c = new UiRichTextEditorComponent()
    expect(c.showExtended).toBe(false)
    c.toggleExtended()
    expect(c.showExtended).toBe(true)
    c.openLinkEditor()
    expect(c.linkOpen).toBe(false)
    c.linkUrl = 'https://x.test'
    c.applyLink()
    expect(c.linkOpen).toBe(false)
    c.closeLinkEditor()
    expect(c.linkOpen).toBe(false)
  })
  it('8: TipTap wiring matches React extensions', () => {
    for (const pkg of [
      '@tiptap/core',
      '@tiptap/starter-kit',
      '@tiptap/extension-placeholder',
      '@tiptap/extension-underline',
      '@tiptap/extension-link',
      '@tiptap/extension-text-align',
      '@tiptap/extension-task-list',
      '@tiptap/extension-task-item',
    ]) {
      expect(src).toContain(pkg)
    }
    expect(src).toContain('new Editor(')
    expect(src).toContain('TaskItem.configure({ nested: true })')
    expect(src).toContain("TextAlign.configure({ types: ['heading', 'paragraph'] })")
    expect(src).toContain('emitUpdate: false')
    expect(src).toContain('editor?.destroy()')
    expect(src).not.toContain('execCommand')
  })
  it('9: link popover form + extended row present', () => {
    expect(src).toContain('Link URL')
    expect(src).toContain('(submit)="applyLink()')
    expect(src).toContain('(click)="removeLink()"')
    expect(src).toContain('(click)="openLinkEditor()"')
    for (const label of [
      'Heading 1',
      'Heading 2',
      'Inline code',
      'Blockquote',
      'Divider',
      'Task list',
      'Align left',
      'Align center',
      'Align right',
      'Clear formatting',
    ]) {
      expect(src).toContain(`aria-label="${label}"`)
    }
    expect(src).toContain('grid-rows-[1fr]')
    expect(src).toContain('(click)="toggleExtended()"')
  })
  it('10: data-slot contract + forms import stays type-only', () => {
    expect(src).toContain('"rich-text-editor"')
    expect(src).toContain('@angular/forms')
    expect(src).toContain('import type')
    expect(src).toContain('(click)="undo()"')
    expect(src).toContain('(click)="redo()"')
  })
})
