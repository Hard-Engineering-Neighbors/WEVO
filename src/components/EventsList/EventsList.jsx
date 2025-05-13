import React, { useState } from "react";
import { User, MapPin, Clock } from "lucide-react";

// Example event data for April 2025
const eventData = [
  {
    date: "2025-04-03",
    org: "Organization Name",
    venue: "COM Gym",
    start: "2025-04-03T07:30",
    end: "2025-04-04T17:30",
  },
  // Add more events as needed
];

// Helper to get all unique event dates for the month
function getEventDatesWithEvents(year, month, events) {
  const filtered = events.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const unique = Array.from(new Set(filtered.map((e) => e.date)));
  return unique.map((dateStr) => new Date(dateStr));
}

function formatDateLabel(date) {
  return date.toLocaleString("default", { month: "long", day: "numeric" });
}

function formatTimeRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleString([], {
    month: "short",
    day: "numeric",
  })}, ${s.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} AM to ${e.toLocaleString([], {
    month: "short",
    day: "numeric",
  })} ${e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} PM`;
}

export default function EventsList({ year = 2025, month = 3 }) {
  const [open, setOpen] = useState(null);
  const days = getEventDatesWithEvents(year, month, eventData);

  // Group events by date string
  const eventsByDate = {};
  for (const e of eventData) {
    if (!eventsByDate[e.date]) eventsByDate[e.date] = [];
    eventsByDate[e.date].push(e);
  }

  return (
    <div className="bg-white rounded-xl shadow border border-[#C0C0C0] p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-[#0458A9] mb-2">Events List</h2>
      <div className="flex-1 overflow-y-auto">
        {days.map((dateObj) => {
          const dateStr = dateObj.toISOString().slice(0, 10);
          const events = eventsByDate[dateStr] || [];
          const isOpen = open === dateStr;
          return (
            <div key={dateStr} className="mb-2">
              <button
                className="flex items-center justify-between w-full text-left font-bold text-lg md:text-xl py-2 focus:outline-none"
                onClick={() => setOpen(isOpen ? null : dateStr)}
              >
                <span>{formatDateLabel(dateObj)}</span>
                <span className="ml-2">
                  {isOpen ? (
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 15l6-6 6 6" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  )}
                </span>
              </button>
              {isOpen && (
                <div className="pl-2 pb-2">
                  {events.map((e, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="text-gray-400" size={20} />
                        <span className="text-base font-medium text-gray-700">
                          {e.org}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="text-gray-400" size={20} />
                        <span className="text-base text-gray-700">
                          {e.venue}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="text-gray-400" size={20} />
                        <span className="text-base text-gray-700">
                          {formatTimeRange(e.start, e.end)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-end mt-2">
        <button className="text-[#0458A9] hover:underline text-sm font-medium">
          Full View
        </button>
      </div>
    </div>
  );
}
