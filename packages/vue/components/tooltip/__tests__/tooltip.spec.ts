import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../index";

function mountTooltip(template: string) {
  return mount(
    {
      components: { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider },
      template,
    },
    { attachTo: document.body },
  );
}

describe("Tooltip", () => {
  it("TooltipProvider renders without crashing", () => {
    const w = mountTooltip(
      "<TooltipProvider><Tooltip><TooltipTrigger>Hover</TooltipTrigger><TooltipContent>Tip</TooltipContent></Tooltip></TooltipProvider>",
    );
    expect(w.find('[data-slot="tooltip-trigger"]').exists()).toBe(true);
    w.unmount();
  });

  it('TooltipTrigger renders with data-slot="tooltip-trigger"', () => {
    const w = mountTooltip(
      "<TooltipProvider><Tooltip><TooltipTrigger>Hover</TooltipTrigger></Tooltip></TooltipProvider>",
    );
    expect(w.find('[data-slot="tooltip-trigger"]').exists()).toBe(true);
    w.unmount();
  });

  it("TooltipTrigger renders as a button when used as child of Tooltip", () => {
    const w = mountTooltip(
      "<TooltipProvider><Tooltip><TooltipTrigger>Hover</TooltipTrigger></Tooltip></TooltipProvider>",
    );
    expect(
      w.find('[data-slot="tooltip-trigger"]').element.tagName.toLowerCase(),
    ).toBe("button");
    w.unmount();
  });

  it('TooltipContent has data-slot="tooltip-content" when open', async () => {
    const w = mountTooltip(
      '<TooltipProvider><Tooltip :default-open="true"><TooltipTrigger>Hover</TooltipTrigger><TooltipContent>Tip</TooltipContent></Tooltip></TooltipProvider>',
    );
    await flushPromises();
    expect(
      document.querySelector('[data-slot="tooltip-content"]'),
    ).toBeTruthy();
    w.unmount();
  });

  it("TooltipContent has data-uipkge", async () => {
    const w = mountTooltip(
      '<TooltipProvider><Tooltip :default-open="true"><TooltipTrigger>Hover</TooltipTrigger><TooltipContent>Tip</TooltipContent></Tooltip></TooltipProvider>',
    );
    await flushPromises();
    expect(
      document
        .querySelector('[data-slot="tooltip-content"]')
        ?.getAttribute("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("TooltipContent renders slot content", async () => {
    const w = mountTooltip(
      '<TooltipProvider><Tooltip :default-open="true"><TooltipTrigger>Hover</TooltipTrigger><TooltipContent>My Tooltip Text</TooltipContent></Tooltip></TooltipProvider>',
    );
    await flushPromises();
    expect(
      document.querySelector('[data-slot="tooltip-content"]')?.textContent,
    ).toContain("My Tooltip Text");
    w.unmount();
  });

  it('TooltipContent has role="tooltip"', async () => {
    const w = mountTooltip(
      '<TooltipProvider><Tooltip :default-open="true"><TooltipTrigger>Hover</TooltipTrigger><TooltipContent>Tip</TooltipContent></Tooltip></TooltipProvider>',
    );
    await flushPromises();
    expect(
      document.querySelector('[data-slot="tooltip-content"] [role="tooltip"]'),
    ).toBeTruthy();
    w.unmount();
  });

  it("Tooltip wraps in TooltipProvider when provided explicitly", async () => {
    const w = mountTooltip(
      '<TooltipProvider><Tooltip :default-open="true"><TooltipTrigger>Hover</TooltipTrigger><TooltipContent>Tip</TooltipContent></Tooltip></TooltipProvider>',
    );
    await flushPromises();
    expect(
      document.querySelector('[data-slot="tooltip-content"]'),
    ).toBeTruthy();
    expect(w.find('[data-slot="tooltip-trigger"]').exists()).toBe(true);
    w.unmount();
  });
});
