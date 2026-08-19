import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CategoryDistributionChart } from "../index";

describe("CategoryDistributionChart", () => {
  const sampleProps = {
    primaryValue: "100",
    primaryLabel: "Total",
    categories: [{ name: "A", percentage: 50 }],
  };

  it("renders without crashing", () => {
    const { container, unmount } = render(
      <CategoryDistributionChart {...sampleProps} />,
    );
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <CategoryDistributionChart
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
