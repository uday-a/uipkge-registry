import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Calendar } from "../Calendar";

describe("Calendar", () => {
  it("renders without crashing", () => {
    const { container } = render(<Calendar />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with data-slot="calendar"', () => {
    const { container } = render(<Calendar />);
    expect(container.querySelector('[data-slot="calendar"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(<Calendar />);
    expect(
      container
        .querySelector('[data-slot="calendar"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("renders a grid", () => {
    const { container } = render(<Calendar />);
    expect(container.querySelector('[role="grid"]')).toBeTruthy();
  });

  it("renders weekday headers", () => {
    const { container } = render(<Calendar />);
    // react-day-picker renders weekday headers in the grid thead
    const headers = container.querySelectorAll('[role="grid"] thead th');
    expect(headers.length).toBeGreaterThan(0);
  });

  it("has navigation buttons", () => {
    const { container } = render(<Calendar />);
    const prev = container.querySelector('button[aria-label*="Previous"]');
    const next = container.querySelector('button[aria-label*="Next"]');
    expect(prev).toBeTruthy();
    expect(next).toBeTruthy();
  });

  it("renders day gridcells in the grid", () => {
    const { container } = render(<Calendar />);
    const grid = container.querySelector('[role="grid"]');
    expect(grid?.querySelectorAll('[role="gridcell"]').length).toBeGreaterThan(
      0,
    );
  });

  it("renders seven weekday headers", () => {
    const { container } = render(<Calendar />);
    const headers = container.querySelectorAll('[role="grid"] thead th');
    expect(headers.length).toBe(7);
  });
});
