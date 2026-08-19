import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { SunburstChart } from "../index";

describe("SunburstChart", () => {
  const sampleProps = {
    data: [{ name: "Root", children: [{ name: "Leaf", value: 10 }] }],
  };

  it("renders without crashing", () => {
    const wrapper = mount(SunburstChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(SunburstChart, {
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
