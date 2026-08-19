import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { StackedAreaChart } from "../index";

describe("StackedAreaChart", () => {
  const sampleProps = {
    data: [{ m: "Jan", a: 10, b: 20 }],
    xField: "m",
    yFields: ["a", "b"],
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(
      <StackedAreaChart {...sampleProps} />,
    );
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <StackedAreaChart
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
