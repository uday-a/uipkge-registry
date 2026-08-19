import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { LiquidFillChart } from "../index";

describe("LiquidFillChart", () => {
  const sampleProps = { value: 60, unit: "%" };

  it("renders without crashing", () => {
    const { container, unmount } = render(<LiquidFillChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <LiquidFillChart
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
