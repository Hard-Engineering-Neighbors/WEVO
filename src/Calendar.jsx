import React, { useState } from "react";

const eventData = [
  { date: "2025-03-31", label: "Cultural Center" },
  { date: "2025-04-03", label: "COM Gym" },
  { date: "2025-04-04", label: "COM Gym" },
  { date: "2025-04-10", label: "COM Gym" },
  { date: "2025-04-15", label: "Cultural Center" },
  { date: "2025-04-18", label: "COM Gym" },
  { date: "2025-04-21", label: "Cultural Center" },
  { date: "2025-04-24", label: "COM Gym" },
  { date: "2025-04-30", label: "COM Gym" },
  { date: "2025-05-01", label: "COM Gym" },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthMatrix(year, month) {
  // month: 0-indexed
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

export default function Calendar() {
  const today = new Date();
  const [view, setView] = useState({
    year: 2025,
    month: 3, // April (0-indexed)
  });
  const [selected, setSelected] = useState(null);
  const matrix = getMonthMatrix(view.year, view.month);

  // Find events for a given date
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

  return (
    <div className="bg-white rounded-2xl shadow border border-[#C0C0C0] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-[#C0C0C0]">
        <h2 className="text-3xl font-bold text-[#0458A9]">
          {monthName} {view.year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="rounded-full hover:bg-gray-100 p-2"
          >
            <span className="sr-only">Previous</span>
            <svg
              width="24"
              height="24"
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
          >
            <span className="sr-only">Next</span>
            <svg
              width="24"
              height="24"
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
      <div className="px-4 pt-4 pb-2">
        <div className="grid grid-cols-7 text-center text-gray-500 font-semibold mb-2">
          {daysOfWeek.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center gap-y-2">
          {matrix.flat().map((cell, idx) => {
            const events = getEvents(cell.date);
            const isToday = formatDate(cell.date) === formatDate(today);
            return (
              <button
                key={idx}
                onClick={() => setSelected(cell)}
                className={`flex flex-col items-center justify-start rounded-lg py-1 transition-all
                  ${
                    cell.isCurrent
                      ? "text-black bg-white hover:bg-blue-50"
                      : "text-gray-400 bg-white hover:bg-gray-100"
                  }
                  ${isToday && cell.isCurrent ? "font-bold text-blue-600" : ""}
                  ${
                    selected &&
                    formatDate(selected.date) === formatDate(cell.date)
                      ? "ring-2 ring-blue-400"
                      : ""
                  }
                `}
                style={{ minHeight: 48 }}
              >
                <span className="text-base">{cell.date.getDate()}</span>
                {events.length > 0 && (
                  <div className="flex flex-col items-center mt-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full inline-block mb-0.5" />
                    <span className="text-xs text-gray-700 leading-tight">
                      {events[0].label}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Legend and Full View */}
      <div className="flex items-center justify-between px-6 py-2 border-t border-[#C0C0C0] mt-2 text-sm">
        <span className="flex items-center gap-2 text-gray-500">
          <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block" />
          Booked in this day
        </span>
        <button className="text-[#0458A9] hover:underline font-medium">
          Full View
        </button>
      </div>
      {/* Modal for events */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[260px] max-w-xs relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setSelected(null)}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
            <h3 className="text-lg font-bold mb-2 text-[#0458A9]">
              {selected.date.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
            <ul className="space-y-1">
              {getEvents(selected.date).length > 0 ? (
                getEvents(selected.date).map((e, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full inline-block" />
                    <span>{e.label}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No events scheduled.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
