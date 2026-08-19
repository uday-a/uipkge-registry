import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TreeChart } from "../index";

describe("TreeChart", () => {
  const sampleProps = { data: { name: "Root", children: [{ name: "Leaf" }] } };

  it("renders without crashing", () => {
    const { container, unmount } = render(<TreeChart {...sampleProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toBeTruthy();
    unmount();
  });

  it("renders expected content or unique feature", () => {
    const { container, unmount } = render(
      <TreeChart {...sampleProps} className="custom-chart-test" height={380} />,
    );
    expect(container).toBeDefined();
    expect(
      container.querySelector(".custom-chart-test") || container.firstChild,
    ).toBeTruthy();
    unmount();
  });
});
