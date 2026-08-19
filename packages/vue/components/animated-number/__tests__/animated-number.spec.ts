import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AnimatedNumber from "../AnimatedNumber.vue";

describe("AnimatedNumber (Vue)", () => {
  it('renders container with data-slot="animated-number"', () => {
    const wrapper = mount(AnimatedNumber, {
      props: { value: 100 },
    });
    expect(wrapper.find('[data-slot="animated-number"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it("formats displayed value using format prop", () => {
    const wrapper = mount(AnimatedNumber, {
      props: {
        value: 250,
        disabled: true,
        format: (v: number) => `$${v}.00`,
      },
    });
    expect(wrapper.text()).toBe("$250.00");
    wrapper.unmount();
  });
});
