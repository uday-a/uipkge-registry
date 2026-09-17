import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { LineChart } from "../index";

describe("LineChart", () => {
  const sampleProps = {
    data: [{ day: "Mon", sessions: 10 }],
    xField: "day",
    yField: "sessions",
  };

  it("renders without crashing", () => {
    const wrapper = mount(LineChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(LineChart, {
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
