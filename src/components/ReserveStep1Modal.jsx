import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    const dateStr = normalizeDate(date);
    const bookingsForDate = bookedSlots.filter(
      (slot) =>
        slot.status &&
        slot.status.toLowerCase() === "approved" &&
        slot.perDayTimes.some((day) => normalizeDate(day.date) === dateStr)
    );
    // If both morning and afternoon are booked, or a booking covers the whole day, return true
    let morningBooked = false,
      afternoonBooked = false,
      fullDayBooked = false;
    bookingsForDate.forEach((slot) => {
      slot.perDayTimes.forEach((day) => {
        if (normalizeDate(day.date) === dateStr) {
          const start = parseInt(day.startTime.split(":")[0], 10);
          const end = parseInt(day.endTime.split(":")[0], 10);
          // University rule: 7:00 to 13:00 (1pm) or later is a full day
          if (start === 7 && end >= 13) fullDayBooked = true;
          else if (start < 13 && end <= 13) morningBooked = true;
          else if (start >= 13) afternoonBooked = true;
        }
      });
    });
    return fullDayBooked || (morningBooked && afternoonBooked);
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
    setShowVenueSelector(false);
  };

  const handleMonthChange = (increment) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + increment);
      return newDate;
    });
  };

  return (
    <AnimatePresence>
      {open && !step2Open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-2 my-8 flex flex-col gap-6 p-4 md:p-10 overflow-y-auto max-h-[95vh]"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-3 right-3 z-10 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close modal"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
            {/* Step 1 label */}
            <motion.div
              className="flex justify-end w-full"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: 0.05 }}
            >
              <span className="text-[#0458A9] font-semibold text-lg md:text-xl">
                Step 1
              </span>
            </motion.div>
            {/* Title and subtitle */}
            <motion.div
              className="mb-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9]">
                Preferred Date
              </h2>
              <div className="text-gray-600 text-sm md:text-base">
                indicate whether your booking is for a single day or multiple
                days, then select your preferred date(s).
              </div>
            </motion.div>
            {/* Main content */}
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Left: Venue Info */}
              <motion.div
                className="flex flex-col items-center md:w-1/2 w-full justify-start"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.15 }}
              >
                <motion.div
                  className="w-full aspect-video rounded-2xl overflow-hidden mb-4"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <img
                    src={venue.images ? venue.images[0] : venue.image}
                    alt={venue.name}
                    className="object-cover w-full h-full"
                  />
                </motion.div>
                <motion.div
                  className="w-full text-left"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.25 }}
                >
                  <h3 className="text-2xl font-bold text-[#0458A9] leading-tight mb-1">
                    {venue.name}
                  </h3>
                  <div className="text-gray-400 text-base mb-4">
                    Managed by (Insert Department Name)
                  </div>
                  <motion.button
                    className="bg-[#0458A9] text-white rounded-full px-6 py-2 font-semibold text-base w-full md:w-auto hover:bg-[#03407a] transition"
                    onClick={() => {
                      setShowVenueSelector(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Change Venue
                  </motion.button>
                </motion.div>
              </motion.div>
              {/* Right: Booking Type and Calendar */}
              <motion.div
                className="flex flex-col gap-4 md:w-1/2 w-full"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.25 }}
                >
                  <h4 className="text-xl md:text-2xl font-bold text-[#0458A9] mb-2">
                    Type of Booking
                  </h4>
                  <div className="flex gap-2 mb-2">
                    <motion.button
                      className={`rounded-full px-6 py-2 font-semibold border transition text-base w-1/2 md:w-auto ${
                        bookingType === "one"
                          ? "bg-[#0458A9] text-white border-[#0458A9]"
                          : "bg-white text-gray-400 border-gray-300"
                      }`}
                      onClick={() => {
                        setBookingType("one");
                        setSelectedDays([]);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      One Day
                    </motion.button>
                    <motion.button
                      className={`rounded-full px-6 py-2 font-semibold border transition text-base w-1/2 md:w-auto ${
                        bookingType === "multiple"
                          ? "bg-[#0458A9] text-white border-[#0458A9]"
                          : "bg-white text-gray-400 border-gray-300"
                      }`}
                      onClick={() => {
                        setBookingType("multiple");
                        setSelectedDays([]);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Multiple Days
                    </motion.button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.3 }}
                >
                  <h4 className="text-xl md:text-2xl font-bold text-[#0458A9] mb-2">
                    Preferred Day(s)
                  </h4>
                  <motion.div
                    className="rounded-2xl border border-gray-400 p-4 bg-white"
                    initial={{ scale: 0.99, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.35 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <motion.button
                        onClick={() => handleMonthChange(-1)}
                        className="text-gray-600 hover:text-[#0458A9]"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ←
                      </motion.button>
                      <div className="font-bold text-[#0458A9] text-lg">
                        {currentDate.toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <motion.button
                        onClick={() => handleMonthChange(1)}
                        className="text-gray-600 hover:text-[#0458A9]"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        →
                      </motion.button>
                    </div>
                    <div className="text-sm text-gray-600 mb-2 text-center">
                      Bookings available from{" "}
                      {new Date(
                        new Date().setDate(new Date().getDate() + 14)
                      ).toLocaleDateString()}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-gray-700 text-base mb-1">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (d, index) => (
                          <motion.div
                            key={d}
                            className="font-semibold"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.1,
                              delay: 0.4 + index * 0.01,
                            }}
                          >
                            {d}
                          </motion.div>
                        )
                      )}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {calendarDays.map((dayData, i) => (
                        <motion.button
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
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.1,
                            delay: 0.45 + i * 0.005,
                          }}
                          whileHover={
                            dayData && !dayData.disabled ? { scale: 1.1 } : {}
                          }
                          whileTap={
                            dayData && !dayData.disabled ? { scale: 0.9 } : {}
                          }
                        >
                          {dayData?.day || ""}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            {/* Footer: Back/Next */}
            <motion.div
              className="flex justify-between items-center mt-6 w-full"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.5 }}
            >
              <motion.button
                className="text-gray-400 font-semibold text-base px-6 py-2 rounded-full cursor-pointer hover:text-[#0458A9] hover:bg-gray-100 transition"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
              <motion.button
                className="bg-[#0458A9] text-white rounded-full px-10 py-2 font-semibold text-base hover:bg-[#03407a] transition"
                onClick={handleNext}
                disabled={selectedDays.length === 0}
                whileHover={{ scale: selectedDays.length > 0 ? 1.02 : 1 }}
                whileTap={{ scale: selectedDays.length > 0 ? 0.98 : 1 }}
              >
                Next
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      {/* Step 2 Modal */}
      <ReserveStep2Modal
        open={step2Open}
        onClose={() => {
          setStep2Open(false);
          onClose();
        }}
        onPrevious={() => setStep2Open(false)}
        onNext={(data) => {
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
      />
      {/* Add Venue Selector Modal */}
      <AnimatePresence>
        {showVenueSelector && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={() => setShowVenueSelector(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 p-6"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#0458A9]">
                  Select a Venue
                </h3>
                <motion.button
                  onClick={() => setShowVenueSelector(false)}
                  className="text-gray-400 hover:text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {venues.map((v, index) => (
                  <motion.button
                    key={v.id}
                    onClick={() => handleVenueSelect(v)}
                    className="flex flex-col items-center p-4 border rounded-xl hover:border-[#0458A9] transition"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.02 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-full aspect-video rounded-lg overflow-hidden mb-2">
                      <img
                        src={v.images ? v.images[0] : v.image}
                        alt={v.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h4 className="font-semibold text-[#0458A9]">{v.name}</h4>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
