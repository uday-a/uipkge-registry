import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "../index";

function mountSheet(template: string) {
  return mount(
    {
      components: {
        Sheet,
        SheetTrigger,
        SheetContent,
        SheetHeader,
        SheetFooter,
        SheetTitle,
        SheetDescription,
        SheetClose,
      },
      template,
    },
    { attachTo: document.body },
  );
}

describe("Sheet", () => {
  it('SheetTrigger renders with data-slot="sheet-trigger"', () => {
    const w = mountSheet("<Sheet><SheetTrigger>Open</SheetTrigger></Sheet>");
    expect(w.find('[data-slot="sheet-trigger"]').exists()).toBe(true);
    w.unmount();
  });

  it("SheetTrigger renders as a button", () => {
    const w = mountSheet("<Sheet><SheetTrigger>Open</SheetTrigger></Sheet>");
    expect(
      w.find('[data-slot="sheet-trigger"]').element.tagName.toLowerCase(),
    ).toBe("button");
    w.unmount();
  });

  it('SheetContent has data-slot="sheet-content" when open', async () => {
    const w = mountSheet(
      '<Sheet :default-open="true"><SheetTrigger>Open</SheetTrigger><SheetContent><SheetTitle>T</SheetTitle><SheetDescription>D</SheetDescription>Body</SheetContent></Sheet>',
    );
    await flushPromises();
    expect(document.querySelector('[data-slot="sheet-content"]')).toBeTruthy();
    w.unmount();
  });

  it("SheetContent has data-uipkge", async () => {
    const w = mountSheet(
      '<Sheet :default-open="true"><SheetTrigger>Open</SheetTrigger><SheetContent><SheetTitle>T</SheetTitle><SheetDescription>D</SheetDescription>Body</SheetContent></Sheet>',
    );
    await flushPromises();
    expect(
      document
        .querySelector('[data-slot="sheet-content"]')
        ?.getAttribute("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('SheetContent has data-state="open" when open', async () => {
    const w = mountSheet(
      '<Sheet :default-open="true"><SheetTrigger>Open</SheetTrigger><SheetContent><SheetTitle>T</SheetTitle><SheetDescription>D</SheetDescription>Body</SheetContent></Sheet>',
    );
    await flushPromises();
    expect(
      document
        .querySelector('[data-slot="sheet-content"]')
        ?.getAttribute("data-state"),
    ).toBe("open");
    w.unmount();
  });

  it("SheetContent renders close button", async () => {
    const w = mountSheet(
      '<Sheet :default-open="true"><SheetTrigger>Open</SheetTrigger><SheetContent><SheetTitle>T</SheetTitle><SheetDescription>D</SheetDescription>Body</SheetContent></Sheet>',
    );
    await flushPromises();
    const buttons = Array.from(document.querySelectorAll("button"));
    const closeBtn = buttons.find((b) =>
      (b.textContent ?? "").includes("Close"),
    );
    expect(closeBtn).toBeTruthy();
    w.unmount();
  });

  it('SheetHeader renders with data-slot="sheet-header"', async () => {
    const w = mountSheet(
      '<Sheet :default-open="true"><SheetTrigger>Open</SheetTrigger><SheetContent><SheetTitle>T</SheetTitle><SheetDescription>D</SheetDescription><SheetHeader>Header</SheetHeader></SheetContent></Sheet>',
    );
    await flushPromises();
    expect(document.querySelector('[data-slot="sheet-header"]')).toBeTruthy();
    w.unmount();
  });

  it('SheetFooter renders with data-slot="sheet-footer"', async () => {
    const w = mountSheet(
      '<Sheet :default-open="true"><SheetTrigger>Open</SheetTrigger><SheetContent><SheetTitle>T</SheetTitle><SheetDescription>D</SheetDescription><SheetFooter>Footer</SheetFooter></SheetContent></Sheet>',
    );
    await flushPromises();
    expect(document.querySelector('[data-slot="sheet-footer"]')).toBeTruthy();
    w.unmount();
  });

  it('SheetTitle renders with data-slot="sheet-title"', async () => {
    const w = mountSheet(
      '<Sheet :default-open="true"><SheetTrigger>Open</SheetTrigger><SheetContent><SheetTitle>Title</SheetTitle><SheetDescription>D</SheetDescription></SheetContent></Sheet>',
    );
    await flushPromises();
    expect(document.querySelector('[data-slot="sheet-title"]')).toBeTruthy();
    w.unmount();
  });

  it('SheetDescription renders with data-slot="sheet-description"', async () => {
    const w = mountSheet(
      '<Sheet :default-open="true"><SheetTrigger>Open</SheetTrigger><SheetContent><SheetTitle>T</SheetTitle><SheetDescription>Desc</SheetDescription></SheetContent></Sheet>',
    );
    await flushPromises();
    expect(
      document.querySelector('[data-slot="sheet-description"]'),
    ).toBeTruthy();
    w.unmount();
  });

  it('SheetClose renders with data-slot="sheet-close"', async () => {
    const w = mountSheet(
      '<Sheet :default-open="true"><SheetTrigger>Open</SheetTrigger><SheetContent><SheetTitle>T</SheetTitle><SheetDescription>D</SheetDescription><SheetClose>Close</SheetClose></SheetContent></Sheet>',
    );
    await flushPromises();
    expect(
      document.querySelectorAll('[data-slot="sheet-close"]').length,
    ).toBeGreaterThanOrEqual(1);
    w.unmount();
  });

  it("SheetContent renders title text when open", async () => {
    const w = mountSheet(
      '<Sheet :default-open="true"><SheetTrigger>Open</SheetTrigger><SheetContent><SheetTitle>My Sheet Title</SheetTitle><SheetDescription>D</SheetDescription></SheetContent></Sheet>',
    );
    await flushPromises();
    expect(
      document.querySelector('[data-slot="sheet-title"]')?.textContent,
    ).toContain("My Sheet Title");
    w.unmount();
  });
});
