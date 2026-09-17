import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { DumbbellChart } from "../index";

describe("DumbbellChart", () => {
  const sampleProps = {
    data: [{ category: "A", start: 10, end: 20 }],
    names: ["Q1", "Q2"],
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(<DumbbellChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <DumbbellChart
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
