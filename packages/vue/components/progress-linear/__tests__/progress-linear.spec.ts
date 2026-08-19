import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { ProgressLinear } from "../index";

describe("ProgressLinear", () => {
  it('renders with data-slot="progress-linear"', () => {
    const w = mount(ProgressLinear, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="progress-linear"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(ProgressLinear, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it('has role="progressbar"', () => {
    const w = mount(ProgressLinear, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="progress-linear"]').attributes("role")).toBe(
      "progressbar",
    );
    w.unmount();
  });

  it("sets aria-valuenow based on modelValue", () => {
    const w = mount(ProgressLinear, {
      props: { modelValue: 60 },
      attachTo: document.body,
    });
    expect(
      w.find('[data-slot="progress-linear"]').attributes("aria-valuenow"),
    ).toBe("60");
    w.unmount();
  });

  it("does not set aria-valuenow when indeterminate", () => {
    const w = mount(ProgressLinear, {
      props: { modelValue: 60, indeterminate: true },
      attachTo: document.body,
    });
    expect(
      w.find('[data-slot="progress-linear"]').attributes("aria-valuenow"),
    ).toBeUndefined();
    w.unmount();
  });

  it("applies rounded variant class", () => {
    const w = mount(ProgressLinear, {
      props: { modelValue: 50, rounded: "none" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="progress-linear"]').classes()).toContain(
      "rounded-none",
    );
    w.unmount();
  });

  it("clamps value to 0-100 range (above)", () => {
    const w = mount(ProgressLinear, {
      props: { modelValue: 150 },
      attachTo: document.body,
    });
    expect(
      w.find('[data-slot="progress-linear"]').attributes("aria-valuenow"),
    ).toBe("100");
    w.unmount();
  });

  it("clamps value to 0-100 range (below)", () => {
    const w = mount(ProgressLinear, {
      props: { modelValue: -10 },
      attachTo: document.body,
    });
    expect(
      w.find('[data-slot="progress-linear"]').attributes("aria-valuenow"),
    ).toBe("0");
    w.unmount();
  });
});
