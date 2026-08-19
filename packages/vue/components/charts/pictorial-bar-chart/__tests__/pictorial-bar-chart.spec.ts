import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { PictorialBarChart } from "../index";

describe("PictorialBarChart", () => {
  const sampleProps = { data: [{ category: "A", value: 10 }] };

  it("renders without crashing", () => {
    const wrapper = mount(PictorialBarChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(PictorialBarChart, {
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
