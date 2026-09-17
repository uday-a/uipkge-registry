import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { IconTransition } from "../index";

const DefaultIcon = defineComponent({
  name: "DefaultIcon",
  setup: () => () => h("svg", { class: "default-icon" }),
});
const ActiveIcon = defineComponent({
  name: "ActiveIcon",
  setup: () => () => h("svg", { class: "active-icon" }),
});

function mountTransition(props: Record<string, unknown> = {}) {
  return mount(IconTransition, {
    props: { defaultIcon: DefaultIcon, activeIcon: ActiveIcon, ...props },
    attachTo: document.body,
  });
}

describe("IconTransition", () => {
  it('renders with data-slot="icon-transition"', () => {
    const w = mountTransition();
    expect(w.find('[data-slot="icon-transition"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mountTransition();
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders as a button by default", () => {
    const w = mountTransition();
    expect(
      w.find('[data-slot="icon-transition"]').element.tagName.toLowerCase(),
    ).toBe("button");
    w.unmount();
  });

  it("renders the default icon initially", () => {
    const w = mountTransition();
    expect(w.find("svg.default-icon").exists()).toBe(true);
    w.unmount();
  });

  it("renders the active icon when active prop is true", () => {
    const w = mountTransition({ active: true });
    expect(w.find("svg.active-icon").exists()).toBe(true);
    w.unmount();
  });

  it("applies activeClass when active", () => {
    const w = mountTransition({ active: true, activeClass: "text-success" });
    expect(w.find('[data-slot="icon-transition"]').classes()).toContain(
      "text-success",
    );
    w.unmount();
  });

  it("transitions to active icon on click (resetAfter=0 keeps active)", async () => {
    const w = mountTransition({ resetAfter: 0 });
    await w.find('[data-slot="icon-transition"]').trigger("click");
    expect(w.find("svg.active-icon").exists()).toBe(true);
    w.unmount();
  });
});
