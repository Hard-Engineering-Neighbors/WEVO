import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { fetchApprovedEvents } from "../../api/requests";

export default function CalendarComponent({
  primaryColor = "#0458A9",
  onEventClick = null,
  onDateSelect = null,
  onFullViewClick = null,
  layout = "default",
  showReserveButton = true,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchApprovedEvents()
      .then((data) => {
        setEventData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load events");
        setLoading(false);
      });
  }, []);

  // Helper to get YYYY-MM-DD in Asia/Manila
  const getPHDateString = (date) => {
    return date.toLocaleDateString("en-CA", { timeZone: "Asia/Manila" }); // 'YYYY-MM-DD'
  };

  // Get events for a specific date (in PH time)
  const getEventsForDate = (date) => {
    const dateStr = getPHDateString(date);
    return eventData.filter((event) => {
      // If perDayTimes is present, check if any entry matches the date
      if (event.perDayTimes && event.perDayTimes.length > 0) {
        return event.perDayTimes.some((d) => d.date === dateStr);
      }
      // Otherwise, check if the date is between start_time and end_time (in PH time)
      if (event.start_time && event.end_time) {
        const start = new Date(
          new Date(event.start_time).toLocaleString("en-US", {
            timeZone: "Asia/Manila",
          })
        );
        const end = new Date(
          new Date(event.end_time).toLocaleString("en-US", {
            timeZone: "Asia/Manila",
          })
        );
        const d = new Date(dateStr + "T00:00:00");
        return (
          d >=
            new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
          d <= new Date(end.getFullYear(), end.getMonth(), end.getDate())
        );
      }
      return false;
    });
  };

  // Get events for selected date
  const selectedDateEvents = getEventsForDate(selectedDate);

  // Check if a date has events (in PH time)
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

  // Add a handler for reserve button
  const handleReserveClick = () => {
    // If using react-router, you can use navigate('/venues')
    // For now, fallback to window.location
    window.location.href = "/venues";
  };

  // Tile content to show event indicators
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const eventsOnDate = getEventsForDate(date);
      const eventCount = eventsOnDate.length;

      if (eventCount > 0) {
        return (
          <div className="flex justify-center items-center mt-1 w-full">
            {eventCount === 1 ? (
              <div
                className="w-2 h-2 rounded-full" // Standard 8px dot for single event
                style={{ backgroundColor: primaryColor }}
              />
            ) : (
              // Enhanced badge for multiple events
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-semibold leading-none"
                // 16px diameter circle with 10px semi-bold text
                style={{ backgroundColor: primaryColor }}
              >
                {eventCount > 9 ? "9+" : eventCount}
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  // Custom tile className
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const isToday = getPHDateString(date) === getPHDateString(new Date());
      const isSelected =
        getPHDateString(date) === getPHDateString(selectedDate);

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

      {/* Main Content - Different layouts based on layout prop */}
      <div
        className={`flex-1 flex ${
          layout === "admin" ? "flex-col" : "flex-col lg:flex-row"
        } min-h-0`}
      >
        {/* Calendar Section */}
        <div
          className={`${
            layout === "admin" ? "flex-1" : "flex-1 lg:flex-[2_1_0%]"
          } p-6`}
        >
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
        <div
          className={`w-full ${
            layout === "admin"
              ? "border-t"
              : "lg:flex-[1_1_0%] border-t lg:border-t-0 lg:border-l"
          } border-gray-100 bg-gray-50`}
        >
          <div
            className={`p-6 h-full flex flex-col ${
              layout === "admin" ? "min-h-[200px]" : "min-h-[300px]"
            }`}
          >
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

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading events...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : selectedDateEvents.length > 0 ? (
              <div
                className={`space-y-3 ${
                  layout === "admin" ? "max-h-[150px]" : "max-h-[220px]"
                } overflow-y-auto pr-1`}
              >
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
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
                        {event.perDayTimes && event.perDayTimes.length > 0 ? (
                          event.perDayTimes
                            .filter(
                              (d) => d.date === getPHDateString(selectedDate)
                            )
                            .map((d, idx) => (
                              <span key={idx}>
                                {d.startTime} - {d.endTime}
                              </span>
                            ))
                        ) : (
                          <span>
                            {new Date(event.start_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "Asia/Manila",
                            })}
                            {" - "}
                            {new Date(event.end_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "Asia/Manila",
                            })}
                          </span>
                        )}
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {event.org}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 flex flex-col items-center gap-4">
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
                <p className="text-gray-500 mb-2">No events scheduled</p>
              </div>
            )}
            {/* Conditionally show Reserve button based on showReserveButton prop */}
            {showReserveButton && (
              <>
                <div className="flex-1" />
                <button
                  className="bg-[#0458A9] hover:bg-[#03407a] text-white font-semibold rounded-full px-6 py-2 text-base transition mt-6 w-full"
                  onClick={handleReserveClick}
                >
                  Reserve
                </button>
              </>
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
        </div>
      </div>

      {/* Modern Calendar Styles */}
      <style>{`
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
