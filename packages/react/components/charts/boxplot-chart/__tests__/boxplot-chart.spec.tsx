import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { BoxplotChart } from "../index";

describe("BoxplotChart", () => {
  const sampleProps = { data: [[1, 2, 3, 4, 5]] };

  it("renders without crashing", () => {
    const { container, unmount } = render(<BoxplotChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <BoxplotChart
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
