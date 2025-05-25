import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CancellationReasonModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (reason.trim()) {
      setLoading(true);
      try {
        await onSubmit(reason);
        setReason(""); // Clear reason after submit
      } catch (error) {
        console.error("Error submitting cancellation reason:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setReason("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          onClick={loading ? undefined : onClose}
        >
          <motion.div
            className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-auto p-6 flex flex-col gap-4"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              className="absolute top-3 right-3 z-10 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
              aria-label="Close modal"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.1 }}
              whileTap={{ scale: loading ? 1 : 0.9 }}
            >
              <X size={20} />
            </motion.button>

            <motion.h3
              className="text-xl font-bold text-[#0458A9] mb-2 text-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.05 }}
            >
              Reason for Cancellation
            </motion.h3>
            <motion.p
              className="text-sm text-gray-600 text-center mb-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.1 }}
            >
              Please provide a reason for cancelling this approved reservation.
            </motion.p>

            <motion.div
              className="w-full"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.15 }}
            >
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#0458A9] focus:border-[#0458A9] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                rows={4}
                disabled={loading}
              />
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.2 }}
            >
              <motion.button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline sm:mr-auto order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleClear}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                Clear
              </motion.button>
              <motion.button
                type="button"
                className="w-full sm:w-auto bg-[#0458A9] text-white rounded-full px-6 py-2.5 font-medium text-sm hover:bg-[#03407a] transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleSubmit}
                disabled={!reason.trim() || loading}
                whileHover={{ scale: !reason.trim() || loading ? 1 : 1.02 }}
                whileTap={{ scale: !reason.trim() || loading ? 1 : 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="animate-spin" size={16} />
                      Submitting...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="submit"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      Submit Reason
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
