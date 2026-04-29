import EventColumn from "./EventColumn";
import { COMPARE_EVENTS } from "@/lib/compare-events";

/**
 * The Bet 02 hero — three event columns side by side on desktop,
 * stacked on mobile. No outer chrome; verticals come from a
 * `divide-x` on the desktop grid.
 */
export default function EventHero() {
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-3 gap-y-10 lg:gap-x-10 lg:divide-x lg:divide-[color:var(--rule)] bs-enter"
      aria-label="Three events, three funds"
    >
      {COMPARE_EVENTS.map((event, i) => (
        <div
          key={event.id}
          className={i === 0 ? "lg:pr-0" : "lg:px-8 lg:first:pl-0 lg:last:pr-0"}
        >
          <EventColumn event={event} />
        </div>
      ))}
    </section>
  );
}
