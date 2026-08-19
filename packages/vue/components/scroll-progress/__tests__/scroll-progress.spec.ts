import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScrollProgress from "../ScrollProgress.vue";

describe("ScrollProgress (Vue)", () => {
  it('renders container with data-slot="scroll-progress"', () => {
    const wrapper = mount(ScrollProgress);
    expect(wrapper.find('[data-slot="scroll-progress"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it("applies absolute position attribute and class", () => {
    const wrapper = mount(ScrollProgress, {
      props: { position: "absolute", height: 4 },
    });
    expect(wrapper.attributes("data-position")).toBe("absolute");
    expect(wrapper.classes()).toContain("absolute");
    wrapper.unmount();
  });
});
