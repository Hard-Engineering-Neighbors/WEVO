import React, { useState } from "react";
import { X, Users } from "lucide-react";
import ReserveStep1Modal from "./ReserveStep1Modal";

export default function VenueDetailsModal({ open, onClose, venue }) {
  const [reserveOpen, setReserveOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [step1Open, setStep1Open] = useState(false);
  const [reservationData, setReservationData] = useState({});

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
            className="absolute top-3 right-3 z-10 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          {/* Left: Carousel & Venue Details */}
          <div className="md:w-1/2 w-full flex flex-col gap-4">
            {/* Carousel */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
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
            {/* Venue Details - MOVED HERE */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9] leading-tight">
              {venue.name}
            </h2>
            <div className="text-gray-400 text-sm -mt-3">
              Managed by (Insert Department Name)
            </div>
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Users size={20} />
              {venue.participants} Participants Max
            </div>
            <div className="text-gray-700 text-sm max-h-32 overflow-y-auto">
              {venue.description}
            </div>
          </div>
          {/* Right: Map & Reserve Button */}
          <div className="flex-1 flex flex-col min-w-0 md:ml-6">
            {/* Location / Map - MOVED UP */}
            <div className="flex-grow">
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

            {/* Reserve Button - MOVED HERE & MODIFIED */}
            <button
              className="bg-[#0458A9] text-white rounded-full px-10 py-3 font-semibold text-base w-full hover:bg-[#03407a] transition mt-auto"
              onClick={() => setReserveOpen(true)}
            >
              Reserve
            </button>
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
