import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import ReserveStep2Modal from "./ReserveStep2Modal";
import { getVenueBookings } from "../api/requests";
import {
  FadeIn,
  ScaleOnHover,
  ButtonPress,
  ModalAnimation,
} from "./AnimationWrapper";

// Helper function to get days in month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get first day of month
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

// Helper function to format date for backend
const formatDate = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
};

// Helper function to check if date is within booking window
const isWithinBookingWindow = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twoWeeksFromNow = new Date(today);
  twoWeeksFromNow.setDate(today.getDate() + 14);

  return date >= twoWeeksFromNow;
};

export default function ReserveStep1Modal({
  open,
  onClose,
  venue,
  onChangeVenue,
  onNext,
  venues = [],
}) {
  const [bookingType, setBookingType] = useState("multiple");
  const [selectedDays, setSelectedDays] = useState([]);
  const [step2Open, setStep2Open] = useState(false);
  const [showVenueSelector, setShowVenueSelector] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [partialDayInfo, setPartialDayInfo] = useState(null);

  // Set initial calendar month to the first available booking month when modal opens
  useEffect(() => {
    if (open) {
      const firstAvailableBookingDate = new Date();
      firstAvailableBookingDate.setHours(0, 0, 0, 0); // Normalize to start of day
      firstAvailableBookingDate.setDate(
        firstAvailableBookingDate.getDate() + 14
      );
      setCurrentDate(firstAvailableBookingDate);
    }
  }, [open]); // Re-run if the modal is opened

  // Fetch bookings for the selected venue
  useEffect(() => {
    if (venue && venue.name) {
      getVenueBookings(venue.name).then((data) => {
        setBookedSlots(data);
      });
    } else {
      setBookedSlots([]);
    }
  }, [venue]);

  // Update calendar when current date changes
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = Array.from({ length: 42 }, (_, i) => {
      const day = i - firstDay + 1;
      if (day > 0 && day <= daysInMonth) {
        const date = new Date(year, month, day);
        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
        const isWithinWindow = isWithinBookingWindow(date);
        const blackout = isDateBooked(date);
        return {
          day,
          date,
          isPast,
          isWithinWindow,
          formattedDate: formatDate(year, month, day),
          disabled: isPast || !isWithinWindow || blackout,
        };
      }
      return null;
    });

    setCalendarDays(days);
  }, [currentDate, bookedSlots, bookingType]);

  // Blackout logic for calendar
  // Normalize to local date (YYYY-MM-DD)
  const normalizeDate = (d) => {
    const local = new Date(d);
    return (
      local.getFullYear() +
      "-" +
      String(local.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(local.getDate()).padStart(2, "0")
    );
  };
  const isDateBooked = (date) => {
    // Block Sundays
    if (date.getDay() === 0) return true;

    // For multi-day booking, block all selected days and any day that is fully or partially blocked in the backend
    if (bookingType === "multiple") {
      const dateStr = normalizeDate(date);
      if (selectedDays.some((d) => d.formattedDate === dateStr)) {
        return true;
      }
      // Block if the day is fully or partially booked (AM or PM)
      const partial = getPartialDayInfo(date);
      return partial.blocked || partial.amBooked || partial.pmBooked;
    }

    if (bookingType === "one") {
      // Only block if the full day is blocked for single-day booking
      return getPartialDayInfo(date).blocked;
    }

    // Default: not blocked
    return false;
  };

  // Enhanced blackout logic for single-day bookings
  const getPartialDayInfo = (date) => {
    const dateStr = normalizeDate(date);
    // Find all approved bookings for this date
    const bookingsForDate = bookedSlots.filter(
      (slot) =>
        slot.status &&
        slot.status.toLowerCase() === "approved" &&
        slot.perDayTimes.some((day) => normalizeDate(day.date) === dateStr)
    );
    // If any booking is multi-day (perDayTimes.length > 1), block the whole day
    if (bookingsForDate.some((slot) => slot.perDayTimes.length > 1)) {
      return { blocked: true };
    }
    // Gather all time ranges for this date
    const times = bookingsForDate
      .map((slot) =>
        slot.perDayTimes
          .filter((d) => normalizeDate(d.date) === dateStr)
          .map((d) => ({ start: d.startTime, end: d.endTime }))
      )
      .flat();
    if (times.length === 0) return { blocked: false };
    // AM: any booking with endTime <= 12:30
    // PM: any booking with startTime >= 13:00
    let amBooked = false,
      pmBooked = false,
      amEnd = null,
      pmStart = null;
    times.forEach(({ start, end }) => {
      const [sH, sM] = start.split(":").map(Number);
      const [eH, eM] = end.split(":").map(Number);
      const startMins = sH * 60 + sM;
      const endMins = eH * 60 + eM;
      if (endMins <= 750) {
        // 12:30 PM or earlier
        amBooked = true;
        amEnd = end;
      }
      if (startMins >= 780 && endMins > startMins) {
        // 1:00 PM or later
        pmBooked = true;
        pmStart = start;
      }
      // If a booking overlaps both (e.g. 11:00–14:00), block the day
      if (startMins < 780 && endMins > 750) {
        amBooked = true;
        pmBooked = true;
      }
    });
    if (amBooked && pmBooked) return { blocked: true };
    if (amBooked)
      return { blocked: false, amBooked: true, amEnd: amEnd || "12:30" };
    if (pmBooked)
      return { blocked: false, pmBooked: true, pmStart: pmStart || "13:00" };
    return { blocked: false };
  };

  // When a single day is selected, compute partialDayInfo
  useEffect(() => {
    if (bookingType === "one" && selectedDays.length === 1) {
      setPartialDayInfo(getPartialDayInfo(selectedDays[0].date));
    } else {
      setPartialDayInfo(null);
    }
  }, [bookingType, selectedDays, bookedSlots]);

  // Deselect any selected day(s) that become blocked after a booking
  useEffect(() => {
    if (bookingType === "one" && selectedDays.length === 1) {
      const day = selectedDays[0];
      if (isDateBooked(day.date)) {
        setSelectedDays([]);
      }
    }
    // if (bookingType === "multiple" && selectedDays.length > 0) {
    //   const filtered = selectedDays.filter((d) => !isDateBooked(d.date));
    //   if (filtered.length !== selectedDays.length) {
    //     setSelectedDays(filtered);
    //   }
    // }
  }, [calendarDays, bookingType, selectedDays]);

  // Function to refresh bookings for the current venue
  const refreshBookings = async () => {
    if (venue && venue.name) {
      const data = await getVenueBookings(venue.name);
      setBookedSlots(data);
    }
  };

  if (!open || !venue) return null;

  const handleDayClick = (dayData) => {
    if (!dayData || dayData.disabled) return;

    if (bookingType === "one") {
      setSelectedDays([dayData]);
    } else {
      setSelectedDays((prev) => {
        const exists = prev.some(
          (d) => d.formattedDate === dayData.formattedDate
        );
        if (exists) {
          return prev.filter((d) => d.formattedDate !== dayData.formattedDate);
        }
        return [...prev, dayData];
      });
    }
  };

  const handleNext = () => {
    if (bookingType === "multiple" && selectedDays.length < 2) {
      setErrorMsg("Please select at least 2 days for a multiple-day booking.");
      return;
    }
    setErrorMsg("");
    // Prepare data for backend
    const bookingData = {
      venueId: venue.id,
      venueName: venue.name,
      bookingType,
      selectedDates: selectedDays.map((day) => day.formattedDate),
      rawSelectedDays: selectedDays,
      venue: venue,
    };
    setStep2Open(true);
  };

  const handleVenueSelect = (selectedVenue) => {
    onChangeVenue(selectedVenue);
    setSelectedDays([]);
    setShowVenueSelector(false);
  };

  const handleMonthChange = (increment) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + increment);
      return newDate;
    });
  };

  // Venue Selector Modal
  const VenueSelector = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredVenues = venues.filter(
      (v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 border-b border-gray-200">
            <div className="mb-2 sm:mb-0">
              <h3 className="text-xl md:text-2xl font-bold text-[#0458A9]">
                Select a Venue
              </h3>
              <p className="text-gray-600 text-sm">
                Choose from {venues.length} available venues
              </p>
            </div>
            <button
              onClick={() => setShowVenueSelector(false)}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors self-end sm:self-auto"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 md:p-6 pb-2 md:pb-4 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search venues by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0458A9] focus:border-transparent text-base placeholder-gray-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Venues Grid */}
          <div className="flex-1 px-4 pt-4 pb-24 md:p-6 overflow-y-auto">
            {filteredVenues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredVenues.map((v, index) => (
                  <div key={v.name} className="group">
                    <button
                      onClick={() => handleVenueSelect(v)}
                      className="w-full flex flex-col bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#0458A9] hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0458A9] focus:border-transparent"
                    >
                      <div className="relative w-full aspect-video overflow-hidden">
                        <img
                          src={v.images ? v.images[0] : v.image}
                          alt={v.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                        />
                        {/* Gradient overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                      <div className="p-4 flex-1 flex flex-col text-left">
                        <h4 className="font-bold text-[#0458A9] text-base md:text-lg mb-2 group-hover:text-[#03407a] transition-colors line-clamp-2">
                          {v.name}
                        </h4>
                        {v.description && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-1">
                            {v.description}
                          </p>
                        )}
                        {v.participants && (
                          <div className="flex items-center text-gray-500 text-sm">
                            <svg
                              className="w-4 h-4 mr-1"
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
                            {v.participants} max
                          </div>
                        )}
                        {/* Selected indicator for current venue */}
                        {v.name === venue.name && (
                          <div className="mt-3 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0458A9] text-white animate-pulse">
                              Currently Selected
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No venues found
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Try adjusting your search terms or clearing the search to see
                  all available venues.
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 px-4 py-2 bg-[#0458A9] text-white rounded-lg hover:bg-[#03407a] transition-colors text-sm font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                {filteredVenues.length} of {venues.length} venues{" "}
                {searchTerm ? "match your search" : "available"}
              </p>
              <button
                onClick={() => setShowVenueSelector(false)}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {open && !step2Open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-auto flex flex-col gap-6 px-4 pt-4 pb-24 md:p-10 overflow-y-auto max-h-[90vh]">
            {/* Header: Close button and Step 1 Label */}
            <div className="flex items-center justify-between w-full mb-2">
              {/* Empty div for spacing, allowing Step 1 to be on the right and close button to be truly on top right of modal */}
              <div className="w-1/3">
                {" "}
                {/* Adjust width as needed or remove if Step 1 can be centered */}
                {/* Intentionally empty or for a potential left-aligned element */}
              </div>
              <FadeIn delay={200} className="w-1/3 text-center">
                <span className="text-[#0458A9] font-semibold text-lg md:text-xl">
                  Step 1
                </span>
              </FadeIn>
              <div className="w-1/3 flex justify-end">
                <button
                  className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors z-10" // Added z-10 just in case
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Title and subtitle */}
            <FadeIn delay={300}>
              <div className="mb-2">
                <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9]">
                  Preferred Date
                </h2>
                <div className="text-gray-600 text-sm md:text-base">
                  indicate whether your booking is for a single day or multiple
                  days, then select your preferred date(s).
                </div>
              </div>
            </FadeIn>

            {/* Main content */}
            <FadeIn delay={400}>
              <div className="flex flex-col md:flex-row gap-8 w-full">
                {/* Left: Venue Info */}
                <div className="flex flex-col items-center md:w-1/2 w-full justify-start">
                  <ScaleOnHover>
                    <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4">
                      <img
                        src={venue.images ? venue.images[0] : venue.image}
                        alt={venue.name}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  </ScaleOnHover>
                  <div className="w-full text-left">
                    <h3 className="text-2xl font-bold text-[#0458A9] leading-tight mb-1">
                      {venue.name}
                    </h3>
                    <div className="text-gray-400 text-base mb-4">
                      Managed by (Insert Department Name)
                    </div>
                    <ButtonPress>
                      <button
                        className="bg-[#0458A9] text-white rounded-full px-6 py-2 font-semibold text-base w-full md:w-auto hover:bg-[#03407a] transition-all duration-200 transform hover:scale-105"
                        onClick={() => {
                          setShowVenueSelector(true);
                        }}
                      >
                        Change Venue
                      </button>
                    </ButtonPress>
                  </div>
                </div>

                {/* Right: Booking Type and Calendar */}
                <div className="flex flex-col gap-4 md:w-1/2 w-full">
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-[#0458A9] mb-2">
                      Type of Booking
                    </h4>
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-2">
                      <ButtonPress className="w-full sm:w-1/2 md:w-auto">
                        <button
                          className={`rounded-full px-6 py-2 font-semibold border transition-all duration-200 text-base w-full ${
                            bookingType === "one"
                              ? "bg-[#0458A9] text-white border-[#0458A9] transform scale-105"
                              : "bg-white text-gray-400 border-gray-300 hover:border-[#0458A9] hover:text-[#0458A9]"
                          }`}
                          onClick={() => {
                            setBookingType("one");
                            setSelectedDays([]);
                          }}
                        >
                          One Day
                        </button>
                      </ButtonPress>
                      <ButtonPress className="w-full sm:w-1/2 md:w-auto">
                        <button
                          className={`rounded-full px-6 py-2 font-semibold border transition-all duration-200 text-base w-full ${
                            bookingType === "multiple"
                              ? "bg-[#0458A9] text-white border-[#0458A9] transform scale-105"
                              : "bg-white text-gray-400 border-gray-300 hover:border-[#0458A9] hover:text-[#0458A9]"
                          }`}
                          onClick={() => {
                            setBookingType("multiple");
                            setSelectedDays([]);
                          }}
                        >
                          Multiple Days
                        </button>
                      </ButtonPress>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-[#0458A9] mb-2">
                      Preferred Day(s)
                    </h4>
                    <div className="rounded-2xl border border-gray-400 p-4 bg-white">
                      <div className="flex justify-between items-center mb-4">
                        <ButtonPress>
                          <button
                            onClick={() => handleMonthChange(-1)}
                            className="text-gray-600 hover:text-[#0458A9] p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            ←
                          </button>
                        </ButtonPress>
                        <div className="font-bold text-[#0458A9] text-lg">
                          {currentDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        <ButtonPress>
                          <button
                            onClick={() => handleMonthChange(1)}
                            className="text-gray-600 hover:text-[#0458A9] p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            →
                          </button>
                        </ButtonPress>
                      </div>
                      <div className="text-sm text-gray-600 mb-2 text-center">
                        Bookings available from{" "}
                        {new Date(
                          new Date().setDate(new Date().getDate() + 14)
                        ).toLocaleDateString()}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-gray-700 text-base mb-1">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (d) => (
                            <div key={d} className="font-semibold">
                              {d}
                            </div>
                          )
                        )}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {calendarDays.map((dayData, i) => (
                          <ButtonPress key={i}>
                            <button
                              className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base transition-all duration-200 border-2 transform ${
                                !dayData
                                  ? "bg-transparent border-transparent cursor-default"
                                  : dayData.disabled
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                  : selectedDays.some(
                                      (d) =>
                                        d.formattedDate ===
                                        dayData.formattedDate
                                    )
                                  ? "bg-[#0458A9] text-white border-[#0458A9] scale-110 shadow-lg"
                                  : "bg-white text-gray-700 border-transparent hover:bg-blue-50 hover:scale-105"
                              }`}
                              disabled={!dayData || dayData.disabled}
                              onClick={() => handleDayClick(dayData)}
                              title={
                                dayData?.disabled
                                  ? "Bookings available from 2 weeks ahead"
                                  : ""
                              }
                            >
                              {dayData?.day || ""}
                            </button>
                          </ButtonPress>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Footer: Back/Next */}
            <FadeIn delay={500}>
              <div className="flex justify-between items-center mt-6 w-full">
                <ButtonPress>
                  <button
                    className="text-gray-400 font-semibold text-base px-6 py-2 rounded-full cursor-pointer hover:text-[#0458A9] hover:bg-gray-100 transition-all duration-200"
                    onClick={onClose}
                  >
                    Back
                  </button>
                </ButtonPress>
                <ButtonPress>
                  <button
                    className="bg-[#0458A9] text-white rounded-full px-10 py-2 font-semibold text-base hover:bg-[#03407a] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleNext}
                    disabled={
                      (bookingType === "multiple" && selectedDays.length < 2) ||
                      (bookingType === "one" && selectedDays.length === 0)
                    }
                  >
                    Next
                  </button>
                </ButtonPress>
              </div>
            </FadeIn>

            {errorMsg && (
              <FadeIn>
                <div className="text-red-600 text-center mt-2 font-semibold animate-pulse">
                  {errorMsg}
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      )}
      {/* Step 2 Modal */}
      <ReserveStep2Modal
        open={step2Open}
        onClose={() => {
          setStep2Open(false);
          onClose();
        }}
        onPrevious={() => setStep2Open(false)}
        onNext={async (data) => {
          await refreshBookings();
          setStep2Open(false);
          onNext && onNext(data);
        }}
        venues={venues}
        initialVenue={venue.name}
        reservationData={{
          venue: venue,
          selectedDates: selectedDays.map((day) => day.formattedDate),
          bookingType,
          rawSelectedDays: selectedDays,
        }}
        partialDayInfo={partialDayInfo}
      />
      {/* Add Venue Selector Modal */}
      {showVenueSelector && <VenueSelector />}
    </>
  );
}
