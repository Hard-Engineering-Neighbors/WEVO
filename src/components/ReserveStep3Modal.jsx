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
  uploadedFiles = {},
  reservationData = {},
}) {
  const [files, setFiles] = useState(uploadedFiles);
  const fileInputs = useRef([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  if (!open) return null;

  const handleFileChange = (idx, file) => {
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
    onSubmit && onSubmit(files);
    setShowReviewModal(false);
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
          {/* Step 3 label */}
          <div className="flex justify-end w-full">
            <span className="text-[#0458A9] font-semibold text-lg md:text-xl">
              Step 3
            </span>
          </div>
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9] mb-2">
            Upload Documents
          </h2>
          <div className="text-gray-700 text-sm md:text-base mb-2">
            Upload all required documents to support your event application.
            Make sure each file is{" "}
            <span className="italic text-[#0458A9]">
              complete and clearly labeled
            </span>
            .
          </div>
          {/* Upload Form */}
          <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row items-center gap-4 w-full"
                >
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className="text-[#E53935] text-lg">*</span>
                    <span className="truncate font-medium text-gray-800">
                      {req}
                    </span>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <button
                      type="button"
                      className="bg-[#0458A9] text-white rounded-full px-8 py-2 font-semibold text-base hover:bg-[#03407a] transition w-full md:w-auto"
                      onClick={() => handleUploadClick(idx)}
                    >
                      Upload
                    </button>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      ref={(el) => (fileInputs.current[idx] = el)}
                      onChange={(e) => handleFileChange(idx, e.target.files[0])}
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2 min-w-0 justify-center md:justify-start">
                    <span className="flex items-center gap-1">
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
                      <span className="text-gray-700 text-xs md:text-sm truncate max-w-[100px]">
                        {files[idx]?.name || "Filename.pdf"}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Footer: Previous/Submit */}
            <div className="flex justify-between items-center mt-6 w-full">
              <button
                type="button"
                className="text-gray-400 font-semibold text-base px-6 py-2 rounded-full cursor-pointer hover:text-[#0458A9] hover:bg-gray-100 transition"
                onClick={onPrevious}
              >
                Previous
              </button>
              <button
                type="submit"
                className="bg-[#0458A9] text-white rounded-full px-10 py-2 font-semibold text-base hover:bg-[#03407a] transition"
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
