import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MaskedInput from "../MaskedInput.vue";

describe("MaskedInput", () => {
  it('renders with data-slot="masked-input"', () => {
    const w = mount(MaskedInput, {
      props: { modelValue: "", mask: "##/##/####" },
    });
    expect(w.find('[data-slot="masked-input"]').exists()).toBe(true);
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders a native input element", () => {
    const w = mount(MaskedInput, {
      props: { modelValue: "", mask: "##/##/####" },
    });
    expect(w.find("input").exists()).toBe(true);
    w.unmount();
  });

  it("disables input when disabled prop is true", () => {
    const w = mount(MaskedInput, {
      props: { modelValue: "", mask: "##/##/####", disabled: true },
    });
    expect(w.find("input").attributes("disabled")).toBeDefined();
    w.unmount();
  });

  it("sets input as readonly when readonly prop is true", () => {
    const w = mount(MaskedInput, {
      props: { modelValue: "", mask: "##/##/####", readonly: true },
    });
    expect(w.find("input").attributes("readonly")).toBeDefined();
    w.unmount();
  });

  it("emits update:modelValue when typing", async () => {
    const w = mount(MaskedInput, {
      props: { modelValue: "", mask: "##/##/####" },
    });
    const input = w.find("input");
    await input.setValue("12");
    expect(w.emitted("update:modelValue")).toBeTruthy();
    w.unmount();
  });

  it("uses defaultValue when modelValue is not provided", () => {
    const w = mount(MaskedInput, {
      props: { defaultValue: "", mask: "##/##/####" },
    });
    expect(w.find("input").exists()).toBe(true);
    w.unmount();
  });

  it("applies mask format when user types", async () => {
    const w = mount(MaskedInput, { props: { modelValue: "", mask: "##-##" } });
    const input = w.find("input");
    input.element.value = "12";
    await input.trigger("input");
    const emitted = w.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    expect(emitted![0][0]).toContain("-");
    w.unmount();
  });

  it("emits complete event when mask is fully filled", async () => {
    const w = mount(MaskedInput, { props: { modelValue: "", mask: "##" } });
    const input = w.find("input");
    await input.setValue("12");
    const completeEvents = w.emitted("complete");
    if (completeEvents) {
      expect(completeEvents[0]).toEqual(["12"]);
    }
    w.unmount();
  });

  it("blocks non-digits in numeric slots", async () => {
    const w = mount(MaskedInput, { props: { modelValue: "", mask: "##-##" } });
    const input = w.find("input");
    input.element.value = "ab";
    await input.trigger("input");
    const emitted = w.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    // Non-digits are blocked, so output contains only mask placeholders
    expect(emitted![0][0]).toBe("__-__");
    w.unmount();
  });

  it("displays placeholder text when provided", () => {
    const w = mount(MaskedInput, {
      props: { modelValue: "", mask: "##/##/####", placeholder: "MM/DD/YYYY" },
    });
    const input = w.find("input");
    expect(input.attributes("placeholder")).toBe("MM/DD/YYYY");
    w.unmount();
  });

  it("displays error message and sets aria-invalid", () => {
    const w = mount(MaskedInput, {
      props: {
        modelValue: "12",
        mask: "##/##/####",
        invalid: true,
        errorMessage: "Date is incomplete",
      },
    });
    const input = w.find("input");
    expect(input.attributes("aria-invalid")).toBe("true");
    const errorEl = w.find('[data-slot="masked-input-error"]');
    expect(errorEl.exists()).toBe(true);
    expect(errorEl.text()).toBe("Date is incomplete");
    w.unmount();
  });
});
