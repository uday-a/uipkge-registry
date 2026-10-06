import { Component, Input } from '@angular/core'
import {
  UiAccordionComponent,
  UiAccordionContentComponent,
  UiAccordionHeaderComponent,
  UiAccordionItemComponent,
  UiAccordionTriggerComponent,
} from '../../../../../packages/registry-angular/components/accordion/accordion.component'
import {
  UiCardComponent,
  UiCardContentComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the accordion page. Mirrors demos/react/accordion.tsx story by story. */
@Component({
  selector: 'angular-accordion-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiAccordionComponent,
    UiAccordionItemComponent,
    UiAccordionHeaderComponent,
    UiAccordionTriggerComponent,
    UiAccordionContentComponent,
    UiCardComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <div ui-accordion type="single" collapsible class="max-w-md">
          <div ui-accordion-item value="item-1">
            <button ui-accordion-trigger>Is it accessible?</button>
            <div ui-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</div>
          </div>
          <div ui-accordion-item value="item-2">
            <button ui-accordion-trigger>Is it styled?</button>
            <div ui-accordion-content>Yes. Default Tailwind styles match the rest of the registry.</div>
          </div>
          <div ui-accordion-item value="item-3">
            <button ui-accordion-trigger>Is it animated?</button>
            <div ui-accordion-content>Yes. Smooth open/close animation via tw-animate-css.</div>
          </div>
        </div>
      }
      @case ('Multiple') {
        <div ui-accordion type="multiple" [defaultValue]="['shipping', 'returns']" class="max-w-md">
          <div ui-accordion-item value="shipping">
            <button ui-accordion-trigger>Shipping</button>
            <div ui-accordion-content>Free shipping on orders over $50. Most orders ship within two business days.</div>
          </div>
          <div ui-accordion-item value="returns">
            <button ui-accordion-trigger>Returns</button>
            <div ui-accordion-content>30-day return window with prepaid labels for any reason.</div>
          </div>
          <div ui-accordion-item value="warranty">
            <button ui-accordion-trigger>Warranty</button>
            <div ui-accordion-content>One-year limited warranty against manufacturer defects.</div>
          </div>
        </div>
      }
      @case ('Separated variant') {
        <div ui-accordion type="single" collapsible variant="separated" defaultValue="invoice" class="max-w-md">
          <div ui-accordion-item value="invoice">
            <button ui-accordion-trigger>Where do I find my invoices?</button>
            <div ui-accordion-content class="px-4">
              Invoices are listed under Settings → Billing. Each invoice can be downloaded as PDF.
            </div>
          </div>
          <div ui-accordion-item value="upgrade">
            <button ui-accordion-trigger>How do I upgrade my plan?</button>
            <div ui-accordion-content class="px-4">
              Go to Settings → Plan and pick a new tier — proration is calculated automatically.
            </div>
          </div>
          <div ui-accordion-item value="cancel">
            <button ui-accordion-trigger>How do I cancel?</button>
            <div ui-accordion-content class="px-4">
              From Settings → Plan → Cancel subscription. Access continues until the end of the period.
            </div>
          </div>
        </div>
      }
      @case ('Ghost variant') {
        <div ui-card class="max-w-md">
          <div ui-card-content class="p-2">
            <div ui-accordion type="single" collapsible variant="ghost">
              <div ui-accordion-item value="a">
                <button ui-accordion-trigger>What is the registry?</button>
                <div ui-accordion-content>An open-source UI registry where the components are the product.</div>
              </div>
              <div ui-accordion-item value="b">
                <button ui-accordion-trigger>How do I install components?</button>
                <div ui-accordion-content>
                  Run npx shadcn@latest add &lt;url&gt; to install a component into your project.
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      @case ('Non-collapsible') {
        <div ui-accordion type="single" [collapsible]="false" defaultValue="overview" class="max-w-md">
          <div ui-accordion-item value="overview">
            <button ui-accordion-trigger>Overview</button>
            <div ui-accordion-content>This panel is open by default and cannot be fully closed.</div>
          </div>
          <div ui-accordion-item value="details">
            <button ui-accordion-trigger>Details</button>
            <div ui-accordion-content>Selecting another item moves the open state — but it never empties.</div>
          </div>
          <div ui-accordion-item value="faq">
            <button ui-accordion-trigger>FAQ</button>
            <div ui-accordion-content>Useful when you want to guarantee something is always visible.</div>
          </div>
        </div>
      }
      @case ('With AccordionHeader') {
        <div ui-accordion type="single" collapsible variant="separated" class="max-w-md">
          <div ui-accordion-item value="plan-1">
            <h3 ui-accordion-header class="items-center justify-between gap-2">
              <button ui-accordion-trigger class="flex-1">
                <span class="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-sparkles text-primary size-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
                    />
                    <path d="M20 2v4" />
                    <path d="M22 4h-4" />
                    <circle cx="4" cy="20" r="2" />
                  </svg>
                  <span>Pro plan</span>
                </span>
              </button>
              <span class="text-muted-foreground pr-4 text-xs">$12/mo</span>
            </h3>
            <div ui-accordion-content class="px-4">Unlimited projects, priority support, and advanced analytics.</div>
          </div>
          <div ui-accordion-item value="plan-2">
            <h3 ui-accordion-header class="items-center justify-between gap-2">
              <button ui-accordion-trigger class="flex-1">
                <span class="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-sparkles text-primary size-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
                    />
                    <path d="M20 2v4" />
                    <path d="M22 4h-4" />
                    <circle cx="4" cy="20" r="2" />
                  </svg>
                  <span>Team plan</span>
                </span>
              </button>
              <span class="text-muted-foreground pr-4 text-xs">$24/mo</span>
            </h3>
            <div ui-accordion-content class="px-4">Everything in Pro plus shared workspaces and SSO.</div>
          </div>
        </div>
      }
      @case ('Pre-opened') {
        <div ui-accordion type="single" collapsible defaultValue="b" class="max-w-md">
          <div ui-accordion-item value="a">
            <button ui-accordion-trigger>Step 1 — Install</button>
            <div ui-accordion-content>Run npx shadcn add to install the component into your project.</div>
          </div>
          <div ui-accordion-item value="b">
            <button ui-accordion-trigger>Step 2 — Import</button>
            <div ui-accordion-content>Auto-imports work in Nuxt; otherwise import from your components directory.</div>
          </div>
          <div ui-accordion-item value="c">
            <button ui-accordion-trigger>Step 3 — Compose</button>
            <div ui-accordion-content>Drop AccordionItem children inside Accordion and you are done.</div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularAccordionDemoComponent {
  @Input() story = 'Default'
}
