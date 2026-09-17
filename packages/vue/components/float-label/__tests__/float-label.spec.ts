import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { FloatLabel } from "../index";

function mountFloatLabel(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(FloatLabel, { props, slots, attachTo: document.body });
}

describe("FloatLabel", () => {
  it('renders container with data-slot="float-label" and data-uipkge', () => {
    const w = mountFloatLabel({ label: "Email" }, { default: "<input />" });
    const el = w.find('[data-slot="float-label"]');
    expect(el.exists()).toBe(true);
    expect(el.attributes("data-uipkge")).toBeDefined();
    w.unmount();
  });

  it("renders an input from slot", () => {
    const w = mountFloatLabel({ label: "Email" }, { default: "<input />" });
    expect(w.find("input").exists()).toBe(true);
    w.unmount();
  });

  it("renders a label element", () => {
    const w = mountFloatLabel({ label: "Email" }, { default: "<input />" });
    expect(w.find("label").exists()).toBe(true);
    w.unmount();
  });

  it("label text matches prop", () => {
    const w = mountFloatLabel({ label: "Username" }, { default: "<input />" });
    expect(w.find("label").text()).toBe("Username");
    w.unmount();
  });

  it("data-floating is false initially when input is empty", async () => {
    const w = mountFloatLabel({ label: "Email" }, { default: "<input />" });
    await flushPromises();
    expect(
      w.find('[data-slot="float-label"]').attributes("data-floating"),
    ).toBe("false");
    w.unmount();
  });

  it("label floats on focus (data-floating becomes true)", async () => {
    const w = mountFloatLabel({ label: "Email" }, { default: "<input />" });
    await flushPromises();
    await w.find("input").trigger("focusin");
    expect(
      w.find('[data-slot="float-label"]').attributes("data-floating"),
    ).toBe("true");
    w.unmount();
  });

  it("shows required indicator when required prop is set", () => {
    const w = mountFloatLabel(
      { label: "Email", required: true },
      { default: "<input />" },
    );
    const label = w.find("label");
    expect(label.classes().some((c) => c.includes("destructive"))).toBe(true);
    w.unmount();
  });
});
