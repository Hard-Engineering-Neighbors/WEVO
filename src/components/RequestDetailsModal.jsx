import React, { useState } from "react";
import { X } from "lucide-react";
import { cancelReservation } from "../api/requests";

export default function RequestDetailsModal({ open, onClose, request, onReservationUpdated }) {
  const [current, setCurrent] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

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
    console.log("View documents for:", request);
  };

  const handleCancelReservation = async () => {
    try {
      await cancelReservation(request.id);
      if (typeof onReservationUpdated === "function") onReservationUpdated();
      onClose();
    } catch (e) {
      setErrorMessage("Failed to cancel reservation: " + (e.message || e));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-2 my-8 flex flex-col md:flex-row p-4 md:p-8 gap-6 overflow-y-auto max-h-[95vh]">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}

        {/* Left: Carousel */}
        <div className="md:w-1/2 w-full">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
            <img
              src={images[current]}
              alt={request.venue}
              className="object-cover w-full h-full"
            />
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
                  onClick={prev}
                >
                  <span className="text-2xl">&#8592;</span>
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
                  onClick={next}
                >
                  <span className="text-2xl">&#8594;</span>
                </button>
              </>
            )}
            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === current ? "bg-white" : "bg-gray-400/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0458A9]">
            {request.venue}
          </h2>
          <div className="text-gray-500 text-sm">
            Managed by (Insert Department Name)
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-gray-100 rounded-lg px-6 py-3">
              <div className="text-gray-500 text-sm">Event Name</div>
              <div className="font-semibold">{request.event}</div>
            </div>

            <div className="bg-gray-100 rounded-lg px-6 py-3">
              <div className="text-gray-500 text-sm">Participants No.</div>
              <div className="font-semibold">
                {request.participants || request.event}
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg px-6 py-3">
              <div className="text-gray-500 text-sm">Event Duration</div>
              <div className="font-semibold">
                {request.date || request.event}
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg px-6 py-3">
              <div className="text-gray-500 text-sm">Event Type</div>
              <div className="font-semibold">{request.type}</div>
            </div>

            <div className="bg-gray-100 rounded-lg px-6 py-3 md:col-span-2">
              <div className="text-gray-500 text-sm">Event Purpose</div>
              <div className="font-semibold">{request.purpose || "-"}</div>
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-700 mt-2">
            {request.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
          </div>

          {/* PDF Documents Section */}
          {pdfFiles.length > 0 && (
            <div className="mt-4">
              <div className="text-lg font-semibold mb-2">Uploaded Documents</div>
              <ul className="space-y-2">
                {pdfFiles.map((file, idx) => (
                  <li key={file.id || idx} className="flex items-center gap-2">
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
                      {file.file_name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4">
            <button
              className="bg-[#0458A9] text-white rounded-full px-8 py-3 font-semibold text-base hover:bg-[#03407a]"
              onClick={handleViewDocuments}
            >
              Documents
            </button>
            <button
              className="bg-white text-[#0458A9] border border-[#0458A9] rounded-full px-8 py-3 font-semibold text-base hover:bg-gray-100"
              onClick={handleCancelReservation}
            >
              Cancel Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
