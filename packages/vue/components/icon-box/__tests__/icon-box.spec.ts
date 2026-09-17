import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { IconBox } from "../index";

const StubIcon = defineComponent({
  name: "StubIcon",
  setup: () => () => h("svg", { "data-testid": "stub-icon" }),
});

describe("IconBox", () => {
  it('renders with data-slot="icon-box"', () => {
    const w = mount(IconBox, {
      props: { icon: StubIcon },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="icon-box"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(IconBox, {
      props: { icon: StubIcon },
      attachTo: document.body,
    });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders as a div container", () => {
    const w = mount(IconBox, {
      props: { icon: StubIcon },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="icon-box"]').element.tagName.toLowerCase()).toBe(
      "div",
    );
    w.unmount();
  });

  it("renders the icon component inside", () => {
    const w = mount(IconBox, {
      props: { icon: StubIcon },
      attachTo: document.body,
    });
    expect(w.find('svg[data-testid="stub-icon"]').exists()).toBe(true);
    w.unmount();
  });

  it("applies primary variant classes by default", () => {
    const w = mount(IconBox, {
      props: { icon: StubIcon },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="icon-box"]').classes()).toContain(
      "bg-primary/10",
    );
    expect(w.find('[data-slot="icon-box"]').classes()).toContain(
      "text-primary",
    );
    w.unmount();
  });

  it("applies muted variant classes", () => {
    const w = mount(IconBox, {
      props: { icon: StubIcon, variant: "muted" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="icon-box"]').classes()).toContain("bg-muted");
    expect(w.find('[data-slot="icon-box"]').classes()).toContain(
      "text-muted-foreground",
    );
    w.unmount();
  });

  it("applies size classes for sm", () => {
    const w = mount(IconBox, {
      props: { icon: StubIcon, size: "sm" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="icon-box"]').classes()).toContain("p-1.5");
    w.unmount();
  });

  it("applies circle shape classes", () => {
    const w = mount(IconBox, {
      props: { icon: StubIcon, shape: "circle" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="icon-box"]').classes()).toContain(
      "rounded-full",
    );
    w.unmount();
  });
});
