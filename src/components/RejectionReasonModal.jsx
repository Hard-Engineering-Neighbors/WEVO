import React, { useState } from "react";
import { X } from "lucide-react";

export default function RejectionReasonModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit(reason);
    setReason(""); // Clear reason after submit
    onClose();
  };

  const handleClear = () => {
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl mx-auto flex flex-col gap-5 p-6 md:p-8">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-[#56708A] mb-1">
            Reason for Rejection
          </h2>
        </div>

        {/* Reason Text Area */}
        <div className="w-full">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please specify the reason for cancelling this reservation."
            className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#56708A] focus:border-[#56708A] resize-none"
          />
        </div>

        {/* Footer: Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-2">
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline sm:mr-auto"
            onClick={handleClear}
          >
            Clear Forms
          </button>
          <button
            type="button"
            className="w-full sm:w-auto bg-[#56708A] text-white rounded-lg px-8 py-2.5 font-medium text-sm hover:bg-[#455b74] transition"
            onClick={handleSubmit}
            disabled={!reason.trim()} // Disable if reason is empty
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
