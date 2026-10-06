<script lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
    AccordionTrigger,
  } from '@svelte-registry/accordion'
  import { Sparkles } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default'}
  <Accordion type="single" collapsible class="max-w-md">
    <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Is it styled?</AccordionTrigger>
      <AccordionContent>Yes. Default Tailwind styles match the rest of the registry.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger>Is it animated?</AccordionTrigger>
      <AccordionContent>Yes. Smooth open/close animation via tw-animate-css.</AccordionContent>
    </AccordionItem>
  </Accordion>
{/if}

{#if story === 'Multiple'}
  <Accordion type="multiple" defaultValue={['shipping', 'returns']} class="max-w-md">
    <AccordionItem value="shipping">
      <AccordionTrigger>Shipping</AccordionTrigger>
      <AccordionContent>Free shipping on orders over $50. Most orders ship within two business days.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="returns">
      <AccordionTrigger>Returns</AccordionTrigger>
      <AccordionContent>30-day return window with prepaid labels for any reason.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="warranty">
      <AccordionTrigger>Warranty</AccordionTrigger>
      <AccordionContent>One-year limited warranty against manufacturer defects.</AccordionContent>
    </AccordionItem>
  </Accordion>
{/if}

{#if story === 'Separated variant'}
  <Accordion type="single" collapsible variant="separated" defaultValue="invoice" class="max-w-md">
    <AccordionItem value="invoice">
      <AccordionTrigger>Where do I find my invoices?</AccordionTrigger>
      <AccordionContent class="px-4">
        Invoices are listed under Settings → Billing. Each invoice can be downloaded as PDF.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="upgrade">
      <AccordionTrigger>How do I upgrade my plan?</AccordionTrigger>
      <AccordionContent class="px-4">
        Go to Settings → Plan and pick a new tier — proration is calculated automatically.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="cancel">
      <AccordionTrigger>How do I cancel?</AccordionTrigger>
      <AccordionContent class="px-4">
        From Settings → Plan → Cancel subscription. Access continues until the end of the period.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
{/if}

{#if story === 'Ghost variant'}
  <div class="bg-card max-w-md rounded-lg border p-2">
    <Accordion type="single" collapsible variant="ghost">
      <AccordionItem value="a">
        <AccordionTrigger>What is the registry?</AccordionTrigger>
        <AccordionContent>An open-source UI registry where the components are the product.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>How do I install components?</AccordionTrigger>
        <AccordionContent>Run npx shadcn@latest add &lt;url&gt; to install a component into your project.</AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
{/if}

{#if story === 'Non-collapsible'}
  <Accordion type="single" collapsible={false} defaultValue="overview" class="max-w-md">
    <AccordionItem value="overview">
      <AccordionTrigger>Overview</AccordionTrigger>
      <AccordionContent>This panel is open by default and cannot be fully closed.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="details">
      <AccordionTrigger>Details</AccordionTrigger>
      <AccordionContent>Selecting another item moves the open state — but it never empties.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="faq">
      <AccordionTrigger>FAQ</AccordionTrigger>
      <AccordionContent>Useful when you want to guarantee something is always visible.</AccordionContent>
    </AccordionItem>
  </Accordion>
{/if}

{#if story === 'With AccordionHeader'}
  <Accordion type="single" collapsible variant="separated" class="max-w-md">
    <AccordionItem value="plan-1">
      <AccordionHeader class="items-center justify-between gap-2">
        <AccordionTrigger class="flex-1">
          <div class="flex items-center gap-2">
            <Sparkles class="text-primary size-4" />
            <span>Pro plan</span>
          </div>
        </AccordionTrigger>
        <span class="text-muted-foreground pr-4 text-xs">$12/mo</span>
      </AccordionHeader>
      <AccordionContent class="px-4">Unlimited projects, priority support, and advanced analytics.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="plan-2">
      <AccordionHeader class="items-center justify-between gap-2">
        <AccordionTrigger class="flex-1">
          <div class="flex items-center gap-2">
            <Sparkles class="text-primary size-4" />
            <span>Team plan</span>
          </div>
        </AccordionTrigger>
        <span class="text-muted-foreground pr-4 text-xs">$24/mo</span>
      </AccordionHeader>
      <AccordionContent class="px-4">Everything in Pro plus shared workspaces and SSO.</AccordionContent>
    </AccordionItem>
  </Accordion>
{/if}

{#if story === 'Pre-opened'}
  <Accordion type="single" collapsible defaultValue="b" class="max-w-md">
    <AccordionItem value="a">
      <AccordionTrigger>Step 1 — Install</AccordionTrigger>
      <AccordionContent>Run the add command to install the component into your project.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="b">
      <AccordionTrigger>Step 2 — Import</AccordionTrigger>
      <AccordionContent>Import from your components directory — no plugin setup required.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="c">
      <AccordionTrigger>Step 3 — Compose</AccordionTrigger>
      <AccordionContent>Drop AccordionItem children inside Accordion and you are done.</AccordionContent>
    </AccordionItem>
  </Accordion>
{/if}
