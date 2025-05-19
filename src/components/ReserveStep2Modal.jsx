import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

export default function ReserveStep2Modal({
  open,
  onClose,
  onPrevious,
  onNext,
  venues = [],
  initialVenue = "",
}) {
  const [form, setForm] = useState({
    title: "",
    type: "",
    purpose: "",
    time: "",
    venue: initialVenue || (venues[0] ? venues[0].name : ""),
    participants: "",
  });
  const [venueDropdown, setVenueDropdown] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVenueSelect = (venue) => {
    setForm((prev) => ({ ...prev, venue }));
    setVenueDropdown(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-2 my-8 flex flex-col gap-6 p-4 md:p-10 overflow-y-auto max-h-[95vh]">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          <X size={28} />
        </button>
        {/* Step 2 label */}
        <div className="flex justify-end w-full">
          <span className="text-[#0458A9] font-semibold text-lg md:text-xl">
            Step 2
          </span>
        </div>
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9] mb-2">
          Event Details
        </h2>
        {/* Form */}
        <form className="flex flex-col gap-8 w-full">
          {/* Row 1: Title & Type */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="flex-1">
              <label className="font-semibold text-gray-800 mb-1 block">
                <span className="text-[#E53935]">*</span> Title of the Event
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Artikulo: Voices in Motion"
                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                required
              />
            </div>
            <div className="flex-1">
              <label className="font-semibold text-gray-800 mb-1 block">
                <span className="text-[#E53935]">*</span> Type of Activity
              </label>
              <input
                type="text"
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="e.g., Workshop"
                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                required
              />
            </div>
          </div>
          {/* Row 2: Purpose */}
          <div>
            <label className="font-semibold text-gray-800 mb-1 block">
              <span className="text-[#E53935]">*</span> Purpose of the Event
            </label>
            <input
              type="text"
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              placeholder="e.g., Team-building and skill development"
              className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
              required
            />
          </div>
          {/* Row 3: Time, Venue, Participants */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="flex-1">
              <label className="font-semibold text-gray-800 mb-1 block">
                <span className="text-[#E53935]">*</span> Event Time
              </label>
              <input
                type="text"
                name="time"
                value={form.time}
                onChange={handleChange}
                placeholder="00:00   A.M.   12:00   P.M."
                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                required
              />
            </div>
            <div className="flex-1 relative">
              <label className="font-semibold text-gray-800 mb-1 block">
                <span className="text-[#E53935]">*</span> Preferred Venue
              </label>
              <button
                type="button"
                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base flex items-center justify-between focus:outline-none focus:border-[#0458A9]"
                onClick={() => setVenueDropdown((v) => !v)}
              >
                {form.venue || "Select Venue"}
                <ChevronDown size={20} />
              </button>
              {venueDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                  {venues.map((v) => (
                    <div
                      key={v.name}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleVenueSelect(v.name)}
                    >
                      {v.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="font-semibold text-gray-800 mb-1 block">
                <span className="text-[#E53935]">*</span> No. of Participants
              </label>
              <input
                type="number"
                name="participants"
                value={form.participants}
                onChange={handleChange}
                placeholder="e.g., 50 Participants"
                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                required
                min={1}
              />
            </div>
          </div>
        </form>
        {/* Footer: Previous/Next */}
        <div className="flex justify-between items-center mt-6 w-full">
          <button
            className="text-gray-400 font-semibold text-base px-6 py-2 rounded-full cursor-pointer hover:text-[#0458A9] hover:bg-gray-100 transition"
            onClick={onPrevious}
          >
            Previous
          </button>
          <button
            className="bg-[#0458A9] text-white rounded-full px-10 py-2 font-semibold text-base hover:bg-[#03407a] transition"
            onClick={() => onNext(form)}
            disabled={
              !form.title ||
              !form.type ||
              !form.purpose ||
              !form.time ||
              !form.venue ||
              !form.participants
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
