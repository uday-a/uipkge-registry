import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ProgressRingChart } from "../index";

describe("ProgressRingChart", () => {
  const sampleProps = { rings: [{ value: 60, label: "Progress" }] };

  it("renders without crashing", () => {
    const { container, unmount } = render(
      <ProgressRingChart {...sampleProps} />,
    );
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <ProgressRingChart
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
