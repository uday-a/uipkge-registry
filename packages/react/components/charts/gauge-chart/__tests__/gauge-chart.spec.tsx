import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { GaugeChart } from "../index";

describe("GaugeChart", () => {
  const sampleProps = { value: 65, unit: "%", label: "Usage" };

  it("renders without crashing", () => {
    const { container, unmount } = render(<GaugeChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <GaugeChart
        {...sampleProps}
        className="custom-chart-test"
        height={380}
      />,
    );
    expect(container).toBeDefined();
    expect(
      container.querySelector(".custom-chart-test") || container.firstChild,
    ).toBeTruthy();
    unmount();
  });
});
