import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { AlluvialChart } from "../index";

describe("AlluvialChart", () => {
  const sampleProps = { links: [{ source: "A", target: "B", value: 10 }] };

  it("renders without crashing", () => {
    const wrapper = mount(AlluvialChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(AlluvialChart, {
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
