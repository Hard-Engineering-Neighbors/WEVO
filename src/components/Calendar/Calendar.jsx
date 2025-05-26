import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Event data structure for backend integration
const dummyEventData = [
  {
    id: 1,
    date: "2025-04-10",
    venue: "COM Gym",
    event: "Basketball Practice",
    time: "7:30 AM - 9:30 AM",
    organization: "Sports Club",
  },
  {
    id: 2,
    date: "2025-04-10",
    venue: "COM Gym",
    event: "Volleyball Tournament",
    time: "10:00 AM - 4:00 PM",
    organization: "Athletic Department",
  },
  {
    id: 3,
    date: "2025-04-12",
    venue: "COM Gym",
    event: "Fitness Class",
    time: "6:00 PM - 7:30 PM",
    organization: "Fitness Club",
  },
  {
    id: 4,
    date: "2025-04-17",
    venue: "Cultural Center",
    event: "Art Exhibition",
    time: "9:00 AM - 6:00 PM",
    organization: "Art Society",
  },
  {
    id: 5,
    date: "2025-05-11",
    venue: "COM Gym",
    event: "Swimming Competition",
    time: "8:00 AM - 12:00 PM",
    organization: "Swim Team",
  },
  {
    id: 6,
    date: "2025-05-12",
    venue: "Cultural Center",
    event: "Music Concert",
    time: "7:00 PM - 9:00 PM",
    organization: "Music Club",
  },
  {
    id: 7,
    date: "2025-05-17",
    venue: "Cultural Center",
    event: "Dance Performance",
    time: "6:30 PM - 8:30 PM",
    organization: "Dance Club",
  },
  {
    id: 8,
    date: "2025-05-18",
    venue: "COM Gym",
    event: "Tennis Match",
    time: "2:00 PM - 5:00 PM",
    organization: "Tennis Club",
  },
];

export default function CalendarComponent({
  eventData = dummyEventData,
  primaryColor = "#0458A9",
  onEventClick = null,
  onDateSelect = null,
  onFullViewClick = null,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // Format date to YYYY-MM-DD for comparison
  const formatDate = (date) => {
    return date.toISOString().slice(0, 10);
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return eventData.filter((event) => event.date === dateStr);
  };

  // Get events for selected date
  const selectedDateEvents = getEventsForDate(selectedDate);

  // Check if a date has events
  const hasEvents = (date) => {
    return getEventsForDate(date).length > 0;
  };

  // Get month and year for header
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = monthNames[activeStartDate.getMonth()];
  const currentYear = activeStartDate.getFullYear();

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date, getEventsForDate(date));
    }
  };

  // Handle event click
  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Tile content to show event indicators
  const tileContent = ({ date, view }) => {
    if (view === "month" && hasEvents(date)) {
      const eventCount = getEventsForDate(date).length;
      return (
        <div className="flex justify-center items-center mt-1">
          <div
            className="w-2 h-2 rounded-full flex items-center justify-center text-xs text-white font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            {eventCount > 1 && <span className="text-[8px]">{eventCount}</span>}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tile className
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const isToday = formatDate(date) === formatDate(new Date());
      const isSelected = formatDate(date) === formatDate(selectedDate);

      let classes = "calendar-tile";
      if (isToday) classes += " today";
      if (isSelected) classes += " selected";
      if (hasEvents(date)) classes += " has-events";

      return classes;
    }
    return null;
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-2xl font-semibold" style={{ color: primaryColor }}>
          Calendar
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Calendar Section */}
        <div className="flex-1 lg:flex-[2_1_0%] p-6">
          <div className="modern-calendar-wrapper h-full">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              activeStartDate={activeStartDate}
              onActiveStartDateChange={({ activeStartDate }) =>
                setActiveStartDate(activeStartDate)
              }
              tileContent={tileContent}
              tileClassName={tileClassName}
              showNeighboringMonth={true}
              calendarType="gregory"
              locale="en-US"
              prev2Label={null}
              next2Label={null}
              prevLabel={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              }
              nextLabel={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Event Details Section */}
        <div className="w-full lg:flex-[1_1_0%] border-t lg:border-t-0 lg:border-l border-gray-100 bg-gray-50">
          <div className="p-6 h-full overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedDateEvents.length} event
                {selectedDateEvents.length !== 1 ? "s" : ""} scheduled
              </p>
            </div>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {event.event}
                      </h4>
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0 ml-2"
                        style={{ backgroundColor: primaryColor }}
                      />
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {event.venue}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {event.organization}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500">No events scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: primaryColor }}
            />
            <span>Venue is reserved on that day</span>
          </div>
          <button
            className="text-sm font-medium hover:underline transition-colors"
            style={{ color: primaryColor }}
            onClick={onFullViewClick}
          >
            Full View
          </button>
        </div>
      </div>

      {/* Modern Calendar Styles */}
      <style jsx>{`
        .modern-calendar-wrapper {
          --primary-color: ${primaryColor};
          --primary-light: ${primaryColor}20;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-600: #4b5563;
        }

        .modern-calendar-wrapper .react-calendar {
          width: 100%;
          height: 100%;
          background: white;
          border: none;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", sans-serif;
          line-height: 1.125em;
          display: flex;
          flex-direction: column;
        }

        .modern-calendar-wrapper .react-calendar__navigation {
          display: flex;
          height: 48px;
          margin-bottom: 16px;
          align-items: center;
        }

        .modern-calendar-wrapper .react-calendar__navigation button {
          min-width: 40px;
          height: 40px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gray-600);
        }

        .modern-calendar-wrapper .react-calendar__navigation button:hover {
          background-color: var(--gray-100);
          color: var(--primary-color);
        }

        .modern-calendar-wrapper .react-calendar__navigation button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .modern-calendar-wrapper .react-calendar__navigation__label {
          font-weight: 600;
          font-size: 20px;
          color: var(--primary-color);
          flex-grow: 1;
          text-align: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .modern-calendar-wrapper .react-calendar__navigation__label:hover {
          background-color: var(--primary-light);
        }

        .modern-calendar-wrapper .react-calendar__viewContainer {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .modern-calendar-wrapper .react-calendar__month-view {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .modern-calendar-wrapper .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 11px;
          color: var(--gray-600);
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .modern-calendar-wrapper
          .react-calendar__month-view__weekdays__weekday {
          padding: 12px 0;
        }

        .modern-calendar-wrapper
          .react-calendar__month-view__weekdays__weekday
          abbr {
          text-decoration: none;
        }

        .modern-calendar-wrapper .react-calendar__month-view__days {
          flex: 1;
          display: grid !important;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: repeat(6, 1fr);
          gap: 2px;
          background-color: transparent;
          border-radius: 8px;
          overflow: hidden;
          min-height: 300px;
        }

        /* Ensure all tiles have consistent positioning */
        .modern-calendar-wrapper .react-calendar__tile {
          background: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 4px;
          min-height: 48px;
          height: 100%;
          font-size: 15px;
          font-weight: 500;
          position: relative;
          transition: all 0.2s ease;
          color: #1f2937;
          box-sizing: border-box;
        }

        /* Fix first day of month positioning */
        .modern-calendar-wrapper .react-calendar__month-view__days__day {
          grid-column: auto;
          grid-row: auto;
        }

        /* Ensure proper grid positioning for all days */
        .modern-calendar-wrapper .react-calendar__month-view__days > * {
          min-height: 48px;
          height: 100%;
        }

        .modern-calendar-wrapper .react-calendar__tile:hover {
          background-color: var(--primary-light);
          color: var(--primary-color);
        }

        .modern-calendar-wrapper .react-calendar__tile--active {
          background-color: var(--primary-color) !important;
          color: white !important;
          font-weight: 600;
        }

        .modern-calendar-wrapper .react-calendar__tile--now {
          background-color: #fef3c7;
          color: #d97706;
          font-weight: 600;
        }

        .modern-calendar-wrapper
          .react-calendar__tile--now.react-calendar__tile--active {
          background-color: var(--primary-color) !important;
          color: white !important;
        }

        .modern-calendar-wrapper
          .react-calendar__month-view__days__day--neighboringMonth {
          color: #d1d5db;
        }

        .modern-calendar-wrapper
          .react-calendar__month-view__days__day--weekend {
          color: inherit;
        }

        @media (max-width: 1024px) {
          .modern-calendar-wrapper .react-calendar__tile {
            min-height: 44px;
            font-size: 14px;
          }

          .modern-calendar-wrapper .react-calendar__navigation {
            height: 44px;
          }

          .modern-calendar-wrapper .react-calendar__navigation__label {
            font-size: 18px;
          }
        }

        @media (max-width: 640px) {
          .modern-calendar-wrapper .react-calendar__tile {
            min-height: 40px;
            font-size: 13px;
          }

          .modern-calendar-wrapper .react-calendar__navigation__label {
            font-size: 16px;
          }

          .modern-calendar-wrapper .react-calendar__month-view__weekdays {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
