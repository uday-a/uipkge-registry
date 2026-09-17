import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { ChoroplethMapChart } from "../index";

describe("ChoroplethMapChart", () => {
  const sampleProps = {
    geoJson: { type: "FeatureCollection", features: [] },
    mapName: "test-map",
    data: [],
  };

  it("renders without crashing", () => {
    const wrapper = mount(ChoroplethMapChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(ChoroplethMapChart, {
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
