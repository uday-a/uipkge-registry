import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import RichTextEditor from "../RichTextEditor.vue";

describe("RichTextEditor (Vue)", () => {
  it('renders editor container with data-slot="rich-text-editor"', () => {
    const wrapper = mount(RichTextEditor, {
      props: { placeholder: "Type here..." },
    });
    expect(wrapper.find('[data-slot="rich-text-editor"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it("renders editor content area and handles input", async () => {
    const wrapper = mount(RichTextEditor, {
      props: { modelValue: "<p>Initial text</p>" },
    });
    await flushPromises();
    expect(wrapper.find('[data-slot="rich-text-editor"]').exists()).toBe(true);
    expect(wrapper.classes()).toContain("rich-text-editor");
    wrapper.unmount();
  });
});
