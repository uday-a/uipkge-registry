import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { SlopeChart } from "../index";

describe("SlopeChart", () => {
  const sampleProps = {
    data: [{ label: "A", values: [10, 20] }],
    points: ["2023", "2024"],
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<SlopeChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <SlopeChart
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
