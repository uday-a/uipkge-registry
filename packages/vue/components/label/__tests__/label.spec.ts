import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Label from "../Label.vue";

describe("Label", () => {
  it('renders with data-slot="label"', () => {
    const w = mount(Label, { slots: { default: "My Label" } });
    expect(w.find('[data-slot="label"]').exists()).toBe(true);
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders slot content", () => {
    const w = mount(Label, { slots: { default: "Username" } });
    expect(w.text()).toContain("Username");
    w.unmount();
  });

  it("renders a label element by default", () => {
    const w = mount(Label, { slots: { default: "Test" } });
    expect(w.find("label").exists()).toBe(true);
    w.unmount();
  });

  it("accepts for attribute", () => {
    const w = mount(Label, {
      props: { for: "input-id" },
      slots: { default: "Test" },
    });
    expect(w.find("label").attributes("for")).toBe("input-id");
    w.unmount();
  });

  it("applies custom class", () => {
    const w = mount(Label, {
      props: { class: "custom-class" },
      slots: { default: "Test" },
    });
    expect(w.find('[data-slot="label"]').classes()).toContain("custom-class");
    w.unmount();
  });
});
