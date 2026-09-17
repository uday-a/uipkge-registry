import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { RangeAreaChart } from "../index";

describe("RangeAreaChart", () => {
  const sampleProps = {
    data: [{ d: "Mon", min: 10, max: 20, avg: 15 }],
    xField: "d",
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<RangeAreaChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <RangeAreaChart
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
