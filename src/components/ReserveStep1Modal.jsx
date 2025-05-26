import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import ReserveStep2Modal from "./ReserveStep2Modal";
import { getVenueBookings } from "../api/requests";

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
  }, [currentDate, bookedSlots]);

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

    // For multi-day booking, block all selected days and any day that is fully blocked in the backend
    if (bookingType === "multiple") {
      const dateStr = normalizeDate(date);
      if (selectedDays.some((d) => d.formattedDate === dateStr)) {
        return true;
      }
      // Also block if the day is fully blocked in the backend
      return getPartialDayInfo(date).blocked;
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
    let amBooked = false, pmBooked = false, amEnd = null, pmStart = null;
    times.forEach(({ start, end }) => {
      const [sH, sM] = start.split(":").map(Number);
      const [eH, eM] = end.split(":").map(Number);
      const startMins = sH * 60 + sM;
      const endMins = eH * 60 + eM;
      if (endMins <= 750) { // 12:30 PM or earlier
        amBooked = true;
        amEnd = end;
      }
      if (startMins >= 780 && endMins > startMins) { // 1:00 PM or later
        pmBooked = true;
        pmStart = start;
      }
      // If a booking overlaps both (e.g. 11:00–14:00), block the day
      if (startMins < 780 && endMins > 750) {
        amBooked = true; pmBooked = true;
      }
    });
    if (amBooked && pmBooked) return { blocked: true };
    if (amBooked) return { blocked: false, amBooked: true, amEnd: amEnd || "12:30" };
    if (pmBooked) return { blocked: false, pmBooked: true, pmStart: pmStart || "13:00" };
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
    if (bookingType === "multiple" && selectedDays.length > 0) {
      const filtered = selectedDays.filter((d) => !isDateBooked(d.date));
      if (filtered.length !== selectedDays.length) {
        setSelectedDays(filtered);
      }
    }
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
  const VenueSelector = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-[#0458A9]">Select a Venue</h3>
          <button
            onClick={() => setShowVenueSelector(false)}
            className="text-gray-400 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map((v) => (
            <button
              key={v.id}
              onClick={() => handleVenueSelect(v)}
              className="flex flex-col items-center p-4 border rounded-xl hover:border-[#0458A9] transition"
            >
              <div className="w-full aspect-video rounded-lg overflow-hidden mb-2">
                <img
                  src={v.images ? v.images[0] : v.image}
                  alt={v.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h4 className="font-semibold text-[#0458A9]">{v.name}</h4>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {open && !step2Open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-2 my-8 flex flex-col gap-6 p-4 md:p-10 overflow-y-auto max-h-[95vh]">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 z-10 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            {/* Step 1 label */}
            <div className="flex justify-end w-full">
              <span className="text-[#0458A9] font-semibold text-lg md:text-xl">
                Step 1
              </span>
            </div>
            {/* Title and subtitle */}
            <div className="mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9]">
                Preferred Date
              </h2>
              <div className="text-gray-600 text-sm md:text-base">
                indicate whether your booking is for a single day or multiple
                days, then select your preferred date(s).
              </div>
            </div>
            {/* Main content */}
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Left: Venue Info */}
              <div className="flex flex-col items-center md:w-1/2 w-full justify-start">
                <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4">
                  <img
                    src={venue.images ? venue.images[0] : venue.image}
                    alt={venue.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="w-full text-left">
                  <h3 className="text-2xl font-bold text-[#0458A9] leading-tight mb-1">
                    {venue.name}
                  </h3>
                  <div className="text-gray-400 text-base mb-4">
                    Managed by (Insert Department Name)
                  </div>
                  <button
                    className="bg-[#0458A9] text-white rounded-full px-6 py-2 font-semibold text-base w-full md:w-auto hover:bg-[#03407a] transition"
                    onClick={() => {
                      setShowVenueSelector(true);
                    }}
                  >
                    Change Venue
                  </button>
                </div>
              </div>
              {/* Right: Booking Type and Calendar */}
              <div className="flex flex-col gap-4 md:w-1/2 w-full">
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-[#0458A9] mb-2">
                    Type of Booking
                  </h4>
                  <div className="flex gap-2 mb-2">
                    <button
                      className={`rounded-full px-6 py-2 font-semibold border transition text-base w-1/2 md:w-auto ${
                        bookingType === "one"
                          ? "bg-[#0458A9] text-white border-[#0458A9]"
                          : "bg-white text-gray-400 border-gray-300"
                      }`}
                      onClick={() => {
                        setBookingType("one");
                        setSelectedDays([]);
                      }}
                    >
                      One Day
                    </button>
                    <button
                      className={`rounded-full px-6 py-2 font-semibold border transition text-base w-1/2 md:w-auto ${
                        bookingType === "multiple"
                          ? "bg-[#0458A9] text-white border-[#0458A9]"
                          : "bg-white text-gray-400 border-gray-300"
                      }`}
                      onClick={() => {
                        setBookingType("multiple");
                        setSelectedDays([]);
                      }}
                    >
                      Multiple Days
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-[#0458A9] mb-2">
                    Preferred Day(s)
                  </h4>
                  <div className="rounded-2xl border border-gray-400 p-4 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={() => handleMonthChange(-1)}
                        className="text-gray-600 hover:text-[#0458A9]"
                      >
                        ←
                      </button>
                      <div className="font-bold text-[#0458A9] text-lg">
                        {currentDate.toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <button
                        onClick={() => handleMonthChange(1)}
                        className="text-gray-600 hover:text-[#0458A9]"
                      >
                        →
                      </button>
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
                        <button
                          key={i}
                          className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base transition border-2 ${
                            !dayData
                              ? "bg-transparent border-transparent cursor-default"
                              : dayData.disabled
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : selectedDays.some(
                                  (d) =>
                                    d.formattedDate === dayData.formattedDate
                                )
                              ? "bg-[#0458A9] text-white border-[#0458A9]"
                              : "bg-white text-gray-700 border-transparent hover:bg-blue-50"
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
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer: Back/Next */}
            <div className="flex justify-between items-center mt-6 w-full">
              <button
                className="text-gray-400 font-semibold text-base px-6 py-2 rounded-full cursor-pointer hover:text-[#0458A9] hover:bg-gray-100 transition"
                onClick={onClose}
              >
                Back
              </button>
              <button
                className="bg-[#0458A9] text-white rounded-full px-10 py-2 font-semibold text-base hover:bg-[#03407a] transition"
                onClick={handleNext}
                disabled={
                  (bookingType === "multiple" && selectedDays.length < 2) ||
                  (bookingType === "one" && selectedDays.length === 0)
                }
              >
                Next
              </button>
            </div>
            {errorMsg && (
              <div className="text-red-600 text-center mt-2 font-semibold">{errorMsg}</div>
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
