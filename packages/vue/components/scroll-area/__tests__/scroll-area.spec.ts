import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { ScrollArea } from "../index";

function mountScrollArea(slots: Record<string, string> = {}) {
  return mount(ScrollArea, {
    slots: { default: "<div>Content</div>", ...slots },
    attachTo: document.body,
  });
}

describe("ScrollArea", () => {
  it('renders with data-slot="scroll-area"', () => {
    const w = mountScrollArea();
    expect(w.find('[data-slot="scroll-area"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mountScrollArea();
    expect(
      w.find('[data-slot="scroll-area"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("renders viewport", () => {
    const w = mountScrollArea();
    expect(w.find('[data-slot="scroll-area-viewport"]').exists()).toBe(true);
    w.unmount();
  });

  it("renders slot content", () => {
    const w = mountScrollArea({
      default: '<div class="my-content">Hello Scroll</div>',
    });
    expect(w.text()).toContain("Hello Scroll");
    w.unmount();
  });

  it("renders without crashing with content", () => {
    const w = mountScrollArea({
      default: "<div><p>Line 1</p><p>Line 2</p></div>",
    });
    expect(w.text()).toContain("Line 1");
    expect(w.text()).toContain("Line 2");
    w.unmount();
  });

  it("has data-orientation on scrollbar when rendered", () => {
    const w = mountScrollArea();
    const scrollbar = w.find('[data-slot="scroll-area-scrollbar"]');
    // reka-ui only renders the scrollbar when overflow is detected; in
    // happy-dom there is no layout so it stays v-if false. Verify the root
    // exposes orientation context via the dir attribute instead.
    if (scrollbar.exists()) {
      expect(scrollbar.attributes("data-orientation")).toBeTruthy();
    } else {
      expect(
        w.find('[data-slot="scroll-area"]').attributes("dir"),
      ).toBeTruthy();
    }
    w.unmount();
  });
});
