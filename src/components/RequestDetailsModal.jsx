import React, { useState } from "react";
import { X } from "lucide-react";

export default function RequestDetailsModal({ open, onClose, request }) {
  const [current, setCurrent] = useState(0);

  if (!open || !request) return null;

  // Handle multiple images if they exist, otherwise use the single image
  const images = request.images || [request.image];

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  // Placeholder functions for button actions
  const handleViewDocuments = () => {
    // TODO: Implement viewing/downloading documents
    console.log("View documents for:", request);
  };

  const handleCancelReservation = () => {
    // TODO: Implement cancellation flow
    console.log("Cancel reservation for:", request);
    // Close the modal after cancellation is initiated
    onClose();
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
