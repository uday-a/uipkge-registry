import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { ViolinChart } from "../index";

describe("ViolinChart", () => {
  const sampleProps = { groups: [{ name: "G1", values: [1, 2, 3, 4, 5] }] };

  it("renders without crashing", () => {
    const wrapper = mount(ViolinChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(ViolinChart, {
      props: {
        ...sampleProps,
        class: "custom-chart-test",
        height: 380,
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("custom-chart-test");
    wrapper.unmount();
  });
});
