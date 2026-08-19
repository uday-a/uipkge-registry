import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import { DatePicker } from "../index";

function mountDatePicker(props: Record<string, unknown> = {}) {
  return mount(DatePicker, {
    props: { placeholder: "Pick a date", ...props },
    attachTo: document.body,
  });
}

describe("DatePicker", () => {
  it("renders without crashing", () => {
    const w = mountDatePicker();
    expect(w.find('[data-slot="date-picker"]').exists()).toBe(true);
    w.unmount();
  });

  it("renders a trigger button", () => {
    const w = mountDatePicker();
    expect(w.find('button[data-slot="date-picker"]').exists()).toBe(true);
    w.unmount();
  });

  it("shows placeholder text", () => {
    const w = mountDatePicker({ placeholder: "Pick a date" });
    expect(w.text()).toContain("Pick a date");
    w.unmount();
  });

  it("disables trigger when disabled prop is true", () => {
    const w = mountDatePicker({ disabled: true });
    expect(
      w.find('button[data-slot="date-picker"]').attributes("disabled"),
    ).toBeDefined();
    w.unmount();
  });

  it("renders clear button when clearable and has value", () => {
    const w = mountDatePicker({ modelValue: "2024-06-15", clearable: true });
    expect(w.find('[aria-label="Clear date"]').exists()).toBe(true);
    w.unmount();
  });

  it("does not render clear button when no value", () => {
    const w = mountDatePicker({ clearable: true });
    expect(w.find('[aria-label="Clear date"]').exists()).toBe(false);
    w.unmount();
  });

  it("does not render clear button when not clearable", () => {
    const w = mountDatePicker({ modelValue: "2024-06-15", clearable: false });
    expect(w.find('[aria-label="Clear date"]').exists()).toBe(false);
    w.unmount();
  });

  it("has data-uipkge on trigger", () => {
    const w = mountDatePicker();
    expect(
      w.find('[data-slot="date-picker"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("keeps each selected date when type is multiple", async () => {
    const selectedDates = ref<string[]>([]);
    const w = mount(
      {
        components: { DatePicker },
        setup: () => ({ selectedDates }),
        template: '<DatePicker v-model="selectedDates" type="multiple" />',
      },
      { attachTo: document.body },
    );

    await w.find('button[data-slot="date-picker"]').trigger("click");
    await nextTick();

    const days = Array.from(
      document.querySelectorAll<HTMLButtonElement>(
        '[data-slot="calendar-cell-trigger"]',
      ),
    ).filter((day) => !day.disabled);
    days[10]!.click();
    await nextTick();
    days[11]!.click();
    await nextTick();

    expect(selectedDates.value).toHaveLength(2);
    expect(new Set(selectedDates.value).size).toBe(2);
    w.unmount();
  });
});
