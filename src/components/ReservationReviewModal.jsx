import React, { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { createReservation } from "../api/requests";
import { useNavigate } from "react-router-dom";

export default function ReservationReviewModal({
  open,
  onClose,
  onEdit,
  onSubmit,
  reservationData = {},
  uploadedFiles = {},
}) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!open) {
      setShowSuccess(false);
      setError("");
    }
  }, [open]);

  if (!open) return null;

  // Ensure reservationData is an object
  const safeReservationData = reservationData || {};

  // Extract data with defaults for each field
  const {
    venue = { name: "Cultural Center" },
    selectedDates = [],
    bookingType = "multiple",
    startTime = "7:30 AM",
    endTime = "5:30 PM",
    eventTitle = "Artikulo: Voices in Motion",
    eventType = "Workshop",
    eventPurpose = "Team-building and skill development",
    participants = "50 Participants",
    orgName = "N/A",
    contactPerson = "N/A",
    contactPosition = "N/A",
    contactNumber = "N/A",
  } = safeReservationData;

  const perDayTimes =
    safeReservationData.perDayTimes || safeReservationData.per_day_times || [];

  // Format date from ISO string to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format time
  const formatTime = (timeString) => {
    return timeString || "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    // Ensure perDayTimes is set correctly for the backend
    const dataToSend = {
      ...safeReservationData,
      perDayTimes:
        safeReservationData.perDayTimes ||
        safeReservationData.eventTimesPerDay ||
        [],
    };
    try {
      await createReservation({
        form: dataToSend,
        files: Object.values(uploadedFiles),
        user: currentUser,
      });
      setLoading(false);
      setShowSuccess(true);

      // Wait for 2 seconds to show success message before redirecting
      setTimeout(() => {
        onSubmit && onSubmit();
        navigate("/dashboard");
      }, 2000);
    } catch (e) {
      setError(e.message || "Failed to submit reservation");
      setLoading(false);
    }
  };

  // Success Notification Component
  const SuccessNotification = () => (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full mx-4 transform transition-all">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            Success!
          </h3>
          <p className="text-gray-600 text-sm md:text-base">
            Your reservation request has been submitted successfully. You will
            be redirected to the dashboard shortly.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showSuccess && <SuccessNotification />}
      <div className="fixed inset-0 z-[1600] flex items-center justify-center bg-black/30 backdrop-blur-sm p-2 md:p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-auto my-2 md:my-8 flex flex-col gap-4 md:gap-6 px-4 pt-4 pb-24 md:p-10 overflow-y-auto max-h-[95vh]">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-700 text-xl md:text-2xl z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="w-full pr-8 md:pr-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0458A9] mb-2">
              Review Reservation Form
            </h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base leading-relaxed">
              Please double-check all the details you've entered to ensure
              accuracy. Make sure names, dates, and contact information are
              correct before submitting. This helps the administration process
              your reservation smoothly and avoid any delays or
              misunderstandings.
            </p>
          </div>

          {/* Requesting Party Information */}
          <div className="w-full">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#0458A9] mb-3 md:mb-4">
              Requesting Party Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-gray-600 text-xs md:text-sm mb-1">
                  Name of Organization / Individual
                </label>{" "}
                <div className="p-3 bg-gray-100 rounded-lg text-sm md:text-base">
                  {orgName}
                </div>
              </div>
              <div>
                <label className="block text-gray-600 text-xs md:text-sm mb-1">
                  Contact Person
                </label>
                <div className="p-3 bg-gray-100 rounded-lg text-sm md:text-base">
                  {contactPerson}
                </div>
              </div>
              <div>
                <label className="block text-gray-600 text-xs md:text-sm mb-1">
                  Position
                </label>
                <div className="p-3 bg-gray-100 rounded-lg text-sm md:text-base">
                  {contactPosition}
                </div>
              </div>
              <div>
                <label className="block text-gray-600 text-xs md:text-sm mb-1">
                  Contact Number
                </label>
                <div className="p-3 bg-gray-100 rounded-lg text-sm md:text-base">
                  {contactNumber}
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="w-full">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#0458A9] mb-3 md:mb-4">
              Event Details
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-gray-600 text-xs md:text-sm mb-1">
                  Title of the Event
                </label>
                <div className="p-3 bg-gray-100 rounded-lg text-sm md:text-base">
                  {eventTitle}
                </div>
              </div>
              <div>
                <label className="block text-gray-600 text-xs md:text-sm mb-1">
                  Type of Activity
                </label>
                <div className="p-3 bg-gray-100 rounded-lg text-sm md:text-base">
                  {eventType}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-600 text-xs md:text-sm mb-1">
                Purpose of the Event
              </label>
              <div className="p-3 bg-gray-100 rounded-lg text-sm md:text-base">
                {eventPurpose}
              </div>
            </div>
            {/* Event Date and Time (per-day times) */}
            <div className="w-full mt-4">
              <label className="block text-gray-600 text-xs md:text-sm mb-1">
                Event Date and Time
              </label>
              <div className="flex flex-col gap-2">
                {perDayTimes.length > 0 ? (
                  perDayTimes.map(({ date, startTime, endTime }) => (
                    <div
                      key={date}
                      className="p-3 bg-gray-100 rounded-lg flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0"
                    >
                      <span className="text-sm md:text-base font-medium">
                        {new Date(date).toLocaleDateString()}
                      </span>
                      <span className="text-sm md:text-base text-gray-600">
                        {startTime} - {endTime}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-gray-100 rounded-lg flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-sm md:text-base font-medium">
                      {selectedDates.length > 0 ? selectedDates[0] : "-"}
                    </span>
                    <span className="text-sm md:text-base text-gray-600">
                      {startTime} - {endTime}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Event Duration (summary) */}
            <div className="w-full mt-4">
              <label className="block text-gray-600 text-xs md:text-sm mb-1">
                Event Duration
              </label>
              <div className="p-3 bg-gray-100 rounded-lg text-sm md:text-base">
                {perDayTimes.length > 0
                  ? `${new Date(perDayTimes[0].date).toLocaleDateString()} ${
                      perDayTimes[0].startTime
                    } - ${new Date(
                      perDayTimes[perDayTimes.length - 1].date
                    ).toLocaleDateString()} ${
                      perDayTimes[perDayTimes.length - 1].endTime
                    }`
                  : `${
                      selectedDates.length > 0 ? selectedDates[0] : "-"
                    } ${startTime} - ${
                      selectedDates.length > 0
                        ? selectedDates[selectedDates.length - 1]
                        : "-"
                    } ${endTime}`}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-4">
              <div>
                <label className="block text-gray-600 text-xs md:text-sm mb-1">
                  Preferred Venue
                </label>
                <div className="p-3 bg-gray-100 rounded-lg text-sm md:text-base">
                  {venue.name}
                </div>
              </div>
              <div>
                <label className="block text-gray-600 text-xs md:text-sm mb-1">
                  No. of Participants
                </label>
                <div className="p-3 bg-gray-100 rounded-lg text-sm md:text-base">
                  {participants}
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="w-full">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#0458A9] mb-3 md:mb-4">
              Uploaded Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {Object.entries(uploadedFiles).length > 0
                ? Object.entries(uploadedFiles).map(([key, file], idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0"
                      >
                        <rect width="24" height="24" rx="4" fill="#0458A9" />
                        <path d="M7 7H17V17H7V7Z" fill="white" />
                        <text
                          x="12"
                          y="16"
                          textAnchor="middle"
                          fontSize="8"
                          fill="#0458A9"
                          fontWeight="bold"
                        >
                          PDF
                        </text>
                      </svg>
                      <span className="text-gray-700 text-xs md:text-sm truncate flex-1 min-w-0">
                        {file.name || `Filename${idx}.pdf`}
                      </span>
                    </div>
                  ))
                : Array(4)
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="flex-shrink-0"
                        >
                          <rect width="24" height="24" rx="4" fill="#0458A9" />
                          <path d="M7 7H17V17H7V7Z" fill="white" />
                          <text
                            x="12"
                            y="16"
                            textAnchor="middle"
                            fontSize="8"
                            fill="#0458A9"
                            fontWeight="bold"
                          >
                            PDF
                          </text>
                        </svg>
                        <span className="text-gray-700 text-xs md:text-sm truncate flex-1 min-w-0">
                          Filename.pdf
                        </span>
                      </div>
                    ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 font-semibold text-sm md:text-base">
              {error}
            </div>
          )}

          {/* Footer: Edit/Submit */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6 w-full">
            <button
              type="button"
              className="text-gray-400 font-semibold text-sm md:text-base px-6 py-3 sm:py-2 rounded-full cursor-pointer hover:text-[#0458A9] hover:bg-gray-100 transition order-2 sm:order-1"
              onClick={onEdit}
              disabled={loading}
            >
              Edit Forms
            </button>
            <button
              type="button"
              className="bg-[#0458A9] text-white rounded-full px-10 py-3 sm:py-2 font-semibold text-sm md:text-base hover:bg-[#03407a] transition order-1 sm:order-2"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
