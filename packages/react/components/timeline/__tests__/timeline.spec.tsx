import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  Timeline,
  TimelineItem,
  TimelineMedia,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineDate,
} from "../timeline";

describe("Timeline", () => {
  it('Timeline renders with data-slot="timeline"', () => {
    const { container } = render(<Timeline />);
    expect(container.querySelector('[data-slot="timeline"]')).toBeTruthy();
  });

  it("Timeline has data-uipkge", () => {
    const { container } = render(<Timeline />);
    expect(
      container
        .querySelector('[data-slot="timeline"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("Timeline applies data-direction", () => {
    const { container } = render(<Timeline direction="horizontal" />);
    expect(
      container
        .querySelector('[data-slot="timeline"]')
        ?.getAttribute("data-direction"),
    ).toBe("horizontal");
  });

  it("Timeline applies data-align", () => {
    const { container } = render(<Timeline align="center" />);
    expect(
      container
        .querySelector('[data-slot="timeline"]')
        ?.getAttribute("data-align"),
    ).toBe("center");
  });

  it("Timeline defaults to vertical direction", () => {
    const { container } = render(<Timeline />);
    expect(
      container
        .querySelector('[data-slot="timeline"]')
        ?.getAttribute("data-direction"),
    ).toBe("vertical");
  });

  it('TimelineItem renders with data-slot="timeline-item"', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineContent>Content</TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    expect(container.querySelector('[data-slot="timeline-item"]')).toBeTruthy();
  });

  it("TimelineItem has data-uipkge", () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineContent>Content</TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    expect(
      container
        .querySelector('[data-slot="timeline-item"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("TimelineItem applies data-status", () => {
    const { container } = render(
      <Timeline>
        <TimelineItem status="success">
          <TimelineContent>Content</TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    expect(
      container
        .querySelector('[data-slot="timeline-item"]')
        ?.getAttribute("data-status"),
    ).toBe("success");
  });

  it('TimelineMedia renders with data-slot="timeline-media"', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineMedia />
          <TimelineContent>Content</TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    expect(
      container.querySelector('[data-slot="timeline-media"]'),
    ).toBeTruthy();
  });

  it('TimelineContent renders with data-slot="timeline-content"', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineContent>Content</TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    expect(
      container.querySelector('[data-slot="timeline-content"]'),
    ).toBeTruthy();
  });

  it('TimelineTitle renders with data-slot="timeline-title"', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineContent>
            <TimelineTitle>Title</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    expect(
      container.querySelector('[data-slot="timeline-title"]'),
    ).toBeTruthy();
  });

  it('TimelineDescription renders with data-slot="timeline-description"', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineContent>
            <TimelineDescription>Description</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    expect(
      container.querySelector('[data-slot="timeline-description"]'),
    ).toBeTruthy();
  });

  it('TimelineDate renders with data-slot="timeline-date"', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineContent>
            <TimelineDate>Jan 1, 2024</TimelineDate>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    expect(container.querySelector('[data-slot="timeline-date"]')).toBeTruthy();
  });

  it("TimelineDate renders a time element", () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineContent>
            <TimelineDate>Jan 1, 2024</TimelineDate>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    expect(
      container
        .querySelector('[data-slot="timeline-date"]')
        ?.tagName.toLowerCase(),
    ).toBe("time");
  });

  it("TimelineTitle renders as h3 by default", () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineContent>
            <TimelineTitle>Title</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    expect(
      container
        .querySelector('[data-slot="timeline-title"]')
        ?.tagName.toLowerCase(),
    ).toBe("h3");
  });
});
