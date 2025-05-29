import React, { useState, useEffect } from "react";
import { X, Users, Edit, Trash2, MapPin } from "lucide-react";

export default function AdminVenueDetailsModal({
  open,
  onClose,
  venue,
  onEdit,
  onDelete,
}) {
  const [current, setCurrent] = useState(0);

  // Lock body scroll when modal is open
  useEffect(() => {
    const body = document.body;
    if (open) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      body.style.overflow = "unset";
    };
  }, [open]);

  if (!open || !venue) return null;

  // Carousel state
  const images = venue.images || [venue.image];

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  const handleEdit = () => {
    onEdit && onEdit(venue);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${venue.name}? This action cannot be undone.`
      )
    ) {
      onDelete && onDelete(venue);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[1000]">
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
                e.target.onerror = null;
                e.target.src = "/images/placeholder_venue.png";
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
          <h2 className="text-2xl md:text-3xl font-bold text-[#56708A] leading-tight">
            {venue.name}
          </h2>
          <div className="text-gray-400 text-sm -mt-3">
            Managed by Administration
          </div>
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Users size={20} />
            {venue.participants} Participants Max
          </div>
          <div className="text-gray-700 text-sm max-h-32 overflow-y-auto">
            {venue.description}
          </div>

          {/* Admin Statistics */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-gray-800">Venue Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Bookings:</span>
                <span className="font-medium ml-2">--</span>
              </div>
              <div>
                <span className="text-gray-600">This Month:</span>
                <span className="font-medium ml-2">--</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="font-medium ml-2 text-green-600">Active</span>
              </div>
              <div>
                <span className="text-gray-600">Last Booked:</span>
                <span className="font-medium ml-2">--</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Map & Admin Actions */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-6">
          {/* Location / Map */}
          <div className="flex-grow">
            <h3 className="text-lg font-bold mb-2">Location</h3>
            <div className="w-full aspect-video rounded-xl overflow-hidden border">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=122.545%2C10.720%2C122.550%2C10.725&amp;layer=mapnik"
                title="Venue Location"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Admin Action Buttons */}
          <div className="space-y-3 mt-6">
            <button
              className="bg-[#56708A] text-white rounded-lg px-6 py-3 font-semibold text-base w-full hover:bg-[#455b74] transition flex items-center justify-center gap-2"
              onClick={handleEdit}
            >
              <Edit size={18} />
              Edit Venue
            </button>
            <button
              className="bg-red-500 text-white rounded-lg px-6 py-3 font-semibold text-base w-full hover:bg-red-600 transition flex items-center justify-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 size={18} />
              Delete Venue
            </button>
            <div className="text-center">
              <button
                className="text-[#56708A] hover:text-[#455b74] text-sm font-medium"
                onClick={() => {
                  // TODO: Navigate to venue booking history
                  alert(
                    "View booking history functionality will be implemented"
                  );
                }}
              >
                View Booking History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
