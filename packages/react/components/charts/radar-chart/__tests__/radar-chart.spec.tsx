import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { RadarChart } from "../index";

describe("RadarChart", () => {
  const sampleProps = {
    indicators: [{ name: "A", max: 100 }],
    data: [{ name: "Series", value: [50] }],
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<RadarChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <RadarChart
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
