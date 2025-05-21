import React, { useState } from "react";

// Dummy event data - this will come from API/backend
const dummyEventData = [
  { date: "2025-04-10", venue: "COM Gym" },
  { date: "2025-04-11", venue: "COM Gym" },
  { date: "2025-04-12", venue: "COM Gym" },
  { date: "2025-04-17", venue: "Cultural Center" },
  { date: "2025-05-11", venue: "COM Gym" },
  { date: "2025-05-12", venue: "Cultural Center" },
  { date: "2025-05-17", venue: "Cultural Center" },
  { date: "2025-05-18", venue: "COM Gym" },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({
  eventData = dummyEventData,
  primaryColor = "#0458A9",
}) {
  // Set today's date to May 22, 2025
  const today = new Date(2025, 4, 22); // May 22, 2025 (months are 0-indexed)

  // Initialize view to today's month and year
  const [view, setView] = useState({
    year: today.getFullYear(),
    month: today.getMonth(), // May is 4 (0-indexed)
  });

  const [hoveredDate, setHoveredDate] = useState(null);

  function getMonthMatrix(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const matrix = [];
    let week = [];
    let day = 1 - firstDay.getDay();
    for (let i = 0; i < 6; i++) {
      week = [];
      for (let j = 0; j < 7; j++, day++) {
        let d, isCurrent, isPrev, isNext;
        if (day < 1) {
          d = prevLastDay.getDate() + day;
          isCurrent = false;
          isPrev = true;
          isNext = false;
        } else if (day > lastDay.getDate()) {
          d = day - lastDay.getDate();
          isCurrent = false;
          isPrev = false;
          isNext = true;
        } else {
          d = day;
          isCurrent = true;
          isPrev = false;
          isNext = false;
        }
        week.push({
          date: new Date(
            year,
            isCurrent ? month : isPrev ? month - 1 : month + 1,
            d
          ),
          isCurrent,
          isPrev,
          isNext,
        });
      }
      matrix.push(week);
    }
    return matrix;
  }

  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }

  function getEvents(date) {
    return eventData.filter((e) => e.date === formatDate(date));
  }

  function handlePrev() {
    setView((v) => {
      let m = v.month - 1;
      let y = v.year;
      if (m < 0) {
        m = 11;
        y--;
      }
      return { year: y, month: m };
    });
  }

  function handleNext() {
    setView((v) => {
      let m = v.month + 1;
      let y = v.year;
      if (m > 11) {
        m = 0;
        y++;
      }
      return { year: y, month: m };
    });
  }

  const monthName = new Date(view.year, view.month).toLocaleString("default", {
    month: "long",
  });

  const matrix = getMonthMatrix(view.year, view.month);

  // Check if a date is today (May 22, 2025)
  const isToday = (date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-xl shadow border border-[#C0C0C0] overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
          {monthName} {view.year} Calendar
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="rounded-full hover:bg-gray-100 p-2"
            aria-label="Previous month"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="rounded-full hover:bg-gray-100 p-2"
            aria-label="Next month"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="px-6 flex-grow flex flex-col">
        <div className="grid grid-cols-7 text-center font-medium mb-4">
          {daysOfWeek.map((d) => (
            <div key={d} className="text-sm">
              {d}
            </div>
          ))}
        </div>
        <div
          className="grid grid-cols-7 grid-rows-6 flex-grow"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {matrix.flat().map((cell, idx) => {
            const events = getEvents(cell.date);
            const hasEvents = events.length > 0;
            const isTodayDate = isToday(cell.date);

            return (
              <div
                key={idx}
                className="relative flex items-center justify-center py-1"
              >
                {isTodayDate && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-10 h-10 rounded-full z-0"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                  </div>
                )}
                <button
                  onClick={() => {}}
                  onMouseEnter={() => setHoveredDate(cell.date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`relative w-full h-full flex flex-col items-center justify-center z-10
                    ${cell.isCurrent ? "text-black" : "text-gray-400"}
                    ${isTodayDate ? "text-white font-medium" : "font-medium"}
                  `}
                >
                  <span className="text-lg">{cell.date.getDate()}</span>
                  {hasEvents && (
                    <span
                      className="absolute -top-1 right-1/4 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    ></span>
                  )}
                </button>

                {/* Hover tooltip */}
                {hoveredDate &&
                  formatDate(hoveredDate) === formatDate(cell.date) &&
                  hasEvents && (
                    <div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20 p-2 rounded-md shadow-lg text-white text-xs w-max"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {getEvents(cell.date)
                        .map((e) => e.venue)
                        .join(", ")}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Legend and Full View */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 mt-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-blue-600 rounded-full inline-block" />
          <span>Venue is reserved on that day</span>
        </div>
        <button className="text-blue-700 hover:underline font-medium">
          Full View
        </button>
      </div>
    </div>
  );
}
