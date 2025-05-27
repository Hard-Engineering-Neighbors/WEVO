import React, { useState } from "react";
import { X } from "lucide-react";

export default function CancellationReasonModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason(""); // Clear reason after submit
    }
  };

  const handleClear = () => {
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-auto p-6 flex flex-col gap-4">
        <button
          className="absolute top-3 right-3 z-10 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-[#0458A9] mb-2 text-center">
          Reason for Cancellation
        </h3>
        <p className="text-sm text-gray-600 text-center mb-2">
          Please provide a reason for cancelling this approved reservation.
        </p>

        <div className="w-full">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#0458A9] focus:border-[#0458A9] resize-none"
            rows={4}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-2">
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline sm:mr-auto order-2 sm:order-1"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="button"
            className="w-full sm:w-auto bg-[#0458A9] text-white rounded-full px-6 py-2.5 font-medium text-sm hover:bg-[#03407a] transition order-1 sm:order-2 flex items-center justify-center"
            onClick={handleSubmit}
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : null}
            {isSubmitting ? "Submitting..." : "Submit Reason"}
          </button>
        </div>
      </div>
    </div>
  );
}
