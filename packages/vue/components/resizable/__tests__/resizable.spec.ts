import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../index";

function mountResizable(template?: string) {
  return mount(
    {
      template:
        template ??
        '<ResizablePanelGroup direction="horizontal"><ResizablePanel>Panel 1</ResizablePanel><ResizableHandle /><ResizablePanel>Panel 2</ResizablePanel></ResizablePanelGroup>',
      components: { ResizablePanelGroup, ResizablePanel, ResizableHandle },
    },
    { attachTo: document.body },
  );
}

describe("Resizable", () => {
  it('ResizablePanelGroup renders with data-slot="resizable-panel-group"', () => {
    const w = mountResizable();
    expect(w.find('[data-slot="resizable-panel-group"]').exists()).toBe(true);
    w.unmount();
  });

  it("ResizablePanelGroup has data-uipkge", () => {
    const w = mountResizable();
    expect(
      w.find('[data-slot="resizable-panel-group"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('ResizablePanel renders with data-slot="resizable-panel"', () => {
    const w = mountResizable();
    expect(w.findAll('[data-slot="resizable-panel"]').length).toBe(2);
    w.unmount();
  });

  it("ResizablePanel has data-uipkge", () => {
    const w = mountResizable();
    expect(
      w.find('[data-slot="resizable-panel"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('ResizableHandle renders with data-slot="resizable-handle"', () => {
    const w = mountResizable();
    expect(w.find('[data-slot="resizable-handle"]').exists()).toBe(true);
    w.unmount();
  });

  it("ResizableHandle has data-uipkge", () => {
    const w = mountResizable();
    expect(
      w.find('[data-slot="resizable-handle"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("ResizableHandle renders grip icon when withHandle is true", () => {
    const w = mountResizable(
      '<ResizablePanelGroup direction="horizontal"><ResizablePanel>Panel 1</ResizablePanel><ResizableHandle withHandle /><ResizablePanel>Panel 2</ResizablePanel></ResizablePanelGroup>',
    );
    expect(w.find('[data-slot="resizable-handle"] svg').exists()).toBe(true);
    w.unmount();
  });

  it("ResizableHandle does not render grip icon by default", () => {
    const w = mountResizable();
    expect(w.find('[data-slot="resizable-handle"] svg').exists()).toBe(false);
    w.unmount();
  });

  it("ResizablePanelGroup applies data-orientation", () => {
    const w = mountResizable();
    expect(
      w
        .find('[data-slot="resizable-panel-group"]')
        .attributes("data-orientation"),
    ).toBeDefined();
    w.unmount();
  });
});
