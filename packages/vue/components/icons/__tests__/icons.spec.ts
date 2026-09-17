import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Icon from "../Icon.vue";

describe("Icon (Vue)", () => {
  it('renders container with data-slot="icon"', () => {
    const wrapper = mount(Icon, {
      slots: { default: '<svg data-testid="test-svg"></svg>' },
    });
    expect(wrapper.find('[data-slot="icon"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it("applies size class and passes slots", () => {
    const wrapper = mount(Icon, {
      props: { size: "xl" },
      slots: { default: "<svg></svg>" },
    });
    expect(wrapper.find('[data-slot="icon"]').classes()).toContain("size-8");
    wrapper.unmount();
  });
});
