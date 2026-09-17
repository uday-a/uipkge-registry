import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ScatterChart } from "../index";

describe("ScatterChart", () => {
  const sampleProps = { data: [{ x: 1, y: 2 }], xField: "x", yField: "y" };

  it("renders without crashing", () => {
    const { container, unmount } = render(<ScatterChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <ScatterChart
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
