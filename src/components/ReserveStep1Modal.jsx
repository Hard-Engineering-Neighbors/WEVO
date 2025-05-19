import React, { useState } from "react";
import { X } from "lucide-react";
import ReserveStep2Modal from "./ReserveStep2Modal";

// Dummy calendar for April 2025
const daysInMonth = 30;
const firstDayOfWeek = 2; // April 1, 2025 is a Tuesday (0=Sun)
const days = Array.from({ length: 35 }, (_, i) => {
  const day = i - firstDayOfWeek + 1;
  return day > 0 && day <= daysInMonth ? day : null;
});

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

  if (!open || !venue) return null;

  const handleDayClick = (day) => {
    if (!day) return;
    if (bookingType === "one") {
      setSelectedDays([day]);
    } else {
      setSelectedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
    }
  };

  const handleNext = () => {
    setStep2Open(true);
  };

  const handleStep2Close = () => {
    setStep2Open(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-2 my-8 flex flex-col gap-6 p-4 md:p-10 overflow-y-auto max-h-[95vh]">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            <X size={28} />
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
                  onClick={onChangeVenue}
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
                  <div className="font-bold text-[#0458A9] text-lg mb-2">
                    April 2025
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
                    {days.map((day, i) => (
                      <button
                        key={i}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base transition border-2 ${
                          day === null
                            ? "bg-transparent border-transparent cursor-default"
                            : selectedDays.includes(day)
                            ? "bg-[#0458A9] text-white border-[#0458A9]"
                            : "bg-white text-gray-700 border-transparent hover:bg-blue-50"
                        }`}
                        disabled={day === null}
                        onClick={() => handleDayClick(day)}
                      >
                        {day || ""}
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
              disabled={selectedDays.length === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>
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
      />
    </>
  );
}
