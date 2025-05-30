import React, { useState, useEffect } from "react";
import { X, Users, MapPin } from "lucide-react";
import ReserveStep1Modal from "./ReserveStep1Modal";
import { fetchVenues } from "../api/venues";

export default function VenueDetailsModal({ open, onClose, venue }) {
  const [current, setCurrent] = useState(0);
  const [step1Open, setStep1Open] = useState(false);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(venue);

  useEffect(() => {
    fetchVenues().then(setVenues);
  }, []);

  // Reset selectedVenue when modal is opened with a new venue
  useEffect(() => {
    if (open && venue) {
      setSelectedVenue(venue);
      // Debug: Log venue data to check if image is present
      console.log("VenueDetailsModal - Venue data:", venue);
      console.log("VenueDetailsModal - Venue image:", venue.image);
    }
  }, [open, venue]);

  // Reset step1Open when this modal closes
  useEffect(() => {
    if (!open) {
      setStep1Open(false);
    }
  }, [open]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const body = document.body;
    if (open || step1Open) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      body.style.overflow = "unset";
    };
  }, [open, step1Open]);

  if (!open || !venue) return null;

  // Carousel state - ensure we have a valid image
  const images = [venue.image_url || "/images/placeholder_venue.png"];

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  const handleReserveClick = () => {
    setStep1Open(true);
  };

  const handleStep1Close = () => {
    setStep1Open(false);
  };

  return (
    <>
      {/* Venue details modal - always show when open, adjust z-index based on step1 state */}
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm ${
          step1Open ? "z-[999]" : "z-[1000]"
        }`}
      >
        <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-2 my-8 flex flex-col md:flex-row px-4 pt-4 pb-24 md:p-8 gap-6 overflow-y-auto max-h-[95vh]">
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
                onError={(e) => {
                  console.log("Image failed to load:", e.target.src);
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder_venue.png";
                }}
                onLoad={() => {
                  console.log("Image loaded successfully:", images[current]);
                }}
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
            {/* Venue Details */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9] leading-tight">
              {venue.name}
            </h2>
            <div className="text-gray-400 text-sm -mt-3">
              Managed by {venue.department || "(Insert Department Name)"}
            </div>
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Users size={20} />
              {venue.capacity} Participants Max
            </div>
            <div className="text-gray-700 text-sm max-h-32 overflow-y-auto">
              {venue.description}
            </div>
          </div>
          {/* Right: Map, Features & Reserve Button */}
          <div className="flex-1 flex flex-col min-w-0 md:ml-6">
            {/* Location / Map */}
            <div className="flex-grow">
              <h3 className="text-lg font-bold mb-2">Location</h3>
              <div className="w-full aspect-video rounded-xl overflow-hidden border">
                {venue.location_image_url ? (
                  <img
                    src={venue.location_image_url}
                    alt={`${venue.name} location map`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log(
                        "Location image failed to load:",
                        e.target.src
                      );
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder_location.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin
                        size={48}
                        className="mx-auto mb-2 text-gray-400"
                      />
                      <p className="text-sm">Location map not available</p>
                      {venue.location && (
                        <p className="text-xs mt-1">{venue.location}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features Section - MOVED HERE */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Available Features
              </h4>
              {Array.isArray(venue.features) && venue.features.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {venue.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-gray-500 italic">
                  No features listed
                </div>
              )}
            </div>

            {/* Reserve Button */}
            <button
              className="bg-[#0458A9] text-white rounded-full px-10 py-3 font-semibold text-base w-full hover:bg-[#03407a] transition mt-6"
              onClick={handleReserveClick}
            >
              Reserve
            </button>
          </div>
        </div>
      </div>

      {/* Reserve Step 1 Modal */}
      <ReserveStep1Modal
        open={step1Open}
        onClose={handleStep1Close}
        venue={selectedVenue}
        onChangeVenue={(newVenue) => setSelectedVenue(newVenue)}
        onNext={() => {
          // Step1Modal will handle opening Step2Modal
          // We just need to close this step1
          setStep1Open(false);
        }}
        venues={venues}
      />
    </>
  );
}
