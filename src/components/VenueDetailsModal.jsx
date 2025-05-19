import React, { useState } from "react";
import { X, Users } from "lucide-react";
import ReserveStep1Modal from "./ReserveStep1Modal";

export default function VenueDetailsModal({ open, onClose, venue }) {
  const [reserveOpen, setReserveOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  if (!open || !venue) return null;

  // Carousel state
  const images = venue.images || [venue.image];

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-2 my-8 flex flex-col md:flex-row p-4 md:p-8 gap-6 overflow-y-auto max-h-[95vh]">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            <X size={28} />
          </button>
          {/* Left: Carousel & Reserve */}
          <div className="flex flex-col items-end md:w-1/2 w-full">
            {/* Carousel */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4">
              <img
                src={images[current]}
                alt={venue.name}
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
            {/* Reserve Button */}
            <button
              className="bg-[#0458A9] text-white rounded-full px-10 py-2 font-semibold text-base mt-2 w-40 hover:bg-[#03407a] transition"
              onClick={() => setReserveOpen(true)}
            >
              Reserve
            </button>
          </div>
          {/* Right: Details */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <h2 className="text-2xl md:text-4xl font-bold text-[#0458A9] leading-tight">
              {venue.name}
            </h2>
            <div className="text-gray-400 text-sm mb-1">
              Managed by (Insert Department Name)
            </div>
            <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Users size={20} />
              {venue.participants} Participants Max
            </div>
            <div className="text-gray-700 text-sm mb-2 max-h-32 overflow-y-auto">
              {venue.description}
            </div>
            {/* Show More (optional) */}
            {/* Location */}
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Location</h3>
              <div className="w-full aspect-video rounded-xl overflow-hidden border">
                {/* Replace src with venue.mapUrl or similar if available */}
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=122.545%2C10.720%2C122.550%2C10.725&amp;layer=mapnik"
                  title="Venue Location"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Reserve Step 1 Modal */}
      <ReserveStep1Modal
        open={reserveOpen}
        onClose={() => setReserveOpen(false)}
        venue={venue}
        onChangeVenue={() => {
          setReserveOpen(false);
          onClose();
        }}
        onNext={(data) => {
          // TODO: handle next step
          setReserveOpen(false);
          onClose();
        }}
      />
    </>
  );
}
