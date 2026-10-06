// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TestBed } from '@angular/core/testing'
import { reflectComponentType } from '@angular/core'

// Every exported component must JIT-compile and render with default inputs. Class-level
// specs never touch templates, which is how a template that cannot compile (a reserved
// word in a host binding, a pipe with no import) shipped unnoticed. Parts that only work
// inside their parent are listed explicitly, and must fail with the missing-parent error.

const here = dirname(fileURLToPath(import.meta.url))

/** Parts that inject their parent (menu item -> menu, sidebar part -> provider, ...). */
const NEEDS_PARENT = [
  'UiAccordionContentComponent',
  'UiAccordionHeaderComponent',
  'UiAccordionItemComponent',
  'UiAccordionTriggerComponent',
  'UiBoardCardComponent',
  'UiBoardLaneComponent',
  'UiCollapsibleContentComponent',
  'UiCommandEmptyComponent',
  'UiCommandGroupComponent',
  'UiCommandInputComponent',
  'UiCommandItemComponent',
  'UiCommandListComponent',
  'UiCommandSeparatorComponent',
  'UiContextMenuCheckboxItemComponent',
  'UiContextMenuContentComponent',
  'UiContextMenuItemComponent',
  'UiContextMenuRadioItemComponent',
  'UiContextMenuSubContentComponent',
  'UiContextMenuSubTriggerComponent',
  'UiDialogContentComponent',
  'UiDialogScrollContentComponent',
  'UiDropdownMenuCheckboxItemComponent',
  'UiDropdownMenuContentComponent',
  'UiDropdownMenuItemComponent',
  'UiDropdownMenuRadioItemComponent',
  'UiDropdownMenuSubContentComponent',
  'UiDropdownMenuSubTriggerComponent',
  'UiFormDescriptionComponent',
  'UiFormLabelComponent',
  'UiFormMessageComponent',
  'UiGanttTimelineComponent',
  'UiGanttTreeComponent',
  'UiHoverCardContentComponent',
  'UiKanbanCardComponent',
  'UiKanbanColumnComponent',
  'UiMenubarCheckboxItemComponent',
  'UiMenubarContentComponent',
  'UiMenubarItemComponent',
  'UiMenubarMenuComponent',
  'UiMenubarRadioItemComponent',
  'UiMenubarSubContentComponent',
  'UiMenubarSubTriggerComponent',
  'UiNavigationMenuContentComponent',
  'UiNavigationMenuIndicatorComponent',
  'UiNavigationMenuListComponent',
  'UiNavigationMenuTriggerComponent',
  'UiNavigationMenuViewportComponent',
  'UiPinInputSlotComponent',
  'UiPopoverContentComponent',
  'UiResizableHandleComponent',
  'UiResizablePanelComponent',
  'UiSelectContentComponent',
  'UiSelectItemComponent',
  'UiSelectScrollDownButtonComponent',
  'UiSelectScrollUpButtonComponent',
  'UiSelectTriggerComponent',
  'UiSelectValueComponent',
  'UiSheetContentComponent',
  'UiSidebarComponent',
  'UiSidebarMenuButtonComponent',
  'UiSidebarRailComponent',
  'UiSidebarTriggerComponent',
  'UiStepperItemComponent',
  'UiTabsContentComponent',
  'UiTabsListComponent',
  'UiToggleGroupItemComponent',
  'UiTooltipContentComponent',
  'UiTransferListComponent',
  'UiVerticalTabsContentComponent',
  'UiVerticalTabsListComponent',
]

async function renderAll() {
  const failures: { name: string; error: string }[] = []
  let rendered = 0
  const dirs = readdirSync(here, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== 'charts')
  for (const { name: dir } of dirs) {
    if (!existsSync(resolve(here, dir, 'index.ts'))) continue
    const mod = await import(`./${dir}/index.ts`)
    for (const [name, value] of Object.entries(mod)) {
      if (typeof value !== 'function') continue
      try {
        if (!reflectComponentType(value as never)) continue
        TestBed.resetTestingModule()
        const fixture = TestBed.createComponent(value as never)
        fixture.detectChanges()
        fixture.destroy()
        rendered++
      } catch (e) {
        failures.push({ name, error: String((e as Error).message) })
      }
    }
  }
  return { failures, rendered }
}

describe('Render smoke (angular, 2 checks)', () => {
  let result: Awaited<ReturnType<typeof renderAll>>

  it('1: every standalone component compiles and renders with default inputs', async () => {
    result = await renderAll()
    expect(result.rendered).toBeGreaterThan(250)
    expect(result.failures.map((f) => f.name).sort()).toEqual([...NEEDS_PARENT].sort())
  }, 120_000)

  it('2: parts rendered outside their parent fail with the missing-parent error, nothing else', () => {
    for (const f of result.failures) expect(f.error, f.name).toMatch(/NG0201|must be used within/)
  })
})

// Template branches the default render never reaches (inputs that switch @if blocks on).
describe('Render smoke, optional branches (angular, 1 check)', () => {
  it('1: circular-progress renders its value label (showValue)', async () => {
    const { UiCircularProgressComponent } = await import('./circular-progress/circular-progress.component')
    const fixture = TestBed.createComponent(UiCircularProgressComponent)
    fixture.componentRef.setInput('showValue', true)
    fixture.componentRef.setInput('value', 42.4)
    fixture.detectChanges()
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('42%')
  })
})
