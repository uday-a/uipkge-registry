import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "../index";

function mountContextMenu(template: string) {
  return mount(
    {
      components: {
        ContextMenu,
        ContextMenuTrigger,
        ContextMenuContent,
        ContextMenuItem,
        ContextMenuLabel,
        ContextMenuSeparator,
      },
      template,
    },
    { attachTo: document.body },
  );
}

async function openContextMenu(w: ReturnType<typeof mount>) {
  await flushPromises();
  const trigger = w.find('[data-slot="context-menu-trigger"]');
  await trigger.trigger("contextmenu");
  await flushPromises();
}

describe("ContextMenu", () => {
  it('ContextMenuTrigger renders with data-slot="context-menu-trigger"', () => {
    const w = mountContextMenu(
      "<ContextMenu><ContextMenuTrigger>Right click</ContextMenuTrigger></ContextMenu>",
    );
    expect(w.find('[data-slot="context-menu-trigger"]').exists()).toBe(true);
    w.unmount();
  });

  it('ContextMenuItem has data-slot="context-menu-item" when open', async () => {
    const w = mountContextMenu(
      "<ContextMenu><ContextMenuTrigger>Right click</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>Item</ContextMenuItem></ContextMenuContent></ContextMenu>",
    );
    await openContextMenu(w);
    expect(
      document.querySelector('[data-slot="context-menu-item"]'),
    ).toBeTruthy();
    w.unmount();
  });

  it("ContextMenuItem has data-uipkge", async () => {
    const w = mountContextMenu(
      "<ContextMenu><ContextMenuTrigger>Right click</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>Item</ContextMenuItem></ContextMenuContent></ContextMenu>",
    );
    await openContextMenu(w);
    expect(
      document
        .querySelector('[data-slot="context-menu-item"]')
        ?.getAttribute("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("ContextMenuItem applies data-inset when inset is true", async () => {
    const w = mountContextMenu(
      '<ContextMenu><ContextMenuTrigger>Right click</ContextMenuTrigger><ContextMenuContent><ContextMenuItem :inset="true">Item</ContextMenuItem></ContextMenuContent></ContextMenu>',
    );
    await openContextMenu(w);
    expect(
      document
        .querySelector('[data-slot="context-menu-item"]')
        ?.getAttribute("data-inset"),
    ).toBeDefined();
    w.unmount();
  });

  it("ContextMenuItem applies data-variant when variant is destructive", async () => {
    const w = mountContextMenu(
      '<ContextMenu><ContextMenuTrigger>Right click</ContextMenuTrigger><ContextMenuContent><ContextMenuItem variant="destructive">Delete</ContextMenuItem></ContextMenuContent></ContextMenu>',
    );
    await openContextMenu(w);
    expect(
      document
        .querySelector('[data-slot="context-menu-item"]')
        ?.getAttribute("data-variant"),
    ).toBe("destructive");
    w.unmount();
  });

  it('ContextMenuContent has data-slot="context-menu-content" when open', async () => {
    const w = mountContextMenu(
      "<ContextMenu><ContextMenuTrigger>Right click</ContextMenuTrigger><ContextMenuContent>Content</ContextMenuContent></ContextMenu>",
    );
    await openContextMenu(w);
    expect(
      document.querySelector('[data-slot="context-menu-content"]'),
    ).toBeTruthy();
    w.unmount();
  });

  it('ContextMenuLabel renders with data-slot="context-menu-label"', async () => {
    const w = mountContextMenu(
      "<ContextMenu><ContextMenuTrigger>Right click</ContextMenuTrigger><ContextMenuContent><ContextMenuLabel>Label</ContextMenuLabel></ContextMenuContent></ContextMenu>",
    );
    await openContextMenu(w);
    expect(
      document.querySelector('[data-slot="context-menu-label"]'),
    ).toBeTruthy();
    w.unmount();
  });

  it('ContextMenuSeparator renders with data-slot="context-menu-separator"', async () => {
    const w = mountContextMenu(
      "<ContextMenu><ContextMenuTrigger>Right click</ContextMenuTrigger><ContextMenuContent><ContextMenuSeparator /></ContextMenuContent></ContextMenu>",
    );
    await openContextMenu(w);
    expect(
      document.querySelector('[data-slot="context-menu-separator"]'),
    ).toBeTruthy();
    w.unmount();
  });

  it("ContextMenuItem renders slot content", async () => {
    const w = mountContextMenu(
      "<ContextMenu><ContextMenuTrigger>Right click</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>My Item Text</ContextMenuItem></ContextMenuContent></ContextMenu>",
    );
    await openContextMenu(w);
    expect(
      document.querySelector('[data-slot="context-menu-item"]')?.textContent,
    ).toContain("My Item Text");
    w.unmount();
  });
});
