import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { LoadingBar } from "../index";

describe("LoadingBar", () => {
  it('renders container with data-slot="loading-bar"', () => {
    const w = mount(LoadingBar, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="loading-bar"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(LoadingBar, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(
      w.find('[data-slot="loading-bar"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('renders progress bar fill with data-slot="loading-bar-fill"', () => {
    const w = mount(LoadingBar, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="loading-bar-fill"]').exists()).toBe(true);
    w.unmount();
  });

  it('applies data-state="determinate" by default', () => {
    const w = mount(LoadingBar, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="loading-bar"]').attributes("data-state")).toBe(
      "determinate",
    );
    w.unmount();
  });

  it('applies data-state="indeterminate" when indeterminate', () => {
    const w = mount(LoadingBar, {
      props: { indeterminate: true },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="loading-bar"]').attributes("data-state")).toBe(
      "indeterminate",
    );
    w.unmount();
  });

  it('applies data-state="error" when error prop is true', () => {
    const w = mount(LoadingBar, {
      props: { modelValue: 50, error: true },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="loading-bar"]').attributes("data-state")).toBe(
      "error",
    );
    w.unmount();
  });

  it('applies data-position="top" by default', () => {
    const w = mount(LoadingBar, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(
      w.find('[data-slot="loading-bar"]').attributes("data-position"),
    ).toBe("top");
    w.unmount();
  });

  it('applies data-position="bottom" when position prop is set', () => {
    const w = mount(LoadingBar, {
      props: { modelValue: 50, position: "bottom" },
      attachTo: document.body,
    });
    expect(
      w.find('[data-slot="loading-bar"]').attributes("data-position"),
    ).toBe("bottom");
    w.unmount();
  });

  it('renders indeterminate bar with data-slot="loading-bar-indeterminate"', () => {
    const w = mount(LoadingBar, {
      props: { indeterminate: true },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="loading-bar-indeterminate"]').exists()).toBe(
      true,
    );
    w.unmount();
  });

  it('has role="progressbar"', () => {
    const w = mount(LoadingBar, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="loading-bar"]').attributes("role")).toBe(
      "progressbar",
    );
    w.unmount();
  });
});
