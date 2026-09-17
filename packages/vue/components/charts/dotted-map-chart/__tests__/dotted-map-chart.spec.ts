import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { DottedMapChart } from "../index";

describe("DottedMapChart", () => {
  const sampleProps = {
    pins: [{ id: "1", lat: 0, lng: 0, label: "Pin" }],
    routes: [],
  };

  it("renders without crashing", () => {
    const wrapper = mount(DottedMapChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(DottedMapChart, {
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
