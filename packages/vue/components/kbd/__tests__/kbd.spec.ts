import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Kbd } from "../index";

describe("Kbd", () => {
  it('renders a kbd element with data-slot="kbd"', () => {
    const w = mount(Kbd, { attachTo: document.body });
    const el = w.find('[data-slot="kbd"]');
    expect(el.exists()).toBe(true);
    expect(el.element.tagName.toLowerCase()).toBe("kbd");
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(Kbd, { attachTo: document.body });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders key text via slot", () => {
    const w = mount(Kbd, {
      slots: { default: "Ctrl" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("Ctrl");
    w.unmount();
  });

  it("applies custom class", () => {
    const w = mount(Kbd, {
      props: { class: "custom-class" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="kbd"]').classes()).toContain("custom-class");
    w.unmount();
  });
});
