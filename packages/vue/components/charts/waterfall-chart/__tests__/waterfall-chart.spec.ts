import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { WaterfallChart } from "../index";

describe("WaterfallChart", () => {
  const sampleProps = { data: [{ name: "Start", value: 100 }] };

  it("renders without crashing", () => {
    const wrapper = mount(WaterfallChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(WaterfallChart, {
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
