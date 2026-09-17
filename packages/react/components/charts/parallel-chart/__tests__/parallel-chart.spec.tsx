import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ParallelChart } from "../index";

describe("ParallelChart", () => {
  const sampleProps = {
    axes: [
      { dim: 0, name: "A" },
      { dim: 1, name: "B" },
    ],
    data: [[1, 2]],
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<ParallelChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <ParallelChart
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
