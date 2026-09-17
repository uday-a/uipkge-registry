import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TagsInput from "../TagsInput.vue";
import TagsInputInput from "../TagsInputInput.vue";

function mountTagsInput(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { TagsInput, TagsInputInput },
      data() {
        return { val: props.modelValue ?? [], ...props };
      },
      template: `
        <TagsInput
          :model-value="val"
          :default-value="defaultValue"
          :disabled="disabled"
          :placeholder="placeholder"
          :max="max"
          @update:model-value="val = $event"
        >
          <TagsInputInput />
        </TagsInput>`,
      computed: {
        defaultValue: () => props.defaultValue,
        disabled: () => props.disabled,
        placeholder: () => props.placeholder,
        max: () => props.max,
      },
    },
    { attachTo: document.body },
  );
}

describe("TagsInput", () => {
  it('renders with data-slot="tags-input"', () => {
    const w = mountTagsInput({ modelValue: [] });
    expect(w.find('[data-slot="tags-input"]').exists()).toBe(true);
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it('renders input with data-slot="tags-input-input"', () => {
    const w = mountTagsInput({ modelValue: [] });
    expect(w.find('[data-slot="tags-input-input"]').exists()).toBe(true);
    w.unmount();
  });

  it("renders a native input element", () => {
    const w = mountTagsInput({ modelValue: [] });
    expect(w.find("input").exists()).toBe(true);
    w.unmount();
  });

  it("renders without crashing with empty modelValue", () => {
    const w = mountTagsInput({ modelValue: [] });
    expect(w.find('[data-slot="tags-input"]').exists()).toBe(true);
    w.unmount();
  });

  it("renders without crashing with tags", () => {
    const w = mountTagsInput({ modelValue: ["tag1", "tag2"] });
    expect(w.find('[data-slot="tags-input"]').exists()).toBe(true);
    w.unmount();
  });

  it("renders without crashing in uncontrolled mode", () => {
    const w = mount(
      {
        components: { TagsInput, TagsInputInput },
        template: "<TagsInput><TagsInputInput /></TagsInput>",
      },
      { attachTo: document.body },
    );
    expect(w.find('[data-slot="tags-input"]').exists()).toBe(true);
    w.unmount();
  });
});
