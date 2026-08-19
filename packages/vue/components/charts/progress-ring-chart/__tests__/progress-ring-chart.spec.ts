import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { ProgressRingChart } from "../index";

describe("ProgressRingChart", () => {
  const sampleProps = { rings: [{ value: 60, label: "Progress" }] };

  it("renders without crashing", () => {
    const wrapper = mount(ProgressRingChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(ProgressRingChart, {
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
