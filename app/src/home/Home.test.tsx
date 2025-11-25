// app/src/home/Home.test.tsx

import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { Home } from "./Home";
import type { PlannerBuckets, PlannerService } from "../domain/planner";

/**
 * Helper to build a fake PlannerService for a test case.
 * It always resolves to the given buckets.
 */
function createFakePlanner(buckets: PlannerBuckets): PlannerService {
  return {
    getTodayBuckets: vi.fn().mockResolvedValue(buckets),
  };
}

describe("Home", () => {
  it("renders overdue and due today sections with correct order and counts", async () => {
    const buckets: PlannerBuckets = {
      overdue: [
        {
          id: "o1",
          title: "Oldest overdue",
          dueAt: "2025-01-01T10:00:00.000Z",
        },
        {
          id: "o2",
          title: "Newer overdue",
          dueAt: "2025-01-02T10:00:00.000Z",
        },
      ],
      dueToday: [
        {
          id: "t1",
          title: "Morning training",
          dueAt: "2025-01-03T07:00:00.000Z",
        },
        {
          id: "t2",
          title: "Evening training",
          dueAt: "2025-01-03T18:00:00.000Z",
        },
      ],
      upcoming: [],
    };

    const planner = createFakePlanner(buckets);

    const { container } = render(<Home planner={planner} />);

    // Because Home will fetch data asynchronously (Promise),
    // we wait for the Overdue heading to appear.
    const overdueHeading = await screen.findByRole("heading", {
      name: /overdue \(2\)/i,
    });
    expect(overdueHeading).toBeInTheDocument();

    // Due Today heading should also be there with count (2)
    const dueTodayHeading = screen.getByRole("heading", {
      name: /due today \(2\)/i,
    });
    expect(dueTodayHeading).toBeInTheDocument();

    // Overdue list – we assume Home renders a section with data-testid="overdue-section"
    const overdueSection = screen.getByTestId("overdue-section");
    const overdueItems = within(overdueSection).getAllByRole("listitem");
    const overdueTexts = overdueItems.map((li) => li.textContent?.trim());
    expect(overdueTexts).toEqual(["Oldest overdue", "Newer overdue"]);

    // Due Today list – section with data-testid="due-today-section"
    const dueTodaySection = screen.getByTestId("due-today-section");
    const dueTodayItems = within(dueTodaySection).getAllByRole("listitem");
    const dueTodayTexts = dueTodayItems.map((li) => li.textContent?.trim());
    expect(dueTodayTexts).toEqual(["Morning training", "Evening training"]);

    // Planner must be called exactly once
    expect(planner.getTodayBuckets).toHaveBeenCalledTimes(1);

    // Snapshot – locks in structure & basic content
    expect(container).toMatchSnapshot();
  });
});
