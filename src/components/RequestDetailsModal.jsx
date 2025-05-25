import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cancelReservation, cancelApprovedReservation } from "../api/requests";
import CancellationReasonModal from "./CancellationReasonModal";

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (text && typeof text === "string" && text.length > maxLength) {
    return text.substring(0, 25) + "...";
  }
  return text;
};

export default function RequestDetailsModal({
  open,
  onClose,
  request,
  onReservationUpdated,
}) {
  const [current, setCurrent] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCancellationReasonModalOpen, setIsCancellationReasonModalOpen] =
    useState(false);
  const [showAllDates, setShowAllDates] = useState(false);
  const [isRemovingRequest, setIsRemovingRequest] = useState(false);

  if (!open || !request) return null;

  // Handle multiple images if they exist, otherwise use the single image
  const images = request.images || [request.image];

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  // PDF files (from request.pdf_files)
  const pdfFiles = request.pdf_files || [];
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  // Placeholder functions for button actions
  const handleViewDocuments = () => {
    // TODO: Implement viewing/downloading documents
    // console.log("View documents for:", request); // Removed for privacy
  };

  const handleCancelReservation = async (reason) => {
    if (typeof reason === "string") {
      // Approved event: cancel with reason
      try {
        await cancelApprovedReservation({
          bookingRequestId: request.id,
          userId: request.requested_by,
          reason,
        });
        if (typeof onReservationUpdated === "function") onReservationUpdated();
        setIsCancellationReasonModalOpen(false);
        onClose();
      } catch (e) {
        setErrorMessage("Failed to cancel reservation: " + (e.message || e));
        setIsCancellationReasonModalOpen(false);
      }
    } else {
      if (request.status && request.status.toLowerCase() === "approved") {
        setIsCancellationReasonModalOpen(true);
      } else {
        // Pending: delete
        try {
          await cancelReservation(request.id);
          if (typeof onReservationUpdated === "function")
            onReservationUpdated();
          onClose();
        } catch (e) {
          setErrorMessage("Failed to cancel reservation: " + (e.message || e));
        }
      }
    }
  };

  const handleRemoveRequest = async () => {
    setIsRemovingRequest(true);
    try {
      await cancelReservation(request.id);
      if (typeof onReservationUpdated === "function") onReservationUpdated();
      onClose();
    } catch (e) {
      setErrorMessage("Failed to remove request: " + (e.message || e));
    } finally {
      setIsRemovingRequest(false);
    }
  };

  return (
    <AnimatePresence>
      {open && request && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-2 my-8 flex flex-col md:flex-row px-4 pb-4 pt-14 md:px-8 md:pb-8 md:pt-16 gap-6 overflow-y-auto max-h-[95vh]"
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

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  className="bg-red-100 text-red-700 p-4 rounded-lg mb-4"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Left: Carousel */}
            <motion.div
              className="md:w-1/2 w-full"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <motion.div
                className="relative w-full aspect-video rounded-2xl overflow-hidden"
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <img
                  src={images[current]}
                  alt={request.venue}
                  className="object-cover w-full h-full"
                />
                {images.length > 1 && (
                  <>
                    <motion.button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
                      onClick={prev}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-2xl">&#8592;</span>
                    </motion.button>
                    <motion.button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
                      onClick={next}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-2xl">&#8594;</span>
                    </motion.button>
                  </>
                )}
                {/* Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <motion.span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === current ? "bg-white" : "bg-gray-400/60"
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.02 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Venue Name and Description - MOVED HERE */}
              <motion.div
                className="mt-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.15 }}
              >
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-[#0458A9]"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.2 }}
                >
                  {request.venue}
                </motion.h2>
                <motion.div
                  className="text-gray-500 text-sm mt-1"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.25 }}
                >
                  Managed by WVSU Administration
                </motion.div>
                <motion.div
                  className="text-gray-700 mt-4"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.3 }}
                >
                  {request.description ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right: Details */}
            <motion.div
              className="flex-1 flex flex-col gap-4 min-w-0"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {/* Event Details */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <motion.div
                  className="bg-gray-100 rounded-lg px-6 py-3"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.25 }}
                >
                  <div className="text-gray-500 text-sm">Event Name</div>
                  <div className="font-semibold">
                    {truncateText(request.event, 40)}
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gray-100 rounded-lg px-6 py-3"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.3 }}
                >
                  <div className="text-gray-500 text-sm">Participants No.</div>
                  <div className="font-semibold">
                    {request.participants || request.event}
                  </div>
                </motion.div>

                {/* Per-day times display with toggle */}
                <motion.div
                  className="bg-gray-100 rounded-lg px-6 py-3 md:col-span-2"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.35 }}
                >
                  <div className="text-gray-500 text-sm flex items-center gap-2">
                    Event Date and Time
                    {request.perDayTimes && request.perDayTimes.length > 1 && (
                      <button
                        type="button"
                        className="ml-2 text-xs text-[#0458A9] hover:underline focus:outline-none"
                        onClick={() => setShowAllDates((prev) => !prev)}
                      >
                        {showAllDates ? "▲" : "▼"}
                      </button>
                    )}
                  </div>
                  <div className="font-semibold">
                    {request.perDayTimes && request.perDayTimes.length > 0 ? (
                      showAllDates ? (
                        <div className="flex flex-col space-y-1 mt-1 pl-2">
                          {request.perDayTimes.map((item, idx) => (
                            <div key={idx} className="flex">
                              <span>
                                {new Date(item.date).toLocaleDateString()} —{" "}
                                {item.startTime} - {item.endTime}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>
                          {new Date(
                            request.perDayTimes[0].date
                          ).toLocaleDateString()}{" "}
                          {request.perDayTimes[0].startTime} -{" "}
                          {new Date(
                            request.perDayTimes[
                              request.perDayTimes.length - 1
                            ].date
                          ).toLocaleDateString()}{" "}
                          {
                            request.perDayTimes[request.perDayTimes.length - 1]
                              .endTime
                          }
                        </span>
                      )
                    ) : (
                      <span>{request.date || request.event}</span>
                    )}
                  </div>
                </motion.div>

                {/* Event Type fills the row if perDayTimes is present */}
                <motion.div
                  className="bg-gray-100 rounded-lg px-6 py-3 md:col-span-2"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.4 }}
                >
                  <div className="text-gray-500 text-sm">Event Type</div>
                  <div className="font-semibold">{request.type}</div>
                </motion.div>

                <motion.div
                  className="bg-gray-100 rounded-lg px-6 py-3 md:col-span-2"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.45 }}
                >
                  <div className="text-gray-500 text-sm">Event Purpose</div>
                  <div className="font-semibold">
                    {truncateText(request.purpose, 100) || "-"}
                  </div>
                </motion.div>
              </motion.div>

              {/* PDF Documents Section */}
              {pdfFiles.length > 0 && (
                <motion.div
                  className="mt-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.5 }}
                >
                  <div className="text-lg font-semibold mb-2">
                    Uploaded Documents
                  </div>
                  <ul className="space-y-2">
                    {pdfFiles.map((file, idx) => (
                      <motion.li
                        key={file.id || idx}
                        className="flex items-center gap-2"
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.15,
                          delay: 0.55 + idx * 0.02,
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
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
                        <a
                          href={`${supabaseUrl}/storage/v1/object/public/pdfs/${file.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline hover:text-blue-900 text-sm truncate max-w-[200px]"
                        >
                          {truncateText(file.file_name, 30)}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-auto pt-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.6 }}
              >
                <motion.button
                  className="bg-[#0458A9] text-white rounded-full px-8 py-3 font-semibold text-base hover:bg-[#03407a]"
                  onClick={handleViewDocuments}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Documents
                </motion.button>
                {request.status &&
                (request.status.toLowerCase() === "cancelled" ||
                  request.status.toLowerCase() === "rejected") ? (
                  <motion.button
                    className={`bg-white text-red-600 border border-red-600 rounded-full px-8 py-3 font-semibold text-base transition-all ${
                      isRemovingRequest
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={handleRemoveRequest}
                    disabled={isRemovingRequest}
                    whileHover={{ scale: isRemovingRequest ? 1 : 1.02 }}
                    whileTap={{ scale: isRemovingRequest ? 1 : 0.98 }}
                  >
                    <AnimatePresence mode="wait">
                      {isRemovingRequest ? (
                        <motion.div
                          key="loading"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Loader2 className="animate-spin" size={18} />
                          Removing...
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          Remove Request
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ) : (
                  <motion.button
                    className="bg-white text-[#0458A9] border border-[#0458A9] rounded-full px-8 py-3 font-semibold text-base hover:bg-gray-100"
                    onClick={() => handleCancelReservation()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel Reservation
                  </motion.button>
                )}
              </motion.div>

              {/* Show cancellation reason if cancelled */}
              <AnimatePresence>
                {request.status &&
                  request.status.toLowerCase() === "cancelled" &&
                  request.cancellation_reason && (
                    <motion.div
                      className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-3 mt-4"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="font-semibold mb-1">
                        Cancellation Reason:
                      </div>
                      <div>{request.cancellation_reason}</div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      <CancellationReasonModal
        open={isCancellationReasonModalOpen}
        onClose={() => setIsCancellationReasonModalOpen(false)}
        onSubmit={handleCancelReservation}
      />
    </AnimatePresence>
  );
}
