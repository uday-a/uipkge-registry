import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Stepper, StepperItem, StepperContent, StepperHeader } from "../index";
import StepperIndicator from "../StepperIndicator.vue";

// Stepper.vue and StepperItem.vue reference sibling children (StepperItem,
// StepperIndicator) by tag name without importing them — they rely on Nuxt
// auto-import in the app. Register them globally so the SFC compiler's
// resolveComponent() calls succeed in tests.
function mountStepper(overrides: Record<string, unknown> = {}) {
  return mount(
    {
      template:
        '<Stepper :steps="steps" v-model="val"><StepperHeader /><StepperContent :step="1">Content 1</StepperContent><StepperContent :step="2">Content 2</StepperContent></Stepper>',
      components: { Stepper, StepperItem, StepperContent, StepperHeader },
      data() {
        return {
          val: overrides.val ?? 1,
          steps: [{ title: "Step 1" }, { title: "Step 2" }],
        };
      },
    },
    {
      attachTo: document.body,
      global: { components: { StepperItem, StepperIndicator } },
    },
  );
}

describe("Stepper", () => {
  it('renders with role="tablist"', () => {
    const w = mountStepper();
    expect(w.find('[role="tablist"]').exists()).toBe(true);
    w.unmount();
  });

  it("StepperItem renders without crashing", () => {
    const w = mountStepper();
    // Stepper family doesn't set data-uipkge; verify data-slot instead
    const item = w.find('[data-slot="stepper-item"]');
    expect(item.exists()).toBe(true);
    w.unmount();
  });

  it('StepperItem renders with data-slot="stepper-item"', () => {
    const w = mountStepper();
    expect(w.find('[data-slot="stepper-item"]').exists()).toBe(true);
    w.unmount();
  });

  it("StepperItem has data-status attribute", () => {
    const w = mountStepper();
    const items = w.findAll('[data-slot="stepper-item"]');
    expect(items[0].attributes("data-status")).toBe("active");
    expect(items[1].attributes("data-status")).toBe("pending");
    w.unmount();
  });

  it('StepperContent renders with data-slot="stepper-content"', () => {
    const w = mountStepper();
    expect(w.findAll('[data-slot="stepper-content"]').length).toBe(2);
    w.unmount();
  });

  it("StepperContent shows content for active step", () => {
    const w = mountStepper();
    const contents = w.findAll('[data-slot="stepper-content"]');
    expect(contents[0].isVisible()).toBe(true);
    expect(contents[0].text()).toContain("Content 1");
    w.unmount();
  });

  it("StepperContent hides content for inactive step (aria-hidden)", () => {
    const w = mountStepper();
    const contents = w.findAll('[data-slot="stepper-content"]');
    expect(contents[1].attributes("aria-hidden")).toBe("true");
    expect(contents[1].isVisible()).toBe(false);
    w.unmount();
  });

  it("Stepper applies data-orientation", () => {
    const w = mountStepper();
    expect(w.find('[role="tablist"]').attributes("data-orientation")).toBe(
      "horizontal",
    );
    w.unmount();
  });

  it("StepperHeader renders", () => {
    const w = mountStepper();
    expect(w.find(".stepper-header").exists()).toBe(true);
    w.unmount();
  });

  it("emits update:modelValue when step changes", async () => {
    const w = mountStepper({ val: 2 });
    const indicators = w.findAll('[data-slot="stepper-indicator"]');
    await indicators[0].trigger("click");
    expect(w.findComponent(Stepper).emitted("update:modelValue")).toBeTruthy();
    w.unmount();
  });
});
