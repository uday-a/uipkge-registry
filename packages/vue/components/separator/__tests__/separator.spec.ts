import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Separator } from "../index";

function mountSeparator(props: Record<string, unknown> = {}) {
  return mount(Separator, { props, attachTo: document.body });
}

describe("Separator", () => {
  it('renders with data-slot="separator"', () => {
    const w = mountSeparator();
    expect(w.find('[data-slot="separator"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mountSeparator();
    expect(
      w.find('[data-slot="separator"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('has role="separator" or data-orientation', () => {
    const w = mountSeparator({ decorative: false });
    const el = w.find('[data-slot="separator"]');
    expect(
      el.attributes("role") === "separator" ||
        el.attributes("data-orientation"),
    ).toBeTruthy();
    w.unmount();
  });

  it('has data-orientation="horizontal" by default', () => {
    const w = mountSeparator();
    expect(
      w.find('[data-slot="separator"]').attributes("data-orientation"),
    ).toBe("horizontal");
    w.unmount();
  });

  it('has data-orientation="vertical" when orientation prop is vertical', () => {
    const w = mountSeparator({ orientation: "vertical" });
    expect(
      w.find('[data-slot="separator"]').attributes("data-orientation"),
    ).toBe("vertical");
    w.unmount();
  });

  it('is decorative by default (role="none")', () => {
    const w = mountSeparator();
    const el = w.find('[data-slot="separator"]');
    // reka-ui renders role="none" when decorative is true (default)
    expect(el.attributes("role")).toBe("none");
    w.unmount();
  });
});
