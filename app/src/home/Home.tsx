import React, { useEffect } from "react";
import type { PlannerBuckets, PlannerService } from "../domain/planner";

type HomeProps = {
  planner: PlannerService;
};

export function Home({ planner }: HomeProps) {
  const [buckets, setBuckets] = React.useState<PlannerBuckets | null>(null);

  useEffect(() => {
    planner.getTodayBuckets().then(setBuckets);
  }, [planner]);

  return (
    <div>
      {!buckets && <p>Loading...</p>}
      <section data-testid="overdue-section">
        <h2>overdue ({buckets?.overdue.length ?? 0})</h2>
        {buckets && buckets.overdue.length === 0 ? (
          <p>No overdue exercises.</p>
        ) : (
          <ul>
            {buckets?.overdue.map((exercise) => (
              <li key={exercise.id}>{exercise.title}</li>
            ))}
          </ul>
        )}
      </section>

      <section data-testid="due-today-section">
        <h2>due today ({buckets?.dueToday.length ?? 0})</h2>
        {buckets && buckets.dueToday.length === 0 ? (
          <p>No due today exercises.</p>
        ) : (
          <ul>
            {buckets?.dueToday.map((exercise) => (
              <li key={exercise.id}>{exercise.title}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
