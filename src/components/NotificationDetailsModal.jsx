import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationDetailsModal({ notif, onClose }) {
  if (!notif) return null;
  let venue = "";
  let orgName = "";
  let eventName = "";
  let date = "";
  let participants = "";
  let type = "";
  let purpose = "";
  let cancellationReason = "";
  let rejectionReason = "";
  if (notif.data) {
    try {
      const data =
        typeof notif.data === "string" ? JSON.parse(notif.data) : notif.data;
      venue = data.venue?.name || data.venue || "";
      orgName = data.orgName || "";
      eventName = data.eventName || data.event || "";
      date = data.date || "";
      participants = data.participants || "";
      type = data.type || "";
      purpose = data.purpose || "";
      cancellationReason = data.cancellationReason || "";
      rejectionReason = data.rejectionReason || "";
    } catch (_) {
      // Ignore JSON parsing errors
    }
  }
  return (
    <AnimatePresence>
      {notif && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-8 flex flex-col gap-2"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={onClose}
              aria-label="Close modal"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
            {venue && (
              <motion.div
                className="text-2xl font-bold text-[#0458A9] mb-1"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.05 }}
              >
                {venue}
              </motion.div>
            )}
            <motion.div
              className="flex flex-wrap gap-4 mb-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.1 }}
            >
              <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(notif.created_at).toLocaleString()}
              </div>
              {orgName && (
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
                  <span className="font-semibold">Organization:</span> {orgName}
                </div>
              )}
            </motion.div>
            {!eventName &&
              !participants &&
              !type &&
              !purpose &&
              !cancellationReason &&
              !rejectionReason && (
                <motion.div
                  className="text-gray-700 text-base mb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.15 }}
                >
                  {notif.message}
                </motion.div>
              )}
            {eventName && (
              <motion.div
                className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.2 }}
              >
                <span className="font-semibold">Event Name:</span> {eventName}
              </motion.div>
            )}
            {date && (
              <motion.div
                className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.25 }}
              >
                <span className="font-semibold">Event Date and Time:</span>{" "}
                {date}
              </motion.div>
            )}
            {participants && (
              <motion.div
                className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.3 }}
              >
                <span className="font-semibold">Participants:</span>{" "}
                {participants}
              </motion.div>
            )}
            {type && (
              <motion.div
                className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.35 }}
              >
                <span className="font-semibold">Event Type:</span> {type}
              </motion.div>
            )}
            {purpose && (
              <motion.div
                className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.4 }}
              >
                <span className="font-semibold">Event Purpose:</span> {purpose}
              </motion.div>
            )}
            {rejectionReason && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-3 mt-4"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.45 }}
              >
                <div className="font-semibold mb-1">Rejection Reason:</div>
                <div>{rejectionReason}</div>
              </motion.div>
            )}
            {cancellationReason && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-3 mt-4"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.45 }}
              >
                <div className="font-semibold mb-1">Cancellation Reason:</div>
                <div>{cancellationReason}</div>
              </motion.div>
            )}
            {!venue &&
              !eventName &&
              !date &&
              !participants &&
              !type &&
              !purpose &&
              !cancellationReason &&
              !rejectionReason && (
                <motion.div
                  className="text-gray-700 text-base mb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.15 }}
                >
                  {notif.message}
                </motion.div>
              )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
