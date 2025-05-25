import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { createReservation } from "../api/requests";

export default function ReservationReviewModal({
  open,
  onClose,
  onEdit,
  onSubmit,
  reservationData = {},
  uploadedFiles = {},
}) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

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
  } = reservationData;

  const perDayTimes =
    reservationData.perDayTimes || reservationData.per_day_times || [];

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    // Ensure perDayTimes is set correctly for the backend
    const dataToSend = {
      ...reservationData,
      perDayTimes:
        reservationData.perDayTimes || reservationData.eventTimesPerDay || [],
    };
    try {
      await createReservation({
        form: dataToSend,
        files: Object.values(uploadedFiles),
        user: currentUser,
      });
      setLoading(false);
      onSubmit && onSubmit();
    } catch (e) {
      setError(e.message || "Failed to submit reservation");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
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
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={28} />
            </motion.button>

            {/* Header */}
            <motion.div
              className="w-full"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.05 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9] mb-2">
                Review Reservation Form
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Please double-check all the details you've entered to ensure
                accuracy. Make sure names, dates, and contact information are
                correct before submitting. This helps the administration process
                your reservation smoothly and avoid any delays or
                misunderstandings.
              </p>
            </motion.div>

            {/* Requesting Party Information */}
            <motion.div
              className="w-full"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.1 }}
            >
              <h3 className="text-xl md:text-2xl font-bold text-[#0458A9] mb-4">
                Requesting Party Information
              </h3>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.15 }}
              >
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.2 }}
                >
                  <label className="block text-gray-600 text-sm mb-1">
                    Name of Organization / Individual
                  </label>
                  <div className="p-3 bg-gray-100 rounded-lg">{orgName}</div>
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.25 }}
                >
                  <label className="block text-gray-600 text-sm mb-1">
                    Contact Person
                  </label>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {contactPerson}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.3 }}
                >
                  <label className="block text-gray-600 text-sm mb-1">
                    Position
                  </label>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {contactPosition}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.35 }}
                >
                  <label className="block text-gray-600 text-sm mb-1">
                    Contact Number
                  </label>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {contactNumber}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Event Details */}
            <motion.div
              className="w-full"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.4 }}
            >
              <h3 className="text-xl md:text-2xl font-bold text-[#0458A9] mb-4">
                Event Details
              </h3>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.45 }}
              >
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.5 }}
                >
                  <label className="block text-gray-600 text-sm mb-1">
                    Title of the Event
                  </label>
                  <div className="p-3 bg-gray-100 rounded-lg">{eventTitle}</div>
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.55 }}
                >
                  <label className="block text-gray-600 text-sm mb-1">
                    Type of Activity
                  </label>
                  <div className="p-3 bg-gray-100 rounded-lg">{eventType}</div>
                </motion.div>
              </motion.div>
              <motion.div
                className="mt-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.6 }}
              >
                <label className="block text-gray-600 text-sm mb-1">
                  Purpose of the Event
                </label>
                <div className="p-3 bg-gray-100 rounded-lg">{eventPurpose}</div>
              </motion.div>
              {/* Event Date and Time (per-day times) */}
              <motion.div
                className="w-full"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.65 }}
              >
                <label className="block text-gray-600 text-sm mb-1">
                  Event Date and Time
                </label>
                <div className="flex flex-col gap-2">
                  {perDayTimes.length > 0 ? (
                    perDayTimes.map(({ date, startTime, endTime }, index) => (
                      <motion.div
                        key={date}
                        className="p-3 bg-gray-100 rounded-lg flex justify-between"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.15,
                          delay: 0.7 + index * 0.05,
                        }}
                      >
                        <span>{new Date(date).toLocaleDateString()}</span>
                        <span>
                          {startTime} - {endTime}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="p-3 bg-gray-100 rounded-lg flex justify-between"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.15, delay: 0.7 }}
                    >
                      <span>
                        {selectedDates.length > 0 ? selectedDates[0] : "-"}
                      </span>
                      <span>
                        {startTime} - {endTime}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Event Duration (summary) */}
              <motion.div
                className="w-full"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.75 }}
              >
                <label className="block text-gray-600 text-sm mb-1">
                  Event Duration
                </label>
                <div className="p-3 bg-gray-100 rounded-lg">
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
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.8 }}
              >
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.85 }}
                >
                  <label className="block text-gray-600 text-sm mb-1">
                    Preferred Venue
                  </label>
                  <div className="p-3 bg-gray-100 rounded-lg">{venue.name}</div>
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.9 }}
                >
                  <label className="block text-gray-600 text-sm mb-1">
                    No. of Participants
                  </label>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {participants}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Uploaded Documents */}
            <motion.div
              className="w-full"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.95 }}
            >
              <h3 className="text-xl md:text-2xl font-bold text-[#0458A9] mb-4">
                Uploaded Documents
              </h3>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: 1.0 }}
              >
                {Object.entries(uploadedFiles).length > 0
                  ? Object.entries(uploadedFiles).map(([key, file], idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-2"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.15,
                          delay: 1.05 + idx * 0.05,
                        }}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
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
                        <span className="text-gray-700 text-xs md:text-sm truncate max-w-[150px]">
                          {file?.name || `Document ${idx + 1}`}
                        </span>
                      </motion.div>
                    ))
                  : Array.from({ length: 1 }, (_, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-2"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.15,
                          delay: 1.05 + idx * 0.05,
                        }}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
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
                        <span className="text-gray-700 text-xs md:text-sm truncate max-w-[150px]">
                          Document {idx + 1}
                        </span>
                      </motion.div>
                    ))}
              </motion.div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="text-red-600 font-semibold"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer: Edit/Submit */}
            <motion.div
              className="flex justify-between items-center mt-6 w-full"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 1.1 }}
            >
              <motion.button
                type="button"
                className="text-gray-400 font-semibold text-base px-6 py-2 rounded-full cursor-pointer hover:text-[#0458A9] hover:bg-gray-100 transition"
                onClick={onEdit}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                Edit Forms
              </motion.button>
              <motion.button
                type="button"
                className="bg-[#0458A9] text-white rounded-full px-10 py-2 font-semibold text-base hover:bg-[#03407a] transition"
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? "Submitting..." : "Submit"}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
