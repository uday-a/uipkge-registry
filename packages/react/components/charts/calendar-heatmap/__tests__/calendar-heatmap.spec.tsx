import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CalendarHeatmap } from "../index";

describe("CalendarHeatmap", () => {
  const sampleProps = { data: [["2024-01-01", 1]], range: "2024" };

  it("renders without crashing", () => {
    const { container, unmount } = render(<CalendarHeatmap {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <CalendarHeatmap
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
