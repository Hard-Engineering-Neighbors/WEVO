import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import ReservationReviewModal from "./ReservationReviewModal";

const requirements = [
  "Requirement Number 1",
  // "Requirement Number 2",
  // "Requirement Number 3",
  // "Requirement Number 4",
  // "Requirement Number 5",
  // "Requirement Number 6",
  // "Requirement Number 7",
];

export default function ReserveStep3Modal({
  open,
  onClose,
  onPrevious,
  onSubmit,
  reservationData = {},
  uploadedFiles = {},
  onReservationSubmitted, // <-- add this prop
}) {
  const [files, setFiles] = useState(uploadedFiles);
  const fileInputs = useRef([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  if (!open) return null;

  const handleFileChange = (idx, file) => {
    if (file && file.type !== "application/pdf") {
      alert("Invalid file type. Please upload PDF files only.");
      // Clear the file input
      if (fileInputs.current[idx]) {
        fileInputs.current[idx].value = null;
      }
      // Optionally, remove the file from the state if it was somehow set before this check
      // setFiles((prev) => ({ ...prev, [idx]: null }));
      return;
    }
    setFiles((prev) => ({ ...prev, [idx]: file }));
  };

  const handleUploadClick = (idx) => {
    fileInputs.current[idx]?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show review modal instead of submitting immediately
    setShowReviewModal(true);
  };

  const handleFinalSubmit = () => {
    // This function will be called after review to submit the final data
    if (onSubmit) onSubmit(files);
    if (onReservationSubmitted) onReservationSubmitted(); // <-- notify parent
    setShowReviewModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/30 backdrop-blur-sm p-2 md:p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-auto my-2 md:my-8 flex flex-col gap-4 md:gap-6 px-4 pt-4 pb-24 md:p-10 overflow-y-auto max-h-[95vh]">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 z-10 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          {/* Step 3 label */}
          <div className="flex justify-end w-full pr-8 md:pr-12">
            <span className="text-[#0458A9] font-semibold text-base md:text-lg lg:text-xl">
              Step 3
            </span>
          </div>
          {/* Title */}
          <div className="pr-8 md:pr-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0458A9] mb-2">
              Upload Documents
            </h2>
            <div className="text-gray-700 text-xs md:text-sm lg:text-base mb-2 leading-relaxed">
              Upload all required documents to support your event application.
              Make sure each file is{" "}
              <span className="italic text-[#0458A9]">
                complete and clearly labeled
              </span>
              .
            </div>
          </div>
          {/* Upload Form */}
          <form
            className="flex flex-col gap-6 md:gap-8 w-full"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-4 md:gap-6">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-3 md:gap-4 w-full p-4 md:p-6 bg-gray-50 rounded-2xl"
                >
                  {/* Requirement label */}
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-[#E53935] text-lg">*</span>
                    <span className="font-medium text-gray-800 text-sm md:text-base">
                      {req}
                    </span>
                  </div>

                  {/* Upload button and file display */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                    <button
                      type="button"
                      className="bg-[#0458A9] text-white rounded-full px-6 md:px-8 py-2.5 md:py-2 font-semibold text-sm md:text-base hover:bg-[#03407a] transition flex-shrink-0"
                      onClick={() => handleUploadClick(idx)}
                    >
                      Upload File
                    </button>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      ref={(el) => (fileInputs.current[idx] = el)}
                      onChange={(e) => handleFileChange(idx, e.target.files[0])}
                    />

                    {/* File display */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 p-3 bg-white rounded-lg border border-gray-200">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0"
                      >
                        <rect width="24" height="24" rx="4" fill="#0458A9" />
                        <rect
                          x="5"
                          y="5"
                          width="14"
                          height="14"
                          rx="1"
                          fill="white"
                        />
                        <text
                          x="12"
                          y="12.5"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="7.5"
                          fill="#0458A9"
                          fontWeight="bold"
                        >
                          PDF
                        </text>
                      </svg>
                      <span className="text-gray-700 text-xs md:text-sm truncate flex-1 min-w-0">
                        {files[idx]?.name || "No file selected"}
                      </span>
                      {files[idx] && (
                        <svg
                          className="w-4 h-4 text-green-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Footer: Previous/Submit */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-4 md:mt-6 w-full">
              <button
                type="button"
                className="text-gray-400 font-semibold text-sm md:text-base px-6 py-3 sm:py-2 rounded-full cursor-pointer hover:text-[#0458A9] hover:bg-gray-100 transition order-2 sm:order-1"
                onClick={onPrevious}
              >
                Previous
              </button>
              <button
                type="submit"
                className="bg-[#0458A9] text-white rounded-full px-10 py-3 sm:py-2 font-semibold text-sm md:text-base hover:bg-[#03407a] transition disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                disabled={requirements.some((_, idx) => !files[idx])}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Review Modal */}
      <ReservationReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onEdit={() => setShowReviewModal(false)}
        onSubmit={handleFinalSubmit}
        reservationData={reservationData}
        uploadedFiles={files}
      />
    </>
  );
}
