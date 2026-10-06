// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import {
  UiFormActionsComponent,
  UiFormControlDirective,
  UiFormDescriptionComponent,
  UiFormDirective,
  UiFormFieldDirective,
  UiFormItemComponent,
  UiFormLabelComponent,
  UiFormMessageComponent,
  UiFormSectionComponent,
  UiFormStatusComponent,
} from './form.component'
import { UiInputComponent } from '../input/input.component'

// The shadcn / react-hook-form Form, as users meet it: the label is linked to the control,
// the control is described by its description (and, once invalid, its message), errors
// stay hidden until the first submit (react-hook-form's default) and then update live,
// the message is announced (role=alert), and the helpers (FormItem label / help / status,
// FormSection, FormActions, FormStatus) render React's markup. If the ids drifted, screen
// readers would read the wrong hint; if errors showed early, users would be scolded
// before typing.

const Parts = [
  ReactiveFormsModule,
  UiFormDirective,
  UiFormFieldDirective,
  UiFormItemComponent,
  UiFormLabelComponent,
  UiFormControlDirective,
  UiFormDescriptionComponent,
  UiFormMessageComponent,
  UiInputComponent,
]

const emailRequired = (c: { value: unknown }) =>
  /^[^@\s]+@[^@\s]+$/.test(String(c.value ?? '')) ? null : { email: { message: 'Enter a valid email' } }

@Component({
  standalone: true,
  imports: Parts,
  template: `
    <form uiForm [formGroup]="fg">
      <ng-container uiFormField="email">
        <ui-form-item>
          <label ui-form-label>Email</label>
          <ui-input uiFormControl formControlName="email" />
          <p ui-form-description>We never share it.</p>
          <ui-form-message />
        </ui-form-item>
      </ng-container>
      <button type="submit">Go</button>
    </form>
  `,
})
class LoginHost {
  fg = new FormGroup({ email: new FormControl('', { validators: [emailRequired] }) })
}

async function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  await fixture.whenStable()
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  document.body.appendChild(el)
  const q = <E extends Element = HTMLElement>(s: string) => el.querySelector<E>(s)!
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }
  return { fixture, el, q, settle, cleanup: () => el.remove() }
}

describe('Form (angular, 9 checks)', () => {
  it('1: FormItem / Label / Control / Description share one id family (label for, aria-describedby)', async () => {
    const { q, cleanup } = await render(LoginHost)
    const item = q('[data-slot="form-item"]')
    expect(['grid', 'gap-1.5'].every((c) => item.classList.contains(c))).toBe(true)
    const label = q('label')
    const input = q<HTMLInputElement>('input')
    const desc = q('[data-slot="form-description"]')
    expect(label.getAttribute('data-slot')).toBe('form-label')
    expect(label.getAttribute('data-error')).toBe('false')
    expect(label.getAttribute('for')).toMatch(/^form-\d+-form-item$/)
    expect(input.id).toBe(label.getAttribute('for'))
    expect(input.getAttribute('data-slot')).toBe('form-control')
    expect(desc.id).toBe(`${input.id}-description`)
    expect(input.getAttribute('aria-describedby')).toBe(desc.id)
    expect(input.getAttribute('aria-invalid')).toBe('false')
    // The label is the Label primitive's markup plus the error variant.
    expect(
      ['flex', 'text-sm', 'font-medium', 'data-[error=true]:text-destructive'].every((c) =>
        label.classList.contains(c),
      ),
    ).toBe(true)
    cleanup()
  })

  it('2: no message and no error before the first submit, even though the field is invalid', async () => {
    const { el, q, cleanup } = await render(LoginHost)
    expect(el.querySelector('[data-slot="form-message"]')).toBeNull()
    expect(q('ui-form-message').childElementCount).toBe(0)
    cleanup()
  })

  it('3: submit reveals the error: role=alert message, aria-invalid, describedby includes the message, red label', async () => {
    const { q, settle, cleanup } = await render(LoginHost)
    q<HTMLButtonElement>('button[type="submit"]').click()
    await settle()
    const msg = q('[data-slot="form-message"]')
    expect(msg.getAttribute('role')).toBe('alert')
    expect(msg.textContent?.trim()).toBe('Enter a valid email')
    expect(msg.className).toBe('text-destructive text-sm')
    const input = q<HTMLInputElement>('input')
    expect(msg.id).toBe(`${input.id}-message`)
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(q('[data-slot="input"]').getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe(`${input.id}-description ${input.id}-message`)
    expect(q('label').getAttribute('data-error')).toBe('true')
    cleanup()
  })

  it('4: after submit the error follows typing live (re-validate on change)', async () => {
    const { el, q, settle, cleanup } = await render(LoginHost)
    q<HTMLButtonElement>('button[type="submit"]').click()
    await settle()
    const input = q<HTMLInputElement>('input')
    input.value = 'a@b.co'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()
    expect(el.querySelector('[data-slot="form-message"]')).toBeNull()
    expect(input.getAttribute('aria-invalid')).toBe('false')
    cleanup()
  })

  it('5: FormItem props: label (linked), required marker, description, status help (role=alert on error)', async () => {
    @Component({
      standalone: true,
      imports: [UiFormItemComponent, UiInputComponent],
      template: `
        <ui-form-item label="Username" required description="Pick one" status="error" help="Taken">
          <ui-input />
        </ui-form-item>
      `,
    })
    class Host {}
    const { el, q, cleanup } = await render(Host)
    const row = q('[data-slot="form-item"]').firstElementChild!
    expect(row.className).toBe('flex items-center gap-1')
    const label = row.querySelector('label')!
    expect(label.getAttribute('for')).toMatch(/-form-item$/)
    expect(label.classList.contains('text-destructive')).toBe(true)
    expect(row.querySelector('span')!.textContent!.trim()).toBe('*')
    const body = row.nextElementSibling!
    expect(body.classList.contains('[&_input]:border-destructive')).toBe(true)
    const help = el.querySelector('[role="alert"]')!
    expect(help.textContent).toBe('Taken')
    expect(['text-xs', 'text-destructive'].every((c) => help.classList.contains(c))).toBe(true)
    expect(body.textContent).toContain('Pick one')
    cleanup()
  })

  it('6: horizontal layout puts the label in a --label-width column', async () => {
    @Component({
      standalone: true,
      imports: [UiFormItemComponent],
      template: `<ui-form-item label="Role" layout="horizontal" labelWidth="180px"><span>x</span></ui-form-item>`,
    })
    class Host {}
    const { q, cleanup } = await render(Host)
    const item = q<HTMLElement>('[data-slot="form-item"]')
    expect(item.classList.contains('grid-cols-[var(--label-width,140px)_1fr]')).toBe(true)
    expect(item.style.getPropertyValue('--label-width')).toBe('180px')
    cleanup()
  })

  it('7: FormSection renders the divider, an h4 title by default (headingLevel switches it) and description', async () => {
    @Component({
      standalone: true,
      imports: [UiFormSectionComponent],
      template: `
        <ui-form-section id="a" title="Account" description="Info" divider><i>f</i></ui-form-section>
        <ui-form-section id="b" title="Other" headingLevel="h2" />
      `,
    })
    class Host {}
    const { q, cleanup } = await render(Host)
    const a = q('#a')
    expect(['block', 'space-y-3'].every((c) => a.classList.contains(c))).toBe(true)
    expect(a.firstElementChild!.className).toBe('border-t pt-4')
    expect(a.querySelector('h4')!.className).toBe('text-sm font-semibold')
    expect(a.querySelector('p.text-xs')!.textContent).toBe('Info')
    expect(q('#b').querySelector('h2')).not.toBeNull()
    cleanup()
  })

  it('8: FormActions aligns / spaces its buttons; FormStatus is a tinted banner with role alert / status', async () => {
    @Component({
      standalone: true,
      imports: [UiFormActionsComponent, UiFormStatusComponent],
      template: `
        <ui-form-actions id="r" />
        <ui-form-actions id="l" align="left" gap="lg" />
        <ui-form-status id="e" status="error" message="Fix it" />
        <ui-form-status id="s" status="success" message="Saved" />
      `,
    })
    class Host {}
    const { q, cleanup } = await render(Host)
    const cls = (id: string) => [...q(id).classList].sort().join(' ')
    expect(cls('#r')).toBe('flex flex-wrap gap-3 items-center justify-end')
    expect(cls('#l')).toBe('flex flex-wrap gap-4 items-center justify-start')
    expect(q('#e').getAttribute('role')).toBe('alert')
    expect(q('#e').querySelector('svg.lucide-circle-alert')).not.toBeNull()
    expect(q('#e').classList.contains('bg-destructive/10')).toBe(true)
    expect(q('#s').getAttribute('role')).toBe('status')
    expect(q('#s').querySelector('svg.lucide-circle-check')).not.toBeNull()
    expect(q('#s').textContent!.trim()).toBe('Saved')
    cleanup()
  })

  it('9: field parts outside a FormField fail loudly (React useFormField throws)', () => {
    @Component({ standalone: true, imports: [UiFormLabelComponent], template: `<label ui-form-label>X</label>` })
    class Host {}
    expect(() => TestBed.createComponent(Host)).toThrow(/must be used within/)
  })
})
